/**
 * GraphQL Query: Get Order History
 *
 * Fetches paginated order history for wholesale partner.
 * - Bounded query (first: 10) per project-context rules
 * - Sorted newest first (sortKey: PROCESSED_AT, reverse: true)
 * - Cursor-based pagination (Shopify standard)
 *
 * Story: 7.7
 */

export const GET_ORDER_HISTORY_QUERY = `#graphql
  query GetOrderHistory($first: Int!, $after: String) {
    customer {
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          cursor
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
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
