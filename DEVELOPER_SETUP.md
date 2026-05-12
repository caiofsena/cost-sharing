# Developer Setup Guide

## Pre-commit Hooks

This project uses **Husky** + **lint-staged** to automatically run code quality checks before each commit.

### What happens on commit:
1. **Prettier** formats your code automatically
2. **ESLint** fixes any linting issues
3. If checks fail, the commit is blocked

### Manual commands:
```bash
# Format all files
npm run format

# Run ESLint
npm run lint

# Run TypeScript check
npx tsc --noEmit
```

## Absolute Imports

Use `@/` instead of relative paths:

```typescript
// ❌ Before
import { Button } from "../../components/Button";
import { useAppDispatch } from "../../store/hooks";

// ✅ After
import { Button } from "@/components/Button";
import { useAppDispatch } from "@/store/hooks";
```

## Editor Setup

### VS Code (Recommended)

Install these extensions:
- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)

Add to your `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### Other Editors

The `.editorconfig` file ensures consistent formatting across all editors that support it.

## Configuration Files

| File | Purpose |
|------|---------|
| `.prettierrc` | Prettier formatting rules |
| `.prettierignore` | Files to exclude from formatting |
| `.editorconfig` | Editor-agnostic formatting rules |
| `eslint.config.js` | ESLint linting rules |
| `.husky/pre-commit` | Git hook that runs lint-staged |
| `tsconfig.json` | TypeScript + absolute import paths |
| `babel.config.js` | Babel module-resolver for runtime |
