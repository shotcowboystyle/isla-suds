/**
 * Wholesale Portal Content (B2B)
 *
 * Centralized copy for wholesale partner experience.
 * All user-facing strings MUST come from this file.
 *
 * Tone: Warm, friendly, transactional
 */

export const wholesaleContent = {
  // Authentication
  auth: {
    loginTitle: 'Partner Login',
    loginSubtitle: 'Welcome back',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginButton: 'Log In',
    logoutButton: 'Log Out',

    // Error messages - warm and friendly
    invalidCredentials: "That didn't work. Check your email and password.",
    notWholesaleCustomer:
      'This login is for wholesale partners only. If you have a business account with us, please contact support.',
    sessionExpired: 'Your session has expired. Please log in again.',
    genericError: 'Something went wrong. Please try again.',
  },

  // Header
  header: {
    welcomePrefix: 'Welcome',
  },

  // Logout Confirmation
  logout: {
    confirmTitle: 'Log Out',
    confirmMessage: 'Are you sure you want to log out of the wholesale portal?',
    confirmButton: 'Yes, Log Out',
    cancelButton: 'Cancel',
  },

  // Dashboard
  dashboard: {
    welcomeMessage: 'Welcome back, {partnerName}',
    acknowledgment: "We appreciate your partnership with Isla Sud's.",
    acknowledgmentTemplate: (partnerName: string, storeCount: number) =>
      `Isla Suds is in ${storeCount} local stores. Thanks for being one of them, ${partnerName}.`,
    storeCount: 3, // MVP hardcoded, future: fetch from Shopify metafields
    noOrdersMessage: 'No orders yet. Ready to stock up?',
    placeNewOrderButton: 'Place New Order',
  },

  // Reorder functionality (Story 7.6)
  reorder: {
    button: 'Reorder',
    buttonLoading: 'Reordering...',
    errorMessage: "Something went wrong. Let's try again.",
    successMessage: (storeName: string) =>
      `Another batch heading to ${storeName}. Your customers are lucky.`,
  },

  // Order History (Story 7.7)
  orders: {
    title: 'Order History',
    noOrdersMessage: "You haven't placed any orders yet. Ready to stock up?",
    loadMoreButton: 'Load More Orders',
    viewDetailsLink: 'View Details',
  },

  // Invoice Request (Story 7.8)
  invoice: {
    requestButton: 'Request Invoice',
    requestedButton: 'Invoice Requested',
    requestingButton: 'Requesting...',
    confirmationMessage:
      "We'll send your invoice within 1-2 business days.",
    errorMessage:
      "Couldn't send your request. Please try again or email us directly.",
  },

  // Order Page (Epic 1-2)
  order: {
    pageTitle: 'Place New Order',
    pageSubtitle: "Select quantities for the products you'd like to order.",
    productUnavailable: 'Currently unavailable',
    pricePerUnit: 'per unit',
    moqError: 'Minimum order is 6 units',
    summary: {
      title: 'Order Summary',
      emptyState: 'No items added yet.',
      subtotalLabel: 'Subtotal',
      checkoutButton: 'Proceed to Checkout',
      checkoutButtonLoading: 'Processing...',
      cartError: "Something went wrong. Your order is safe — let's try again.",
    },
  },

  // Wholesale product catalog — Shopify product handles
  // Update these to match the actual handles in your Shopify store
  catalog: {
    productHandles: [
      'isla-suds-lavender-bar-soap',
      'isla-suds-citrus-bar-soap',
      'isla-suds-eucalyptus-bar-soap',
      'isla-suds-unscented-bar-soap',
    ] as const,
  },
} as const;
