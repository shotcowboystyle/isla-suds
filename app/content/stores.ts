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
}

export interface RetailStore {
  name: string;
  website?: string;
  locations: StoreLocation[];
}

export const LOCATIONS_PAGE = {
  meta: {
    title: 'Store Locations | Isla Suds',
    description: 'Find Isla Suds products at retail stores near you.',
  },
  heading: 'Find Us Near You',
  subheading: 'Pick up Isla Suds at these retail partners.',
  stores: [
    {
      name: 'Sewee Outpost',
      website: 'https://seweeoutpost.com',
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
        },
      ],
    },
    {
      name: 'Odd Duck Market',
      website: 'https://oddduckmarkets.com',
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
        },
      ],
    },
  ] satisfies RetailStore[],
};
