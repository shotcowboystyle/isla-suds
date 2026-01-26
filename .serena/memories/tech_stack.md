# Tech Stack

## Core Framework

- **React Router 7** (v7.12.0) - File-based routing with SSR support
- **React** (v18.3.1) - UI library
- **Shopify Hydrogen** (v2025.7.3) - Shopify-specific React framework for commerce

## Language & Type System

- **TypeScript** (v5.9.2) - Strict mode enabled
- **@total-typescript/ts-reset** - Enhanced TypeScript types
- Target: ES2022
- Module: ES2022 with Bundler resolution

## Build & Development

- **Vite** (v6.2.4) - Build tool and dev server
- **@react-router/dev** - React Router development tools
- **@shopify/cli** (v3.85.4) - Shopify-specific CLI wrapper
- **@shopify/mini-oxygen** - Local Oxygen worker emulator

## Styling

- **Tailwind CSS** (v4.1.6) - Utility-first CSS framework
- **@tailwindcss/vite** - Vite plugin for Tailwind v4
- **clsx** + **tailwind-merge** - Conditional classname utility

## GraphQL

- **graphql** (v16.10.0) - GraphQL core library
- **graphql-tag** - Template literal tag for GraphQL queries
- **@graphql-codegen/cli** - TypeScript type generation from GraphQL schemas
- **@shopify/hydrogen-codegen** - Shopify-specific GraphQL codegen

## Code Quality

- **ESLint** (v9.18.0) - Linting with flat config
- **Prettier** - Code formatting (via @shopify/prettier-config)
- **TypeScript compiler** - Type checking

## Testing

- Custom smoke tests (build, typecheck, dev server startup)
- Located in `scripts/` directory

## APIs & Services

- Shopify Storefront API (GraphQL)
- Shopify Customer Account API (GraphQL)
- Session management via encrypted cookies
