# Guia de Configuração para Desenvolvedores

## Hooks de Pre-commit

Este projeto utiliza **Husky** + **lint-staged** para executar automaticamente verificações de qualidade de código antes de cada commit.

### O que acontece no commit:
1. **Prettier** formata seu código automaticamente
2. **ESLint** corrige problemas de linting
3. Se as verificações falharem, o commit é bloqueado

### Comandos manuais:
```bash
# Formatar todos os arquivos
npm run format

# Executar ESLint
npm run lint

# Executar verificação do TypeScript
npx tsc --noEmit
```

## Imports Absolutos

Use `@/` ao invés de caminhos relativos:

```typescript
// ❌ Antes
import { Button } from "../../components/Button";
import { useAppDispatch } from "../../store/hooks";

// ✅ Depois
import { Button } from "@/components/Button";
import { useAppDispatch } from "@/store/hooks";
```

## Configuração do Editor

### VS Code (Recomendado)

Instale estas extensões:
- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)

Adicione ao seu `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### Outros Editores

O arquivo `.editorconfig` garante formatação consistente em todos os editores que o suportam.

## Arquivos de Configuração

| Arquivo | Propósito |
|------|---------|
| `.prettierrc` | Regras de formatação do Prettier |
| `.prettierignore` | Arquivos a excluir da formatação |
| `.editorconfig` | Regras de formatação independentes do editor |
| `eslint.config.js` | Regras de linting do ESLint |
| `.husky/pre-commit` | Hook do Git que executa lint-staged |
| `tsconfig.json` | TypeScript + caminhos de import absoluto |
| `babel.config.js` | module-resolver do Babel para runtime |
