/**
 * Contact page copy. The goat answers the phone; the visitor fills in a
 * "While You Were Out" slip; the goat takes it. We write the replies.
 */

const EMAIL = 'contact@islasuds.com';

export const CONTACT_PAGE = {
  meta: {
    title: 'Contact | Isla Suds',
    description:
      'Leave the goat a message. Questions, order help, wholesale or just hello: we write back within 24-48 hours.',
  },
  email: EMAIL,
  hero: {
    /** Screen-reader start of the h1, so the page still announces itself as Contact. */
    srLead: 'Contact Isla Suds.',
    lead: 'Ring ring.',
    sticker: "The goat's on the line.",
    body: "Questions, order help, wholesale, or fan mail for the goat. Leave a message and we'll write back within 24-48 hours.",
    ring: 'Ring!',
  },
  desk: {
    heading: 'Leave a message.',
    notes: [
      {title: 'Back to you in 24-48 hours.', body: 'From us, not the goat.'},
      {title: 'Order trouble?', body: 'Tick "Order help" and add your order number.'},
      {title: 'Got a shop?', link: {label: 'See wholesale', href: '/partners'}},
      {title: 'Rather email?', link: {label: EMAIL, href: `mailto:${EMAIL}`}},
    ],
    aside: 'The goat takes the message. We write the reply.',
  },
  slip: {
    title: 'While you were out',
    printed: [
      {label: 'For', value: 'Isla Suds'},
      {label: 'Time', value: 'Any time'},
    ],
    name: {label: 'From', hint: '(your name)', placeholder: 'Your name'},
    email: {label: 'Write back to', hint: '(your email)', placeholder: 'you@example.com'},
    subject: {
      legend: 'Re:',
      /** `value` is what lands in our inbox; keep these stable. */
      options: [
        {value: 'General Inquiry', label: 'Just saying hi'},
        {value: 'Order Support', label: 'Order help'},
        {value: 'Wholesale', label: 'Got a shop'},
        {value: 'Press/Media', label: 'Press'},
        {value: 'Other', label: 'Something else'},
      ],
    },
    orderNumber: {label: 'Order no.', placeholder: 'e.g. #1001'},
    message: {label: 'Message', placeholder: "Go on, we're listening."},
    takenBy: 'Taken by: the goat',
    submit: 'Send to the goat',
    submitting: 'Ringing…',
    busy: "The line's busy. Try again in a minute.",
    required: 'Fill in your name, your email, one box and a message.',
    orEmail: 'Or email us at',
  },
  taken: {
    sticker: 'Message taken.',
    thanks: (name: string) => `Thanks, ${name}.`,
    body: "We'll write back within 24-48 hours. The goat is guarding it until then.",
    again: 'Leave another message',
    slipFor: 'For: Isla Suds',
    slipFrom: (name: string) => `From: ${name}`,
  },
};
