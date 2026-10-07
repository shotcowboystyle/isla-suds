import PlateCafeMobile from '~/assets/images/partners/plate-cafe-m.webp';
import PlateCafe from '~/assets/images/partners/plate-cafe.webp';
import PlateGroceryMobile from '~/assets/images/partners/plate-grocery-m.webp';
import PlateGrocery from '~/assets/images/partners/plate-grocery.webp';
import PlateGymMobile from '~/assets/images/partners/plate-gym-m.webp';
import PlateGym from '~/assets/images/partners/plate-gym.webp';
import PlateHotelMobile from '~/assets/images/partners/plate-hotel-m.webp';
import PlateHotel from '~/assets/images/partners/plate-hotel.webp';
import PlateOfficeMobile from '~/assets/images/partners/plate-office-m.webp';
import PlateOffice from '~/assets/images/partners/plate-office.webp';
import PlateRestaurantMobile from '~/assets/images/partners/plate-restaurant-m.webp';
import PlateRestaurant from '~/assets/images/partners/plate-restaurant.webp';
import PlateSpaMobile from '~/assets/images/partners/plate-spa-m.webp';
import PlateSpa from '~/assets/images/partners/plate-spa.webp';

export const PARTNERS_PAGE = {
  meta: {
    title: 'Become a Partner | Isla Suds',
    description:
      'Stock Isla Suds goat milk soap in your shop, gym, café, hotel or spa. 20% partner pricing, a 6-bar minimum, and reorders in one click.',
  },
};

export interface Venue {
  label: string;
  /** The hero one-liner for this kind of shop. */
  line: string;
  /** Fills "Your ___'s soap situation." */
  possessive: string;
  /** Placeholder for the application's message field. */
  placeholder: string;
  plate: string;
  plateMobile: string;
  /**
   * Where the bars sit, as a percentage of the plate's height: the middle of
   * the counter top, measured off the art. Bars are positioned inside a box
   * with the plate's own aspect ratio, so this holds at every viewport.
   */
  counter: number;
}

export const VENUES = {
  grocery: {
    label: 'Grocery',
    line: 'Right between the oat milk and the cereal nobody admits buying.',
    possessive: 'shop',
    placeholder: 'Tell us about your shop: where it is, who shops there, which bars you would stock first.',
    plate: PlateGrocery,
    plateMobile: PlateGroceryMobile,
    counter: 80,
  },
  gym: {
    label: 'Gym',
    line: "The only thing in the locker room that's gentle.",
    possessive: 'gym',
    placeholder: 'Tell us about your gym: where it is, how many members, retail shelf or locker rooms.',
    plate: PlateGym,
    plateMobile: PlateGymMobile,
    counter: 80,
  },
  office: {
    label: 'Office',
    line: 'Retire the pink pump soap. Nobody will miss it.',
    possessive: 'office',
    placeholder: 'Tell us about your office: where it is, how many people, how many restrooms and kitchens.',
    plate: PlateOffice,
    plateMobile: PlateOfficeMobile,
    counter: 80,
  },
  cafe: {
    label: 'Café',
    line: 'Pairs well with a cortado and clean hands.',
    possessive: 'café',
    placeholder: 'Tell us about your café: where it is, the vibe, whether you would sell bars at the counter.',
    plate: PlateCafe,
    plateMobile: PlateCafeMobile,
    counter: 82,
  },
  hotel: {
    label: 'Hotel',
    line: "Guests will 'accidentally' pack it.",
    possessive: 'hotel',
    placeholder: 'Tell us about your hotel: where it is, how many rooms, guest bathrooms or a gift shop.',
    plate: PlateHotel,
    plateMobile: PlateHotelMobile,
    counter: 77,
  },
  spa: {
    label: 'Spa',
    line: 'Gentle enough for your most sensitive regulars.',
    possessive: 'spa',
    placeholder: 'Tell us about your spa: where it is, your treatments, retail shelf or treatment rooms.',
    plate: PlateSpa,
    plateMobile: PlateSpaMobile,
    counter: 79,
  },
  restaurant: {
    label: 'Restaurant',
    line: 'A five-star restroom, one tiny bar.',
    possessive: 'restaurant',
    placeholder: 'Tell us about your restaurant: where it is, how many seats, how many restrooms.',
    plate: PlateRestaurant,
    plateMobile: PlateRestaurantMobile,
    counter: 79,
  },
} satisfies Record<string, Venue>;

export type VenueId = keyof typeof VENUES;

export const VENUE_IDS = Object.keys(VENUES) as VenueId[];

export const DEFAULT_VENUE: VenueId = 'grocery';

/** `?shop=` value to a venue. `Object.hasOwn`, because `'toString' in VENUES` is true. */
export function toVenue(value: string | null | undefined): VenueId {
  return value && Object.hasOwn(VENUES, value) ? (value as VenueId) : DEFAULT_VENUE;
}

/** Real terms, approved by the owner on 2026-10-07. */
export const TERMS = {
  retail: 10,
  wholesale: 8,
  discountPercent: 20,
  minimumBars: 6,
} as const;

export const PERKS: {title: string; body: string; price?: {pay: number; sell: number}}[] = [
  {
    title: 'Partner pricing',
    body: `${TERMS.discountPercent}% off retail. You pay $${TERMS.wholesale} a bar, your customers pay $${TERMS.retail}.`,
    price: {pay: TERMS.wholesale, sell: TERMS.retail},
  },
  {
    title: 'Start small',
    body: `A ${TERMS.minimumBars}-bar minimum. Try one shelf before you commit the whole aisle.`,
  },
  {
    title: 'Reorder in one click',
    body: 'Your partner portal keeps your order history, reorders in one click, and sends invoices on request.',
  },
  {
    title: 'Join the team',
    body: 'Become part of a growing network of retailers who prioritize quality. We support our partners with marketing materials and dedicated service.',
  },
  {
    title: 'Connect with fans',
    body: 'Isla Suds customers are loyal and enthusiastic. Bring them into your store by offering their favorite bars locally.',
  },
  {
    title: 'Share and shine',
    body: 'We love to shout out our partners on social media. Let us help drive traffic to your door.',
  },
];
