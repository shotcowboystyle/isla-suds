# Code Style & Conventions

## TypeScript Configuration

- **Strict mode**: Enabled (`strict: true`)
- **Isolated modules**: Required for Vite
- **Path alias**: `~/` maps to `app/` directory
- **JSX**: react-jsx (no React imports needed)
- **Verbatim module syntax**: Enabled (explicit type imports)
- **No emit**: TypeScript for type-checking only, Vite handles compilation

## File Naming

- **Components**: PascalCase (e.g., `ProductForm.tsx`, `CartMain.tsx`)
- **Routes**: kebab-case or special syntax (e.g., `products.$handle.tsx`, `cart.tsx`)
- **Utilities**: camelCase (e.g., `cn.ts`, `variants.ts`)
- **Config files**: kebab-case (e.g., `react-router.config.ts`)

## Import Conventions

- Use `~/` path alias for imports from `app/` directory
- Example: `import { cn } from '~/utils/cn'`
- Keep imports organized: external deps, then internal modules

## React Router Patterns

- **Routes**: File-based routing in `app/routes/`
- **Data fetching**: Export `loader` function for GET, `action` for mutations
- **Type annotations**: Use `Route.LoaderArgs`, `Route.ActionArgs`, `Route.MetaFunction`
- **Deferred data**: Use `defer()` for streaming SSR
- **Meta tags**: Export `meta` function returning array of meta descriptors

## GraphQL Conventions

- Store reusable fragments in `app/lib/fragments.ts`
- Use `#graphql` comment before template literals for syntax highlighting
- Auto-generated types: `storefrontapi.generated.d.ts`, `customer-accountapi.generated.d.ts`
- Fragment naming: SCREAMING_SNAKE_CASE (e.g., `CART_QUERY_FRAGMENT`)

## Component Patterns

- **Styling**: Use Tailwind classes with `cn()` utility from `app/utils/cn.ts`
- **Conditional classnames**: `cn('base-class', condition && 'conditional-class')`
- **Props destructuring**: Prefer destructured props in function signatures
- **Type exports**: Export prop types when components are reusable

## Hydrogen-Specific Patterns

- **Context access**: Use `context` from loader/action args
- **Storefront queries**: `await context.storefront.query(QUERY)`
- **Cart operations**: `await context.cart.get()`, `context.cart.add()`, etc.
- **Session**: Custom `AppSession` class implementing `HydrogenSession`

## Error Handling

- Let Hydrogen/React Router handle boundary errors
- Use `throw new Response()` for controlled HTTP errors
- Return error responses from actions with appropriate status codes

## Formatting

- **Prettier config**: Uses @shopify/prettier-config
- **Line length**: Managed by Prettier
- **Semicolons**: Yes (Shopify style)
- **Quotes**: Single quotes preferred

## Linting

- ESLint flat config (eslint.config.js)
- React, JSX, TypeScript, import, accessibility plugins enabled
- No warnings should remain in committed code
