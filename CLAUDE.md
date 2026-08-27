# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Isla Suds is a Shopify Hydrogen-based headless commerce storefront built with React Router 7, TypeScript, and Tailwind CSS. It uses Shopify's Storefront API and Customer Account API for data fetching and user management, deployed to Shopify Oxygen edge workers.

## Architecture

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

## BMAD Integration

This project includes BMAD (Build-Measure-Adapt-Deploy) AI agent framework in `_bmad/`, accessible via skills (see .mcp.json).

## Important Notes

- Always run codegen after modifying GraphQL queries
- Session secret must be set in environment
- Customer Account API requires public domain setup (see README)
- Use `shopify hydrogen` CLI commands (not direct `vite` or `react-router`)
- TypeScript paths use `~/` alias for `app/` directory
