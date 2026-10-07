/**
 * Site footer copy. The footer closes every route, so it is the last thing a
 * visitor reads: the preloader's bathtub comes back, and the page says goodbye.
 */
export const FOOTER = {
  signoff: {lead: 'See you', sticker: 'in the tub.'},
  hashtag: '#SoapIsDope',
  newsletter: {
    heading: 'Bath-time gossip',
    body: 'New bars, market days and the odd goat update. Never spam.',
    label: 'Email address',
    placeholder: 'Your email',
    submit: 'Sign me up',
    submitting: 'Sending…',
    success: "You're on the list. Bubbles incoming.",
  },
  madeBy: 'Made by hand in our home kitchen.',
  /** The bubble-pop pill. `count` is the visitor's own pops, never an invented number. */
  pops: (count: number) =>
    count === 0 ? 'Go on, pop one.' : count < 10 ? `${count} popped. So relaxing.` : 'Okay. Back to the bath.',
};
