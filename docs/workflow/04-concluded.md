# 04 · Concluded

Tarefas fechadas. Só o `finalizador` escreve aqui, e só depois de confirmar que o relatório mais recente em `03-testing.md` é `Aprovado`.

## Tarefas concluídas

<!--
Modelo de entrada:

### DS-000 · Título — concluída a AAAA-MM-DD

- **Relatório de testes que aprovou:** Relatório N (AAAA-MM-DD), commit hash
- **Iterações de desenvolvimento:** N
- **Entregue:** o que o utilizador da biblioteca ganha, numa frase
- **Changeset:** ficheiro `.changeset/...` (patch | minor | major) ou "não aplicável"
- **Documentação:** story/página atualizada
- **Lições:** opcional, uma linha
-->

### DS-001 · Monorepo pnpm, TypeScript strict, ESLint e Prettier — concluída a 2026-10-09

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-09), commit d42f1ce
- **Iterações de desenvolvimento:** 1
- **Entregue:** esqueleto do monorepo com quatro workspaces, TypeScript strict, ESLint e Prettier, com `pnpm lint` e `pnpm typecheck` a funcionar.
- **Changeset:** não aplicável (tarefa só de infraestrutura; pacotes privados)
- **Documentação:** README atualizado no commit d42f1ce; stories não aplicáveis (sem componentes)
- **Lições:** nenhuma

### DS-002 · Vitest + Testing Library e build com tsup — concluída a 2026-10-09

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-09), commit b305745
- **Iterações de desenvolvimento:** 1
- **Entregue:** testes unitários com Vitest, jsdom e Testing Library, e build ESM + CJS + `.d.ts` com tsup em `ui` e `icons`, provados de ponta a ponta com o `VisuallyHidden` mínimo.
- **Changeset:** não aplicável (tarefa só de infraestrutura; pacotes privados)
- **Documentação:** stories não aplicáveis (Storybook chega na DS-003); sem `TODO` deixados no código
- **Lições:** nenhuma

### DS-003 · Storybook 8 com addon-a11y e `pnpm test:a11y` — concluída a 2026-10-11

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-11), commit 3f25ff9
- **Iterações de desenvolvimento:** 1
- **Entregue:** Storybook 8 em `apps/docs` com addon-a11y e `pnpm test:a11y` (test-runner + axe, WCAG A/AA) que falha perante violações, provado com a story do `VisuallyHidden`.
- **Changeset:** não aplicável (tarefa só de infraestrutura; pacotes privados)
- **Documentação:** `apps/docs/README.md` (inclui `test:a11y:setup`); story `Utilities/VisuallyHidden` com autodocs. Tema escuro nas stories não aplicável: tokens e tema chegam em DS-004 a DS-006. Sem `TODO` na tarefa.
- **Lições:** o CI/ciclo diário precisa de `pnpm test:a11y:setup` antes de `test:a11y` (já em "Decisões para o João")

### DS-004 · Tokens primitivos com Style Dictionary — concluída a 2026-10-11

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-11), commit 7598497
- **Iterações de desenvolvimento:** 1
- **Entregue:** tokens primitivos (cor, espaço, tipografia, raios, sombras, duração, z-index) em JSON, gerados pelo Style Dictionary como `tokens.css` (`--ds-*`) e objeto `tokens` tipado (ESM, CJS, `.d.ts`); `tokens` é construído antes de `ui`.
- **Changeset:** não aplicável (tarefa só de infraestrutura; pacotes privados)
- **Documentação:** stories e tema escuro não aplicáveis (páginas de tokens na DS-006); sem `TODO` na tarefa
- **Lições:** nenhuma

### DS-005 · Tokens semânticos e temas claro/escuro — concluída a 2026-10-12

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-12), commit 36fa7b6
- **Iterações de desenvolvimento:** 1
- **Entregue:** tokens semânticos (fundo, texto, borda, acento, estados, focus-ring, overlay) resolvidos em `themes.css` para tema claro, escuro e fallback `prefers-color-scheme`, exportados como `themes`, com contraste AA verificado por teste.
- **Changeset:** não aplicável (tarefa só de infraestrutura; pacotes privados)
- **Documentação:** pares de contraste documentados em `packages/tokens/src/contrast-pairs.ts`; stories e tema escuro no Storybook não aplicáveis (DS-006). Sem `TODO` na tarefa.
- **Lições:** nenhuma

### DS-008 · Pacote de ícones (subconjunto do Lucide com SVGR) — concluída a 2026-10-12

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-12), commit 7e74ced
- **Iterações de desenvolvimento:** 1
- **Entregue:** pacote `@ds/icons` com 30 ícones Lucide como componentes React gerados com SVGR, acessíveis por omissão (decorativos sem `title`, `role="img"` com `title`), com `size`, `className` e `ref`, em ESM + CJS + `.d.ts`.
- **Changeset:** não aplicável (`@ds/icons` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** `packages/icons/README.md` (secção "Credits") e `LICENSE-LUCIDE`; stories `Gallery`, `Sizes`, `WithTitle` e `DarkTheme`. Sem `TODO` na tarefa.
- **Lições:** nenhuma

## Marcos

<!-- O finalizador regista aqui quando uma fase do MVP fica toda Concluído (ex.: "Fundações concluídas — 2026-10-30"). -->
