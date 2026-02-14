/** Retail store locations - third-party retailers carrying Isla Suds products */

export interface StoreLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  hours?: string;
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
      name: 'Store Name 1',
      website: 'https://example.com',
      locations: [
        {
          address: '123 Main St',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90001',
          phone: '(310) 555-0100',
          hours: 'Mon-Sat 10am-6pm, Sun 11am-5pm',
        },
      ],
    },
    {
      name: 'Store Name 2',
      website: 'https://example.com',
      locations: [
        {
          address: '456 First Ave',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90002',
          phone: '(310) 555-0200',
          hours: 'Mon-Fri 9am-7pm, Sat-Sun 10am-6pm',
        },
        {
          address: '789 Second Blvd',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90003',
          phone: '(310) 555-0300',
          hours: 'Mon-Fri 9am-7pm, Sat-Sun 10am-6pm',
        },
        {
          address: '321 Third St',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90004',
          phone: '(310) 555-0400',
          hours: 'Mon-Fri 9am-7pm, Sat-Sun 10am-6pm',
        },
        {
          address: '654 Fourth Ave',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90005',
          phone: '(310) 555-0500',
          hours: 'Mon-Fri 9am-7pm, Sat-Sun 10am-6pm',
        },
      ],
    },
  ] satisfies RetailStore[],
};
