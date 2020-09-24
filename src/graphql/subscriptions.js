/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTransaction = /* GraphQL */ `
  subscription OnCreateTransaction {
    onCreateTransaction {
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
export const onUpdateTransaction = /* GraphQL */ `
  subscription OnUpdateTransaction {
    onUpdateTransaction {
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
export const onDeleteTransaction = /* GraphQL */ `
  subscription OnDeleteTransaction {
    onDeleteTransaction {
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
export const onCreatePaymentRequest = /* GraphQL */ `
  subscription OnCreatePaymentRequest {
    onCreatePaymentRequest {
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
export const onUpdatePaymentRequest = /* GraphQL */ `
  subscription OnUpdatePaymentRequest {
    onUpdatePaymentRequest {
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
export const onDeletePaymentRequest = /* GraphQL */ `
  subscription OnDeletePaymentRequest {
    onDeletePaymentRequest {
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
