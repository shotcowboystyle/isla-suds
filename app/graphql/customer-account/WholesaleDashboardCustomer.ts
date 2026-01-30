/**
 * GraphQL Query: Wholesale Dashboard Customer
 *
 * Fetches customer details for dashboard:
 * - Name (first, last)
 * - Email
 * - Company association (B2B validation)
 */

export const WHOLESALE_DASHBOARD_CUSTOMER_QUERY = `#graphql
  query WholesaleDashboardCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
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
