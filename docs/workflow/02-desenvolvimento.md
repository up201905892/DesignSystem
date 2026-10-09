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
