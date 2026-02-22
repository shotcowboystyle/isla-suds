/**
 * GraphQL Query: Wholesale Customer
 *
 * Unified query for all wholesale routes. Fetches:
 * - Customer identity (id, firstName, lastName, displayName)
 * - Email
 * - Company association (B2B validation)
 */

export const WHOLESALE_CUSTOMER_QUERY = `#graphql
  query WholesaleCustomer {
    customer {
      id
      firstName
      lastName
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
