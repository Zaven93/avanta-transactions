const axios = require('axios')
const gql = require('graphql-tag')
const graphql = require('graphql')
const { print } = graphql

const createDraftOrder = gql`
    mutation createDraftOrder($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
            draftOrder {
                id
                note2
                lineItems(first: 5) {
                    edges {
                        node {
                            variant {
                                id
                                price
                                title
                                product {
                                    tags
                                    title
                                    images(first: 5) {
                                        edges {
                                            node {
                                                originalSrc
                                            }
                                        }
                                    }
                                }
                            }
                            name
                            quantity
                        }
                    }
                }
            }
        }
    }
`

const completeOrder = gql`
    mutation CompleteOrder($id: ID!) {
        draftOrderComplete(id: $id, paymentPending: true) {
            draftOrder {
                customer {
                    id
                }
                email
                name
            }
        }
    }
`

const updatePaymentRequest = gql`
    mutation updatePaymentRequest($input: UpdatePaymentRequestInput!) {
        updatePaymentRequest(input: $input) {
            id
            orderId
        }
    }
`

exports.handler = async (event) => {
    //eslint-disable-line
    console.log(JSON.stringify(event, null, 2))

    let dynamoDBStream = {
        paymentRequestId: '',
        NewImage: {
            status: '',
            bonusAmount: '',
            customerId: '',
            products: []
        },
        OldImage: {
            status: ''
        },
        eventName: ''
    }

    const createOrder = async (orderInput) => {
        try {
            const orderData = await axios({
                url: 'https://transactions-avanta.myshopify.com/admin/api/2020-07/graphql.json',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': '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'
                },
                data: {
                    query: print(createDraftOrder),
                    variables: {
                        input: {
                            customerId: `gid://shopify/Customer/${orderInput.NewImage.customerId}`,
                            taxExempt: true,
                            lineItems: orderInput.NewImage.products.map((product) => ({
                                quantity: Number(product.quantity),
                                originalUnitPrice: Number(product.originalUnitPrice),
                                variantId: product.variantId
                            })),
                            note: `${orderInput.NewImage.bonusAmount} amount of bonus has been paid for these products`
                        }
                    }
                }
            })

            console.log('Order data Zvushka', JSON.stringify(orderData.data))

            const updatedPaymentRequest = await axios({
                url:
                    'https://kytejmxrrrgahiikcodklhf6rq.appsync-api.us-east-1.amazonaws.com/graphql',
                method: 'post',
                headers: {
                    'x-api-key': 'da2-iwznaxe3h5bxznagzuctrhqekm'
                },
                data: {
                    query: print(updatePaymentRequest),
                    variables: {
                        input: {
                            id: orderInput.paymentRequestId,
                            orderId: orderData.data.data.draftOrderCreate.draftOrder.id
                        }
                    }
                }
            })

            console.log('Added order id to payment request', updatedPaymentRequest.data)

            const sendCompleteOrder = await axios({
                url: 'https://transactions-avanta.myshopify.com/admin/api/graphql.json',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': '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'
                },
                data: {
                    query: print(completeOrder),
                    variables: {
                        id: orderData.data.data.draftOrderCreate.draftOrder.id
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    event.Records.forEach((record) => {
        console.log(record.eventID)
        console.log(record.eventName)
        if (record.eventName === 'REMOVE') {
            return
        }

        console.log('DynamoDB Record: %j', record.dynamodb)

        if (record.dynamodb.NewImage && record.dynamodb.NewImage.status.S === 'PENDING') {
            console.log('Zaven jan Van dam status is pending', record.dynamodb.NewImage.status)
        } else if (record.dynamodb.NewImage && record.dynamodb.NewImage.status.S === 'APPROVED') {
            dynamoDBStream.paymentRequestId = record.dynamodb.Keys.id.S
            dynamoDBStream.NewImage.status = record.dynamodb.NewImage
                ? record.dynamodb.NewImage.status.S
                : ''
            dynamoDBStream.OldImage.status = record.dynamodb.OldImage.status.S
            dynamoDBStream.eventName = record.eventName
            dynamoDBStream.NewImage.bonusAmount = record.dynamodb.NewImage
                ? record.dynamodb.NewImage.bonusAmount.N
                : ''
            dynamoDBStream.NewImage.customerId = record.dynamodb.NewImage
                ? record.dynamodb.NewImage.customerId.S
                : ''
            dynamoDBStream.NewImage.products = record.dynamodb.NewImage
                ? record.dynamodb.NewImage.products.L.map((product) => ({
                      originalUnitPrice: product.M.originalUnitPrice.N,
                      quantity: product.M.quantity.N,
                      variantId: product.M.variantId.S
                  }))
                : ''
        }
    })

    if (
        dynamoDBStream.eventName === 'MODIFY' &&
        dynamoDBStream.NewImage.status === 'APPROVED' &&
        dynamoDBStream.NewImage.status !== dynamoDBStream.OldImage.status
    ) {
        return createOrder(dynamoDBStream)
    }
}
