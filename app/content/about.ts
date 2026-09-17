/** About page content - centralized copy per project-context.md */

export const ABOUT_PAGE = {
  meta: {
    title: 'About Us | Isla Suds',
    description:
      'Meet the family behind Isla Suds. Handcrafted natural soaps made with love in our kitchen, named for our daughter Isla.',
  },
  hero: {
    title: 'Made in Our Kitchen, Named for Our Daughter',
    subtitle: 'The Isla Suds Story',
    /**
     * The same sentence as `title`, broken into the three plates the hero sets
     * it on. `stamp` is the phrase that gets the outlined box treatment the
     * home page uses. Concatenated they read as `title`, so the h1 still
     * announces one sentence to a screen reader.
     */
    titleParts: {
      lead: 'Made in',
      stamp: 'our kitchen',
      trail: 'Named for our daughter',
    },
  },
  founderStory: {
    heading: 'From Corporate Desk to Farmers Market',
    content: [
      "Sarah never intended to start a soap business. After years in corporate marketing, she found herself increasingly disconnected from the work she was doing. The turning point came during maternity leave with Isla, when she started making soap as a way to slow down and create something with her hands.",
      "What began as a Sunday afternoon hobby turned into Saturday market trips. First one farmers market booth, then two, then wholesale orders from local shops. Three years later, Sarah left her corporate job entirely. Now the kitchen is the studio, and every bar of soap is made by hand—no outsourcing, no scaling shortcuts.",
      "This wasn't the plan, but it's become the life. Small batches, local ingredients where possible, and a commitment to keeping it personal even as the business grows.",
    ],
  },
  islaNameSake: {
    heading: 'Why Isla Suds?',
    content: [
      "Isla is our daughter. When she was born, we wanted to create something gentle enough for her sensitive skin but effective enough to actually work. The big-brand \"natural\" soaps were full of synthetic fragrances and mystery ingredients. So Sarah went back to basics: olive oil, coconut oil, shea butter, and essential oils.",
      "Naming the business after Isla felt right. It's a reminder that every bar we make should be good enough for our own family. If we wouldn't use it on Isla's skin, we don't sell it.",
    ],
    /**
     * The page's peak. Lifted verbatim out of `content[1]` so the scroll score
     * can hold it on its own screen at display size. It is still present in the
     * paragraph below it, which is where the sentence earns its context.
     */
    pullQuote: "If we wouldn't use it on Isla's skin, we don't sell it.",
  },
  recipeHeritage: {
    heading: 'A Family Recipe, Reimagined',
    /** The period the recipe comes from, in the copy's own words. */
    marker: 'The Depression',
    content: [
      "The base recipe came from Sarah's grandmother, who made soap during the Depression when store-bought soap was a luxury. She used lard and lye and whatever fats were left over from cooking. It wasn't fancy, but it worked.",
      "We've updated the recipe for modern sensibilities—vegetable oils instead of animal fats, essential oils for scent, clays and botanicals for texture—but the core process is the same. Cold process saponification, hand-poured into molds, cured for six weeks. It takes time, but that's what makes it last.",
    ],
  },
  craftsmanship: {
    heading: 'How We Make Each Bar',
    /** Real cure time, straight out of `content[1]`. Drives the cure counter. */
    cureWeeks: 6,
    content: [
      "Every batch starts in our kitchen. We measure, melt, blend, and pour by hand. Each bar is cut with a wire cutter, stamped with our logo, and set on wooden racks to cure. No machines, no assembly line, no rushing.",
      "The soap cures for six weeks before we sell it. This gives the lye time to fully saponify and the bars time to harden. Fresh soap is soft and doesn't last. Cured soap is hard, long-lasting, and gentle on your skin.",
      "We source locally when we can: honey from the beekeeper down the road, goat milk from a farm two towns over. Everything else comes from suppliers we trust. We know what's in every bar.",
    ],
  },
  close: {
    heading: 'Made for her',
    stamp: 'made for you',
    body: 'Small batches, cured six weeks, sold by the people who made them.',
    primary: {label: 'Shop the soap', href: '/collections/all'},
    secondary: {label: 'Find a store', href: '/locations'},
  },
  images: {
    founder: {
      src: '/images/placeholders/founder-portrait.jpg',
      alt: 'Sarah, founder of Isla Suds, holding a bar of lavender soap in the home kitchen studio',
    },
    workshop: {
      src: '/images/placeholders/workshop.jpg',
      alt: 'Behind the scenes: bars of handmade soap curing on wooden racks in the drying room',
    },
    market: {
      src: '/images/placeholders/market-booth.jpg',
      alt: 'Isla Suds booth at the local farmers market, with soap displays and customers browsing',
    },
  },
};
