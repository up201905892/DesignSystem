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

### DS-006 · Tema no Storybook: toggle e páginas de tokens — concluída a 2026-10-12

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-12), commit 5ffc6f1
- **Iterações de desenvolvimento:** 1
- **Entregue:** seletor "Theme" (claro/escuro) no Storybook, com `parameters.theme` a ter prioridade, e páginas Foundations (cores, semânticos nos dois temas, espaçamento, tipografia, raios, sombras) geradas a partir dos tokens.
- **Changeset:** não aplicável (alterações só em `apps/docs`, privado; nenhum pacote publicado alterado)
- **Documentação:** convenção da story `DarkTheme` em `apps/docs/README.md`; stories `Foundations/*` e `Foundations/Theme › DarkTheme` (tema escuro coberto pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** sugestão ao planeador (do programador): retirar os fallbacks da story `DarkTheme` dos ícones (DS-008), agora que o Storybook carrega os temas. Troca de tema ao vivo não observada no browser pelo testador; verificada por leitura do decorator.

### DS-007 · CSS base, focus visível, `styles.css` agregado e Stylelint — concluída a 2026-10-12

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-12), commit fdb215a
- **Iterações de desenvolvimento:** 1
- **Entregue:** CSS base limitado a elementos `ds-*`, classe `ds-focus-ring` com `:focus-visible`, regra de `prefers-reduced-motion`, `styles.css` agregado (gerado em `dist/styles.css` por `build-css.mjs`, sem `@import`) carregado pelo Storybook, e Stylelint em `pnpm lint` a proibir valores escritos à mão e classes sem prefixo `ds-`.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** stories `Foundations/FocusRing` e `FocusRing/DarkTheme` (tema escuro coberto pelo `test:a11y`); regras e exceções em `stylelint.config.js`. Sem `TODO` na tarefa.
- **Lições:** nota do testador: não há teste automático que prove o anel ao premir Tab (jsdom não avalia `:focus-visible`); verificado por leitura do CSS e das stories.

### DS-009 · Utilitários partilhados, helper de axe e teste de convenções — concluída a 2026-10-13

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-13), commit d729d7e
- **Iterações de desenvolvimento:** 1
- **Entregue:** `cx` e `Slot` em `utils/`, `VisuallyHidden` conforme C1 a C5 (com `asChild`), helper `expectNoA11yViolations` (vitest-axe), polyfills de jsdom no setup partilhado, `conventions.test.ts` e secção "How to create a component" no README de `@ds/ui`.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** `packages/ui/README.md`; stories `VisuallyHidden` Default e DarkTheme (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** nota do testador: a prova negativa do teste de convenções e os polyfills não têm verificação automática própria.

### DS-010 · Button — concluída a 2026-10-13

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-13), commit dcf7d57 (mais e005cde, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** componente `Button` com quatro variantes, três tamanhos, ícones decorativos, `fullWidth` e `asChild` (incluindo `disabled` acessível em ligações), referência de API para os componentes seguintes.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade (commit docs); stories `Primary`, `Secondary`, `Ghost`, `Danger`, `Sizes`, `WithIcons`, `FullWidth`, `Disabled`, `AsLink`, `AsLinkDisabled` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** nota do testador: sem `play` que prove `:hover`/`:active`; verificado por leitura do CSS.

## Marcos

- Fundações concluídas — 2026-10-13 (DS-001 a DS-009)

<!-- O finalizador regista aqui quando uma fase do MVP fica toda Concluído (ex.: "Fundações concluídas — 2026-10-30"). -->
