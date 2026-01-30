export const GET_LAST_ORDER_QUERY = `#graphql
  query GetLastOrder {
    customer {
      orders(first: 1, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            name
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
