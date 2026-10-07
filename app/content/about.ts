/**
 * About page copy. Every fact here was confirmed by the owner on 2026-10-07:
 * a family recipe handed down (no era, no named relative), made by hand in our
 * kitchen, wire-cut, cured six weeks, goat milk from a nearby farm, one market
 * booth then two then local shops, and Isla is why. Anything else is a joke and
 * reads like one.
 */
export const ABOUT_PAGE = {
  meta: {
    title: 'About Us | Isla Suds',
    description:
      'Meet the family behind Isla Suds: goat milk soap made by hand in our kitchen, cured six weeks, and named for our daughter Isla.',
  },
  hero: {
    eyebrow: 'The Isla Suds story',
    /** Read in order these make the h1: "Made in our kitchen. Named for our daughter." */
    lead: 'Made in',
    stamp: 'our kitchen.',
    trail: 'Named for our daughter.',
  },
  recipe: {
    heading: 'A family recipe, handed down.',
    body: "It's been in our family for generations. We still make it the slow way, by hand, in our kitchen. We just added a few notes of our own.",
    sticker: 'Margin notes by us. Crayon by Isla.',
    /**
     * The card. `older` lines are generic cold-process steps standing in for the
     * family card (owner to swap in the real wording). `note` is our ballpoint.
     */
    card: {
      title: 'Family Soap',
      lines: [
        {older: 'lye + water (go slow!)'},
        {older: 'warm the oils', note: '+ goat milk'},
        {older: 'stir till it traces', note: '+ essential oils. NO added fragrance.'},
        {older: 'pour, cover, wait', note: '6 WEEKS. No peeking.'},
      ],
      isla: "Isla's edit",
    },
  },
  made: {
    heading: 'Made by hand. Then we wait.',
    photos: [
      {key: 'farm', caption: 'Goat milk from a farm nearby', alt: 'A dairy goat in a sunny pasture by a wooden fence'},
      {key: 'pour', caption: 'Poured by hand', alt: 'Hands pouring creamy soap batter into a wooden loaf mold'},
      {
        key: 'wirecut',
        caption: 'Cut with a wire, one bar at a time',
        alt: 'Hands pressing a wire cutter through a soap loaf',
      },
      {key: 'racks', caption: 'Six weeks on the rack', alt: 'Rows of soap bars curing on wooden racks'},
    ],
    /** Real cure time. */
    cureWeeks: 6,
    cureBody:
      "Fresh soap is soft and doesn't last. Six weeks on a wooden rack makes it hard, long-lasting and gentle. We've asked it to hurry. It won't.",
  },
  market: {
    heading: 'One table. Then two. Then shops.',
    frames: [
      {
        key: 'one',
        line: 'It started with one farmers market booth.',
        alt: 'A market table of Isla Suds bars with a goat standing behind it',
      },
      {key: 'two', line: 'Then two.', alt: 'Two market tables of Isla Suds bars, the same goat still in charge'},
      {
        key: 'shops',
        line: 'Then local shops asked to stock us.',
        alt: 'A real Isla Suds shop display: whole soap loaves behind rows of labelled bars',
      },
    ],
    goatSticker: 'Booth staff. Unpaid. Mostly napping.',
    storesLead: 'Find us at',
    link: {label: 'Find a store', href: '/locations'},
  },
  isla: {
    heading: 'Why Isla Suds?',
    body: 'Isla is our daughter. When she came along, we wanted a soap gentle enough for her skin that still got her clean. So we kept it simple: goat milk, plant oils and essential oils, with no added fragrance.',
    silence: 'Every batch still has to pass one inspection.',
    checklist: ['Goat milk', 'Essential oils, no added fragrance', 'Cured six weeks', 'Gentle enough for Isla'],
    stamp: 'Approved',
    quote: "If we wouldn't use it on Isla's skin, we don't sell it.",
    caption: 'Head of Quality: one rubber duck, hired by Isla.',
  },
  close: {
    heading: 'Made for her,',
    stamp: 'made for you',
    body: 'Small batches, cured six weeks, sold by the people who made them.',
    primary: {label: 'Shop the bars', href: '/collections/frontpage'},
    secondary: {label: 'Find a store', href: '/locations'},
  },
};
