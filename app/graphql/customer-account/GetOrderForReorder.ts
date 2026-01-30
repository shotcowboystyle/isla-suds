/**
 * GraphQL Query: Get Order For Reorder
 *
 * Fetches order details for one-click reorder:
 * - Line items with variant IDs for cart recreation
 * - Quantity for each line item
 *
 * Note: first: 50 limit is based on typical wholesale order size (12-24 items).
 * Shopify B2B orders rarely exceed 50 unique SKUs. If needed, implement pagination.
 */

export const GET_ORDER_FOR_REORDER_QUERY = `#graphql
  query GetOrderForReorder($query: String!) {
    customer {
      orders(first: 1, query: $query) {
        edges {
          node {
            id
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
