# Task Completion Checklist

When you complete a development task, follow this checklist to ensure quality and completeness.

## Before Committing

### 1. Type Check

```bash
pnpm typecheck
```

- Ensure no TypeScript errors
- Verify all types are correct
- Check for any missing type definitions

### 2. Lint

```bash
pnpm lint
```

- Fix all linting errors
- Address any warnings
- Ensure code follows style guidelines

### 3. Code Generation (if GraphQL changed)

```bash
pnpm codegen
```

- Run if you modified any GraphQL queries or mutations
- Regenerates TypeScript types from GraphQL schemas
- Updates React Router types

### 4. Build Test

```bash
pnpm build
```

- Verify production build succeeds
- Check for any build-time errors
- Ensure no bundle size issues

### 5. Smoke Tests

```bash
pnpm test:smoke
```

- Run all smoke tests
- Verify build and typecheck pass
- Optionally test dev server startup

## Code Quality Checks

### Review Changes

- Remove any debug code (`console.log`, commented code)
- Ensure no temporary/test code remains
- Check for proper error handling

### TypeScript

- No `any` types unless absolutely necessary
- Proper type annotations on function parameters
- Use generated GraphQL types

### React Router

- Loaders return proper data types
- Actions handle form data correctly
- Meta functions return proper meta tags
- Error boundaries handle errors appropriately

### Hydrogen Patterns

- Use context from loader/action args
- Follow Hydrogen session patterns
- Use appropriate cache strategies
- Handle cart operations correctly

### Security

- No sensitive data in client-side code
- Proper session handling
- No exposed API keys or secrets
- Input validation where needed

## Testing in Development

### Manual Testing

1. Start dev server: `pnpm dev`
2. Test the feature in browser
3. Check network requests in DevTools
4. Verify responsive design
5. Test error states

### Cross-browser (if UI changes)

- Test in Chrome
- Test in Safari
- Test in Firefox (optional)
- Test on mobile viewport

## Git Workflow

### Stage Changes

```bash
git add <modified-files>
```

- Stage only relevant files
- Don't commit build artifacts
- Don't commit `.env` or secrets

### Commit

```bash
git commit -m "type: description"
```

- Use conventional commit format
- Types: feat, fix, refactor, docs, style, test, chore
- Keep message clear and concise

### Before Push

- Review the diff: `git diff HEAD`
- Ensure commit includes all changes
- Verify no unintended changes included

## Documentation

### Update if Needed

- Update CLAUDE.md if architecture changed
- Update README.md for user-facing changes
- Add comments for complex logic
- Document new environment variables

## Deployment Considerations

### Environment Variables

- Ensure `.env.example` is updated if new vars added
- Document required environment variables
- Test with production-like env vars

### Performance

- Check bundle size with `pnpm build`
- Ensure no unnecessary dependencies added
- Verify images are optimized

## Final Checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm test:smoke` passes
- [ ] No debug code remains
- [ ] Manual testing completed
- [ ] Git commit is clean and descriptive
- [ ] Documentation updated if needed
- [ ] Ready to push/deploy
