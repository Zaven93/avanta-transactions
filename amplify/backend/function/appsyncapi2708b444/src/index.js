const axios = require('axios')
const gql = require('graphql-tag')
const graphql = require('graphql')
const { print } = graphql

const createTransaction = gql`
    mutation createTransaction($input: CreateTransactionInput!) {
        createTransaction(input: $input) {
            id
            note
            totalPrice
            currency
            products {
                id
                title
                bonusPercentage
                priceAmount
                priceCurrency
                image
            }
            customer {
                id
                firstName
                lastName
                phone
                email
            }
        }
    }
`

const getPoductById = gql`
    query Order($id: ID!) {
        order(id: $id) {
            id
            name
            email
            lineItems(first: 5) {
                edges {
                    node {
                        id
                        image {
                            originalSrc
                        }
                        quantity
                        name
                        title
                        product {
                            tags
                        }
                        originalUnitPriceSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }
                    }
                }
            }
            customer {
                firstName
                lastName
                email
                phone
                id
            }
        }
    }
`

exports.handler = async (event) => {
    try {
        console.log('request: ' + JSON.stringify(event))
        let response = {
            statusCode: 200,
            body: JSON.parse(event.body)
        }
        console.log('response: ' + JSON.stringify(response.body))

        let transaction = {
            id: response.body.id,
            totalPrice: response.body.total_price,
            totalBonusAmount: null,
            note: response.body.note,
            currency: response.body.currency,
            products: [],
            customer: {
                id: response.body.customer.id,
                firstName: response.body.customer.first_name,
                lastName: response.body.customer.last_name,
                email: response.body.customer.email,
                phone: response.body.customer.phone
            }
        }

        console.log('Transasction data', JSON.stringify(transaction))

        if (transaction) {
            const orderData = await axios({
                url: 'https://transactions-avanta.myshopify.com/admin/api/2020-07/graphql.json',
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': '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'
                },
                data: {
                    query: print(getPoductById),
                    variables: {
                        id: `gid://shopify/Order/${JSON.stringify(transaction.id)}`
                    }
                }
            })

            console.log('Order data', JSON.stringify(orderData.data))

            transaction.products = orderData.data.data.order.lineItems.edges.map((product) => ({
                id: product.node.id,
                title: product.node.title,
                bonusPercentage: product.node.product ? product.node.product.tags[0] : null,
                priceAmount: product.node.originalUnitPriceSet.shopMoney.amount,
                priceCurrency: product.node.originalUnitPriceSet.shopMoney.currencyCode,
                image: product.node.image ? product.node.image.originalSrc : null
            }))

            transaction.totalBonusAmount = transaction.products.reduce((accumulator, product) => {
                const bonus =
                    (Number(product.priceAmount) * Number(product.bonusPercentage.split('')[0])) /
                    100

                accumulator += bonus

                return accumulator
            }, 0)

            console.log('Updated transaction', JSON.stringify(transaction))

            const transactionData = await axios({
                url:
                    'https://kytejmxrrrgahiikcodklhf6rq.appsync-api.us-east-1.amazonaws.com/graphql',
                method: 'post',
                headers: {
                    'x-api-key': 'da2-iwznaxe3h5bxznagzuctrhqekm'
                },
                data: {
                    query: print(createTransaction),
                    variables: {
                        input: {
                            id: transaction.id,
                            totalPrice: transaction.totalPrice,
                            totalBonusAmount: transaction.totalBonusAmount,
                            note: transaction.note,
                            currency: transaction.currency,
                            products: transaction.products.map((product) => ({
                                id: product.id,
                                title: product.title,
                                bonusPercentage: product.bonusPercentage,
                                priceAmount: product.priceAmount,
                                priceCurrency: product.priceCurrency,
                                image: product.image
                            })),
                            customer: {
                                id: transaction.customer.id,
                                firstName: transaction.customer.firstName,
                                lastName: transaction.customer.lastName,
                                email: transaction.customer.email,
                                phone: transaction.customer.phone
                            }
                        }
                    }
                }
            })
        } else {
            console.log('Some error occured')
        }
    } catch (err) {
        console.log('error creating todo: ', err)
    }
}
