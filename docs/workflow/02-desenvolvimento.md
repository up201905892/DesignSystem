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

### DS-019 · Badge

**Iteração 1 — 2026-10-16**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Badge` como `<span class="ds-badge">` (ou o filho com `asChild`, via `Slot`), com `variant` (`neutral` por omissão, `primary`, `success`, `warning`, `danger`, `info`), `appearance` (`subtle` por omissão, `solid`) e `size` (`sm`, `md` por omissão), expostos em `data-variant`, `data-appearance` e `data-size`. Sem `role`. O CSS usa as variáveis locais `--ds-badge-bg` e `--ds-badge-fg` sobre tokens; `white-space: nowrap`, `max-width: 100%`, `overflow: hidden` e `text-overflow: ellipsis`.
- **Ficheiros alterados:** `packages/ui/src/Badge/{Badge.tsx,Badge.css,Badge.css.test.ts,Badge.test.tsx,Badge.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** 15b540c `feat(ui): DS-019 add Badge with variants, appearances and sizes`
- **Critérios de aceitação cobertos:** todos; testes em `Badge.test.tsx` e `Badge.css.test.ts`; stories `Default`, `Variants`, `Solid`, `Sizes`, `LongText` (play: não ultrapassa o contentor e o texto é cortado), `DarkTheme`.
- **Testes escritos pelo programador:** `Badge.test.tsx` (texto e valores por omissão, cada variante, aparência e tamanho, className, ref, props nativas, displayName, sem role, `asChild` com `<a>`, axe nas 12 combinações). `Badge.css.test.ts` calcula o contraste (>= 4,5:1) das 12 combinações nos dois temas a partir de `themes.css` e verifica as regras de não quebrar linha e reticências.
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 357) · build ✔ · test:a11y ✔ (96).
- **Notas para o testador:**
  - Sem dependências novas. `pnpm build` tem de correr antes do typecheck (`@ds/icons`, `@ds/tokens`).
  - O axe em jsdom não mede `color-contrast` (sem canvas); por isso o contraste é verificado por cálculo em `Badge.css.test.ts` e no `test:a11y` (browser real).
  - Escolhas de cor: `subtle` usa `<variante>-subtle` com `<variante>-text`; `primary` subtle usa `accent-subtle` com `text-default`. `solid` usa `<variante>-text` como fundo com `text-on-accent` (os tokens `*-default` não chegam a 4,5:1 com texto branco no tema claro); `neutral` solid usa `bg-inverse`, `primary` solid usa `accent-default`.
  - Com `asChild` sobre um `<a>`, o badge não ganha estilos de hover; só tem `:focus-visible`.

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

### DS-025 · Dialog (Modal)

**Iteração 1 — 2026-10-19**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogFooter` e `DialogClose` sobre `@radix-ui/react-dialog`. `DialogContent` (classe `ds-dialog`) vem num portal com overlay (`ds-dialog__overlay`, `color-overlay`), ambos com `z-index-modal`; `size` (`sm`/`md` por omissão/`lg`) em `data-size`; `closeLabel` (omissão `"Close"`), `hideClose` e `closeOnOverlayClick` (via `onPointerDownOutside`). O botão de fechar é um `IconButton` ghost com `XIcon`. O corpo faz scroll (`overflow-y: auto`) com cabeçalho e rodapé fixos; largura `min(<tamanho>, 100vw - space-8)`. Animações `fade`/`slide` de entrada e saída, anuladas por `prefers-reduced-motion` em `styles/motion.css`.
- **Ficheiros alterados:** `packages/ui/src/Dialog/{Dialog.tsx,Dialog.css,Dialog.test.tsx,Dialog.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `packages/ui/package.json`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** e1c2909 `feat(ui): DS-025 add Dialog with focus trap, sizes and overlay`
- **Critérios de aceitação cobertos:** todos; testes em `Dialog.test.tsx`; stories `Default`, `Sizes`, `WithForm`, `LongContent`, `Confirmation`, `NoOverlayClose`, `DisabledTrigger`, `KeyboardInteraction` (play: focus preso com Tab/Shift+Tab, Esc e regresso do focus ao gatilho), `DarkTheme` (aberto).
- **Testes escritos pelo programador:** `Dialog.test.tsx` (fechado por omissão, abrir, `defaultOpen`, controlado, `onOpenChange(false)` pelo botão, `DialogClose` e overlay, `closeOnOverlayClick={false}`, `hideClose`, `closeLabel`, `size`, ref/className/displayName, nome e descrição, ausência de `aria-describedby` e de aviso sem descrição, portal, conteúdo de fundo `aria-hidden`, scroll bloqueado, focus ao abrir, focus preso, Esc, Enter/Espaço no gatilho, gatilho `Button`/`IconButton` desativado (não abre, sem `onOpenChange`, Tab salta), axe com o diálogo aberto).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 393) · build ✔ · test:a11y ✔ (105) · `pnpm install --frozen-lockfile` ✔.
- **Notas para o testador:**
  - Dependência nova: `@radix-ui/react-dialog` (nomeada na tarefa).
  - O Radix Dialog não põe `aria-modal`; é acrescentado em `DialogContent`.
  - Sem `DialogDescription` o Radix avisa na consola; para evitar ruído, `Dialog` regista a presença da descrição (contexto) e sem ela `DialogContent` passa `aria-describedby={undefined}`. Com descrição o Radix liga o id normalmente.
  - Largura em tokens: `sm` = `space-16 * 6` (24rem), `md` = `space-16 * 8` (32rem), `lg` = `space-16 * 12` (48rem); margem em ecrãs estreitos = `space-8` no total.
  - O axe em jsdom não mede `color-contrast`; a verificação real é o `test:a11y` (browser). Em `LongContent` o `DialogBody` tem `tabIndex={0}` para o scroll por teclado (regra `scrollable-region-focusable`).
  - A story `KeyboardInteraction` usa `KeyboardEvent` sintéticos (como a do Select); o Radix FocusScope trata o Tab nos extremos.
  - Com `hideClose`, o diálogo continua a fechar com Esc e com `DialogClose`.

### DS-026 · DropdownMenu

**Iteração 1 — 2026-10-19**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuGroup` e `DropdownMenuSeparator` sobre `@radix-ui/react-dropdown-menu`. `DropdownMenuContent` (classe `ds-dropdown-menu`) vai num portal com `z-index-dropdown`; `side` (omissão `bottom`), `align` (omissão `start`), `ref` e `className`. `DropdownMenuItem` tem `variant` (`default`/`danger`, em `data-variant`), `leadingIcon` (decorativo, `aria-hidden`), `onSelect` e `disabled` (Radix põe `aria-disabled="true"`). O realce é por `data-highlighted` (focus real no item). `danger` usa `danger-text` (e `danger-subtle` no realce); com ícone a distinção não depende só da cor.
- **Ficheiros alterados:** `packages/ui/src/DropdownMenu/{DropdownMenu.tsx,DropdownMenu.css,DropdownMenu.css.test.ts,DropdownMenu.test.tsx,DropdownMenu.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `packages/ui/package.json`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** d1f8738 `feat(ui): DS-026 add DropdownMenu with keyboard navigation and danger items`
- **Critérios de aceitação cobertos:** todos; testes em `DropdownMenu.test.tsx`; stories `Default`, `WithIcons`, `WithGroupsAndLabels`, `DisabledItem`, `DangerItem`, `OnIconButton`, `DisabledTrigger`, `KeyboardInteraction` (play), `DarkTheme` (aberto).
- **Testes escritos pelo programador:** `DropdownMenu.test.tsx` (fechado por omissão, `aria-haspopup`/`aria-expanded`, abrir, `defaultOpen`, `onSelect` + fecho + focus no gatilho, item desativado, controlado e `open={false}`, clicar fora, label/group/separator, portal e `side`/`align`, ref/className/variant/displayName, ícone decorativo, Enter/Espaço/Seta para baixo abrem com o primeiro item focado, setas com saltos de desativados, Home/End, pesquisa por letra, Enter/Espaço ativam, Esc, Tab fecha, gatilho `Button`/`IconButton` desativado (não abre, sem `onOpenChange`, Tab salta), axe com o menu aberto); `DropdownMenu.css.test.ts` (tokens existentes, `z-index-dropdown`, `data-highlighted`, `danger-text`, sem cores fixas).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 438) · build ✔ · test:a11y ✔ (114).
- **Notas para o testador:**
  - Dependência nova: `@radix-ui/react-dropdown-menu` (nomeada na tarefa).
  - O menu é não modal (`modal={false}` no Radix). Em modo modal o Radix põe `aria-hidden` no `#storybook-root` com o gatilho focável lá dentro, e o `test:a11y` falhava com `aria-hidden-focus` em 7 stories abertas. Consequência: a página por trás não fica inerte nem com scroll bloqueado; clicar fora fecha na mesma.
  - O Radix não fecha o menu com Tab (mantém o focus lá dentro). A tarefa exige que Tab feche; `DropdownMenu` guarda o estado aberto (suporta controlado e não controlado) e `DropdownMenuContent` chama `setOpen(false)` em Tab. O focus volta ao gatilho (o Radix impede o Tab nativo).
  - O Radix só respeita o seu `disabled`; com `asChild` sobre um `Button disabled`, o `pointerdown` e as teclas chegavam ao gatilho no teste e o menu abria. `DropdownMenuTrigger` faz `preventDefault` em `onPointerDown`/`onKeyDown` quando o elemento tem `disabled` ou `aria-disabled="true"`.
  - O axe unitário corre sobre o `role="menu"` (sobre o `body` dava a regra `region`, ruído de jsdom); o contraste real fica no `test:a11y`.
  - `sideOffset` tem omissão de 4px (valor literal, passado ao Radix, não é CSS).
  - A story `KeyboardInteraction` usa `KeyboardEvent` sintéticos (como as de Select e Dialog).

### DS-032 · Table: estrutura base

**Iteração 1 — 2026-10-19**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Table`, `TableCaption`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell` e `TableCell` sobre elementos HTML nativos. `Table` renderiza `div.ds-table-container` (`role="region"`, `tabIndex=0`, `overflow: auto`, nome por `aria-label`/`aria-labelledby`, obrigatório no tipo) à volta de `<table class="ds-table">`; o nome também vai para a `<table>`. `size` (`sm`/`md`), `striped` e `stickyHeader` em `data-size`, `data-striped`, `data-sticky-header`. `TableHeaderCell`: `scope` (omissão `col`) e `align`; `TableCell`: `align` e `numeric` (alinha ao fim, `tabular-nums`). `TableCaption`: `visuallyHidden`. `TableRow`: `selected` (`aria-selected` e `data-selected`). Striped, hover e selecionado usam `bg-subtle` / `accent-subtle` com `text-default`.
- **Ficheiros alterados:** `packages/ui/src/Table/{Table.tsx,Table.css,Table.css.test.ts,Table.test.tsx,Table.stories.tsx,index.ts}`, `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** 6d8452a `feat(ui): DS-032 add Table base structure with sticky header and scroll region`
- **Critérios de aceitação cobertos:** todos, exceto a verificação em browser das setas a fazer scroll (ver notas); testes em `Table.test.tsx`; stories `Default`, `Striped`, `Dense`, `WithCaption`, `NumericColumns`, `StickyHeader`, `HorizontalScroll`, `WithBadges`, `DarkTheme`.
- **Testes escritos pelo programador:** `Table.test.tsx` (estrutura nativa, região focável e nomeada, `aria-labelledby`, `getByRole('table', { name })`, contagens de `columnheader`/`rowheader`/`row`, `scope`, `align`/`numeric`, `size`/`striped`/`stickyHeader`, `selected`, legenda escondida, `ref`/`className` em cada subparte, `displayName`, Tab foca o contentor, axe com `Badge` numa célula); `Table.css.test.ts` (tokens existentes, `overflow: auto`, `tabular-nums`, sem cores fixas).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 466) · build ✔ · test:a11y ✔ (123). Sem dependências novas.
- **Notas para o testador:**
  - O scroll com as setas é comportamento nativo do browser num elemento com scroll e focus; o jsdom não o simula, por isso o teste unitário só confirma `tabIndex=0`, `role="region"` e o nome. Verificar no Storybook (`HorizontalScroll`).
  - `stickyHeader` só tem efeito visível com altura limitada: o consumidor define `--ds-table-max-height` num ancestral (a story `StickyHeader` mostra como). Sem props extra no contentor.
  - O nome é aplicado ao contentor e à `<table>`; por isso `getByRole('table', { name })` funciona mesmo sem `TableCaption`.
  - `aria-selected` só é emitido quando `selected` é definido (`true`/`false`); `data-selected` só com `true`.
  - O `tabIndex` no contentor tem um `eslint-disable` justificado (`jsx-a11y/no-noninteractive-tabindex`), exigido pela regra axe `scrollable-region-focusable`.
  - Sugestão para o planeador: `Table` não permite passar `className` nem props ao contentor (`ds-table-container`); se for preciso (ex.: DS-035), criar tarefa.
  - O contraste de `accent-subtle`/`bg-subtle` com `text-default` passou no `test:a11y` (browser), mas a story `DarkTheme` só confirma o tema escuro se o toggle for aplicado; o testador deve rever.

### DS-032 · Table: estrutura base (continuação)

**Iteração 2 — 2026-10-19**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** corrigida a falha 1 do relatório 1 (falta o teste do scroll horizontal com as setas). Em `apps/docs/.storybook/test-runner.ts`, o `postVisit` da story `components-table--horizontal-scroll` usa teclado real do Playwright: confirma que a tabela é mais larga do que o contentor, foca a região, `ArrowRight` leva `scrollLeft` a > 0 e `ArrowLeft` devolve-o a 0. Um `play` na story não serve, porque eventos sintéticos não provocam o scroll nativo. Nota não bloqueante tratada: `position: relative` em `.ds-table-container` para o caption `visuallyHidden` (absolute) não escapar ao scroll.
- **Ficheiros alterados:** `apps/docs/.storybook/test-runner.ts`, `packages/ui/src/Table/Table.css`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** f83f5cf `fix(ui): DS-032 test arrow-key horizontal scroll of Table region`
- **Critérios de aceitação cobertos:** o teste de acessibilidade do scroll por setas passa a existir e corre em `pnpm test:a11y`.
- **Testes escritos pelo programador:** verificação no test runner (Chromium). Confirmei que é efetiva: com a condição `scrollLeft > 99999` a suite da Table falha; com `> 0` passa.
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 466) · build ✔ · test:a11y ✔ (123).
- **Notas para o testador:** o teste vive no `test-runner.ts` (corre depois da story, junto do axe), não na story. Afeta só a story `HorizontalScroll`.

### DS-050 · Pacotes do workspace resolvidos a partir do código-fonte (typecheck e testes sem build prévio)

**Iteração 1 — 2026-10-19**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** mecanismo escolhido: condição de exportação própria `"source"` (a primeira entrada de `exports["."]` em `packages/icons/package.json`, a apontar para `./src/index.ts`), ativada com `customConditions: ["source"]` no `tsconfig.base.json` (TypeScript), `resolve.conditions: ['source']` no Vitest do `@ds/ui` e `viteFinal` com `resolve.conditions` no Storybook. Motivo: uma só fonte de verdade (o `package.json` do pacote), sem duplicar caminhos em `paths`/`alias` em cada configuração; `main`, `module`, `types`, `import`, `require` continuam a apontar para `dist/`, e o `tsup` e os consumidores normais não usam a condição `source`. Para `@ds/tokens` (solução a: geração automática como passo prévio): o `src/index.ts` está vazio e o CSS/objeto só existem depois do Style Dictionary; `apps/docs` (`storybook`, `build-storybook`, `typecheck`, `test:a11y`) e `@ds/tokens test` já corriam o build dos tokens; faltava o `@ds/ui`, cujos testes de CSS leem `tokens/dist/*.css` e cujo `styles.test.ts` resolve `@ds/tokens/*.css` para `dist/`. Acrescentei `packages/ui/test/global-setup.ts` (`globalSetup` do Vitest), que corre `node scripts/build.mjs` em `packages/tokens` antes dos testes (também em `test:watch`).
- **Inventário das dependências `@ds/*`:**

  | Origem | Destino | Tipo | Resolução em desenvolvimento |
  | --- | --- | --- | --- |
  | `ui` (`Checkbox`, `Select`, `Dialog`, `DropdownMenu.stories`) | `@ds/icons` | TS/JS | condição `source` → `icons/src/index.ts` (tsc, Vitest, Storybook/Vite) |
  | `ui` (`src/styles.css`, `scripts/build-css.mjs`) | `@ds/tokens/tokens.css`, `@ds/tokens/themes.css` | CSS | `dist/` gerado pelo Style Dictionary; `pnpm --filter @ds/tokens build` automático (globalSetup do Vitest do `ui`; script do `docs`) |
  | `ui` (`*.css.test.ts`) | `tokens/dist/*.css` (caminho relativo) | CSS (leitura de ficheiro) | idem, gerado pelo globalSetup |
  | `docs` (`Scales.stories.tsx`, `Colors.stories.tsx`) | `@ds/tokens` (`tokens`, `themes`) | TS/JS | `dist/` gerado; os scripts `storybook`, `build-storybook`, `typecheck` e `test:a11y` do `docs` correm o build dos tokens antes |
  | `docs` (`.storybook/preview.tsx`) | `packages/ui/src/styles.css` (caminho relativo), que importa `@ds/tokens/*.css` | CSS | `dist/` dos tokens (acima) |
  | `docs` (stories do `ui`, em `packages/*/src/**/*.stories.tsx`) | `@ds/icons` (indireto, sem dependência declarada no `docs`) | TS/JS | condição `source` no `viteFinal` |
  | `docs` | `@ds/ui` | n/a | não há importação por nome (as stories usam caminhos relativos) e o `@ds/ui` não tem `main`/`exports`; nada a resolver |

- **Ficheiros alterados:** `tsconfig.base.json`, `packages/icons/package.json`, `packages/ui/vitest.config.ts`, `packages/ui/test/global-setup.ts` (novo), `apps/docs/.storybook/main.ts`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** fd42d21 `feat(ui): DS-050 resolve workspace packages from source in development`
- **Critérios de aceitação cobertos:** todos (verificação abaixo). Sem testes novos: o próprio `pnpm test` num estado sem `dist/` é a prova (os testes do `ui` dependem de `@ds/icons` e de `tokens/dist`).
- **Testes escritos pelo programador:** nenhum novo (ver acima); `test/global-setup.ts` é infraestrutura de testes.
- **Verificação de regressão (sem clone novo; `dist/` e `storybook-static/` removidos com `rm -rf packages/tokens/dist packages/icons/dist packages/ui/dist apps/docs/storybook-static`, depois `pnpm install --frozen-lockfile`):**
  - `pnpm typecheck` → 0 (isolado, sem `dist/`)
  - `rm -rf packages/*/dist` + `pnpm test` → 0 (tokens 89, icons 10, ui 466)
  - `rm -rf packages/*/dist` + `pnpm lint` → 0
  - `pnpm build` → 0; ficheiros em `dist/` iguais aos de antes: tokens (`index.cjs`, `index.d.ts`, `index.js`, `themes.css`, `tokens.css`), icons (`index.{cjs,cjs.map,d.cts,d.ts,js,js.map}`), ui (`index.{cjs,cjs.map,d.cts,d.ts,js,js.map}`, `styles.css`)
  - `grep -nE "icons/src|packages/icons|src/index|IconBase|@ds/icons" packages/ui/dist/*.d.ts packages/ui/dist/*.d.cts` → sem resultados (o `.d.ts` do `ui` não referencia o `@ds/icons` nem copia declarações)
  - `cd packages/ui && node -e "console.log(require.resolve('@ds/icons'))"` → `packages/icons/dist/index.cjs`; `import.meta.resolve('@ds/icons')` (ESM) → `packages/icons/dist/index.js`
  - sem `dist/` nem `storybook-static/`: `pnpm build:docs` → 0
  - sem `dist/` nem `storybook-static/`: `pnpm test:a11y` → 0 (123 testes)
  - prova negativa (temporária, revertida, não commitada): em `packages/icons/src/IconBase.tsx`, `size?: number | string` passou a `size?: boolean`; `pnpm --filter @ds/ui typecheck` falhou (TS2322 em `../icons/src/IconBase.tsx`), logo os tipos vêm do código-fonte.
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ · build ✔ · test:a11y ✔ · build:docs ✔. Sem dependências novas; `.github/` intocado.
- **Notas para o testador:**
  - O critério "`require('@ds/ui')` a partir de `apps/docs`" não é aplicável: o `docs` não declara `@ds/ui` nem `@ds/icons` e o `@ds/ui` não tem `main`/`exports` (metadados na DS-036). Verifiquei a resolução de `@ds/icons` a partir de `packages/ui`.
  - `pnpm storybook` interativo não foi aberto (ambiente sem browser); as stories do Checkbox e do Select correm no `test:a11y` e o `build:docs` bundla `@ds/icons` a partir do código-fonte sem `dist/`. A verificação visual dos ícones fica ao testador.
  - O `typecheck` de `ui` agora também verifica o código-fonte de `icons` com as opções do `ui` (iguais, vêm do `tsconfig.base.json`).
  - Pedido para o João (não feito, ficheiro dele): nenhum obrigatório; o CI já não precisa de `build` antes de `typecheck`/`test`/`lint`, por isso a reordenação provisória do `ci.yml` pode ser revertida se quiser.

### DS-033 · Table: ordenação

**Iteração 1 — 2026-10-20**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `TableHeaderCell` ganha `sortable`, `sortDirection` e `onSort`: quando `sortable`, o conteúdo fica num `<button type="button">` com `ArrowUpIcon`/`ArrowDownIcon`/`ArrowUpDownIcon` (decorativos, `aria-hidden` por omissão do `IconBase`) e o `<th>` recebe `aria-sort` (`ascending`/`descending`/`none`); sem `sortable` não há botão nem `aria-sort`. Hook `useTableSort<T>({ data, columns, sort?, defaultSort?, onSortChange? })` em `Table/useTableSort.ts`, exportado de `packages/ui/src/index.ts`, com tipos. Ciclo asc → desc → nenhum, uma coluna de cada vez; números por valor, datas por tempo, strings com `Intl.Collator` (`numeric`, `sensitivity: 'base'`, equivalente a `localeCompare` com essas opções), `null`/`undefined` sempre no fim nas duas direções; `compare` próprio por coluna (invertido em `desc`) e `accessor` opcional; ordenação estável sobre uma cópia. Modo controlado quando `sort !== undefined` (`null` é um valor controlado válido). CSS do botão e do ícone em `Table.css` só com tokens; o focus do botão desenha-se por dentro da célula para o contentor com scroll não o cortar. Âmbito: não toquei no contentor `ds-table-container` (a nota sobre `className`/props no contentor não é exigida pela especificação).
- **Ficheiros alterados:** `packages/ui/src/Table/Table.tsx`, `Table.css`, `Table.stories.tsx`, `index.ts`, `useTableSort.ts` (novo), `useTableSort.test.tsx` (novo), `TableSort.test.tsx` (novo), `packages/ui/src/index.ts`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** 754b37b `feat(ui): DS-033 add sortable Table headers and useTableSort hook`
- **Critérios de aceitação cobertos:** todos os da tarefa; G1 a G3; C1 a C5 (pasta `Table` já existente).
- **Testes escritos pelo programador:** `useTableSort.test.tsx` (16: ciclo, mudar de coluna, números, strings com acentos/maiúsculas/numeração, datas, nulos nas duas direções, `compare`, `accessor`, estabilidade, não mutação, `defaultSort`, coluna desconhecida, `onSortChange` e modo controlado); `TableSort.test.tsx` (aria-sort, sem botão nos não ordenáveis, clique/Enter/Espaço, Tab pela ordem das colunas, ícone decorativo, axe, focus mantido e ordem das linhas no DOM). Stories: `Sortable`, `SortableControlled`, `DefaultSort`, `CustomCompare`, `SortKeyboardInteraction` (com `play`), e `DarkTheme` com tabela ordenável.
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 488) · build ✔ · test:a11y ✔ (128).
- **Notas para o testador:**
  - O `play` de `SortKeyboardInteraction` usa DOM simples (`focus()` + `click()` e espera de um frame), porque `@storybook/test` não está instalado e a G2 não permite dependências novas. Enter e Espaço reais estão nos testes unitários (`userEvent`).
  - Não acrescentei a `Table.test.tsx` para não o inflar: os testes de ordenação do componente estão em `TableSort.test.tsx`.
  - Sugestão para o planeador: se se quiser `play` com teclado real nas stories, uma tarefa para adicionar `@storybook/test`, ou alargar o `test-runner.ts` como na DS-032.

### DS-020 · Spinner e Skeleton

**Iteração 1 — 2026-10-20**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** dois componentes, cada um na sua pasta (C1). `Spinner` (`size` sm/md/lg, `label` omissão "Loading"): `<span role="status">` com SVG decorativo (`aria-hidden`, `currentColor`) e o `label` em `VisuallyHidden`. O `role="status"` não tira o nome do conteúdo, por isso o root tem `aria-labelledby` (via `useId`) a apontar para o texto escondido; assim `getByRole('status', { name: 'Saving' })` funciona. Um `aria-label`/`aria-labelledby` do consumidor sobrepõe-se por vir depois no spread. `Skeleton` (`variant` text/rect/circle, `width`/`height`, `lines`): `<div aria-hidden="true">`; `width`/`height` vão para `--ds-skeleton-width`/`--ds-skeleton-height` (números em px) no atributo `style`, fundidos com o `style` do consumidor; `lines` só na variante `text` (mínimo 1; a última linha tem 70% de largura). Animações: o Spinner roda (800ms) e fica estático com `prefers-reduced-motion: reduce`; o brilho do Skeleton é escondido nesse caso. Tamanhos do Spinner por `--ds-space-4/6/8` (não há tokens de tamanho). Exportados em `packages/ui/src/index.ts`; CSS em `styles.css`.
- **Ficheiros alterados:** `packages/ui/src/Spinner/{Spinner.tsx,Spinner.css,Spinner.test.tsx,Spinner.stories.tsx,index.ts}` (novos), `packages/ui/src/Skeleton/{Skeleton.tsx,Skeleton.css,Skeleton.test.tsx,Skeleton.stories.tsx,index.ts}` (novos), `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** 5374d91 `feat(ui): DS-020 add Spinner and Skeleton`
- **Critérios de aceitação cobertos:** todos; G1 a G3; C1 a C5 para os dois componentes.
- **Testes escritos pelo programador:** `Spinner.test.tsx` (8: role e nome por omissão, `label`, `data-size`, gráfico `aria-hidden` e texto escondido, ref/className, displayName, Tab sem focus, axe); `Skeleton.test.tsx` (12: defaults e `aria-hidden`, variantes, `lines={3}`, `lines` ignorado fora de `text`, custom properties, sem propriedades por omissão, `style` do consumidor, ref/className, displayName, fora da árvore de acessibilidade, Tab sem focus, axe). Stories: Spinner `Default`, `Sizes`, `CustomLabel`, `DarkTheme`; Skeleton `Text`, `Rect`, `Circle`, `CardPlaceholder`, `DarkTheme`.
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 533) · build ✔ · test:a11y ✔ (137).
- **Notas para o testador:**
  - A regra de `prefers-reduced-motion` está em CSS (nos dois `.css` e na regra global de `motion.css`); o jsdom não avalia media queries, por isso a verificação é visual/por leitura do CSS ou por emulação no browser (Playwright `reducedMotion: 'reduce'`).
  - O Skeleton não tem contraste de texto (é decorativo, `aria-hidden`); a cor de fundo usa `--ds-color-bg-subtle`, com o brilho em `--ds-color-bg-surface`.
  - Sugestão para o planeador: nenhuma obrigatória.

### DS-021 · Button: estado `loading`

**Iteração 1 — 2026-10-21**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Button` ganha `loading` e `loadingLabel` (omissão "Loading"); `IconButton` herda-as. Com `loading`, o root tem `aria-busy="true"`, `aria-disabled="true"` e `data-loading`, sem `disabled` nem `tabIndex={-1}` (continua na ordem de Tab), e o clique é bloqueado na captura (`blockClick`), incluindo com `asChild`. Um `Spinner` (`size="sm"`, `label={loadingLabel}`) substitui o `leadingIcon` no mesmo `<span aria-hidden>` (criado se não houver ícone); o `trailingIcon` não muda. O `id` do Spinner entra no `aria-describedby` do root, acrescentado ao que o consumidor passe, e o nome do botão não muda. Com `disabled` + `loading`, `disabled` prevalece (atributo `disabled` ou `tabIndex={-1}` no `asChild`) e o Spinner continua visível. JSDoc de `loading` e `disabled` documenta a diferença face a `disabled` e que o resultado é comunicado pelo consumidor (Toast ou outro feedback). CSS: `cursor: progress` em `[data-loading]:not([data-disabled])`.
- **Ficheiros alterados:** `packages/ui/src/Button/{Button.tsx,Button.css,Button.test.tsx,Button.stories.tsx}`, `packages/ui/src/IconButton/{IconButton.test.tsx,IconButton.stories.tsx}`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** f9ada3d `feat(ui): DS-021 add loading state to Button and IconButton`
- **Critérios de aceitação cobertos:** todos os da tarefa; G1 a G3; C1 a C5 (pastas existentes). `IconButton.tsx` não precisou de alterações (a prop passa por `...props`).
- **Testes escritos pelo programador:** `Button.test.tsx` (bloco `loading`, 13 testes: Spinner no lugar do ícone, span criado sem ícone, sem loading nada muda, descrição "Loading" e `loadingLabel` próprio, `aria-describedby` acrescentado, clique cancelado, submit bloqueado com rato/Enter/Espaço, `disabled` + `loading`, Tab loading vs disabled, focus mantido ao alternar, `asChild` (atributos, Spinner antes do texto, clique e Enter bloqueados, Tab), axe); `IconButton.test.tsx` (Spinner no lugar do ícone, nome pelo `aria-label`, axe). Stories: `Button/Loading`, `Button/LoadingToggle` (com `play`), `Button/AsLinkLoading`, `IconButton/Loading`, e loading em `Button/DarkTheme`.
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 555) · build ✔ · test:a11y ✔ (141).
- **Notas para o testador:**
  - Largura: o Spinner usa `size="sm"` (`--ds-space-4`, 16px), igual aos ícones de 16px das stories; com um `leadingIcon` de outra largura o botão muda de largura. Não há forma de medir o ícone do consumidor sem JS de layout. A verificação é visual (o `play` de `LoadingToggle` confirma largura igual com ícone de 16px).
  - O `play` de `LoadingToggle` usa DOM simples (`focus()` + `click()`), como na DS-033, porque `@storybook/test` não está instalado.
  - Com `asChild`, um `aria-describedby` do próprio filho sobrepõe-se ao calculado pelo `Slot` (comportamento do Radix), pelo que perderia a descrição de loading. Caso limite não coberto pela especificação.
  - Sugestão para o planeador: nenhuma obrigatória.

### DS-022 · Alert

**Iteração 1 — 2026-10-21**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** componente `Alert` (`<div>` raiz) com `variant` (`info` por omissão, `success`, `warning`, `danger`), `title`, `icon` (`ReactNode | false`), `onClose` e `closeLabel` (omissão "Close"); `title` do HTML é omitido do tipo nativo para aceitar `ReactNode`. `role` por omissão `alert` para `danger`/`warning` e `status` para `info`/`success`, substituível pelo consumidor. Ícones por omissão `InfoIcon`, `CircleCheckIcon`, `TriangleAlertIcon`, `CircleXIcon` num `<span aria-hidden>`; ícone personalizado vai no mesmo span. O botão de fechar é um `IconButton` (`ghost`, `sm`, `XIcon`) e só existe com `onClose`; o Alert nunca se esconde. Os blocos de título e descrição só são renderizados quando existem. CSS só com tokens: fundo `*-subtle`, texto, ícone e borda `*-text` da variante (via `--ds-alert-bg`/`--ds-alert-fg`); `overflow-wrap: anywhere` para conteúdo longo.
- **Ficheiros alterados:** `packages/ui/src/Alert/{Alert.tsx,Alert.css,Alert.css.test.ts,Alert.test.tsx,Alert.stories.tsx,index.ts}` (novos), `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** 1d99eb1 `feat(ui): DS-022 add Alert with variants, icon and close button`
- **Critérios de aceitação cobertos:** todos os da tarefa; G1 a G3; C1 a C5.
- **Testes escritos pelo programador:** `Alert.test.tsx` (role por variante e personalizado, ícone decorativo por variante e diferente em cada uma, ícone personalizado e `icon={false}`, sem botão sem `onClose`, clique chama `onClose` uma vez e o Alert não desaparece, `closeLabel`, sem título/descrição, ref/className/props, Tab + Enter + Espaço, axe nas quatro variantes); `Alert.css.test.ts` (contraste ≥ 4,5:1 de `*-text` sobre `*-subtle` nos dois temas). Stories: `Info`, `Success`, `Warning`, `Danger`, `WithoutTitle`, `Dismissible`, `LongContent`, `DarkTheme` (as quatro variantes com fecho).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 594) · build ✔ · test:a11y ✔ (149).
- **Notas para o testador:**
  - O botão de fechar é um `IconButton` `ghost` com `color: var(--ds-alert-fg)`; o contraste dele sobre `*-subtle` é o mesmo de `*-text` (coberto pelo teste de CSS), mas o jsdom não avalia o CSS real, por isso a verificação visual dos dois temas é no Storybook.
  - A borda do alerta usa `*-text` (não está na especificação, é só um reforço visual).
  - Sugestão para o planeador: nenhuma obrigatória.

### DS-023 · Tooltip

**Iteração 1 — 2026-10-22**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Tooltip` e `TooltipProvider` sobre `@radix-ui/react-tooltip`. `Tooltip` aceita `content`, `children` (um elemento gatilho, usado com `asChild`), `side` (omissão `top`), `align`, `delayDuration` (omissão 400 ms), `open`, `defaultOpen`, `onOpenChange`; as restantes props, `ref` e `className` vão para o conteúdo (`.ds-tooltip`), renderizado num portal. Sem `TooltipProvider`, o `Tooltip` cria o seu próprio provider (um contexto interno deteta o provider do consumidor), por isso funciona isolado. O Radix dá `role="tooltip"` e o `aria-describedby` no gatilho enquanto aberto; Esc fecha sem mover o focus, o conteúdo aceita hover e não há fecho por tempo (WCAG 1.4.13). CSS só com tokens: `z-index: var(--ds-z-tooltip)`, fundo `bg-inverse` com texto `bg-canvas` (contraste verificado nos dois temas), `max-width` por `--ds-space-16` e `overflow-wrap: anywhere`; animação de entrada só em `delayed-open`/`instant-open`, anulada pela regra global de `prefers-reduced-motion`.
- **Ficheiros alterados:** `packages/ui/src/Tooltip/{Tooltip.tsx,Tooltip.css,Tooltip.css.test.ts,Tooltip.test.tsx,Tooltip.stories.tsx,index.ts}` (novos), `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `packages/ui/package.json`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** 76a9b0a `feat(ui): DS-023 add Tooltip with provider, sides and keyboard support`
- **Critérios de aceitação cobertos:** todos os da tarefa; G1 a G3 (dependência nova: `@radix-ui/react-tooltip`); C1 a C5.
- **Testes escritos pelo programador:** `Tooltip.test.tsx` (fechado por omissão, `defaultOpen`, `data-side`, portal, modo controlado, `open={false}`, abre com Tab e descrição acessível igual ao `content`, Esc mantém o focus, Tab para fora fecha, hover com timers falsos (399/401 ms, `delayDuration` próprio, sem fecho por tempo, Esc após hover), ref/className/props, `displayName`, dentro de `TooltipProvider`, `ReactNode`, axe aberto e fechado); `Tooltip.css.test.ts` (tokens existentes, z-index, largura máxima, contraste nos dois temas). Stories: `Default`, `Sides`, `OnIconButton`, `LongContent`, `KeyboardInteraction` (com `play`), `DarkTheme` (com `defaultOpen`).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 633) · build ✔ · test:a11y ✔ (155).
- **Notas para o testador:**
  - O Radix cria um elemento visualmente oculto com `role="tooltip"` para leitores de ecrã, com o mesmo texto do elemento visível (`.ds-tooltip`, que recebe `ref`/`className`/`data-side`). `getByRole('tooltip')` devolve o oculto.
  - jsdom não faz layout: o teste de `side` usa `avoidCollisions={false}`, senão o Radix inverte o lado. O reposicionamento real verifica-se no Storybook.
  - O hover é simulado com `fireEvent.pointerMove` (`pointerType: 'mouse'`) e timers falsos.
  - `sideOffset` (6) e `collisionPadding` (8) estão em pixéis no código, porque o Radix os recebe como números. Sugestão para o planeador: se se quiser que venham de tokens, definir uma tarefa para isso (vale também para outros overlays).

### DS-024 · Popover

**Iteração 1 — 2026-10-22**

- **Estado no fim:** Pronto para teste
- **O que foi feito:** `Popover`, `PopoverTrigger`, `PopoverContent` e `PopoverClose` sobre `@radix-ui/react-popover`. `Popover` aceita `open`, `defaultOpen`, `onOpenChange` e não renderiza elemento. `PopoverTrigger` (com `asChild`) recebe `aria-haspopup="dialog"`, `aria-expanded` e `aria-controls` do Radix. `PopoverContent` (`role="dialog"`, portal) tem `side` (omissão `bottom`), `align` (omissão `center`), `sideOffset` (omissão 6), `showClose` e `closeLabel` (omissão "Close"), `ref` e `className`; o nome acessível é exigido pelo tipo (união: `aria-label` ou `aria-labelledby`). O botão de fechar é um `IconButton` `ghost` `sm` dentro de `Radix.Close`. Colisão do Radix ativa (`collisionPadding` 8). Gatilho desativado: um `Button`/`IconButton` `disabled` já tem o atributo nativo, por isso o Radix não abre nem o focus lá chega; não foi preciso código extra (ao contrário do DropdownMenu, que abre em `pointerdown`). CSS só com tokens: `z-index: var(--ds-z-dropdown)`, `max-width: min(..., 100vw - space-4)`, `max-height` pela altura disponível do Radix, `overflow-wrap: anywhere`, outline de focus visível no conteúdo, animação de entrada anulada pela regra global de `prefers-reduced-motion`.
- **Ficheiros alterados:** `packages/ui/src/Popover/{Popover.tsx,Popover.css,Popover.css.test.ts,Popover.test.tsx,Popover.stories.tsx,index.ts}` (novos), `packages/ui/src/index.ts`, `packages/ui/src/styles.css`, `packages/ui/package.json`, `pnpm-lock.yaml`, `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** a09a0ff `feat(ui): DS-024 add Popover with trigger, content and close button`
- **Critérios de aceitação cobertos:** todos os da tarefa; G1 a G3 (dependência nova: `@radix-ui/react-popover`); C1 a C5.
- **Testes escritos pelo programador:** `Popover.test.tsx` (fechado por omissão, abrir/fechar com o gatilho, `defaultOpen`, controlado e controlado que recusa abrir, clique fora, `PopoverClose`, `showClose` e `closeLabel`, `aria-labelledby`, `side`/`align` e omissões, ref/className/props, portal, `displayName`; gatilho desativado com `Button` e `IconButton` (clique, Enter, Espaço, `onOpenChange` não chamado, Tab salta); axe aberto e fechado; `aria-haspopup`/`aria-expanded`/`aria-controls`; Enter e Espaço abrem com o focus dentro; Tab dentro do conteúdo; Esc e `PopoverClose` devolvem o focus ao gatilho); `Popover.css.test.ts` (tokens existentes, z-index, largura máxima, sem cores fixas, animação só na entrada). Stories: `Default`, `Placement`, `WithForm`, `WithCloseButton`, `Controlled`, `DisabledTrigger`, `KeyboardInteraction` (com `play`), `DarkTheme`.
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 674) · build ✔ · test:a11y não executado (precisa do Storybook/Playwright; o axe corre nos testes unitários).
- **Notas para o testador:**
  - jsdom não faz layout: o teste de `side` usa `avoidCollisions={false}`. O reposicionamento por colisão e o limite à largura do viewport verificam-se no Storybook (redimensionar a janela, story `Placement`).
  - Com `showClose`, o conteúdo ganha `data-close` e padding extra à direita para o botão não tapar texto.
  - O nome acessível obrigatório é garantido só pelo tipo (TypeScript), não em runtime.
  - Sugestão para o planeador: `sideOffset` (6) e `collisionPadding` (8) estão em pixéis no código, porque o Radix os recebe como números; o mesmo já foi referido na DS-023. Se se quiser que venham de tokens, definir uma tarefa transversal.

**Iteração 2 — 2026-10-22** (correção do relatório 1)

- **Estado no fim:** Pronto para teste
- **O que foi feito:**
  - Falha 1 (sideOffset por token): novo `packages/ui/src/utils/spaceToken.ts` (`readSpaceToken`, tipo `SpaceStep`) lê `--ds-space-<passo>` em runtime com `getComputedStyle` e converte `rem` para pixéis pelo tamanho de letra da raiz. `PopoverContent.sideOffset` passou de número para passo do token (`'0'`…`'16'`, omissão `'2'` = 0.5rem); `collisionPadding` usa `--ds-space-2`. Alteração de API: o valor omisso passa de 6 px para 8 px (o token mais próximo; não existe `space-1.5`), e o tipo deixa de aceitar números. Sem o CSS carregado o valor cai para 0 (o componente já depende de `styles.css`).
  - Falha 2 (clique fora): `PopoverContent` trata `onCloseAutoFocus` (chama o do utilizador; se não houver `preventDefault` e o focus estiver no `body`, devolve-o ao gatilho). `Popover` guarda o gatilho num contexto e `PopoverTrigger` regista-o, mantendo o `ref` externo. Se o clique fora cair noutro elemento focável, o focus fica nesse elemento (comportamento esperado, evita roubar o focus).
- **Ficheiros alterados:** `packages/ui/src/Popover/Popover.tsx`, `packages/ui/src/Popover/Popover.test.tsx`, `packages/ui/src/utils/spaceToken.ts`, `packages/ui/src/utils/spaceToken.test.ts` (novos testes), `docs/workflow/01-planeamento.md`, `docs/workflow/02-desenvolvimento.md`.
- **Commit(s):** d2ca4f9 `fix(ui): DS-024 read Popover offsets from space tokens and restore focus after outside click`
- **Critérios de aceitação cobertos:** os da iteração 1, mais `sideOffset` por token e regresso do focus após clique fora.
- **Testes escritos pelo programador:** regressão em `Popover.test.tsx` (focus volta ao gatilho após clique fora num texto; fica no elemento focável clicado; `onCloseAutoFocus` próprio com `preventDefault` respeitado; `ref` do gatilho mantido; `--ds-space-4` e `--ds-space-2` lidos); `spaceToken.test.ts` (rem, px, fallback).
- **Verificações locais:** lint ✔ · typecheck ✔ · test ✔ (ui: 683) · build ✔ · test:a11y não executado (precisa do Storybook/Playwright).
- **Notas para o testador:**
  - jsdom não faz layout: o valor em pixéis do offset não é medido; o teste verifica que os tokens são lidos e `spaceToken.test.ts` a conversão.
  - O Tooltip (DS-023, Concluído) tem o mesmo problema (`sideOffset ?? 6`, `collisionPadding={8}`) e NÃO foi alterado. Sugestão para o planeador: tarefa nova para aplicar `readSpaceToken` ao Tooltip, DropdownMenu (`sideOffset = 4`) e Select (`sideOffset={4}`).
