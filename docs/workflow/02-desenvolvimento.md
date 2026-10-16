# 02 · Desenvolvimento

Registo do trabalho de implementação. Só o `programador` escreve aqui. Uma entrada por tarefa; se a tarefa voltar reprovada dos testes, acrescenta-se uma nova **Iteração** à mesma entrada.

Regra de entrada: a tarefa tem de estar `Planeado` em `01-planeamento.md` e todas as dependências `Concluído`.

## Entradas

<!--
Modelo de entrada:

### DS-000 · Título (igual ao Planeamento)

**Iteração 1 — AAAA-MM-DD**
- **Estado no fim:** Pronto para teste
- **O que foi feito:** resumo em 2–4 linhas
- **Ficheiros alterados:** lista de caminhos
- **Commit(s):** hash curto + mensagem
- **Critérios de aceitação cobertos:** quais e onde (ficheiro ou story)
- **Testes escritos pelo programador:** ficheiros de teste criados/alterados
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ · build ✔
- **Notas para o testador:** como verificar, casos limite conhecidos

**Iteração 2 — AAAA-MM-DD** (só se reprovada)
- **Falhas recebidas:** referência ao relatório em 03-testing.md
- **Correções:** …
-->

### DS-001 · Monorepo pnpm, TypeScript strict, ESLint e Prettier

**Iteração 1 — 2026-10-09**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** esqueleto do monorepo com os quatro workspaces (`@ds/tokens`, `@ds/ui`, `@ds/icons`, `docs`), `tsconfig.base.json` strict, ESLint 9 flat config com typescript-eslint, react, react-hooks e jsx-a11y, Prettier e ficheiros de ignore.
- **Ficheiros alterados:** `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, `tsconfig.base.json`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.gitignore`, `packages/{tokens,ui,icons}/{package.json,tsconfig.json,src/index.ts}`, `apps/docs/{package.json,tsconfig.json,src/index.ts}`; reformatados pelo Prettier: `README.md`, `.vscode/settings.json`.
- **Commit(s):** d42f1ce `feat(ui): DS-001 pnpm monorepo with strict TypeScript, ESLint and Prettier`
- **Critérios de aceitação cobertos:** todos os da especificação; verificados no terminal (ver abaixo).
- **Testes escritos pelo programador:** nenhum (não aplicável nesta tarefa).
- **Verificações locais:** lint ✔ · typecheck ✔ · test n/a · build n/a. Também: `pnpm install --frozen-lockfile` ✔; erro de tipos temporário em `packages/ui` faz `pnpm typecheck` sair ≠ 0; `<img>` sem `alt` num `.tsx` temporário faz `pnpm lint` falhar com `jsx-a11y/alt-text` (ficheiros temporários removidos).
- **Notas para o testador:**
  - Versões instaladas: ESLint 9.39, TypeScript 6.x (fixado com `^6`), Prettier 3. O `pnpm add` escolheu por omissão ESLint 10 e TypeScript 7, mas o ESLint 10 é incompatível com `eslint-plugin-jsx-a11y` (peer) e o typescript-eslint 8.71 recusa TS 7; por isso `eslint@^9` e `typescript@^6`. Há ainda avisos de peer do `eslint-plugin-react-hooks`/`jsx-a11y` com ESLint 9 / TS 6 que não bloqueiam.
  - `settings.react.version` está fixo em `19.0` no ESLint porque `react` ainda não é dependência (surge com os componentes).
  - O Prettier reformatou `README.md` e `.vscode/settings.json` (necessário para `prettier --check .` passar; só mudanças de formatação).
  - Sugestão ao planeador: decidir quando passar a ESLint 10 / TS 7 (dependem de os plugins suportarem).

### DS-002 · Vitest + Testing Library e build com tsup

**Iteração 1 — 2026-10-09**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** Vitest 5 com jsdom e Testing Library em `packages/ui` e `packages/icons`, setup partilhado com jest-dom em `test/setup.ts`, build com tsup (ESM + CJS + `.d.ts`) nos dois pacotes, scripts `test`, `test:watch` e `build` na raiz, e `VisuallyHidden` mínimo (`forwardRef`) em `packages/ui` com teste.
- **Ficheiros alterados:** `package.json`, `pnpm-workspace.yaml` (`onlyBuiltDependencies: esbuild`), `pnpm-lock.yaml`, `tsconfig.base.json`, `test/setup.ts`, `packages/{ui,icons}/{package.json,tsconfig.json,tsup.config.ts,vitest.config.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/VisuallyHidden/{VisuallyHidden.tsx,VisuallyHidden.test.tsx,index.ts}`.
- **Commit(s):** b305745 `feat(ui): DS-002 Vitest with Testing Library and tsup builds`
- **Critérios de aceitação cobertos:** todos os da especificação; verificados no terminal (ver abaixo).
- **Testes escritos pelo programador:** `packages/ui/src/VisuallyHidden/VisuallyHidden.test.tsx` (renderização com `toBeInTheDocument`, `ref` encaminhada, props nativas).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ · build ✔. Também: `pnpm install --frozen-lockfile` ✔ sem avisos de scripts ignorados; `require` do `.cjs` e `import()` do `.js` de `packages/ui/dist` ✔; teste temporário a falhar faz `pnpm test` sair ≠ 0 (ficheiro removido). `packages/icons` não tem testes: `passWithNoTests: true`.
- **Notas para o testador:**
  - `vitest` e `@testing-library/jest-dom` estão também nas devDependencies da raiz, porque `test/setup.ts` (fora dos pacotes) tem de os resolver; os restantes pacotes de teste ficam nos pacotes.
  - `globals: true` no Vitest, para o cleanup automático do Testing Library.
  - `tsconfig.base.json` ganhou `"ignoreDeprecations": "6.0"`: o tsup injeta `baseUrl` no build de `.d.ts`, que o TypeScript 6 marca como obsoleto e faz o build falhar. Deve ser revisto na migração para TS 7.
  - Versões resolvidas: vitest 5.0.3, jsdom 30, tsup 8.5, react 19.3.

### DS-003 · Storybook 8 com addon-a11y e `pnpm test:a11y`

**Iteração 1 — 2026-10-11**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** Storybook 8.6 (`@storybook/react-vite`, addon-essentials, addon-a11y) em `apps/docs/.storybook`, glob `packages/*/src/**/*.stories.tsx` + `apps/docs/src/**/*.mdx`; `@storybook/test-runner` com `axe-playwright` (`injectAxe` + `checkA11y` com tags wcag2a/wcag2aa/wcag21a/wcag21aa); script `apps/docs/scripts/test-a11y.mjs` que constrói, serve (http-server na porta 6007), espera pelo servidor, corre o test-runner e termina o servidor; scripts de raiz `storybook`, `build:docs`, `test:a11y`, `test:a11y:setup`; README do `apps/docs`; story `Utilities/VisuallyHidden` com `autodocs`.
- **Ficheiros alterados:** `package.json`, `pnpm-lock.yaml`, `apps/docs/{package.json,tsconfig.json,README.md}`, `apps/docs/.storybook/{main.ts,preview.ts,test-runner.ts}`, `apps/docs/scripts/test-a11y.mjs`, `packages/ui/package.json` (devDependency `@storybook/react`), `packages/ui/src/VisuallyHidden/VisuallyHidden.stories.tsx`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** 3f25ff9 `feat(ui): DS-003 Storybook 8 with addon-a11y and test:a11y`
- **Critérios de aceitação cobertos:** todos os da especificação. `pnpm storybook` não foi arrancado interativamente (só `build:docs` e o build estático dentro de `test:a11y`).
- **Testes escritos pelo programador:** story de exemplo (smoke test + axe via `pnpm test:a11y`). Prova negativa: story temporária com `<button></button>` fez `pnpm test:a11y` sair ≠ 0 com `button-name` (ficheiro removido, não commitado).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ · build ✔ · build:docs ✔ · test:a11y ✔ (após `pnpm test:a11y:setup`).
- **Notas para o testador:**
  - `@storybook/test-runner` fixado em `^0.22` (a 0.26 exige Storybook 10); `vite` fixado em `^6` (o 8 não é suportado pelo Storybook 8.6).
  - Aviso esperado: "No story files found for src/**/*.mdx" (ainda não há MDX; o glob é exigido pela tarefa).
  - O CI/ciclo diário precisa de correr `pnpm test:a11y:setup` (Chromium) antes de `pnpm test:a11y`; `.github/` não é meu, fica para "Decisões para o João".
  - O pnpm avisa de build scripts ignorados (`@parcel/watcher`, `@swc/core`, `unrs-resolver`); não impediram nada do que foi testado.

### DS-004 · Tokens primitivos com Style Dictionary

**Iteração 1 — 2026-10-11**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** fontes JSON (formato `value` + `type`) por categoria em `packages/tokens/src/primitives/` (`color`, `space`, `typography`, `radius`, `shadow`, `motion`, `z-index`); `scripts/build.mjs` corre o Style Dictionary e gera `dist/tokens.css` (`:root`, prefixo `--ds-`) e `dist/index.js` + `index.cjs` + `index.d.ts` (objeto `tokens` aninhado, com tipos literais `readonly`); `@ds/tokens` passa a ser dependência `workspace:*` de `@ds/ui`, pelo que `pnpm build` constrói `tokens` primeiro.
- **Ficheiros alterados:** `packages/tokens/{package.json,tsconfig.json,vitest.config.ts,scripts/build.mjs,src/tokens.test.ts,src/primitives/*.json}`, `packages/ui/package.json`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** 7598497 `feat(tokens): DS-004 primitive tokens with Style Dictionary`
- **Critérios de aceitação cobertos:** todos os da especificação.
- **Testes escritos pelo programador:** `packages/tokens/src/tokens.test.ts` (14 testes sobre o resultado do build: 10 passos por paleta, espaçamentos múltiplos de 4px, prefixo `--ds-`, nº de variáveis CSS = nº de folhas TS, sem valores vazios nem `{...}`, ESM = CJS).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ · build ✔.
- **Notas para o testador:**
  - O Style Dictionary instalado é a 5.6 (a mais recente); aceita o formato `value` + `type` sem alterações.
  - `pnpm test` do pacote corre primeiro o build, porque os testes leem `dist/`.
  - Nomes: `--ds-font-family-sans`, `--ds-font-size-md`, `--ds-font-weight-bold`, `--ds-font-line-height-normal`, `--ds-radius-*`, `--ds-shadow-*`, `--ds-duration-*`, `--ds-z-*`. Tamanhos `xs` a `3xl` incluem `sm, md, lg, xl, 2xl`.
  - `tsconfig` do pacote tem `types: ["node"]` (TS 6 já não inclui os tipos por omissão) e `@types/node` como devDependency.
  - Valores das paletas escolhidos pelo programador (escala tipo Tailwind); o contraste é da DS-005.
  - Sugestão ao planeador: o `ui` ainda não importa `tokens.css`; fica para as tarefas de componentes/DS-005/DS-006.

### DS-005 · Tokens semânticos e temas claro/escuro

**Iteração 1 — 2026-10-12**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** fontes semânticas `packages/tokens/src/semantic/light.json` e `dark.json` (só referências `{color.*}` a primitivos); o `scripts/build.mjs` resolve cada tema com um Style Dictionary próprio (primitivos em `include`, semânticos em `source`) e gera `dist/themes.css` com `:root, [data-theme="light"]`, `[data-theme="dark"]` e `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`, cada bloco com `color-scheme`; o objeto `themes` (`light` e `dark`) é exportado em `index.js`, `index.cjs` e `index.d.ts`; `exports` do pacote ganhou `./themes.css`; `src/contrast-pairs.ts` documenta os pares de contraste.
- **Ficheiros alterados:** `packages/tokens/{package.json,scripts/build.mjs,src/semantic/light.json,src/semantic/dark.json,src/contrast-pairs.ts,src/themes.test.ts,src/contrast.test.ts}`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** 36fa7b6 `feat(tokens): DS-005 semantic tokens and light/dark themes`
- **Critérios de aceitação cobertos:** todos os da especificação.
- **Testes escritos pelo programador:** `themes.test.ts` (JSON só com referências; mesmo conjunto de chaves nos dois temas; todos os tokens obrigatórios; valores resolvidos; três seletores, `color-scheme` e mesmas variáveis em cada bloco; fallback igual ao tema escuro) e `contrast.test.ts` (rácio WCAG de cada par de `contrast-pairs.ts` nos dois temas: 4,5:1 texto, 3:1 não textual; cobre `text-default|muted` e os quatro `*-text` sobre `bg-canvas|surface` e `*-subtle`, `text-on-accent` sobre `accent-default|hover|active`, `border-strong` e `focus-ring` sobre os três fundos).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (tokens: 89 testes) · build ✔. `test:a11y` não corrido: a tarefa não altera stories nem `apps/docs` (Storybook é da DS-006).
- **Notas para o testador:**
  - `color-overlay` precisa de transparência e os semânticos só podem referenciar primitivos: o JSON tem a propriedade `alpha` (0.5 claro, 0.6 escuro) e uma transformação `ds/color/alpha` no build gera `#0f172a80` / `#00000099`. Os valores de `tokens.css` não mudam.
  - No tema escuro `text-on-accent` é `neutral.900` e o acento é `primary.400|300|200` (branco sobre `primary.500` ficaria abaixo de 4,5:1).
  - `themes.css` não faz parte do objeto `tokens` (a contagem CSS = folhas TS da DS-004 mantém-se); os semânticos estão em `themes.light|dark`, com a mesma estrutura aninhada (ex.: `themes.light.color.bg.canvas`).
  - Os pares `*-default` de estado (ex.: `success-default`) não têm requisito de contraste na especificação e não estão em `contrast-pairs.ts`.
  - Sugestão ao planeador: a DS-007 deve importar `themes.css` no `styles.css`; o `exports` de `@ds/tokens` já tem `./themes.css`.

### DS-008 · Pacote de ícones (subconjunto do Lucide com SVGR)

**Iteração 1 — 2026-10-12**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** 30 SVG de `lucide-static` (1.55.0, versão exata) copiados para `packages/icons/svg/`; `scripts/generate.mjs` (comando `pnpm --filter @ds/icons generate`) copia os SVG da lista, converte-os com `@svgr/core` + `@svgr/plugin-jsx` em `src/generated/<Nome>Icon.tsx` e regenera `src/index.ts` (formatados com Prettier; correr outra vez não produz diferenças, verificado). Cada ícone é um `forwardRef<SVGSVGElement, IconProps>` fino sobre o `IconBase` partilhado (`src/IconBase.tsx`), que trata de `size` (omissão `"1em"`), `title`, `stroke="currentColor"` e ARIA (sem `title`: `aria-hidden="true"` e `focusable="false"`; com `title`: `role="img"` e `<title>`). `LICENSE-LUCIDE` (licença do Lucide, copiada do `lucide-static`) e `README.md` com secção "Credits". `package.json` com `sideEffects: false`, `main`/`module`/`types`/`exports` mínimos.
- **Ficheiros alterados:** `packages/icons/{package.json,tsconfig.json,README.md,LICENSE-LUCIDE,scripts/generate.mjs,svg/*.svg,src/IconBase.tsx,src/index.ts,src/generated/*.tsx,src/icons.test.tsx,src/Icons.stories.tsx,src/vitest-env.d.ts}`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** 7e74ced `feat(icons): DS-008 add icon package from a Lucide subset with SVGR`
- **Critérios de aceitação cobertos:** todos os da especificação.
- **Testes escritos pelo programador:** `src/icons.test.tsx` (10 testes: lista de `svg/` = exports, 30 ícones, tamanho por omissão e `size={24}`, `currentColor`, ref, className/props, `aria-hidden` sem título, `getByRole('img', { name: 'Close' })` com título, axe sem violações nos dois casos, contrato de ARIA em todos os 30 ícones). Stories: `Gallery`, `Sizes`, `WithTitle`, `DarkTheme`.
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (icons: 10) · build ✔ · test:a11y ✔ (5 testes).
- **Notas para o testador:**
  - Dependências novas de `@ds/icons` (devDependencies): `lucide-static` 1.55.0, `@svgr/core` 8.1.0, `@svgr/plugin-jsx` 8.1.0 (versões exatas), mais `axe-core` (o helper `vitest-axe` só chega com a DS-009, por isso o teste usa `axe.run` diretamente), `@storybook/react` e `@types/node` (leitura de `svg/` no teste).
  - `@types/node` dá ao vitest do pacote uma instância própria, pelo que os tipos do jest-dom não chegavam via `test/setup.ts`; `src/vitest-env.d.ts` regista-os também aqui.
  - O teste lê `svg/` a partir de `process.cwd()` (em jsdom `import.meta.url` não é um URL `file:`), logo tem de correr com o diretório do pacote como cwd (o que `pnpm test` faz).
  - Não usei `@svgr/plugin-svgo` para não reescrever os caminhos do Lucide; o invólucro `<svg>` é substituído por `IconBase` no gerador.
  - Story `DarkTheme` usa `var(--ds-color-bg-canvas, <fallback>)`: os fallbacks mantêm-na escura até o Storybook carregar o CSS dos temas (DS-006); depois podem ser retirados.
  - Sugestão ao planeador: a DS-009 podia migrar o teste de axe para `expectNoA11yViolations` e a DS-036 completar os metadados (`files`, licença) do pacote.

### DS-006 · Tema no Storybook: toggle e páginas de tokens

**Iteração 1 — 2026-10-12**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `preview.tsx` importa `tokens.css` e `themes.css`, tem o seletor "Theme" (`light`/`dark`, global `theme`) e um decorator que aplica `data-theme` ao `<html>` do iframe e põe o fundo/cor do body com `--ds-color-bg-canvas`/`--ds-color-text-default`; `parameters.theme` tem prioridade sobre a barra. Páginas "Foundations" geradas a partir de `tokens` e `themes` (sem listas à mão): Colors, Semantic (os dois temas lado a lado), Spacing, Typography, Radii, Shadows, e Theme (`Default` e `DarkTheme`). Convenção `DarkTheme` documentada em `apps/docs/README.md`.
- **Ficheiros alterados:** `apps/docs/.storybook/preview.ts` (removido) → `apps/docs/.storybook/preview.tsx`, `apps/docs/.storybook/main.ts` (inclui `../src/**/*.stories.tsx`), `apps/docs/package.json`, `apps/docs/scripts/test-a11y.mjs`, `apps/docs/README.md`, `apps/docs/src/foundations/utils.tsx`, `apps/docs/src/foundations/Colors.stories.tsx`, `apps/docs/src/foundations/Scales.stories.tsx`, `apps/docs/src/foundations/Theme.stories.tsx`, `pnpm-lock.yaml`.
- **Commit(s):** 5ffc6f1 `feat(ui): DS-006 Storybook theme toggle and foundations token pages`
- **Critérios de aceitação cobertos:** preview e seletor em `.storybook/preview.tsx`; prioridade de `parameters.theme` no decorator `withTheme` e story `Foundations/Theme › DarkTheme`; convenção em `apps/docs/README.md`; páginas em `apps/docs/src/foundations/`; G1–G3.
- **Testes escritos pelo programador:** unitários n/a. Stories verificadas pelo `pnpm test:a11y` (13 stories, 0 violações).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ · build ✔ · test:a11y ✔. Prova negativa: story temporária com `parameters.theme = 'dark'` e texto `--ds-color-neutral-700` falhou por `color-contrast` (ficheiro removido, não commitada).
- **Notas para o testador:**
  - Única dependência nova: `@ds/tokens` (workspace) em `apps/docs`, para importar o CSS e os objetos. Como o pacote só existe em `dist/`, os scripts `storybook`, `build-storybook`, `typecheck` (docs) e `scripts/test-a11y.mjs` fazem primeiro `pnpm --filter @ds/tokens build`; sem isto o `typecheck` do CI (que corre antes do build) falharia.
  - `preview.ts` passou a `preview.tsx` (JSX no decorator).
  - A story `Semantic` mostra cada tema num painel com `data-theme` próprio, independente do seletor; as restantes seguem o seletor (verificar no browser que fundo e texto mudam sem recarregar).
  - Os fallbacks da story `DarkTheme` dos ícones (DS-008) já podem ser retirados; não o fiz por estar fora do âmbito. Sugestão ao planeador.
  - `globals` ao nível da story não foi implementado; só `parameters.theme`.

### DS-007 · CSS base, focus visível, `styles.css` agregado e Stylelint

**Iteração 1 — 2026-10-12**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `packages/ui/src/styles/{base,focus,motion}.css` (base só para `[class^="ds-"], [class*=" ds-"]`; classe `.ds-focus-ring:focus-visible` com outline 2px `--ds-color-focus-ring` e offset 2px; `prefers-reduced-motion: reduce` a zero para `ds-*` e pseudo-elementos). `packages/ui/src/styles.css` importa tokens, temas, base, focus, motion (por esta ordem; os componentes acrescentam-se a seguir). `packages/ui/scripts/build-css.mjs` (corre depois do `tsup` no `pnpm build`) inlina os `@import` e gera `dist/styles.css` único. `.storybook/preview.tsx` importa `packages/ui/src/styles.css` em vez dos CSS dos tokens. `stylelint.config.js` na raiz e `stylelint "packages/ui/src/**/*.css"` em `pnpm lint`.
- **Ficheiros alterados:** `packages/ui/src/styles.css`, `packages/ui/src/styles/{base,focus,motion}.css`, `packages/ui/src/styles/FocusRing.stories.tsx`, `packages/ui/src/styles.test.ts`, `packages/ui/scripts/build-css.mjs`, `packages/ui/package.json`, `packages/ui/tsup.config.ts`, `apps/docs/.storybook/preview.tsx`, `stylelint.config.js`, `package.json`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** fdb215a `feat(ui): DS-007 base CSS, focus ring, aggregated styles.css and Stylelint`
- **Critérios de aceitação cobertos:** todos; prova negativa feita com um `.css` temporário (`.button { color: #ff0000 }`, `padding: 8px`, `red`, `rgb()`), que falhou o `pnpm lint` com 6 erros (ficheiro removido, não commitado). `currentColor` e `border: 1px solid` passam.
- **Testes escritos pelo programador:** `styles.test.ts` (4 testes sobre `dist/styles.css`: variáveis dos tokens e `[data-theme="dark"]`, `:focus-visible` e reduced-motion, sem `@import`, ordem das secções). Stories `Foundations/FocusRing` › `FocusRing` e `DarkTheme` (nome `FocusRing/DarkTheme`).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ · build ✔ · test:a11y ✔ (15 testes).
- **Notas para o testador:**
  - Dependência nova: `stylelint` 17.16.0 (devDependency da raiz); regras só nativas do Stylelint, sem `stylelint-config-standard`.
  - O `tsup` não resolve `@import` de pacotes (exports) em CSS, por isso o agregado é gerado por `scripts/build-css.mjs` (inlining simples, sem PostCSS). Falha se ficar algum `@import`.
  - `styles.test.ts` corre o script de CSS antes de ler `dist/styles.css`; precisa de `@ds/tokens` construído (o `pnpm test` da raiz já o faz pela ordem topológica).
  - Não existem ainda `.tsx` com `import '*.css'`; nenhum componente tem CSS (fora de âmbito). O `ui/package.json` não tem `exports` para `./styles.css` (fica para a DS-036).
  - A regra das unidades usa regex sobre o valor das propriedades listadas (inclui `margin-block`, `padding-inline`, etc.).
  - A story FocusRing usa `style` inline com tokens só para o layout da story.
- **Pedidos para o João:** o CI (`.github/workflows/ci.yml`) já corre `pnpm run lint`, que inclui Stylelint; não é preciso alterar nada em `.github/`.

### DS-009 · Utilitários partilhados, helper de axe e teste de convenções

**Iteração 1 — 2026-10-13**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `cx` e `Slot` em `packages/ui/src/utils/`; `VisuallyHidden` refeito segundo C1 a C5 (classe `ds-visually-hidden`, técnica de `clip`, `asChild`, `className` somada à base, CSS no `styles.css`, stories `Default` e `DarkTheme`); helper `expectNoA11yViolations` em `packages/ui/test/a11y.ts` (vitest-axe); polyfills de jsdom no setup partilhado; `conventions.test.ts`; `packages/ui/README.md` com "How to create a component".
- **Ficheiros alterados:** `packages/ui/package.json`, `pnpm-lock.yaml`, `test/setup.ts`, `packages/ui/README.md`, `packages/ui/src/styles.css`, `packages/ui/src/conventions.test.ts`, `packages/ui/src/utils/{cx.ts,cx.test.ts,Slot.ts}`, `packages/ui/test/{a11y.ts,a11y.test.tsx}`, `packages/ui/src/VisuallyHidden/{VisuallyHidden.tsx,VisuallyHidden.css,VisuallyHidden.test.tsx,VisuallyHidden.stories.tsx}`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** d729d7e `feat(ui): DS-009 shared utils, axe helper and conventions test`
- **Critérios de aceitação cobertos:** todos; `cx.test.ts`, `VisuallyHidden.test.tsx`, `a11y.test.tsx`, `conventions.test.ts`, stories `Utilities/VisuallyHidden`.
- **Testes escritos pelo programador:** os cinco ficheiros acima. Prova negativa: remover `VisuallyHidden.css` fez falhar `conventions.test.ts` (ficheiro reposto, não commitado).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ · build ✔ · test:a11y ✔ · `pnpm install --frozen-lockfile` ✔.
- **Notas para o testador:**
  - Dependências novas: `@radix-ui/react-slot` (dependencies) e `vitest-axe` (devDependencies) em `packages/ui`.
  - Os polyfills ficaram em `test/setup.ts` (setup partilhado já usado pelo Vitest), não em `packages/ui/test/`.
  - O CSS usa `margin: 0` em vez de `-1px` porque o Stylelint proíbe comprimentos fixos; o elemento é `position: absolute`, por isso o efeito é o mesmo.
  - O aviso "HTMLCanvasElement getContext not implemented" nos testes vem do axe em jsdom e é inofensivo.
  - O helper lança um erro com a lista de violações em vez de usar um matcher `toHaveNoViolations`, para não ser preciso estender os tipos do `expect`.

### DS-010 · Button

**Iteração 1 — 2026-10-13**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Button` (`forwardRef`, `variant` primary/secondary/ghost/danger, `size` sm/md/lg, `fullWidth`, `leadingIcon`/`trailingIcon`, `asChild`, `disabled`) com `data-variant`, `data-size`, `data-full-width` e `data-disabled`. `disabled` com `asChild` usa `aria-disabled`, `tabIndex=-1` e bloqueio do clique em `onClickCapture`. Ícones em `<span class="ds-button__icon" aria-hidden>` e `Slottable` para `asChild`. CSS só com tokens; `min-height` 32/40/48px por `--ds-space-8|10|12`.
- **Ficheiros alterados:** `packages/ui/src/Button/{Button.tsx,Button.css,Button.test.tsx,Button.stories.tsx,index.ts}`, `packages/ui/src/utils/Slot.ts` (reexporta `Slottable`), `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** dcf7d57 `feat(ui): DS-010 Button with variants, sizes, icons and asChild`
- **Critérios de aceitação cobertos:** todos; testes em `Button.test.tsx`, stories `Primary`, `Secondary`, `Ghost`, `Danger`, `Sizes` (com `play` que mede a altura), `WithIcons`, `FullWidth`, `Disabled`, `AsLink`, `AsLinkDisabled`, `DarkTheme`.
- **Testes escritos pelo programador:** `Button.test.tsx` (defaults, variantes, tamanhos, className, ref, submit, `asChild`, `disabled` com e sem `asChild`, ícones com e sem `asChild`, axe, Tab/Enter/Espaço).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 58) · build ✔ · test:a11y ✔ (27).
- **Notas para o testador:**
  - Sem dependências novas. O `play` de `Sizes` usa `throw` em vez de `expect` porque `@storybook/test` não é dependência (G2).
  - Cores só com pares de contraste já testados na DS-005: `danger` usa `danger-text` sobre `danger-subtle` com contorno `danger-text` (não há token de texto sobre `danger-default`); `secondary` usa `border-strong`; `ghost` e `secondary` usam `text-default`. O estado desativado usa `text-disabled` sobre `bg-subtle` (isento de contraste em WCAG).
  - O estado desativado com `asChild` não usa `pointer-events: none`, para o clique chegar ao bloqueio em captura.
  - As stories usam `style` inline só para o layout da story (como em `FocusRing`).
  - `type` não é passado ao filho com `asChild`.

### DS-011 · IconButton

**Iteração 1 — 2026-10-13**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `IconButton` sobre o `Button` (o `icon` vai como `leadingIcon`, com `data-icon-only`), sem duplicar lógica de `disabled`/`asChild`. `aria-label` obrigatório no tipo (união com `aria-labelledby`); `fullWidth`, `leadingIcon` e `trailingIcon` omitidos do tipo. `IconButton.css` com largura e altura 32/40/48px por `--ds-space-8|10|12`.
- **Ficheiros alterados:** `packages/ui/src/IconButton/{IconButton.tsx,IconButton.css,IconButton.test.tsx,IconButton.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** 53148f3 `feat(ui): DS-011 add IconButton on top of Button`
- **Critérios de aceitação cobertos:** todos; testes em `IconButton.test.tsx`, stories `Default`, `Variants`, `Sizes` (play), `Disabled`, `AsLink`, `AsLinkDisabled`, `NextToButton` (play), `DarkTheme`.
- **Testes escritos pelo programador:** `IconButton.test.tsx` (ícone `aria-hidden`, data-*, ref/className, onClick, `aria-labelledby`, `@ts-expect-error`, disabled nativo, teclado, `asChild` e `asChild` desativado, axe).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 78) · build ✔ · test:a11y ✔ (35).
- **Notas para o testador:**
  - As regras de tamanho ficaram em `IconButton.css` (a convenção C1 exige um `.css` por componente); as cores vêm de `Button.css`.
  - Testes e stories têm `eslint-disable jsx-a11y/anchor-has-content` porque o conteúdo do `<a>` vem do `icon` via `asChild`.
  - `fullWidth` não faz parte da API do `IconButton`.

### DS-012 · Field (label, descrição e mensagem de erro)

**Iteração 1 — 2026-10-13**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Field`, `FieldLabel`, `FieldDescription`, `FieldError` e `useFieldControl()`. O contexto guarda `id` (de `useId` se faltar), `invalid`, `required`, `disabled` e os ids de descrição e erro (`<id>-description`, `<id>-error`). `FieldDescription` e `FieldError` registam-se no `Field` (em `useLayoutEffect`) para o `aria-describedby` só referir elementos que existem; o erro só entra se `invalid`. Fora de um `Field` o hook devolve um objeto vazio e as partes não falham. `required` mostra `*` com `aria-hidden`.
- **Ficheiros alterados:** `packages/ui/src/Field/{Field.tsx,Field.css,Field.test.tsx,Field.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** 4363736 `feat(ui): DS-012 add Field with label, description and error`
- **Critérios de aceitação cobertos:** todos; testes em `Field.test.tsx`, stories `Default`, `WithDescription`, `Required`, `Invalid`, `Disabled`, `DarkTheme`.
- **Testes escritos pelo programador:** `Field.test.tsx` (label/controlo, ids, describedby com e sem `invalid`, com e sem descrição, required, disabled, ids únicos, clique na etiqueta, refs/className, uso fora do Field, descrição acessível, axe nos 4 estados).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 105) · build ✔ · test:a11y ✔ (41).
- **Notas para o testador:**
  - Sem dependências novas.
  - `Field` omite `id` das props do `div`: o `id` é o do controlo, não o da raiz.
  - No estado `disabled` só a etiqueta passa a `text-disabled`; a descrição mantém `text-muted`, porque o axe apontou `color-contrast` na descrição com `text-disabled` (só o texto de controlos desativados está isento).
  - `FieldError` não usa `role="alert"`; a mensagem chega ao leitor de ecrã por `aria-describedby`. Anúncio dinâmico fica como sugestão para o planeador.
  - O hook devolve `aria-invalid`/`aria-required`/`disabled` como `true` ou `undefined` (nunca `false`).

### DS-013 · Input

**Iteração 1 — 2026-10-13**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Input` com um contorno (`div.ds-input`, com `data-size`/`data-invalid`/`data-disabled`) à volta de um `<input class="ds-input__control">`. Usa `useFieldControl()` e as props passadas diretamente têm prioridade (`id`, `disabled`, `aria-*`, `invalid`). `leadingAddon`/`trailingAddon` em `span aria-hidden`; premir um addon foca o input (`onMouseDown` no contorno). A altura mínima 32/40/48px (`--ds-space-8|10|12`) está no contorno, com o mesmo `padding-block` do `Button` para a altura renderizada ser igual (o `Button sm` renderiza ~35,5px, por conteúdo).
- **Ficheiros alterados:** `packages/ui/src/Input/{Input.tsx,Input.css,Input.test.tsx,Input.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** 97b7644 `feat(ui): DS-013 add Input with sizes, addons and Field integration`
- **Critérios de aceitação cobertos:** todos; testes em `Input.test.tsx`; stories `Default`, `Sizes` (play), `WithButton` (play), `WithField`, `WithAddons`, `Invalid`, `Disabled`, `ReadOnly`, `Password`, `DarkTheme`.
- **Testes escritos pelo programador:** `Input.test.tsx` (tipos, escrita controlada e não controlada, sem avisos na consola, defaultValue, disabled, readOnly, data-size, ref/className/displayName, invalid, addons, Tab, integração com Field, prioridade das props, clique na etiqueta, axe).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 140) · build ✔ · test:a11y ✔ (51).
- **Notas para o testador:**
  - Sem dependências novas.
  - `ref`, `className` e as props nativas vão para o `<input>` (o critério pede que o `ref` aponte para o `<input>`); `data-size` e `data-invalid` estão no `<input>` e no contorno. O contorno não aceita `className` (sugestão para o planeador: `wrapperClassName` ou similar, p.ex. para largura).
  - O focus visível usa `.ds-input:has(.ds-input__control:focus-visible)`, porque o outline é desenhado no contorno.
  - `invalid` direto > `aria-invalid` direto > `Field`. `aria-invalid="false"` explícito é mantido.
  - O contorno tem `eslint-disable jsx-a11y/no-static-element-interactions` (só reencaminha o rato dos addons para o input).
  - Cores: borda `border-strong`, inválido `danger-default`, placeholder `text-muted`, desativado `border-default`/`bg-subtle`/`text-disabled`.

### DS-015 · Checkbox

**Iteração 1 — 2026-10-14**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Checkbox` sobre `@radix-ui/react-checkbox`. Um `<label class="ds-checkbox">` (área clicável mínima 24x24px por `--ds-space-6`) envolve o `<button role="checkbox">` (raiz Radix) e o texto de `children`. Indicador com `CheckIcon` e `MinusIcon` de `@ds/icons`, alternados por CSS conforme o `data-state` (`checked`/`indeterminate`). Usa `useFieldControl()`; as props diretas (`id`, `disabled`, `required`, `aria-describedby`, `aria-invalid`, `invalid`) têm prioridade. Tamanhos `sm` 16px (`--ds-space-4`) e `md` 20px (`--ds-space-5`).
- **Ficheiros alterados:** `packages/ui/src/Checkbox/{Checkbox.tsx,Checkbox.css,Checkbox.test.tsx,Checkbox.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `packages/ui/package.json`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** 4467da0 `feat(ui): DS-015 add Checkbox with indeterminate state and Field integration`
- **Critérios de aceitação cobertos:** todos; testes em `Checkbox.test.tsx`; stories `Default`, `Checked`, `Indeterminate`, `Disabled`, `Sizes` (play, área >= 24px), `WithField`, `Group` (Select all indeterminado), `DarkTheme`.
- **Testes escritos pelo programador:** `Checkbox.test.tsx` (role e nome, alternar não controlado, defaultChecked, controlado, `mixed`, clique na etiqueta, disabled, `FormData`, Tab/Espaço/Enter, Tab salta disabled, ref/className/data-size/displayName, indicador, integração com Field e prioridade das props, axe).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 167) · build ✔ · test:a11y ✔ (59) · `pnpm install --frozen-lockfile` ✔.
- **Notas para o testador:**
  - Dependências novas: `@radix-ui/react-checkbox` (nomeada na tarefa) e `@ds/icons` (workspace, necessária para `CheckIcon`/`MinusIcon`). `@ds/icons` tem de estar construído (`pnpm build`) para typecheck/testes do `ui`.
  - `ref`, `className` e props nativas vão para o botão `role="checkbox"`; o `<label>` exterior não aceita `className` (sugestão para o planeador: `labelClassName` ou similar).
  - O texto da etiqueta desativada usa `text-muted` (não `text-disabled`): o axe em browser acusou `color-contrast` porque não isenta a etiqueta de um controlo `button`. A caixa desativada usa `border-default`/`bg-subtle`.
  - `required` sem `Field` vai para o Radix (`aria-required` + input oculto em formulários).

### DS-018 · Select

**Iteração 1 — 2026-10-14**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Select`, `SelectItem`, `SelectGroup` e `SelectSeparator` sobre `@radix-ui/react-select` (`position="popper"`, lista em portal com `z-index: var(--ds-z-dropdown)` e `min-width: var(--radix-select-trigger-width)`). O gatilho (`button role="combobox"`, classe `ds-select`) recebe `ref`, `className` e props nativas, mostra `ChevronDownIcon`; cada item mostra `CheckIcon` quando selecionado. Usa `useFieldControl()` (props diretas têm prioridade). Alturas mínimas 32/40/48px por `--ds-space-8|10|12`, com o mesmo `padding-block`, borda, raio e estados do `Input`.
- **Ficheiros alterados:** `packages/ui/src/Select/{Select.tsx,Select.css,Select.test.tsx,Select.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `packages/ui/package.json`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`.
- **Commit(s):** 74464f5 `feat(ui): DS-018 add Select with groups, sizes and Field integration`
- **Critérios de aceitação cobertos:** todos; testes em `Select.test.tsx`; stories `Default`, `WithDefaultValue`, `Sizes` (play: alturas e igualdade com `Input`), `Groups`, `DisabledItem`, `Disabled`, `WithField`, `LongList`, `KeyboardInteraction` (play), `DarkTheme` (lista aberta).
- **Testes escritos pelo programador:** `Select.test.tsx` (placeholder, defaultValue, seleção e fecho, `aria-selected` + ícone, controlado, `open` controlado, item desativado, `disabled`, `FormData`, ref/className/data-size/displayName, invalid, grupos e separador, portal, teclado: Enter/Espaço/setas abrem, setas saltam desativados, Home/End, letra, Enter/Espaço selecionam com focus de volta, Esc, integração com Field, axe fechada e aberta).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 207) · build ✔ · test:a11y ✔ (69) · `pnpm install --frozen-lockfile` ✔.
- **Notas para o testador:**
  - Dependência nova: `@radix-ui/react-select` (nomeada na tarefa).
  - O critério fala em "token `z-index-dropdown`"; o token real gerado é `--ds-z-dropdown` (1000), que é o usado.
  - Com a lista aberta o gatilho recebe `tabIndex={-1}` (estado `open` seguido internamente, incluindo `defaultOpen`): o Radix põe o resto da página em `aria-hidden` e o axe acusava `aria-hidden-focus` no gatilho (4 stories com lista aberta). O focus volta ao gatilho ao fechar e o tabindex é retirado.
  - O jsdom não tem `scrollIntoView`, `hasPointerCapture`/`setPointerCapture` nem `ResizeObserver`: o `Select.test.tsx` define-os localmente em `beforeAll` (não alterei `test/setup.ts`).
  - O axe aberto no teste unitário corre com a regra `region` desativada (a lista está num portal fora de qualquer landmark); no `test:a11y` não foi preciso.
  - O `play` de `KeyboardInteraction` usa `KeyboardEvent` despachados (o repositório não tem `@storybook/test`); o teste unitário usa `user-event` e cobre todos os atalhos pedidos.
  - O `SelectSeparator` do Radix é `aria-hidden` (decorativo), logo não tem `role="separator"` na árvore de acessibilidade.
  - Radix só marca `aria-selected="true"` no item selecionado quando está também focado (acontece ao abrir a lista).
  - O gatilho tem `width: 100%`; para largura fixa o consumidor usa `className` ou um contentor.

### DS-014 · Textarea

**Iteração 1 — 2026-10-15**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Textarea` sobre `<textarea>` nativo, com `size` (`sm`/`md`/`lg`), `invalid`, `rows` (omissão 3) e `resize` (`none`/`vertical`/`both`, omissão `vertical`, exposto em `data-resize`). Usa `useFieldControl()` da mesma forma que o `Input` (props diretas têm prioridade). `Textarea.css` usa os mesmos tokens e estados do `Input` (borda, raio, hover, focus, inválido, só de leitura, desativado, placeholder), com `min-height` `--ds-space-8|10|12` e o mesmo `padding-block`, `padding-inline`, `font-size` e `line-height` por tamanho; com `rows={1}` a altura iguala a do `Input`.
- **Ficheiros alterados:** `packages/ui/src/Textarea/{Textarea.tsx,Textarea.css,Textarea.test.tsx,Textarea.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** 3ece050 `feat(ui): DS-014 add Textarea with sizes, resize and Field integration`
- **Critérios de aceitação cobertos:** todos; testes em `Textarea.test.tsx`; stories `Default`, `Sizes` (play: altura >= 32/40/48px com `rows={1}`, igual à do `Input` ao lado, e maior com `rows` por omissão), `WithField`, `Invalid`, `Disabled`, `ResizeNone`, `DarkTheme`.
- **Testes escritos pelo programador:** `Textarea.test.tsx` (elemento nativo, quebras de linha, controlado, sem avisos na consola, defaultValue, rows, data-resize, data-size, disabled, readOnly, ref/className/displayName, invalid, Tab e Enter sem submeter, integração com Field e prioridade das props, clique na etiqueta, axe).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 240) · build ✔ · test:a11y ✔ (76).
- **Notas para o testador:**
  - Sem dependências novas. `@ds/icons` tem de estar construído (`pnpm build`) antes do typecheck do `ui`.
  - Não há contorno: `ref`, `className` e props nativas vão para o próprio `<textarea>` (que tem `data-size`, `data-resize` e `data-invalid`). Largura: `width: 100%`.
  - `invalid` direto > `aria-invalid` direto > `Field`; `aria-invalid="false"` explícito é mantido.
  - O CSS não importa o do `Input`: repete as mesmas variáveis `--ds-*`, sem valores literais.

### DS-017 · Switch

**Iteração 1 — 2026-10-16**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Switch` sobre `@radix-ui/react-switch`. A raiz é `<button role="switch">` (classe `ds-switch__control`) e recebe `ref`, `className` e props nativas; vem dentro de um `<label class="ds-switch">` (área mínima 24px) com o texto de `children`. Usa `useFieldControl()` (`id`, `aria-describedby`, `required`, `disabled`; props diretas têm prioridade). Tamanhos `sm` (32x20px) e `md` (40x24px) por variáveis CSS locais sobre tokens `--ds-space-*`. Desligado: pista `border-strong` e manípulo à esquerda; ligado: pista `accent-default` e manípulo à direita (posição, não só cor). As transições ficam a 0s com `prefers-reduced-motion` através de `styles/motion.css`.
- **Ficheiros alterados:** `packages/ui/src/Switch/` (`Switch.tsx`, `Switch.css`, `Switch.test.tsx`, `Switch.stories.tsx`, `index.ts`), `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `packages/ui/package.json`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** 3fbd332 `feat(ui): DS-017 add Switch with sizes and Field integration`
- **Critérios de aceitação cobertos:** todos; testes em `Switch.test.tsx`; stories `Default`, `Checked`, `Disabled`, `Sizes`, `WithField`, `DarkTheme`.
- **Testes escritos pelo programador:** `Switch.test.tsx` (role e nome, alternar e `onCheckedChange`, `defaultChecked`, controlado e com pai com estado, clique na etiqueta, `disabled`, `FormData` ligado/desligado/desativado, Tab/Espaço/Enter, Tab salta desativado, ref/className/size/displayName, Field com id/descrição/required/disabled e prioridade das props, axe).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 313) · build ✔ · test:a11y ✔ (90).
- **Notas para o testador:**
  - Dependência nova: `@radix-ui/react-switch` (nomeada na tarefa).
  - Contraste 3:1 da pista e do manípulo nos dois temas: não medi numericamente; a pista desligada usa `border-strong` (o mesmo token da borda do `Checkbox`) e o manípulo `bg-surface`; a pista ligada usa `accent-default` com manípulo `text-on-accent`. Convém confirmar com os valores dos temas.
  - Estado desativado: pista `border-default` e manípulo `text-disabled`. O Stylelint do projeto proíbe larguras escritas à mão, por isso não há contorno via `box-shadow`.
  - O `Switch` não tem `invalid` (a tarefa não o pede); `aria-invalid` do `Field` não é aplicado. Se o João o quiser, fica para outra tarefa.
  - Esta entrada foi inserida antes da de DS-016 por limitação da ferramenta de edição (o fim do ficheiro tem linhas duplicadas); o conteúdo é independente.

### DS-016 · RadioGroup

**Iteração 1 — 2026-10-15**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `RadioGroup` e `Radio` sobre `@radix-ui/react-radio-group`. A raiz (`div role="radiogroup"`, classe `ds-radio-group`) recebe `ref`, `className` e props nativas; `orientation` (`vertical` por omissão) vai para `aria-orientation` e `data-orientation`; o nome acessível é obrigatório no tipo (`aria-label` ou `aria-labelledby`). Usa `useFieldControl()` (`id`, `aria-describedby`, `aria-invalid`, `required`, `disabled`; props diretas têm prioridade). Cada `Radio` é um `<label class="ds-radio">` (área mínima 24px) com o `<button role="radio">` e o texto de `children`; tamanhos `sm` 16px e `md` 20px; indicador de ponto central por CSS.
- **Ficheiros alterados:** `packages/ui/src/RadioGroup/{RadioGroup.tsx,RadioGroup.css,RadioGroup.test.tsx,RadioGroup.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `packages/ui/package.json`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** 4aa0448 `feat(ui): DS-016 add RadioGroup and Radio with roving focus and Field integration`
- **Critérios de aceitação cobertos:** todos; testes em `RadioGroup.test.tsx`; stories `Default`, `Horizontal`, `WithDefaultValue`, `DisabledItem`, `DisabledGroup`, `WithField` (descrição e erro), `Sizes`, `DarkTheme`.
- **Testes escritos pelo programador:** `RadioGroup.test.tsx` (roles e nomes, `aria-labelledby`, seleção por clique e pela etiqueta, `onValueChange`, `defaultValue`, controlado, rádio e grupo `disabled`, `FormData`, `aria-orientation`, ref/className/size/displayName, invalid, Tab/Shift+Tab, primeiro ativo sem seleção, as quatro setas com seleção, volta, orientação horizontal, desativados saltados, Espaço, integração com Field e prioridade das props, axe).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 284) · build ✔ · test:a11y ✔ (84) · `pnpm install --frozen-lockfile` ✔.
- **Notas para o testador:**
  - Dependência nova: `@radix-ui/react-radio-group` (nomeada na tarefa).
  - A `orientation` não é passada ao Radix: com `vertical` o roving focus do Radix ignora Seta esquerda/direita, e a tarefa exige as quatro setas em qualquer orientação. `aria-orientation` é posto à mão na raiz.
  - O Radix seleciona o rádio ao receber focus por seta só enquanto a tecla está premida, e move o focus num temporizador. Nos testes unitários as setas usam `{Tecla>}` seguido de `{/Tecla}` (helper `press`); com `user.keyboard('{ArrowDown}')` a tecla é largada cedo demais no jsdom. Num browser real não há diferença.
  - Ordem de tabulação: no Radix o contentor `radiogroup` é que está na ordem de tabulação e reencaminha o focus para o rádio selecionado (ou o primeiro ativo); os botões têm `tabindex=-1`. O comportamento (um só ponto de tabulação, Tab e Shift+Tab) está testado; não se verifica `tabindex=0` no botão.
  - Dentro de um `Field`, o `FieldLabel` usa `htmlFor`, que não nomeia um `div`; o nome do grupo vem de `aria-labelledby` (ver story `WithField`, que usa um `<span id>`). Sugestão para o planeador: tarefa para um `FieldLabel` com `id` ou um `Fieldset`/`legend` (já fora de âmbito).
  - Como no `Checkbox`, o `<label>` exterior de cada `Radio` não aceita `className`; o texto desativado usa `text-muted` (contraste AA no axe) e o estilo desativado usa `:has(:disabled)`.
  - `Radio` fora de um `RadioGroup` falha no Radix (contexto em falta).
