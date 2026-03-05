// Storefront API customerCreate mutation for newsletter signup.
// Creates a customer with email marketing consent enabled.
// https://shopify.dev/docs/api/storefront/latest/mutations/customerCreate
export const NEWSLETTER_SUBSCRIBE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
