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

## Marcos

<!-- O finalizador regista aqui quando uma fase do MVP fica toda Concluído (ex.: "Fundações concluídas — 2026-10-30"). -->
