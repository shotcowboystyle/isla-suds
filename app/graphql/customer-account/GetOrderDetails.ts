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
  query GetOrderDetails($orderId: ID!) {
    order(id: $orderId) {
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
      subtotalPrice {
        amount
        currencyCode
      }
      totalTax {
        amount
        currencyCode
      }
      shippingCost {
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
              image {
                url
                altText
              }
            }
            originalTotalPrice {
              amount
              currencyCode
            }
            discountedTotalPrice {
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
`;
