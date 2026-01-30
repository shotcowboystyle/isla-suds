export const GET_LAST_ORDER_QUERY = `#graphql
  query GetLastOrder {
    customer {
      orders(first: 1, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            number
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                  variantId
                  variantTitle
                }
              }
            }
          }
        }
      }
    }
  }
`;
