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

### DS-011 · IconButton — concluída a 2026-10-13

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-13), commit 53148f3 (mais 9a39631, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** `IconButton` sobre o `Button`, quadrado (32/40/48px), `aria-label` ou `aria-labelledby` obrigatório no tipo, ícone decorativo em `aria-hidden`, com `asChild` e `disabled` acessível herdados do `Button`.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `Variants`, `Sizes`, `Disabled`, `AsLink`, `AsLinkDisabled`, `NextToButton` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** nota do testador: sem `play` visual para `danger` e `ghost` em hover; verificado por leitura do CSS.

### DS-012 · Field — concluída a 2026-10-13

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-13), commit 4363736 (mais 84ce2e8, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** `Field`, `FieldLabel`, `FieldDescription`, `FieldError` e hook `useFieldControl()` que ligam controlo, etiqueta, ajuda e erro (`aria-describedby`, `aria-invalid`, `aria-required`, `disabled`), reutilizáveis pelos componentes de formulário seguintes.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `WithDescription`, `Required`, `Invalid`, `Disabled` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** nota do testador: `FieldError` sem `role="alert"`; anúncio dinâmico do erro fica como sugestão ao planeador.

### DS-013 · Input — concluída a 2026-10-13

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-13), commit 97b7644 (mais o commit 5421d98, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** `Input` com `<input>` nativo dentro de um contorno, tamanhos 32/40/48px iguais aos do `Button`, estado inválido, `leadingAddon`/`trailingAddon` decorativos que focam o input, e integração automática com `Field` (props diretas têm prioridade).
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `Sizes`, `WithButton`, `WithField`, `WithAddons`, `Invalid`, `Disabled`, `ReadOnly`, `Password` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** nota do testador: `className` vai para o `<input>` e o contorno não aceita classe própria; sugestão ao planeador: `wrapperClassName`.

### DS-015 · Checkbox — concluída a 2026-10-14

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-14), commit 4467da0 (mais 4085eca, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** `Checkbox` sobre `@radix-ui/react-checkbox` com estados marcada, desmarcada e indeterminada (`aria-checked="mixed"`), indicador `CheckIcon`/`MinusIcon`, tamanhos `sm`/`md`, etiqueta clicável (>= 24x24px), estado inválido, modo controlado e não controlado, `FormData` e integração automática com `Field`.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `Checked`, `Indeterminate`, `Disabled`, `Sizes`, `WithField`, `Group` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** nota do testador: `className` vai para o botão e o `<label>` exterior não aceita classe própria; sugestão ao planeador: `labelClassName`. Etiqueta desativada usa `text-muted` por causa do axe.

### DS-018 · Select — concluída a 2026-10-14

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-14), commit 74464f5 (mais f7552ff, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** `Select`, `SelectItem`, `SelectGroup` e `SelectSeparator` sobre `@radix-ui/react-select`, lista em portal com `--ds-z-dropdown`, largura mínima do gatilho, tamanhos 32/40/48px iguais aos do `Input`, estado inválido, modo controlado e não controlado, `FormData` e integração automática com `Field`.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `WithDefaultValue`, `Sizes`, `Groups`, `DisabledItem`, `Disabled`, `WithField`, `LongList`, `KeyboardInteraction` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** notas do testador: o `tabIndex={-1}` no gatilho com a lista aberta é deliberado (axe `aria-hidden-focus`); o `play` de `KeyboardInteraction` usa `KeyboardEvent` despachados e o teste unitário cobre os atalhos com `user-event`. O critério dizia `z-index-dropdown`, o token real é `--ds-z-dropdown`.
### DS-014 · Textarea — concluída a 2026-10-15

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-15), commit 3ece050 (mais 6f8a97f, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** `Textarea` sobre `<textarea>` nativo com `size` (altura mínima 32/40/48px), `invalid`, `rows` (omissão 3) e `resize` (`data-resize`), mesmos tokens e estados do `Input`, modo controlado e não controlado e integração automática com `Field`.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `Sizes`, `WithField`, `Invalid`, `Disabled`, `ResizeNone` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** notas do testador: a igualdade de altura com o `Input` só é medida no Chromium (o `play` de `Sizes`); o redimensionamento pelo utilizador não é testado automaticamente.

### DS-016 · RadioGroup — concluída a 2026-10-15

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-15), commit 4aa0448 (mais 66977bf, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** `RadioGroup` e `Radio` sobre `@radix-ui/react-radio-group`, com `aria-orientation` (vertical por omissão), nome acessível obrigatório no tipo, tamanhos `sm`/`md`, setas nas quatro direções com volta, desativados saltados, modo controlado e não controlado, `FormData` e integração automática com `Field`.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `Horizontal`, `WithDefaultValue`, `DisabledItem`, `DisabledGroup`, `WithField`, `Sizes` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** notas do testador: o ponto de tabulação no DOM é o contentor `radiogroup`, que reencaminha o focus; as setas só selecionam em jsdom com a tecla premida; `Radio` fora de `RadioGroup` falha. Sugestão ao planeador: `FieldLabel` com `id` ou `Fieldset`/`legend`, porque `htmlFor` não nomeia o grupo.

### DS-017 · Switch — concluída a 2026-10-16

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-16), commit 3fbd332 (mais 443b3ec, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** `Switch` sobre `@radix-ui/react-switch` (`<button role="switch">`), tamanhos `sm`/`md`, etiqueta clicável (>= 24px), estado pela posição do manípulo com contraste >= 3:1 nos dois temas, transições com `prefers-reduced-motion`, modo controlado e não controlado, `FormData` e integração automática com `Field`.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `Checked`, `Disabled`, `Sizes`, `WithField` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** notas do testador: o contraste do estado desativado fica abaixo de 3:1 (isento por WCAG 1.4.11, igual ao `Checkbox`; decisão de design a propor ao planeador se o João quiser a pista visível no tema escuro); sem `invalid`/`aria-invalid` (fora do critério); movimento reduzido e posição do manípulo verificados só no CSS, não num browser.

### DS-019 · Badge — concluída a 2026-10-16

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-16), commit 15b540c
- **Iterações de desenvolvimento:** 1
- **Entregue:** `Badge` (`<span class="ds-badge">`, ou o filho com `asChild`) com `variant` (6), `appearance` (`subtle`/`solid`) e `size` (`sm`/`md`), contraste >= 4,5:1 nas 12 combinações por tema, sem `role`, texto numa só linha com reticências.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `Variants`, `Solid`, `Sizes`, `LongText` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** notas do testador: o contraste só é medido em browser pelo `test:a11y` e por cálculo em `Badge.css.test.ts`; com `asChild` sobre `<a>` não há estilo de hover.

### DS-025 · Dialog (Modal) — concluída a 2026-10-19

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-19), commit e1c2909 (mais dbe5ab0, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** `Dialog` e componentes associados sobre `@radix-ui/react-dialog`, em portal com overlay e `z-index-modal`, tamanhos `sm`/`md`/`lg`, focus preso e devolvido ao gatilho, scroll interno no corpo, botão de fechar configurável, fecho por overlay opcional, gatilho desativado que não abre, modo controlado e não controlado, `prefers-reduced-motion`.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `Sizes`, `WithForm`, `LongContent`, `Confirmation`, `NoOverlayClose`, `DisabledTrigger`, `KeyboardInteraction` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** notas do testador: `KeyboardInteraction` usa eventos sintéticos (focus preso também testado com `userEvent` em jsdom); movimento reduzido e layout estreito verificados por CSS, não medidos em browser.

### DS-026 · DropdownMenu — concluída a 2026-10-19

- **Relatório de testes que aprovou:** Relatório 1 (2026-10-19), commit d1f8738 (mais 988926b, só de testes)
- **Iterações de desenvolvimento:** 1
- **Entregue:** `DropdownMenu` e componentes associados sobre `@radix-ui/react-dropdown-menu`, em portal com `z-index-dropdown`, navegação completa por teclado (setas, Home/End, letra, Enter/Espaço, Esc, Tab fecha), itens `danger` com ícone, itens e gatilho desativados que não ativam, modo controlado e não controlado.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `WithIcons`, `WithGroupsAndLabels`, `DisabledItem`, `DangerItem`, `OnIconButton`, `DisabledTrigger`, `KeyboardInteraction` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** notas do testador: menu não modal (`modal={false}`) para evitar `aria-hidden-focus`, logo a página atrás continua interativa; `KeyboardInteraction` usa eventos sintéticos; colisões do popper não medidas em browser.

### DS-032 · Table: estrutura base — concluída a 2026-10-19

- **Relatório de testes que aprovou:** Relatório 2 (2026-10-19), commit f83f5cf
- **Iterações de desenvolvimento:** 2
- **Entregue:** `Table`, `TableCaption`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell` e `TableCell` sobre elementos HTML nativos, numa região com scroll focável e nomeada, com `size`, `striped`, `stickyHeader`, `align`, `numeric`, legenda escondida e linha selecionada, contraste AA nos dois temas e scroll horizontal por setas verificado em browser real.
- **Changeset:** não aplicável (`@ds/ui` é privado e a versão é 0.0.0; sem pacote publicado alterado)
- **Documentação:** autodocs com props em JSDoc, exemplo e notas de acessibilidade; stories `Default`, `Striped`, `Dense`, `WithCaption`, `NumericColumns`, `StickyHeader`, `HorizontalScroll`, `WithBadges` e `DarkTheme` (cobertas pelo `test:a11y`). Sem `TODO` na tarefa.
- **Lições:** o teste das setas vive em `apps/docs/.storybook/test-runner.ts` (só corre em `pnpm test:a11y`); sem `className`/props para o contentor `ds-table-container` (sugestão ao planeador, relevante para DS-035); `stickyHeader` depende de `--ds-table-max-height` definida pelo consumidor.

## Marcos

- Fundações concluídas — 2026-10-13 (DS-001 a DS-009)
- Formulários concluídos — 2026-10-16 (DS-010 a DS-018)

<!-- O finalizador regista aqui quando uma fase do MVP fica toda Concluído (ex.: "Fundações concluídas — 2026-10-30"). -->
