# Story 1.1: Initialize Hydrogen Project with Skeleton Template

Status: ready-for-dev

---

## Story

As a **developer**,
I want **a Shopify Hydrogen project initialized with the skeleton template and TypeScript**,
So that **I have a clean foundation without opinionated UI that would conflict with our custom immersive experience**.

---

## Acceptance Criteria

### AC1: Project Initialization

**Given** no existing Hydrogen project in the repository
**When** I run the initialization command with skeleton template, TypeScript, and Tailwind options
**Then** a new Hydrogen project is created with:

- TypeScript configuration (strict mode enabled)
- Tailwind CSS via PostCSS
- Vite 6 + React Router 7.x
- Shopify Storefront API client configured

### AC2: Development Server

**Given** the project is initialized
**When** I run `npm run dev`
**Then** the development server starts successfully in mock shop mode
**And** the page renders without errors in the browser

### AC3: Project Structure

**Given** the project is initialized
**When** I inspect the file structure
**Then** it follows Hydrogen conventions:

- `/app/routes` for file-based routing
- `/app/components` for React components
- `/app/lib` for utilities and helpers

### AC4: Build Verification

**Given** the project is initialized
**When** I run `npm run build`
**Then** the production build completes without errors
**And** TypeScript type checking passes

---

## Tasks / Subtasks

- [ ] **Task 1: Initialize Hydrogen Project** (AC: #1)
  - [ ] 1.1 Run Hydrogen create command with skeleton template
  - [ ] 1.2 Verify TypeScript configuration is strict mode
  - [ ] 1.3 Verify Tailwind CSS is configured via PostCSS
  - [ ] 1.4 Verify Storefront API client is present

- [ ] **Task 2: Verify Development Server** (AC: #2)
  - [ ] 2.1 Run `npm run dev` and confirm server starts
  - [ ] 2.2 Open browser and verify page renders
  - [ ] 2.3 Check browser console for errors

- [ ] **Task 3: Verify Project Structure** (AC: #3)
  - [ ] 3.1 Confirm `/app/routes` directory exists
  - [ ] 3.2 Confirm `/app/components` directory exists
  - [ ] 3.3 Confirm `/app/lib` directory exists

- [ ] **Task 4: Build Verification** (AC: #4)
  - [ ] 4.1 Run `npm run build`
  - [ ] 4.2 Run `npm run typecheck`
  - [ ] 4.3 Confirm no build errors

---

## Dev Notes

### Critical Context

This is the **foundation story** for the entire Isla Suds project. Every subsequent story depends on this initialization being correct. The skeleton template was explicitly chosen over demo-store because:

1. **Isla Suds has a custom immersive experience** - constellation layout, texture reveals
2. **Demo-store would require removing more code than we keep**
3. **Clean slate is better** for highly custom UI work

### Initialization Command (EXACT)

```bash
npm create @shopify/hydrogen@latest -- \
  --language ts \
  --styling tailwind \
  --install-deps \
  --shortcut h2 \
  --markets subfolders
```

**IMPORTANT:** Use this exact command. Do not deviate or add additional flags.

### Post-Initialization Verification Checklist

After running the init command, verify these files exist and are correctly configured:

| File                    | What to Check                                           |
| ----------------------- | ------------------------------------------------------- |
| `tsconfig.json`         | `"strict": true` is enabled                             |
| `vite.config.ts`        | Hydrogen plugin is configured                           |
| `tailwind.config.ts`    | Tailwind is configured for `./app/**/*.{js,ts,jsx,tsx}` |
| `app/root.tsx`          | Root component exists                                   |
| `app/entry.client.tsx`  | Client entry exists                                     |
| `app/entry.server.tsx`  | Server entry exists                                     |
| `app/routes/_index.tsx` | Home route exists                                       |

### Technology Versions Expected

From project-context.md, these are the expected versions:

| Technology       | Version   |
| ---------------- | --------- |
| Shopify Hydrogen | 2025.7.3+ |
| React            | 18.3.1+   |
| React Router     | 7.12.0+   |
| TypeScript       | 5.9.2+    |
| Vite             | 6.2.4+    |
| Tailwind CSS     | 4.1.6+    |
| Node.js          | ≥18.0.0   |

### What This Story Does NOT Do

This story only initializes the project. It does NOT:

- Create design tokens (Story 1.2)
- Configure fluid typography (Story 1.3)
- Add CVA (Story 1.4)
- Add Radix UI (Story 1.5)
- Add Lenis (Story 1.6)
- Add Framer Motion (Story 1.7)
- Configure Zustand (Story 1.8)
- Add error boundaries (Story 1.9)
- Configure CI/CD (Story 1.10)

**Keep scope tight. Only do what's in the acceptance criteria.**

---

## Architecture Compliance

### From architecture.md

**Starter Template Selection Rationale:**

> "The Isla Suds experience is fundamentally custom—constellation layout, texture reveals, dual-audience routing. Starting with demo-store would mean removing more code than we keep. Skeleton gives us the Shopify integration plumbing without UI opinions."

**Required Architectural Elements:**

- TypeScript strict mode enabled
- Tailwind CSS via PostCSS (not CLI)
- Vite 6 with Hydrogen plugin
- React Router 7.x file-based routing

### Bundle Budget Context

The <200KB gzipped bundle budget starts here. The skeleton template provides:

- Core Hydrogen runtime
- Shopify Storefront API client
- React + React Router

Remaining budget after skeleton: ~120-140KB for app code + libraries (Lenis, Framer Motion, Radix, Zustand).

---

## File Structure Notes

### Expected Directory Structure After Init

```
isla-suds/
├── app/
│   ├── components/     # (empty or minimal)
│   ├── lib/            # Shopify utilities
│   ├── routes/
│   │   └── _index.tsx  # Home route
│   ├── root.tsx        # App shell
│   ├── entry.client.tsx
│   └── entry.server.tsx
├── public/
├── .env.example
├── package.json
├── pnpm-lock.yaml (or package-lock.json)
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── server.ts
```

### Path Aliases

After init, verify `tsconfig.json` has the path alias configured:

```json
{
  "compilerOptions": {
    "paths": {
      "~/*": ["./app/*"]
    }
  }
}
```

Use `~/components/X` not `../../../components/X`.

---

## Testing Requirements

### Manual Verification Steps

1. **Dev Server Test:**

   ```bash
   npm run dev
   # Expected: Server starts on localhost:3000
   # Expected: Page loads without console errors
   ```

2. **Build Test:**

   ```bash
   npm run build
   # Expected: Build completes successfully
   # Expected: No TypeScript errors
   ```

3. **Type Check:**
   ```bash
   npm run typecheck
   # Expected: No type errors
   ```

### What to Look For

- No console errors in browser DevTools
- No build warnings about missing dependencies
- TypeScript strict mode violations fail the build (this is expected behavior)

---

## References

- [Source: architecture.md#Starter-Template-Evaluation] - Skeleton template selection rationale
- [Source: architecture.md#Initialization-Command] - Exact initialization command
- [Source: architecture.md#Post-Init-Setup-Required] - Setup sequence (stories 1.2-1.10)
- [Source: project-context.md#Technology-Stack-Versions] - Version requirements
- [Source: epics.md#Story-1.1] - Original story definition

---

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent upon completion_

---

## Story Metadata

| Field                | Value                                                  |
| -------------------- | ------------------------------------------------------ |
| Epic                 | 1 - Project Foundation & Design System                 |
| Story ID             | 1.1                                                    |
| Story Key            | 1-1-initialize-hydrogen-project-with-skeleton-template |
| Priority             | P0 - Critical (blocks all other stories)               |
| Estimated Complexity | Low                                                    |
| Dependencies         | None (first story)                                     |
| Blocks               | Stories 1.2 through 1.10, and all subsequent epics     |

---

_Ultimate context engine analysis completed - comprehensive developer guide created._
