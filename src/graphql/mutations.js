/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTransaction = /* GraphQL */ `
  mutation CreateTransaction(
    $input: CreateTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    createTransaction(input: $input, condition: $condition) {
      id
      totalPrice
      totalBonusAmount
      note
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
      createdAt
      updatedAt
    }
  }
`;
export const updateTransaction = /* GraphQL */ `
  mutation UpdateTransaction(
    $input: UpdateTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    updateTransaction(input: $input, condition: $condition) {
      id
      totalPrice
      totalBonusAmount
      note
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteTransaction = /* GraphQL */ `
  mutation DeleteTransaction(
    $input: DeleteTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    deleteTransaction(input: $input, condition: $condition) {
      id
      totalPrice
      totalBonusAmount
      note
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
      createdAt
      updatedAt
    }
  }
`;
export const createPaymentRequest = /* GraphQL */ `
  mutation CreatePaymentRequest(
    $input: CreatePaymentRequestInput!
    $condition: ModelPaymentRequestConditionInput
  ) {
    createPaymentRequest(input: $input, condition: $condition) {
      id
      orderId
      customerId
      bonusAmount
      status
      products {
        originalUnitPrice
        variantId
        quantity
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePaymentRequest = /* GraphQL */ `
  mutation UpdatePaymentRequest(
    $input: UpdatePaymentRequestInput!
    $condition: ModelPaymentRequestConditionInput
  ) {
    updatePaymentRequest(input: $input, condition: $condition) {
      id
      orderId
      customerId
      bonusAmount
      status
      products {
        originalUnitPrice
        variantId
        quantity
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePaymentRequest = /* GraphQL */ `
  mutation DeletePaymentRequest(
    $input: DeletePaymentRequestInput!
    $condition: ModelPaymentRequestConditionInput
  ) {
    deletePaymentRequest(input: $input, condition: $condition) {
      id
      orderId
      customerId
      bonusAmount
      status
      products {
        originalUnitPrice
        variantId
        quantity
      }
      createdAt
      updatedAt
    }
  }
`;
