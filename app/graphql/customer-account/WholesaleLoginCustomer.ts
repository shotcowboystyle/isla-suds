/**
 * GraphQL Query: Wholesale Login Customer
 *
 * Fetches customer details for wholesale login verification:
 * - Email
 * - Display name
 * - Company association (B2B validation)
 */

export const WHOLESALE_LOGIN_CUSTOMER_QUERY = `#graphql
  query WholesaleLoginCustomer {
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
