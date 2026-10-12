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
