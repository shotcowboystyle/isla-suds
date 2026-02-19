/** Contact page content - centralized copy per project-context.md */

export const CONTACT_PAGE = {
  meta: {
    title: 'Contact Us | Isla Suds',
    description: "Get in touch with Isla Suds. We'd love to hear from you and will respond within 24-48 hours.",
  },
  heading: 'GET IN TOUCH',
  subheading:
    'We love to hear from you. Reach out with comments, questions and feedback. Our lovely team will reply as quickly as we can.',
  form: {
    fields: {
      name: {
        label: 'Full name',
        placeholder: 'Full name',
        required: true,
      },
      email: {
        label: 'Email address',
        placeholder: 'Email address',
        required: true,
      },
      subject: {
        label: 'Subject',
        placeholder: 'Select a subject',
        required: true,
        options: ['General Inquiry', 'Order Support', 'Wholesale', 'Press/Media', 'Other'],
      },
      orderNumber: {
        label: 'Order number (optional)',
        placeholder: 'Order number (optional)',
        required: false,
      },
      message: {
        label: 'Message',
        placeholder: 'Message',
        required: true,
      },
    },
    submit: {
      default: 'SUBMIT',
      submitting: 'SENDING...',
    },
  },
  formHeading: "DON'T BE SHY.\nHIT US UP AND WE'LL GET BACK TO YOU!",
  successMessage: "Thanks for reaching out! We'll be in touch soon.",
  errorMessage: 'Something went wrong sending your message. Please try again or email us directly.',
  emailFallback: {
    text: 'Feel free to shoot us an email',
    email: 'contact@islasuds.com',
  },
};
