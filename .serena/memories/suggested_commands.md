# Suggested Commands

## Primary Development Commands

### Development Server

```bash
pnpm dev
```

Starts the development server with:

- Hot module replacement (HMR)
- Automatic GraphQL codegen
- Mini Oxygen worker emulation
- Default port: 3000

### Production Build

```bash
pnpm build
```

Creates optimized production build with:

- GraphQL codegen
- React Router type generation
- Asset optimization and bundling
- Output to `dist/` directory

### Preview Build

```bash
pnpm preview
```

Preview production build locally:

- Builds if not already built
- Runs Mini Oxygen server
- Tests production-like environment

## Code Quality Commands

### Type Checking

```bash
pnpm typecheck
```

Runs TypeScript compiler with:

- React Router type generation
- No emit (type-check only)
- Full project validation

### Linting

```bash
pnpm lint
```

Runs ESLint across codebase:

- Checks for code quality issues
- Enforces style guidelines
- Validates imports and React patterns

### Code Generation

```bash
pnpm codegen
```

Generates types from:

- Shopify Storefront API schema
- Customer Account API schema
- React Router routes

## Testing Commands

### All Smoke Tests

```bash
pnpm test:smoke
```

Runs all smoke tests (build + typecheck)

### Individual Smoke Tests

```bash
pnpm test:smoke:build      # Test production build
pnpm test:smoke:typecheck  # Test type checking
pnpm test:smoke:dev        # Test dev server startup
```

## Shopify CLI Commands

### Deploy to Oxygen

```bash
shopify hydrogen deploy
```

Deploys to Shopify Oxygen hosting

### Link to Shopify Store

```bash
shopify hydrogen link
```

Links local project to Shopify store

### Environment Variables

```bash
shopify hydrogen env pull
```

Pulls environment variables from Shopify

## Package Management

### Install Dependencies

```bash
pnpm install
```

### Add New Dependency

```bash
pnpm add <package-name>
```

### Add Dev Dependency

```bash
pnpm add -D <package-name>
```

## Git Commands (Darwin/macOS)

```bash
git status                    # Check working tree status
git add <file>               # Stage changes
git commit -m "message"      # Commit changes
git push                     # Push to remote
git pull                     # Pull from remote
git log --oneline -10        # View recent commits
```

## System Commands (Darwin/macOS)

```bash
ls -la                       # List files with details
find . -name "*.tsx"         # Find files by pattern
grep -r "pattern" app/       # Search in files
cat file.txt                 # Display file contents
pwd                          # Print working directory
```

## Recommended Workflow

1. `pnpm dev` - Start development
2. Make changes
3. `pnpm typecheck` - Verify types
4. `pnpm lint` - Check code quality
5. `pnpm test:smoke` - Run smoke tests
6. `git add` + `git commit` - Commit changes
7. `pnpm build` - Test production build before deploy
