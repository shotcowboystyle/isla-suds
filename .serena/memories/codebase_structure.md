# Codebase Structure

## Root Directory

```
isla-suds/
├── app/                          # Application source code
├── public/                       # Static assets (served as-is)
├── scripts/                      # Build and smoke test scripts
├── _bmad/                        # BMAD AI agent framework
├── _bmad-output/                 # BMAD workflow outputs
├── dist/                         # Production build output
├── node_modules/                 # Dependencies
├── server.ts                     # Oxygen worker entry point
├── vite.config.ts               # Vite build configuration
├── react-router.config.ts       # React Router + Hydrogen preset
├── tsconfig.json                # TypeScript configuration
├── eslint.config.js             # ESLint configuration
├── package.json                 # Project dependencies and scripts
├── CLAUDE.md                    # AI coding assistant instructions
└── README.md                    # Project documentation
```

## App Directory Structure

```
app/
├── routes/                       # React Router file-based routing
│   ├── _index.tsx               # Homepage route
│   ├── products.$handle.tsx     # Product detail page
│   ├── collections.$handle.tsx  # Collection page
│   ├── cart.tsx                 # Cart page
│   ├── account.tsx              # Account layout
│   ├── account._index.tsx       # Account dashboard
│   ├── account.orders._index.tsx # Orders list
│   ├── account.profile.tsx      # Profile management
│   ├── search.tsx               # Search results
│   └── ...                      # Other routes
│
├── components/                   # Reusable React components
│   ├── Header.tsx               # Site header with navigation
│   ├── Footer.tsx               # Site footer
│   ├── ProductForm.tsx          # Product variant selector
│   ├── CartMain.tsx             # Cart display
│   ├── AddToCartButton.tsx      # Add to cart interaction
│   ├── SearchFormPredictive.tsx # Predictive search input
│   ├── ThemeSwitcher.tsx        # Theme toggle component
│   └── ...                      # Other components
│
├── lib/                         # Core utilities and context
│   ├── context.ts               # Hydrogen context creation
│   ├── session.ts               # Custom session implementation
│   ├── fragments.ts             # Shared GraphQL fragments
│   ├── variants.ts              # Product variant utilities
│   ├── search.ts                # Search helper functions
│   ├── redirect.ts              # URL redirect handling
│   └── orderFilters.ts          # Order filtering logic
│
├── graphql/                     # GraphQL queries and mutations
│   └── customer-account/        # Customer Account API queries
│       ├── CustomerDetailsQuery.ts
│       ├── CustomerOrdersQuery.ts
│       ├── CustomerOrderQuery.ts
│       ├── CustomerUpdateMutation.ts
│       └── CustomerAddressMutations.ts
│
├── utils/                       # Helper utilities
│   └── cn.ts                    # Classname utility (clsx + tailwind-merge)
│
├── styles/                      # Global CSS
│   ├── app.css                  # Main application styles
│   ├── tailwind.css             # Tailwind directives
│   └── reset.css                # CSS reset
│
├── assets/                      # Static assets bundled with app
│   ├── images/                  # Images
│   ├── video/                   # Video files
│   ├── favicon.svg              # Site favicon
│   └── *.png                    # Logo files
│
├── fonts/                       # Custom font files
│   ├── HelveticaNeue.woff2
│   ├── HelveticaNeueBold.woff2
│   └── HelveticaNeueLight.woff2
│
├── content/                     # Content data
│   └── story.ts                 # Brand story content
│
├── root.tsx                     # Root layout component
├── entry.client.tsx             # Client-side entry point
├── entry.server.tsx             # Server-side entry point
├── routes.ts                    # Route configuration
└── cookie.server.ts             # Cookie utilities
```

## Generated Files

```
storefrontapi.generated.d.ts     # Storefront API TypeScript types
customer-accountapi.generated.d.ts # Customer Account API types
.react-router/                   # React Router generated types
```

## Key Architectural Files

### server.ts

- Oxygen worker entry point
- Creates Hydrogen context
- Handles requests via React Router
- Implements storefront redirects
- Serves static assets

### app/root.tsx

- Root layout component
- Wraps all routes
- Includes Analytics component
- Defines document structure

### app/lib/context.ts

- Creates unified Hydrogen context
- Configures storefront client
- Sets up cart, session, i18n
- Defines cache strategies

### app/lib/session.ts

- Custom session implementation
- Cookie-based storage
- Implements HydrogenSession interface
- Handles pending state tracking

### react-router.config.ts

- React Router configuration
- Hydrogen preset integration
- Build optimization settings

## Route Patterns

### File-based Routing

- `_index.tsx` - Index route
- `$param.tsx` - Dynamic parameter
- `_.route.tsx` - Pathless layout
- `[special].tsx` - Optional route
- Dot notation for nested paths: `account.orders._index.tsx`

### Route Module Structure

```typescript
export async function loader({context}: Route.LoaderArgs) {
  // Fetch data
}

export async function action({context, request}: Route.ActionArgs) {
  // Handle mutations
}

export const meta: Route.MetaFunction = ({data}) => {
  // Return meta tags
};

export default function RouteComponent() {
  // Render UI
}
```
