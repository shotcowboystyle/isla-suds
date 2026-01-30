/**
 * GraphQL Query: Get Order Details
 *
 * Fetches full order details for a single order including:
 * - Order information (number, date, status)
 * - Line items with images and pricing
 * - Order summary (subtotal, shipping, tax, total)
 * - Shipping address
 *
 * Story: 7.7
 */

export const GET_ORDER_DETAILS_QUERY = `#graphql
  query GetOrderDetails($query: String!) {
    customer {
      orders(first: 1, query: $query) {
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
            subtotal {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            totalShipping {
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
                  image {
                    url
                    altText
                  }
                  price {
                    amount
                    currencyCode
                  }
                  currentTotalPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
            shippingAddress {
              formatted
            }
          }
        }
      }
    }
  }
`;
