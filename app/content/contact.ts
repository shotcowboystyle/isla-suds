/** Contact page content - centralized copy per project-context.md */

export const CONTACT_PAGE = {
  meta: {
    title: 'Contact Us | Isla Suds',
    description:
      "Get in touch with Isla Suds. We'd love to hear from you and will respond within 24-48 hours.",
  },
  heading: "Let's Talk",
  subheading: "We'll get back to you within 24-48 hours.",
  form: {
    fields: {
      name: {
        label: 'Name',
        placeholder: 'Your name',
        required: true,
      },
      email: {
        label: 'Email',
        placeholder: 'your@email.com',
        required: true,
      },
      message: {
        label: 'Message',
        placeholder: 'Tell us what is on your mind...',
        required: true,
      },
    },
    submit: {
      default: 'Send Message',
      submitting: 'Sending...',
    },
  },
  successMessage: "Thanks for reaching out! We'll be in touch soon.",
  errorMessage:
    "Something went wrong sending your message. Please try again or email us directly.",
  emailFallback: {
    text: 'Or email us directly at',
    email: 'hello@islasuds.com',
  },
};
