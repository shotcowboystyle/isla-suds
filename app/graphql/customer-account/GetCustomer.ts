/**
 * GraphQL Query: Get Customer
 *
 * Fetches customer details for invoice request:
 * - Name (first, last)
 * - Email
 * - Company name (if wholesale partner)
 *
 * Story: 7.8
 */

export const GET_CUSTOMER_QUERY = `#graphql
  query GetCustomer {
    customer {
      id
      firstName
      lastName
      email
      company {
        name
      }
    }
  }
`;
