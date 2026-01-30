/**
 * GraphQL Query: Wholesale Layout Customer
 *
 * Fetches customer details for wholesale layout:
 * - Email
 * - Display name
 * - Company association (B2B validation)
 */

export const WHOLESALE_LAYOUT_CUSTOMER_QUERY = `#graphql
  query WholesaleLayoutCustomer {
    customer {
      id
      emailAddress {
        emailAddress
      }
      displayName
      companyContacts(first: 1) {
        edges {
          node {
            company {
              id
              name
            }
          }
        }
      }
    }
  }
`;
