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
