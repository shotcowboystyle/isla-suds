/**
 * GraphQL Query: Wholesale Callback Customer
 *
 * Fetches customer details for OAuth callback:
 * - Email
 * - Display name
 * - Company association (B2B validation)
 */

export const WHOLESALE_CALLBACK_CUSTOMER_QUERY = `#graphql
  query WholesaleCallbackCustomer {
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
