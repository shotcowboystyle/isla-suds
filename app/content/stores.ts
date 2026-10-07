import OddDuckLogo from '~/assets/images/odd-duck-logo.avif';
import SeweeLogo from '~/assets/images/sewee-outpost-logo.webp';
import AwendawPostcard from '~/assets/images/stores/pc-awendaw.webp';
import NorthCharlestonPostcard from '~/assets/images/stores/pc-ncharleston.webp';
import SummervillePostcard from '~/assets/images/stores/pc-summerville.webp';

/** Retail store locations - third-party retailers carrying Isla Suds products */

export interface StoreLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  hours?: string;
  lat: number;
  lng: number;
  /** The goat's note on this shop's postcard (/locations). */
  note: string;
  /** The postcard's picture side: a generic sunny scene of the town, never the shop itself. */
  postcard: string;
}

export interface RetailStore {
  name: string;
  website?: string;
  logo?: string;
  /** Intrinsic size of `logo`, so it reserves its space before it loads. */
  logoSize?: {width: number; height: number};
  locations: StoreLocation[];
}

export const LOCATIONS_PAGE = {
  meta: {
    title: 'Stores | Isla Suds',
    description:
      'Find Isla Suds on the shelf at Odd Duck Market in North Charleston and Summerville, and Sewee Outpost in Awendaw.',
  },
  hero: {
    srLead: 'Stores.',
    lines: ['Wish you', 'were here.'],
    goatCard: 'Hi from the road!',
  },
  rack: {
    heading: 'Pick your shop.',
    aside: 'Postcards by the goat. Spelling checked by us.',
    open: 'Open',
    directions: 'Directions',
    call: 'Call',
    website: 'Their website',
    flip: 'Flip it',
    flipBack: 'Flip back',
    greetings: 'Greetings from',
    mapLabel: 'Map of the shops that stock Isla Suds',
  },
  close: {
    heading: 'Too far to drive?',
    to: 'You',
    addressLines: ['Wherever you are', 'Your mailbox, USA'],
    note: "Can't make the trip? We'll mail you a bar instead. xo, the goat",
    postmark: 'Isla Suds',
    shop: {label: 'Shop the bars', href: '/collections/frontpage'},
    stockist: {lead: 'Run a shop?', label: 'Put Isla Suds on your shelf', href: '/partners'},
  },
  stores: [
    {
      name: 'Odd Duck Market',
      website: 'https://oddduckmarkets.com',
      logo: OddDuckLogo,
      logoSize: {width: 400, height: 104},
      locations: [
        {
          address: '1082 E Montague Ave',
          city: 'North Charleston',
          state: 'SC',
          zip: '29405',
          phone: '(843) 471-1246',
          hours: 'Mon-Sun 7am-7pm',
          lat: 32.8817454,
          lng: -79.9772531,
          note: "Wish you were here! They're open at 7, so am I. Bring a tote. xo, the goat",
          postcard: NorthCharlestonPostcard,
        },
        {
          address: '117 S Cedar St',
          city: 'Summerville',
          state: 'SC',
          zip: '29483',
          phone: '(854) 269-0223',
          hours: 'Mon-Sun 7am-4pm',
          lat: 33.0203403,
          lng: -80.1767895,
          note: 'Greetings from the birthplace of sweet tea. Got a bar and a glass. xo, the goat',
          postcard: SummervillePostcard,
        },
      ],
    },
    {
      name: 'Sewee Outpost',
      website: 'https://seweeoutpost.com',
      logo: SeweeLogo,
      logoSize: {width: 183, height: 57},
      locations: [
        {
          address: '4853 N Hwy 17',
          city: 'Awendaw',
          state: 'SC',
          zip: '29429',
          phone: '(843) 928-3493',
          hours: 'Mon-Sun 7am-7pm',
          lat: 32.9290544,
          lng: -79.712732,
          note: 'Out by the marsh. Worth the drive, I promise. xo, the goat',
          postcard: AwendawPostcard,
        },
      ],
    },
  ] satisfies RetailStore[],
};

export interface StorePostcard extends StoreLocation {
  /** Stable id for anchors and keys, e.g. `odd-duck-market-summerville`. */
  id: string;
  storeName: string;
  website?: string;
  logo?: string;
  logoSize?: {width: number; height: number};
}

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Every shop on its own: one entry per location, carrying its retailer's name and logo. */
export const STORE_POSTCARDS: StorePostcard[] = LOCATIONS_PAGE.stores.flatMap(({locations, name, ...store}) =>
  locations.map((location) => ({...location, ...store, storeName: name, id: slug(`${name} ${location.city}`)})),
);
