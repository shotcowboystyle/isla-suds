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

  // Dashboard
  dashboard: {
    welcomeMessage: 'Welcome back, {partnerName}',
    acknowledgment: "We appreciate your partnership with Isla Sud's.",
  },
} as const;
