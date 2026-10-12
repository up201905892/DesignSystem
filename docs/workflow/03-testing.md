# 03 · Testing

Relatórios de teste. Só o `testador` escreve aqui. Cada execução de testes de uma tarefa gera um relatório novo (nunca se reescreve um relatório antigo).

Regra de entrada: a tarefa tem de estar `Pronto para teste` e ter registo em `02-desenvolvimento.md` com ficheiros alterados e commit.

## Relatórios

<!--
Modelo de relatório:

### DS-000 · Título — Relatório N — AAAA-MM-DD

- **Commit testado:** hash curto
- **Resultado:** Aprovado | Reprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` | ✔ / ✘ |
| Tipos | `pnpm typecheck` | ✔ / ✘ |
| Unitários | `pnpm test` (N testes) | ✔ / ✘ |
| Acessibilidade | `pnpm test:a11y` + teclado | ✔ / ✘ |
| Build | `pnpm build` | ✔ / ✘ |

**Critérios de aceitação:**
- [x] critério 1 — como foi verificado
- [ ] critério 2 — FALHA: descrição

**Testes adicionados pelo testador:** ficheiros (se algum)

**Falhas encontradas (se Reprovado):**
1. O que falha, passos para reproduzir, resultado esperado vs obtido, ficheiro provável
-->

### DS-001 · Monorepo pnpm, TypeScript strict, ESLint e Prettier — Relatório 1 — 2026-10-09

- **Commit testado:** d42f1ce (presente no histórico de `develop`; `git status` limpo antes de começar)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Instalação | `pnpm install --frozen-lockfile` | ✔ |
| Lint | `pnpm lint` (eslint + prettier --check) | ✔ |
| Tipos | `pnpm typecheck` (4 workspaces) | ✔ |
| Unitários | `pnpm test` | n/a (script inexistente, G1; chega na DS-002) |
| Acessibilidade | `pnpm test:a11y` | n/a (script inexistente, DS-003); jsx-a11y verificado abaixo |
| Build | `pnpm build` | n/a (script inexistente, DS-002) |

**Critérios de aceitação:**
- [x] `package.json` raiz: lido; `private: true`, `packageManager: pnpm@10.34.6` (exato), `engines.node >=22`.
- [x] `pnpm-workspace.yaml` com `packages/*` e `apps/*`; os quatro workspaces existem com `package.json` privado, nomes `@ds/tokens`, `@ds/ui`, `@ds/icons`, `docs` e `src/index.ts` (confirmado em `git ls-files`).
- [x] `tsconfig.base.json` com `strict`, `noUncheckedIndexedAccess`, `jsx: react-jsx`, `moduleResolution: bundler`; os quatro `tsconfig.json` estendem `../../tsconfig.base.json`.
- [x] `pnpm typecheck` sai com 0; com `packages/ui/src/tmp.ts` contendo `const x: number = 'a'` falhou com TS2322 e `Exit status 2` (ficheiro removido).
- [x] ESLint 9 flat config com typescript-eslint, react, react-hooks e jsx-a11y; `.prettierrc` com `endOfLine: lf`.
- [x] `pnpm lint` sai com 0; `format` existe (`prettier --write .`). Teste negativo: `<img>` sem `alt` em `Tmp.tsx` fez `pnpm lint` falhar com `jsx-a11y/alt-text` (ficheiro removido).
- [x] `.prettierignore` lista os 7 itens exigidos (pnpm-lock.yaml, dist/, storybook-static/, docs/workflow/, .claude/, .github/, CLAUDE.md).
- [x] `.gitignore` cobre node_modules/, dist/, storybook-static/, coverage/, *.tsbuildinfo, *.tgz, .DS_Store (lido).
- [x] `pnpm-lock.yaml` commitado; `pnpm install --frozen-lockfile` sai com 0 ("Lockfile is up to date"). Não foi feito clone limpo separado; verificado no checkout atual.
- [x] Scripts multiplataforma: scripts só usam `eslint`, `prettier`, `pnpm -r`, `tsc`; sem `rm -rf`, `cp` nem variáveis de shell.
- [x] G1 (lint e typecheck verdes; restantes n/a), G2 (dependências só as de tooling nomeadas na especificação; lockfile atualizado), G3 (commit `feat(ui): DS-001 ...` em inglês com ID; o commit não toca em `CLAUDE.md`, `.claude/`, `.github/` nem `aprovacoes.md`).

**Testes exigidos:** unitários, acessibilidade (exceto o teste negativo jsx-a11y, feito) e Storybook não aplicáveis nesta tarefa; verificação manual no terminal feita.

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):** TypeScript 6 e ESLint 9 foram fixados por incompatibilidades de peers documentadas pelo programador; avisos de peer não bloqueiam. O erro TS7026 (JSX sem tipos React) que apareceu no ficheiro `.tsx` temporário deve-se a `react` ainda não ser dependência; é esperado nesta fase e deixa de se aplicar quando os componentes chegarem.

### DS-002 · Vitest + Testing Library e build com tsup — Relatório 1 — 2026-10-09

- **Commit testado:** b305745 (presente no histórico de `develop`; `git status` limpo antes de começar)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Instalação | `pnpm install --frozen-lockfile` (sem avisos de scripts ignorados) | ✔ |
| Lint | `pnpm lint` | ✔ |
| Tipos | `pnpm typecheck` (inclui o teste com matchers jest-dom) | ✔ |
| Unitários | `pnpm test` (3 testes em 1 ficheiro; icons sem testes, `passWithNoTests`) | ✔ |
| Acessibilidade | `pnpm test:a11y` | n/a (script inexistente, chega na DS-003; não aplicável nesta tarefa) |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Vitest com jsdom, Testing Library (react, user-event, jest-dom) e setup partilhado `test/setup.ts`; o `tsconfig` de ui inclui `../../test` e o typecheck verde com `toBeInTheDocument` prova os tipos.
- [x] `pnpm test` usa `vitest run` e sai com 0; `test:watch` existe na raiz e nos pacotes. Teste temporário a falhar (`expect(1).toBe(2)`) fez `pnpm test` sair com 1 (ficheiro removido).
- [x] `react`/`react-dom` em `peerDependencies` (`^18.0.0 || ^19.0.0`) e em `devDependencies` de ui e icons (lido nos `package.json`).
- [x] `tsup.config.ts` em ui e icons com esm+cjs, `dts`, `sourcemap`, `clean`, externos react/react-dom.
- [x] `pnpm build` sai com 0; existem `dist/index.js`, `index.cjs` e `index.d.ts` em ui e icons.
- [x] `VisuallyHidden` com `forwardRef` exportado em `packages/ui/src/index.ts`; o teste renderiza, usa `toBeInTheDocument`, verifica `ref` e props nativas.
- [x] `require` do `.cjs` e `import()` do `.js` terminam sem erro.
- [x] `onlyBuiltDependencies: esbuild` em `pnpm-workspace.yaml`; install frozen sem avisos.
- [x] G1 (lint, typecheck, test e build existem e passam), G2 (dependências apenas as da especificação, lockfile atualizado), G3 (commit `feat(ui): DS-002 ...` em inglês com ID; não toca em `CLAUDE.md`, `.claude/`, `.github/` nem `aprovacoes.md`).

**Testes exigidos:** teste de renderização com ref, não trivial; verificação do exit code ≠ 0 feita (temporária, não commitada). Acessibilidade e Storybook não aplicáveis.

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):** `ignoreDeprecations: "6.0"` em `tsconfig.base.json` e `globals: true` documentados pelo programador; rever na migração para TS 7.

### DS-003 · Storybook 8 com addon-a11y e `pnpm test:a11y` — Relatório 1 — 2026-10-11

- **Commit testado:** 3f25ff9 (presente no histórico de `develop`; `git status` sem alterações por guardar, exceto a atualização de estado do testador)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Instalação | `pnpm install --frozen-lockfile` | ✔ |
| Lint | `pnpm lint` | ✔ |
| Tipos | `pnpm typecheck` (4 pacotes) | ✔ |
| Unitários | `pnpm test` (3 testes em ui; icons sem testes) | ✔ |
| Build | `pnpm build` | ✔ |
| Build docs | `pnpm build:docs` (exit 0) | ✔ |
| Setup a11y | `pnpm test:a11y:setup` | ✔ |
| Acessibilidade | `pnpm test:a11y` (1 story, "No accessibility violations detected", exit 0, termina sozinho) | ✔ |

**Critérios de aceitação:**
- [x] Storybook 8.6 com `@storybook/react-vite`, addon-essentials e addon-a11y; `main.ts` tem os globs `../../../packages/*/src/**/*.stories.tsx` e `../src/**/*.mdx`. Prova: o índice serve as entradas da story do `VisuallyHidden`.
- [x] `pnpm storybook` arrancado em background: `http://localhost:6006/` responde 200, `iframe.html` 200, `index.json` lista `utilities-visuallyhidden--default` e `--docs`; processo terminado depois. Sem erros no terminal (apenas WARN: addon-essentials 8.6.14 vs core 8.6.18 e "No story files found for src/**/*.mdx", esperado).
- [x] `pnpm build:docs` gera `apps/docs/storybook-static/` e sai com 0; `pnpm build` continua a construir só os pacotes.
- [x] `pnpm test:a11y` constrói, serve (porta 6007), corre o test-runner com `injectAxe` + `checkA11y` em `apps/docs/.storybook/test-runner.ts`, termina o servidor e sai com 0.
- [x] Prova negativa: story temporária `<button></button>` fez `pnpm test:a11y` sair com 1, a identificar `button-name` (critical) com o HTML do nó; ficheiro removido, não commitado.
- [x] Tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` configuradas em `runOnly` (lido em `test-runner.ts`).
- [x] `test:a11y:setup` existe (`playwright install chromium`) e o `apps/docs/README.md` documenta que se corre uma vez antes de `test:a11y`.
- [x] Story `Utilities/VisuallyHidden` com `tags: ['autodocs']`; aparece no índice (entrada `--docs` incluída) e passa o teste.
- [x] G1 (todos os scripts do `CLAUDE.md` existem e passam), G2 (dependências de tooling da especificação; versões fixadas justificadas pelo programador), G3 (commit `feat(ui): DS-003 ...` em inglês com ID; sem alterações a `CLAUDE.md`, `.claude/`, `.github/` nem `aprovacoes.md`).

**Testes exigidos:** acessibilidade positiva e negativa feitas. Unitários não aplicáveis. Painel "Accessibility" no browser não foi inspecionado visualmente (sem browser interativo); verificado indiretamente: o addon-a11y está em `main.ts` e o axe corre sem violações em Chromium.

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):** o `checkA11y` limita-se a `#storybook-root`; aceitável para esta fase. O CI/ciclo diário precisa de `pnpm test:a11y:setup` antes de `test:a11y` (já em "Decisões para o João" por indicação do programador). Avisos de build scripts ignorados (`@parcel/watcher`, `@swc/core`, `unrs-resolver`) não afetaram nada.

### DS-004 · Tokens primitivos com Style Dictionary — Relatório 1 — 2026-10-11

- **Commit testado:** 7598497 (presente no histórico de `develop`; `git status` limpo no início)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Instalação | `pnpm install --frozen-lockfile` | ✔ |
| Lint | `pnpm lint` | ✔ |
| Tipos | `pnpm typecheck` (4 pacotes) | ✔ |
| Unitários | `pnpm test` (14 em tokens, 3 em ui) | ✔ |
| Build | `pnpm build` (tokens construído antes de ui) | ✔ |
| Setup a11y | `pnpm test:a11y:setup` | ✔ |
| Acessibilidade (regressão) | `pnpm test:a11y` (1 story, sem violações, exit 0) | ✔ |

**Critérios de aceitação:**
- [x] JSON em `packages/tokens/src/primitives/` (7 ficheiros: color, space, typography, radius, shadow, motion, z-index), formato `value` + `type`. Lido ficheiro a ficheiro; Style Dictionary 5.6 aceita-o sem alterações.
- [x] Cor: `neutral`, `primary`, `success`, `warning`, `danger`, `info` com 10 passos cada, mais `white` e `black`. Verificado em `tokens.css` e no teste por paleta.
- [x] Espaçamento: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16 em rem (1 = 0.25rem, 2 = 0.5rem); todos múltiplos de 4px. Lido em `space.json` e `tokens.css`.
- [x] Tipografia: `sans`/`mono` com pilha do sistema, tamanhos xs, sm, md, lg, xl, 2xl, 3xl, pesos regular/medium/semibold/bold, alturas de linha tight/normal/relaxed.
- [x] Raios (none, sm, md, lg, full), sombras (sm, md, lg), durações (fast, normal), z-index (dropdown, overlay, modal, toast, tooltip) presentes.
- [x] Build gera `dist/tokens.css` (`:root`, 100% com `--ds-`, ex.: `--ds-color-primary-500`, `--ds-space-4`) e `dist/index.js`, `index.cjs`, `index.d.ts` (objeto `tokens` com tipos literais `readonly`). Ficheiros inspecionados; `dist` não está versionado.
- [x] `pnpm build` constrói `tokens` antes de `ui`: no log, `packages/tokens build` aparece antes do build do `ui`; `ui` declara `@ds/tokens: workspace:*`.
- [x] Sem valores repetidos à mão: CSS e TS são gerados (cabeçalho "Do not edit"); o teste confirma ESM = CJS e nº de variáveis CSS = nº de folhas TS.
- [x] G1 (lint, typecheck, test, build passam), G2 (`style-dictionary` e `@types/node` como devDependencies, lockfile atualizado e `--frozen-lockfile` passa), G3 (commit `feat(tokens): DS-004 ...` em inglês com ID; sem alterações a `CLAUDE.md`, `.claude/`, `.github/` nem `aprovacoes.md`).

**Testes exigidos:** unitários existem e não são triviais (10 passos por paleta, múltiplos de 4px, prefixo `--ds-`, contagem CSS = folhas TS, sem vazios nem `{...}`). Acessibilidade e Storybook não aplicáveis nesta tarefa.

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):** o teste de múltiplos de 4px usa 16px por rem (correto para a base atual). Os testes dependem de `dist/` e o script `test` do pacote corre o build antes. A DS-005 deve verificar o contraste dos pares semânticos.

### DS-005 · Tokens semânticos e temas claro/escuro — Relatório 1 — 2026-10-12

- **Commit testado:** 36fa7b6 (presente no histórico de `develop`; `git status` limpo no início; registo 1e3ac8e por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Instalação | `pnpm install --frozen-lockfile` | ✔ |
| Lint | `pnpm lint` | ✔ |
| Tipos | `pnpm typecheck` (4 pacotes) | ✔ |
| Unitários | `pnpm test` (89 em tokens, 3 em ui) | ✔ |
| Build | `pnpm build` | ✔ |
| Acessibilidade (regressão) | `pnpm test:a11y:setup` + `pnpm test:a11y` (1 story, exit 0) | ✔ |

**Critérios de aceitação:**
- [x] Fontes `light.json`/`dark.json` só com referências `{color.*}` — lidos; teste rejeita `#`, `rgb`, `hsl` e valores que não sejam referências; só existem esses dois ficheiros.
- [x] Tokens mínimos — `dist/themes.css` inspecionado: 29 variáveis por tema (14 base, 12 de estado, focus-ring, overlay, etc.); teste `required` cobre a lista toda.
- [x] `themes.css` com os três blocos (`:root, [data-theme="light"]`, `[data-theme="dark"]`, `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) }`) — lido no ficheiro gerado.
- [x] `color-scheme` em cada bloco (light, dark, dark no fallback) — lido e testado.
- [x] Mesmo conjunto de nomes nos dois temas e no fallback; exportado como `themes.light|dark` em `index.js`, `index.cjs`, `index.d.ts` — verificado nos `dist` e por teste.
- [x] Pares de contraste em `contrast-pairs.ts` e testados nos dois temas — recalculei de forma independente a partir dos valores de `themes.css` (script próprio, WCAG 2.1): nenhum par abaixo de 4,5:1 (texto) ou 3:1 (borda-strong, focus-ring) em ambos os temas. O teste lê o `dist` e não é trivial (falha abaixo do limite por par).
- [x] G1 (lint, typecheck, test, build passam), G2 (sem novas dependências), G3 (commit `feat(tokens): DS-005 ...` em inglês com ID; sem alterações a `CLAUDE.md`, `.claude/`, `.github/` nem `aprovacoes.md`).

**Testes exigidos:** unitários (mesmas chaves, sem referências por resolver — valores hex finais, três seletores) e acessibilidade (rácio WCAG por par, incluindo todos os pares mínimos exigidos) existem e são substantivos. Visual/Storybook não aplicável (DS-006).

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):** `color-overlay` usa `alpha` com transformação própria (`#0f172a80`, `#00000099`) e não tem requisito de contraste. `text-disabled` e os `*-default` de estado não têm requisito de contraste na especificação. O bloco de fallback duplica o tema escuro (inevitável em CSS puro; coberto por teste de igualdade).

### DS-008 · Pacote de ícones (subconjunto do Lucide com SVGR) — Relatório 1 — 2026-10-12

- **Commit testado:** 7e74ced (presente no histórico de `develop`; sem alterações por guardar no início; registo fe8ba94 por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Instalação | `pnpm install --frozen-lockfile` | ✔ |
| Lint | `pnpm lint` | ✔ |
| Tipos | `pnpm typecheck` (4 pacotes) | ✔ |
| Unitários | `pnpm test` (10 em icons, 89 em tokens, 3 em ui) | ✔ |
| Acessibilidade | `pnpm test:a11y:setup` + `pnpm test:a11y` (5 testes, 2 suites, sem violações) | ✔ |
| Build | `pnpm build` (`packages/icons/dist`: index.js, index.cjs, index.d.ts, index.d.cts) | ✔ |

**Critérios de aceitação:**
- [x] 30 SVG de `lucide-static` em `svg/` — `ls svg` conta 30 e os nomes coincidem com a lista; `lucide-static` 1.55.0 (versão exata) em devDependencies.
- [x] `pnpm --filter @ds/icons generate` — 30 ficheiros em `src/generated/` e `src/index.ts` regenerado; corri o comando e `git status` não mostrou diferenças em `packages/icons` (idempotente).
- [x] API — lido `IconBase.tsx`: `size` por omissão `"1em"` em `width` e `height`, `title`, `className` e restantes props via `...rest`, `forwardRef<SVGSVGElement>`, `stroke="currentColor"`.
- [x] ARIA — sem `title`: `aria-hidden` e `focusable=false`; com `title`: `role="img"` e `<title>`, sem `aria-hidden`. Coberto por teste em todos os 30 ícones.
- [x] Atribuição — `LICENSE-LUCIDE` (licença ISC) e secção "Credits" no README.
- [x] Build e importação — `dist` ESM + CJS + `.d.ts`; `index.d.ts` exporta os ícones por nome; `"sideEffects": false`.
- [x] G1 (lint, typecheck, test, build passam), G2 (`lucide-static`, `@svgr/core` e `@svgr/plugin-jsx` em versões exatas; lockfile passa com `--frozen-lockfile`), G3 (commit `feat(icons): DS-008 ...` em inglês com ID; sem alterações a `CLAUDE.md`, `.claude/`, `.github/` nem `aprovacoes.md`).

**Testes exigidos:** existem e são substantivos — lista de `svg/` vs exports, `size={24}`, ref, className, ausência em `getByRole('img')` sem título, `getByRole('img', { name: 'Close' })` com título, axe nos dois casos. Stories `Gallery`, `Sizes` (16, 20, 24), `WithTitle` e `DarkTheme` existem; o `test:a11y` passa. Teclado e focus não aplicáveis (ícones não interativos). Tema escuro: os ícones herdam `currentColor`.

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):** o teste de `svg/` depende do cwd do pacote (o que `pnpm test` garante). As props em `...rest` vêm depois do ARIA por omissão, por isso o chamador pode substituí-las de propósito. `title=""` é tratado como decorativo.

### DS-006 · Tema no Storybook: toggle e páginas de tokens — Relatório 1 — 2026-10-12

- **Commit testado:** 5ffc6f1 (presente no histórico de `develop`; sem alterações por guardar no início; registo d20db6a por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Instalação | `pnpm install --frozen-lockfile` | ✔ |
| Lint | `pnpm lint` | ✔ |
| Tipos | `pnpm typecheck` (4 pacotes) | ✔ |
| Unitários | `pnpm test` (10 em icons, 89 em tokens, 3 em ui) | ✔ |
| Acessibilidade | `pnpm test:a11y` (5 suites, 13 testes, sem violações) | ✔ |
| Build | `pnpm build` | ✔ |
| Prova negativa | story temporária (não commitada, removida) com `parameters.theme = 'dark'` e texto `--ds-color-neutral-700`: `pnpm test:a11y` falhou por `color-contrast` | ✔ (falha esperada) |

**Critérios de aceitação:**
- [x] `preview.tsx` importa `@ds/tokens/tokens.css` e `@ds/tokens/themes.css` — lido no ficheiro (o `preview.ts` passou a `.tsx`, sem impacto no critério).
- [x] Seletor "Theme" com `light` e `dark` (global `theme`); o decorator `withTheme` põe `data-theme` em `document.documentElement` (via `useLayoutEffect`, reage à mudança sem recarregar) e o body usa `--ds-color-bg-canvas` e `--ds-color-text-default` — lido no código.
- [x] `parameters.theme` tem prioridade sobre `globals.theme` (ordem no decorator); story `Foundations/Theme › DarkTheme` passa no `test:a11y`, e a prova negativa confirma que a story é de facto avaliada em tema escuro. `globals` por story não implementado, o critério admite "ou".
- [x] Convenção `DarkTheme` em `apps/docs/README.md` (secção Themes, com exemplo).
- [x] Páginas Foundations: Colors, Semantic (os dois temas), Spacing, Typography, Radii, Shadows, geradas por `flatten` sobre `tokens`/`themes` — sem listas à mão (lido em `src/foundations/`).
- [x] G1 (lint, typecheck, test, build passam), G2 (única dependência nova: `@ds/tokens` do workspace), G3 (commit `feat(ui): DS-006 ...` em inglês com ID; sem alterações a `CLAUDE.md`, `.claude/`, `.github/` nem `aprovacoes.md`).

**Testes exigidos:** unitários n/a. Acessibilidade: passa em todas as páginas e na `DarkTheme`; prova negativa reproduzida por mim. Stories `Colors`, `Spacing`, `Typography`, `Radii`, `Shadows` e `DarkTheme` existem.

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):** não consegui abrir o browser para observar a troca de tema ao vivo (a escrita do script de verificação foi bloqueada); a conclusão baseia-se na leitura do decorator, que usa `useLayoutEffect` dependente de `theme`, e nos resultados do axe. Contraste verificado pelo axe só nas stories existentes (claro por omissão e escuro na `DarkTheme`). Teclado/focus não aplicáveis (páginas não interativas).

### DS-007 · CSS base, focus visível, `styles.css` agregado e Stylelint — Relatório 1 — 2026-10-12

- **Commit testado:** fdb215a (presente no histórico de `develop`; sem alterações por guardar no início; registo e9551c5 por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Instalação | `pnpm install --frozen-lockfile` | ✔ |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (10 em icons, 89 em tokens, 7 em ui) | ✔ |
| Acessibilidade | `pnpm test:a11y` (6 suites, 15 testes, sem violações) | ✔ |
| Build | `pnpm build` (tsup + `build-css.mjs`) | ✔ |
| Prova negativa | ficheiro temporário (não commitado, removido) com `.button`, hex, nome, `rgb()`, `hsl()`, `px`/`rem`/`em` em margin, padding, gap, border-radius, font-size, box-shadow e `calc(... + 4px)`: 13 erros do Stylelint. Linha com `0`, `1px solid currentColor`, `2px solid transparent`, `50%`, `inherit` e `var(--ds-*)`: sem erros | ✔ (falha esperada) |

**Critérios de aceitação:**
- [x] `base.css`: lido; `box-sizing` e `font-family` só em `[class^='ds-'], [class*=' ds-']`, sem reset global.
- [x] `focus.css`: `.ds-focus-ring:focus-visible` com `outline: 2px solid var(--ds-color-focus-ring)` e `outline-offset`; nenhum `outline: none` no CSS.
- [x] `motion.css`: dentro de `@media (prefers-reduced-motion: reduce)`, duração e atraso de transições e animações a 0 para `ds-*` e `::before`/`::after`.
- [x] `styles.css`: ordem tokens, themes, base, focus, motion (lido; confirmado também no teste de ordem sobre o `dist`).
- [x] `dist/styles.css`: gerado por `pnpm build`, ficheiro único, 0 ocorrências de `@import`, inclui `--ds-color-bg-canvas`, `[data-theme="dark"]` e `--ds-color-focus-ring` (claro `#2563eb`, escuro `#93c5fd`); nenhum `.tsx` importa `.css`.
- [x] Storybook: `apps/docs/.storybook/preview.tsx` importa `packages/ui/src/styles.css` e já não importa os CSS dos tokens diretamente.
- [x] Stylelint: `stylelint.config.js` e passo em `pnpm lint`; regras e exceções verificadas pela prova negativa acima.
- [x] Ficheiro temporário com `color: #ff0000` ou `.button {}` faz o lint falhar: reproduzido por mim.
- [x] G1 (lint, typecheck, test, build passam), G2 (única dependência nova: `stylelint` 17.16.0 exata; lockfile passa com `--frozen-lockfile`), G3 (commit `feat(ui): DS-007 ...` em inglês com ID; sem alterações a `CLAUDE.md`, `.claude/`, `.github/` nem `aprovacoes.md`).

**Testes exigidos:** `styles.test.ts` existe (4 testes sobre `dist/styles.css`: variáveis e `[data-theme="dark"]`, `:focus-visible` e reduced-motion, sem `@import`, ordem) e não é trivial. Stories `FocusRing` e `FocusRing/DarkTheme` existem com botão e ligação nativos com `ds-focus-ring`; `test:a11y` passa. Contraste do anel: `#2563eb` sobre fundo claro e `#93c5fd` sobre fundo escuro, ambos acima de 3:1 pela inspeção dos valores.

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):** não há teste automático que prove que o anel aparece ao premir Tab (jsdom não avalia `:focus-visible` e a story não tem `play`); a verificação assenta na leitura do CSS e nas stories. O `styles.test.ts` regenera o `dist/styles.css` antes de o ler, por isso não prova que o `pnpm build` o gera (verificado à parte). A regra de unidades é uma regex sobre o valor, pelo que `calc()` com `px` também é apanhado. A story usa `style` inline com tokens só para layout.
