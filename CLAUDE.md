# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Isla Suds is a Shopify Hydrogen-based headless commerce storefront built with React Router 7, TypeScript, and Tailwind CSS. It uses Shopify's Storefront API and Customer Account API for data fetching and user management, deployed to Shopify Oxygen edge workers.

## Core Commands

### Development

```bash
# Start dev server with auto-codegen
pnpm dev

# Build for production with codegen
pnpm build

# Preview production build locally
pnpm preview
```

### Code Quality

```bash
# Lint codebase
pnpm lint

# Type checking (includes React Router type generation)
pnpm typecheck

# Generate GraphQL types and React Router types
pnpm codegen
```

### Testing

```bash
# Run all smoke tests
pnpm test:smoke

# Run individual smoke tests
pnpm test:smoke:build      # Test production build
pnpm test:smoke:typecheck  # Test type checking
pnpm test:smoke:dev        # Test dev server startup
```

## Architecture

### Stack

- **Framework**: React Router 7 (SSR-enabled) with Hydrogen preset
- **Runtime**: Shopify Oxygen (Cloudflare Workers)
- **API**: Shopify Storefront API (GraphQL) + Customer Account API
- **Styling**: Tailwind CSS v4 with custom theme
- **Build Tool**: Vite 6 with Hydrogen plugins

### Directory Structure

```
app/
  ├── routes/           # React Router file-based routing
  ├── components/       # Reusable UI components
  ├── lib/              # Core utilities and context
  │   ├── context.ts    # Hydrogen context setup
  │   ├── session.ts    # Custom session implementation
  │   ├── fragments.ts  # Shared GraphQL fragments
  │   ├── variant-url.ts # Shopify product variant URL helpers
  │   └── variants.ts   # CVA component variants (type-safe styling)
  ├── utils/            # Helper functions (cn.ts for classnames)
  ├── graphql/          # GraphQL queries and customer account API
  ├── styles/           # Global CSS and Tailwind
  └── root.tsx          # Root layout with Analytics
server.ts               # Oxygen worker entry point
react-router.config.ts  # React Router + Hydrogen preset config
vite.config.ts          # Vite + Hydrogen + Tailwind setup
```

### Key Architectural Patterns

**Hydrogen Context (app/lib/context.ts)**

- Creates unified context for storefront, cart, session, cache, i18n
- Use `createHydrogenRouterContext()` in server.ts
- Access via `context` in loaders/actions
- Extend with additional properties via `additionalContext` object and `HydrogenAdditionalContext` interface

**Session Management (app/lib/session.ts)**

- Custom `AppSession` class implements `HydrogenSession` interface
- Cookie-based session storage with `SESSION_SECRET` env var
- Tracks pending state via `isPending` flag
- Commit session headers only when changed

**GraphQL Patterns (app/lib/fragments.ts)**

- Store reusable fragments in `fragments.ts` (CART_QUERY_FRAGMENT, HEADER_QUERY, FOOTER_QUERY)
- Use GraphQL tag literals with `#graphql` comment for syntax highlighting
- Auto-generated TypeScript types in `storefrontapi.generated.d.ts` and `customer-accountapi.generated.d.ts`

**Routing (app/routes/)**

- File-based routing via React Router 7
- Use `Route.LoaderArgs`, `Route.ActionArgs`, `Route.MetaFunction` types
- Implement `loader` for data fetching, `action` for mutations
- Return deferred data with `defer()` for streaming SSR

**Styling**

- Use `cn()` utility from `app/utils/cn.ts` for conditional classnames (combines clsx + tailwind-merge)
- Tailwind CSS v4 via Vite plugin
- Theme switcher in app/components/ThemeSwitcher.tsx

### Environment Variables

Required in `.env`:

- `SESSION_SECRET` - Session encryption key (required)
- Shopify store credentials (auto-configured via Shopify CLI)

### Revalidation Strategy

Root loader uses custom `shouldRevalidate` to avoid unnecessary refetches:

- Revalidates on mutations (POST/PUT/DELETE)
- Revalidates on manual revalidation
- Does NOT revalidate on GET navigation (performance optimization)

### Storefront Redirects

The server.ts handles 404s by checking Shopify URL redirects via `storefrontRedirect()` before returning 404.

## Development Workflow

1. **Adding new routes**: Create files in `app/routes/` following React Router conventions
2. **Adding components**: Place in `app/components/` (use PascalCase)
3. **GraphQL queries**: Add to route files or `app/lib/fragments.ts` for shared queries
4. **Styling**: Use Tailwind classes with `cn()` utility for conditional styles
5. **Type safety**: Run `pnpm codegen` after GraphQL changes to regenerate types

## BMAD Integration

This project includes BMAD (Build-Measure-Adapt-Deploy) AI agent framework in `_bmad/`:

- `bmm/` - Build-Measure-Manage workflows and agents
- `cis/` - Creative & Innovation Suite workflows
- `core/` - Core BMAD functionality
- Output artifacts stored in `_bmad-output/`

BMAD provides workflows for development tasks, accessible via skills (see .mcp.json).

## Important Notes

- Always run codegen after modifying GraphQL queries
- Session secret must be set in environment
- Customer Account API requires public domain setup (see README)
- Use `shopify hydrogen` CLI commands (not direct `vite` or `react-router`)
- TypeScript paths use `~/` alias for `app/` directory
