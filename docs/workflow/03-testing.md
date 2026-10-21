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

### DS-009 · Utilitários partilhados, helper de axe e teste de convenções — Relatório 1 — 2026-10-13

- **Commit testado:** d729d7e (presente no histórico de `develop`; sem alterações por guardar no início; registo 525463d por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Instalação | `pnpm install --frozen-lockfile` | ✔ |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (10 em icons, 89 em tokens, 25 em ui) | ✔ |
| Acessibilidade | `pnpm test:a11y` (6 suites, 16 testes, incluindo `VisuallyHidden` Default e DarkTheme) | ✔ |
| Build | `pnpm build`; `dist/styles.css` contém `ds-visually-hidden` | ✔ |

**Critérios de aceitação:**
- [x] `cx`: lido `utils/cx.ts` (sem dependências); `cx.test.ts` cobre `('a', false, undefined, 'b')` → `'a b'`, `null`, vazio e sem argumentos.
- [x] `@radix-ui/react-slot` em `dependencies` de `packages/ui`; reexportado em `utils/Slot.ts`.
- [x] `VisuallyHidden`: pasta própria com os cinco ficheiros, classe `ds-visually-hidden`, `clip` + `clip-path`, sem `display: none`, `asChild` via `Slot`, `forwardRef`, `displayName`, `className` somada à base.
- [x] `packages/ui/test/a11y.ts` exporta `expectNoA11yViolations` (vitest-axe); usado em `VisuallyHidden.test.tsx`.
- [x] Polyfills em `test/setup.ts` (setup partilhado): `ResizeObserver`, `hasPointerCapture`/`setPointerCapture`/`releasePointerCapture`, `scrollIntoView`, `matchMedia`.
- [x] `conventions.test.ts`: percorre pastas com maiúscula; verifica os cinco ficheiros, export em `index.ts`, `@import` em `styles.css` e `export const DarkTheme`; passa para `VisuallyHidden`.
- [x] README: secção "How to create a component" com C1 a C5, aponta para `VisuallyHidden`.
- [x] G1 (todos os comandos passam), G2 (novas: `@radix-ui/react-slot`, `vitest-axe`; lockfile com `--frozen-lockfile`), G3 (commit em inglês com ID; sem alterações a ficheiros do João). C1 a C5 para `VisuallyHidden` verificados.

**Testes exigidos:** unitários de `cx`, `VisuallyHidden` (texto, `className`, `ref`, `asChild` sem `<span>` extra, nome acessível de botão só com ícone) e do helper (falha com `<img>` sem `alt`, regex `image-alt`) existem e não são triviais. Stories `Default` e `DarkTheme` existem e passam no axe.

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):** a prova negativa do teste de convenções (remover um ficheiro) não foi repetida por mim, porque o ambiente bloqueou mover ficheiros; baseia-se na leitura (`existsSync` por ficheiro) e no registo do programador. Os polyfills não têm teste próprio. O aviso `getContext` do axe em jsdom é inofensivo. Tema escuro/contraste não aplicáveis ao texto oculto; a story `DarkTheme` passa no axe.

### DS-010 · Button — Relatório 1 — 2026-10-13

- **Commit testado:** dcf7d57 (presente no histórico de `develop`; sem alterações por guardar no início; registo b4b8532 por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (10 icons, 89 tokens, 58 ui) | ✔ |
| Acessibilidade | `pnpm test:a11y` (7 suites, 27 testes, incluindo as stories do Button e o `play` de `Sizes`) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] `<button type="button">` por omissão, `type="submit"` submete: lido `Button.tsx`; testes "renders its text and defaults", "submits a form", "does not submit by default".
- [x] Props `variant`, `size`, `fullWidth`, `leadingIcon`, `trailingIcon`, `asChild`, `disabled` e omissões `primary`/`md`: lido `Button.tsx`; testes por variante e tamanho.
- [x] `data-variant`, `data-size`, classe `ds-button`: lido e testado.
- [x] `asChild` aplica classes, `data-*` e `ref` ao filho, sem `type` e sem `<button>`: teste "renders a link with the class and no type".
- [x] `disabled` sem `asChild`: atributo nativo, `data-disabled`, `onClick` não dispara, Tab salta o botão: testes dedicados.
- [x] `disabled` com `asChild`: `aria-disabled`, `tabindex=-1`, sem `disabled`, clique bloqueado em captura (`defaultPrevented`, nem `onClick` do Button nem do `<a>`), Tab salta a ligação: testes dedicados.
- [x] `data-disabled` nos dois casos e usado no CSS (`.ds-button[data-disabled]`, com `:hover` e `:active` declarados depois das variantes, mesma especificidade, por isso ganham).
- [x] `:hover`, `:active`, `:focus-visible`, desativado nas quatro variantes: lido `Button.css`.
- [x] Alturas: `Button.css` usa `--ds-space-8|10|12` para `sm|md|lg`; `play` de `Sizes` mede ≥ 32/40/48px e passou no `test:a11y` (Chromium).
- [x] Ícones em `<span aria-hidden="true">`, nome acessível só com o texto: testes.
- [x] Ícones com `asChild` via `Slottable` (reexportado em `utils/Slot.ts`), dentro do filho, antes e depois do texto, sem elemento à volta: testes (3 nós filhos, `container.firstElementChild` é a ligação).
- [x] Stories e testes usam `<svg>` próprio; sem dependência do pacote de ícones: lido.
- [x] G1 (todos os comandos passam), G2 (sem dependências novas), G3 (commit em inglês com ID; sem alterações a ficheiros do João). C1 a C5: pasta com os cinco ficheiros, `styles.css` importa `Button.css`, `DarkTheme` existe; `conventions.test.ts` passa.

**Testes exigidos:** unitários, de `disabled`, de ícones com `asChild` e de acessibilidade (axe, Tab, Enter, Espaço, Tab a saltar) existem e não são triviais. Stories pedidas todas presentes: `Primary`, `Secondary`, `Ghost`, `Danger`, `Sizes`, `WithIcons`, `FullWidth`, `Disabled`, `AsLink`, `AsLinkDisabled`, `DarkTheme`.

**Acessibilidade e contraste:** cores usam apenas pares já cobertos por `contrast-pairs.ts` nos dois temas (`text-on-accent` sobre `accent-*`, `danger-text` sobre `danger-subtle` e superfícies, `text-default` sobre superfícies, `border-strong` sobre superfícies); anel de focus via `--ds-color-focus-ring`; estado desativado isento de contraste. `DarkTheme` aplica o tema através do `preview.tsx` e passa no axe.

**Testes adicionados pelo testador:** um teste em `Button.test.tsx` (ligação `asChild` desativada com focus programático: Enter e clique no ícone não chamam `onClick`). Passa. Commit a seguir a este relatório (`test(ui): DS-010 ...`).

**Notas (não são falhas):** `white-space: nowrap` faz texto muito longo transbordar o contentor (não é critério da tarefa). Não há `play` que prove o aspeto de `:hover`/`:active`; verificado por leitura do CSS. O `play` de `Sizes` só falha se a altura for inferior ao mínimo.

### DS-011 · IconButton — Relatório 1 — 2026-10-13

- **Commit testado:** 53148f3 (presente no histórico de `develop`; sem alterações por guardar no início; registo d6936da por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 78 antes do meu teste, 79 depois) | ✔ |
| Acessibilidade | `pnpm test:a11y` (8 suites, 35 testes, incluindo as stories do IconButton e os `play` de `Sizes` e `NextToButton`) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Sobre o `Button`, `icon` como `leadingIcon`, `data-icon-only`, sem duplicar cores nem `disabled`: lido `IconButton.tsx` (só delega no `Button`) e `IconButton.css` (só tamanho).
- [x] `aria-label` obrigatório (ou `aria-labelledby`): união de tipos lida; teste com `@ts-expect-error` e `tsc` (inclui `src`) passa; teste de `aria-labelledby`.
- [x] `icon` obrigatório e dentro de `<span aria-hidden="true">`: teste "renders a button with the icon hidden".
- [x] Dimensões: `IconButton.css` usa `--ds-space-8|10|12` em largura e altura para `sm|md|lg`; `font-size: var(--ds-font-size-md)` (16px) e `IconButton.css` é importado depois de `Button.css` com igual especificidade, por isso ganha a `sm`/`lg`; `padding: 0`. `play` de `Sizes` (quadrado, ≥ 32/40/48) e `NextToButton` (mesma altura) passaram em Chromium.
- [x] `disabled` sem `asChild` nativo, Tab salta: teste dedicado.
- [x] `disabled` com `asChild`: `aria-disabled`, `data-disabled`, `tabindex=-1`, sem `disabled`, `defaultPrevented`, nem `onClick` do IconButton nem do filho, Tab salta: teste dedicado.
- [x] `asChild`: `<a>` raiz com `ds-button`, `data-icon-only`, `<span aria-hidden>` dentro, `getByRole('link', { name: 'Settings' })`: teste; sem elemento à volta: teste acrescentado por mim.
- [x] G1 (todos os comandos passam), G2 (sem dependências novas), G3 (commit em inglês com ID; sem alterações a ficheiros do João). C1 a C5: cinco ficheiros, `export` em `index.ts` e `packages/ui/src/index.ts`, `@import` em `styles.css`, `DarkTheme`; `conventions.test.ts` passa.

**Testes exigidos:** unitários, `asChild`, acessibilidade (axe nos três casos, Tab, Enter, Espaço, disabled fora do Tab) e as stories pedidas (`Default`, `Variants`, `Sizes`, `Disabled`, `AsLink`, `AsLinkDisabled`, `NextToButton`, `DarkTheme`) existem e não são triviais.

**Acessibilidade e contraste:** cores herdadas do `Button` (pares já cobertos pela DS-005 nos dois temas); focus visível herdado de `.ds-button:focus-visible`; `DarkTheme` passa no axe.

**Testes adicionados pelo testador:** um teste em `IconButton.test.tsx` (`asChild` sem wrapper, `aria-label` no filho, sem `type`). Passa. Commit a seguir a este relatório (`test(ui): DS-011 ...`).

**Notas (não são falhas):** `IconButton` com `variant="danger"` e `ghost` em hover não tem `play` visual; verificado por leitura do CSS. `ReactNode` como `icon` não impede texto, só a convenção e a documentação.

### DS-012 · Field — Relatório 1 — 2026-10-13

- **Commit testado:** 4363736 (presente no histórico de `develop`; sem alterações por guardar no início; registo a5f729e por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 105 antes do meu teste, 106 depois) | ✔ |
| Acessibilidade | `pnpm test:a11y` (9 suites, 41 testes, incluindo as seis stories do Field) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Exports `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `useFieldControl` em `Field/index.ts` e `packages/ui/src/index.ts`; o hook devolve `id`, `aria-describedby`, `aria-invalid`, `aria-required`, `disabled` (lido `Field.tsx`, testes com `<input>`).
- [x] `Field` com `id?` (`useId`), `invalid`, `required`, `disabled`, contexto e `data-invalid`/`data-disabled` na raiz: testes "uses the given id", "passes disabled ... data attributes".
- [x] `FieldLabel` com `htmlFor` = id; `*` com `aria-hidden="true"`: testes `getByLabelText` e "passes required ...".
- [x] `aria-describedby` com descrição quando existe e erro só se `invalid`: testes com e sem `invalid`, sem descrição, sem ambos; teste acrescentado por mim para a alternância dinâmica.
- [x] `FieldError` só no DOM quando `invalid`, token `--ds-color-danger-text`, texto (não só cor): teste `queryByText` e `Field.css`.
- [x] Fora de um `Field` o hook devolve vazio e as partes não falham: dois testes.
- [x] G1 (todos os comandos passam), G2 (sem dependências novas), G3 (commit em inglês com ID; sem alterações a ficheiros do João). C1 a C5: cinco ficheiros, `export` nos dois `index.ts`, `@import` em `styles.css`, `DarkTheme`; `conventions.test.ts` passa.

**Testes exigidos:** unitários (getByLabelText, describedby com e sem `invalid`, erro ausente do DOM, `disabled`, ids distintos), acessibilidade (axe em normal, inválido, desativado e obrigatório; clique na etiqueta foca; `toHaveAccessibleDescription` com descrição + erro) e stories (`Default`, `WithDescription`, `Required`, `Invalid`, `Disabled`, `DarkTheme`) existem e não são triviais.

**Acessibilidade e contraste:** `text-default`, `text-muted`, `danger-text` e `text-disabled` (só na etiqueta, de controlo desativado) sem violações no axe em Chromium; `DarkTheme` passa. O Field não tem elementos interativos próprios, por isso não há navegação por teclado a verificar além do foco via etiqueta.

**Testes adicionados pelo testador:** um teste em `Field.test.tsx` (aria-describedby ao alternar `invalid` e ao remover a descrição com `rerender`). Passa. Commit a seguir a este relatório (`test(ui): DS-012 ...`).

**Notas (não são falhas):** `FieldError` sem `role="alert"` (decisão documentada; anúncio dinâmico fica como sugestão ao planeador). A descrição mantém `text-muted` quando desativado. Texto muito longo quebra normalmente (sem `nowrap`).

### DS-013 · Input — Relatório 1 — 2026-10-13

- **Commit testado:** 97b7644 (presente no histórico de `develop`; sem alterações por guardar no início; registo 9e9ded0 por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 140 antes dos meus testes, 142 depois) | ✔ |
| Acessibilidade | `pnpm test:a11y` (10 suites, 51 testes, incluindo as 10 stories do Input com os `play` de altura) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] `<input>` nativo, `type` por omissão `text`, seis tipos aceites, `ref` aponta para o `<input>`: testes `it.each` de tipos e "forwards the ref".
- [x] Props `size` (HTML `size` omitido por `Omit`), `invalid`, `leadingAddon`, `trailingAddon`: lido `Input.tsx`; testes de `data-size` e de `invalid`.
- [x] Dentro de `Field`: `id`, `aria-describedby`, `aria-invalid`, `aria-required`, `disabled` automáticos; props diretas ganham: testes de etiqueta, erro, disabled e prioridade; acrescentei dois testes (`invalid={false}` dentro de `Field invalid`; `aria-invalid="false"` e `aria-required={false}` explícitos).
- [x] Controlado (três chamadas a `onChange`) e não controlado (`defaultValue`), sem avisos na consola: teste com espiões em `console.error` e `console.warn`.
- [x] Estados em `Input.css`: `:hover`, `:focus-visible` (via `:has`, outline no contorno), disabled, readOnly, `data-invalid` com `danger-default`, placeholder `text-muted`. Contraste estimado a partir dos tokens: claro, borda `#64748b` e `#dc2626` sobre `#ffffff` ≈ 4,8:1 (≥ 3:1), placeholder `#475569` sobre branco e sobre `#f1f5f9` ≥ 6:1; escuro, borda `#94a3b8` e `#f87171` sobre `#1e293b` ≥ 5:1, placeholder `#cbd5e1` sobre `#334155` ≥ 7:1 (≥ 4,5:1).
- [x] Addons `aria-hidden="true"`, dentro do contorno, clique foca o input: teste com `user.click` nos dois addons.
- [x] Alturas: `Input.css` declara `--ds-space-8`, `--ds-space-10`, `--ds-space-12` no contorno (`.ds-input`); `Sizes` mede ≥ 32/40/48px e `WithButton` confirma altura igual à do `Button` (tolerância 0,5px); ambas passam no test runner (Chromium).
- [x] G1 (todos os comandos passam), G2 (sem dependências novas), G3 (commit em inglês com ID; sem alterações a ficheiros do João). C1 a C5: cinco ficheiros, `export` nos dois `index.ts`, `@import` em `styles.css`, `DarkTheme`.

**Testes exigidos:** unitários (digitar "abc" nos dois modos, `defaultValue`, disabled, readOnly, `data-size`, ref, `className`, Field com `aria-invalid` e `aria-describedby` do erro), acessibilidade (axe com `aria-label` e com `Field` em três estados; `getByLabelText`; Tab; disabled saltado) e stories (`Default`, `Sizes`, `WithButton`, `WithField`, `WithAddons`, `Invalid`, `Disabled`, `ReadOnly`, `Password`, `DarkTheme`) existem e não são triviais.

**Acessibilidade e contraste:** Tab foca o `<input>` e o outline de 2px é desenhado no contorno (verificado no CSS, não visualmente); os addons são `aria-hidden` e não focáveis; `DarkTheme` passa no axe.

**Testes adicionados pelo testador:** dois testes em `Input.test.tsx` (prioridade de `invalid={false}` e de `aria-invalid`/`aria-required` explícitos sobre o `Field`). Passam. Commit a seguir a este relatório (`test(ui): DS-013 ...`).

**Notas (não são falhas):** `className` vai para o `<input>` e o contorno não aceita classe própria (sugestão do programador para o planeador: `wrapperClassName`). O `Button sm` renderiza ~35,5px (por conteúdo) e o `Input sm` acompanha-o por usar o mesmo `padding-block`. A altura em px não é verificável em jsdom; a verificação é feita pelos `play` das stories.

### DS-015 · Checkbox — Relatório 1 — 2026-10-14

- **Commit testado:** 4467da0 (presente no histórico de `develop`; sem alterações por guardar no início; registo 8a8d08d por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 167 antes dos meus testes, 170 depois; Checkbox: 20) | ✔ |
| Acessibilidade | `pnpm test:a11y` (11 suites, 59 testes, incluindo as oito stories do Checkbox) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Usa `@radix-ui/react-checkbox`; `role="checkbox"` e `aria-checked` `true`/`false`/`mixed`: lido `Checkbox.tsx`; testes de role, `defaultChecked` e `checked="indeterminate"` → `mixed`.
- [x] Props `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`, `size` (`sm`/`md`, omissão `md`) e `children` como etiqueta: tipo derivado do Root Radix + `size`/`invalid`/`children`; testes de `data-size` e de etiqueta.
- [x] Controlado e não controlado; `FormData` com `name`: testes de alternância, "only changes in controlled mode when the prop changes" e `FormData`; acrescentei remoção do valor ao desmarcar e ausência quando `disabled`.
- [x] Indicador com `CheckIcon`/`MinusIcon` de `@ds/icons`, alternados por CSS via `data-state`; `data-state` exposto na raiz e no indicador: lido `Checkbox.tsx` e `Checkbox.css`; teste do indicador.
- [x] Integração com `Field` (id, `aria-describedby`, `aria-invalid`, `aria-required`, `disabled`, prioridade das props diretas): três testes. Área clicável: `<label>` com `min-width/min-height: --ds-space-6` (24px); a story `Sizes` mede >= 24x24 no Chromium e passa.
- [x] G1 (todos os comandos passam), G2 (`@radix-ui/react-checkbox` nomeada; `@ds/icons` é workspace, exigido pelo critério dos ícones; `pnpm install --frozen-lockfile` passa e lockfile commitado), G3 (commit em inglês com ID; nenhum ficheiro do João alterado). C1 a C5: cinco ficheiros, `export` nos dois `index.ts`, `@import` em `styles.css`, `DarkTheme`, `autodocs`; só `var(--ds-*)` e todos os tokens usados existem em `tokens/dist` (claro e escuro).

**Testes exigidos:** unitários (alternar, controlado, `mixed`, etiqueta, `disabled`, `FormData`), acessibilidade (axe; Tab; Espaço alterna; Enter não; `getByRole('checkbox', { name: 'I accept the terms' })`; Tab salta `disabled`) e stories (`Default`, `Checked`, `Indeterminate`, `Disabled`, `Sizes`, `WithField` com descrição e erro, `Group` com "Select all" indeterminado, `DarkTheme`) existem e não são triviais.

**Acessibilidade e contraste:** focus via `:focus-visible` com `--ds-color-focus-ring` (outline 2px; 5,2:1 no claro, mais no escuro). Contraste estimado a partir dos tokens: borda `#64748b` sobre `#ffffff` ≈ 4,8:1 (claro) e `#94a3b8` sobre `#1e293b` ≥ 5:1 (escuro); marca branca sobre `#2563eb` ≈ 5,2:1 e `#0f172a` sobre `#60a5fa` ≥ 7:1; etiqueta desativada em `text-muted`. Axe passa nas stories em Chromium, incluindo `DarkTheme`. Enter não alterna (APG).

**Testes adicionados pelo testador:** três testes em `Checkbox.test.tsx` (clique em indeterminada pede `true` e mantém `mixed` em controlado; `FormData` ao desmarcar e com `disabled`; Espaço e clique na etiqueta em controlado dentro de `Field`). Passam. Commit 4085eca (`test(ui): DS-015 ...`).

**Notas (não são falhas):** `className` vai para o botão e o `<label>` exterior não aceita classe própria (sugestão do programador: `labelClassName`). A etiqueta desativada usa `text-muted` em vez de `text-disabled` por causa do axe. As stories usam estilos inline para o layout, como as de Button e Input (precedente; C3 refere o `.css` do componente).

### DS-018 · Select — Relatório 1 — 2026-10-14

- **Commit testado:** 74464f5 (presente no histórico de `develop`; sem alterações por guardar no início, além do meu registo de estado; registo cbb02b3 por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 207 antes dos meus testes, 212 depois; Select: 34) | ✔ |
| Acessibilidade | `pnpm test:a11y` (12 suites, 69 testes, incluindo as 10 stories do Select e os `play`) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Exporta `Select`, `SelectItem`, `SelectGroup`, `SelectSeparator`: lido `Select/index.ts` e `src/index.ts`; `@import` em `styles.css`.
- [x] Props de `Select` (`value`, `defaultValue`, `onValueChange`, `open`, `defaultOpen`, `onOpenChange`, `placeholder`, `disabled`, `required`, `name`, `size`, `invalid`); `ref` e `className` no gatilho: lido `Select.tsx`; testes de ref/className/data-size, `open` controlado, invalid.
- [x] `SelectItem` (`value`, `disabled`, `children`) e `SelectGroup` (`label` obrigatório): tipos lidos; teste de grupos e separadores.
- [x] Gatilho `role="combobox"`, `aria-expanded`, `ChevronDownIcon`; lista `role="listbox"` em portal (teste "portal"), `z-index: var(--ds-z-dropdown)` (token existe, 1000), `min-width: var(--radix-select-trigger-width)`; item selecionado com `CheckIcon` e `aria-selected="true"`: testes e CSS. O nome `z-index-dropdown` do critério corresponde ao token real `--ds-z-dropdown`.
- [x] Controlado e não controlado; `FormData`: testes existentes; acrescentei controlado que ignora `onValueChange` e `FormData` com `disabled`.
- [x] Integração com `Field`: etiqueta, `aria-describedby`, `aria-invalid`, `aria-required`, `disabled`, prioridade das props diretas: três testes.
- [x] Mesma borda, raio e estados do `Input`: comparado `Select.css` com `Input.css` (borda `border-strong`, `radius-md`, hover, invalid, disabled, focus-visible idênticos).
- [x] Alturas: `Select.css` declara `--ds-space-8/10/12` por `data-size`; `Sizes` mede ≥ 32/40/48px e igualdade com `Input` (tolerância 0,5px); passa no Chromium.
- [x] G1 a G3 (dependência `@radix-ui/react-select` nomeada na tarefa; commit em inglês com ID; nenhum ficheiro do João alterado); C1 a C5 (cinco ficheiros, exports, `@import`, `DarkTheme`, `autodocs`, só tokens `var(--ds-*)`).

**Testes exigidos:** unitários (placeholder, `defaultValue`, selecionar chama `onValueChange` e fecha, controlado, item desativado, `disabled`, `FormData`), acessibilidade (axe fechada e aberta; Enter, Espaço, setas abrem; setas, Home, End, letra; Enter/Espaço selecionam e devolvem o focus; Esc; desativados saltados) e as dez stories pedidas existem e não são triviais (`Sizes` e `KeyboardInteraction` com `play` que lançam erro se falharem).

**Acessibilidade e contraste:** focus via `:focus-visible` com `--ds-color-focus-ring` (outline 2px, igual ao Input). `DarkTheme` com lista aberta passa no axe. Contraste só estimado a partir dos tokens (iguais aos do Input; rótulo de grupo em `text-muted`).

**Testes adicionados pelo testador:** cinco testes em `Select.test.tsx` (controlado ignora a mudança do pai; `FormData` ausente com `disabled` e presente depois; `onOpenChange` e retirada do `tabindex="-1"` ao fechar; axe com etiqueta muito longa; select desativado saltado no Tab). Passam. Commit f7552ff (`test(ui): DS-018 ...`).

**Notas (não são falhas):** o `play` de `KeyboardInteraction` usa `KeyboardEvent` despachados (sem `@storybook/test`), mas o teste unitário com `user-event` cobre todos os atalhos. O `tabIndex={-1}` com a lista aberta é uma solução deliberada para o axe (`aria-hidden-focus`); testado que é retirado ao fechar. O gatilho tem `width: 100%`.

### DS-014 · Textarea — Relatório 1 — 2026-10-15

- **Commit testado:** 3ece050 (presente no histórico de `develop`; sem alterações por guardar no início, além do meu registo de estado; registo 69bfe4a por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 240 antes dos meus testes, 248 depois; Textarea: 20 + 8 de CSS) | ✔ |
| Acessibilidade | `pnpm test:a11y` (13 suites, 76 testes, incluindo as 7 stories do Textarea e o `play` de `Sizes`) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] `<textarea>` nativo; `size`, `invalid`, `rows` (omissão 3), `resize` (omissão `vertical`, `data-resize`): lido `Textarea.tsx`; testes de elemento nativo, rows, data-resize, data-size, invalid.
- [x] Mesmos tokens e estados do `Input`, sem valores literais: comparado `Textarea.css` com `Input.css` (borda, raio, hover, focus-visible, inválido, só de leitura, desativado, placeholder); font-size e padding-inline por `size` idênticos. Só há literais `1px`/`2px` (borda e outline), iguais aos do `Input`. Teste novo compara estas propriedades com o CSS do `Input`.
- [x] Alturas: `Textarea.css` declara `min-height` `--ds-space-8/10/12` por `data-size` e não declara `height`; `Sizes` mede no Chromium `rows={1}` >= 32/40/48px e igual ao `Input` (tolerância 0,5px), e `rows` por omissão maior que o mínimo; passa. Redimensionar não desce abaixo do mínimo (`min-height` no CSS).
- [x] Integração com `Field` (id, `aria-describedby`, `aria-invalid`, `aria-required`, `disabled`, prioridade das props diretas, clique na etiqueta): cinco testes.
- [x] Controlado e não controlado sem avisos: teste que espia `console.error`/`warn` nos dois modos.
- [x] G1 a G3 (sem dependências novas; commit em inglês com ID; nenhum ficheiro do João alterado); C1 a C5 (cinco ficheiros, exports nos dois `index.ts`, `@import` em `styles.css`, `DarkTheme`, `autodocs`, só `var(--ds-*)`).

**Testes exigidos:** unitários (quebras de linha, controlado, `defaultValue`, rows, `data-resize`, `disabled`, `readOnly`, ref `HTMLTextAreaElement`, `Field invalid`), acessibilidade (axe em todos os estados; Tab foca e salta `disabled`; `getByLabelText`; Enter insere `\n` e não submete) e as sete stories pedidas existem e não são triviais.

**Acessibilidade e contraste:** focus via `:focus-visible` com `--ds-color-focus-ring` (outline 2px, igual ao Input). Axe passa em Chromium nas stories, incluindo `DarkTheme` (padrão, só de leitura, desativado, inválido). Contraste só estimado: usa os mesmos tokens do `Input`.

**Testes adicionados pelo testador:** `Textarea.css.test.ts` (8 casos: `min-height` por tamanho sem `height`, paridade de font-size/padding/borda/raio/line-height com o `Input`, sem cores literais). Passam. Commit 6f8a97f (`test(ui): DS-014 ...`).

**Notas (não são falhas):** a igualdade de altura com o `Input` só é medida no Chromium (jsdom não calcula layout); o `play` de `Sizes` cobre-a. O redimensionamento pelo utilizador não é testado de forma automática.

### DS-016 · RadioGroup — Relatório 1 — 2026-10-15

- **Commit testado:** 4aa0448 (presente no histórico de `develop`; sem alterações por guardar no início, além do meu registo de estado; registo 7cf5927 por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 284 antes dos meus testes, 291 depois; RadioGroup: 35) | ✔ |
| Acessibilidade | `pnpm test:a11y` (14 suites, 84 testes, incluindo as 8 stories do RadioGroup) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Exporta `RadioGroup` (`role="radiogroup"`) e `Radio` (`role="radio"`, etiqueta via `children`): lido `RadioGroup/index.ts`, `src/index.ts`, `@import` em `styles.css`; teste de roles e nomes.
- [x] Props de `RadioGroup` (`value`, `defaultValue`, `onValueChange`, `name`, `disabled`, `required`, `orientation` com omissão `vertical` e `aria-orientation`; nome por `aria-label` ou `aria-labelledby` obrigatório no tipo `RadioGroupName`): lido `RadioGroup.tsx`; testes de orientação, `aria-labelledby`; acrescentei `required` (`aria-required="true"`).
- [x] `Radio`: `value` obrigatório no tipo, `disabled`, `size` `sm`/`md`: lido; teste de `data-size`, desativado.
- [x] Controlado e não controlado; `FormData` com `name`: testes existentes; acrescentei controlado que ignora a mudança do pai, `FormData` ausente com grupo `disabled` e sem seleção.
- [x] Tabindex itinerante: um só ponto de tabulação, no selecionado ou no primeiro ativo; Tab e Shift+Tab testados. Inspecionado o DOM: o `div radiogroup` tem `tabindex="0"` e os botões `-1`; o Radix reencaminha o focus para o rádio selecionado (ver notas). Acrescentei: grupo desativado é saltado no Tab.
- [x] Integração com `Field` (`aria-describedby` com descrição e erro, `aria-invalid`, `disabled`, prioridade das props diretas): três testes.
- [x] G1 a G3 (dependência `@radix-ui/react-radio-group` nomeada na tarefa e em `package.json`; commit em inglês com ID; nenhum ficheiro do João alterado); C1 a C5 (cinco ficheiros, exports, `@import`, `DarkTheme`, `autodocs`). `RadioGroup.css` só usa `var(--ds-*)` (verificado que todos os tokens existem em `tokens.css`/`themes.css`), exceto `1px`/`2px` de borda e outline, como nos outros componentes.

**Testes exigidos:** unitários (clique seleciona e desmarca, `onValueChange`, `defaultValue`, controlado, rádio e grupo `disabled`, `FormData`), acessibilidade (axe; Tab entra no selecionado e o seguinte sai; setas baixo/direita e cima/esquerda movem e selecionam; volta nos dois sentidos; desativados saltados; Espaço) e as stories pedidas (`Default`, `Horizontal`, `WithDefaultValue`, `DisabledItem`, `DisabledGroup`, `WithField` com erro, `DarkTheme`, mais `Sizes`) existem. Os testes de setas verificam focus e `aria-checked`, não são triviais.

**Acessibilidade e contraste:** focus via `:focus-visible` com `--ds-color-focus-ring` (outline 2px, offset 2px) no botão; área clicável mínima 24px (`min-height`/`min-width` `--ds-space-6`). `DarkTheme` (com rádio desativado e grupo inválido) passa no axe no Chromium. Texto desativado em `text-muted` para manter AA. Contraste só estimado a partir dos tokens; não medi rácios.

**Testes adicionados pelo testador:** sete testes em `RadioGroup.test.tsx` (controlado ignora o pai; `FormData` ausente com grupo `disabled`; `FormData` ausente sem seleção; `required`; grupo desativado saltado no Tab; Espaço no rádio já selecionado não dispara `onValueChange`; axe com etiquetas muito longas e os dois tamanhos). Passam. Commit 66977bf (`test(ui): DS-016 ...`).

**Notas (não são falhas):**
- O ponto de tabulação no DOM é o contentor `radiogroup` (`tabindex="0"`), que reencaminha o focus para o rádio certo; nenhum botão tem `tabindex="0"` antes de receber focus. O comportamento observável cumpre o critério (comportamento padrão do Radix), mas só foi verificado em jsdom, não num teste de teclado no Chromium.
- As setas só selecionam em jsdom com a tecla mantida premida (helper `press`); o comportamento em browser real não foi exercitado por um `play`.
- `FieldLabel` não nomeia o grupo (`htmlFor` num `div`); a story `WithField` usa `aria-labelledby` com um `<span>`. Sugestão já feita pelo programador para o planeador.
- `Radio` fora de um `RadioGroup` falha (contexto do Radix).

### DS-017 · Switch — Relatório 1 — 2026-10-16

- **Commit testado:** 3fbd332 (presente no histórico de `develop`; sem alterações por guardar no início; registo 094a2fc por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 313 antes dos meus testes, 320 depois; Switch: 13 + 7 de CSS) | ✔ |
| Acessibilidade | `pnpm test:a11y` (15 suites, 90 testes, incluindo as 6 stories do Switch) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] `@radix-ui/react-switch`; raiz `<button role="switch">` com `aria-checked` e `data-state`: lido `Switch.tsx` e `package.json`; teste de role, tagName, `aria-checked` e `data-state`.
- [x] Props `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `required`, `name`, `value`, `size` (`sm`/`md`, omissão `md`), `children` como etiqueta: lido o tipo (herda as props do Radix; `size` e `children` próprios); testes de `data-size`, etiqueta, ref/className.
- [x] Controlado e não controlado; `FormData`: testes de controlado (ignora o clique sem mudança do pai), com pai com estado, `defaultChecked`, e `FormData` com valor quando ligado, ausente quando desligado ou `disabled`.
- [x] Estado pela posição do manípulo: `Switch.css` aplica `translateX` (inset à esquerda; largura menos manípulo menos inset à direita) quando `data-state='checked'`; teste novo. Contraste (calculado com os valores de `themes.css`, fórmula WCAG; o teste novo repete o cálculo):

| Par | Claro | Escuro |
| --- | --- | --- |
| Pista desligada (`border-strong`) vs `bg-canvas` / `bg-surface` | 4,55 / 4,76 | 7,1 / 5,7 |
| Pista ligada (`accent-default`) vs `bg-canvas` / `bg-surface` | ~4,7 / ~5,2 | ~7,3 / ~5,9 |
| Manípulo desligado (`bg-surface`) vs pista | 4,76 | 5,7 |
| Manípulo ligado (`text-on-accent`) vs pista (também em hover) | >= 5 | ~7,3 |

  Todos >= 3:1 (valores aproximados na tabela; o teste afirma >= 3 para todos, incluindo hover da pista ligada).
- [x] `prefers-reduced-motion`: as transições da pista e do manípulo usam `--ds-duration-fast` em classes `ds-*`, e `styles/motion.css` (importado em `styles.css`) põe `transition-duration: 0s !important` com `reduce`; teste novo confirma as duas pontas. Não executado num browser com a preferência ativa.
- [x] Integração com `Field`: `id`, `aria-describedby`, `aria-required`, `disabled`, prioridade das props diretas: dois testes.
- [x] G1 a G3 (dependência `@radix-ui/react-switch` nomeada na tarefa e em `package.json`/`pnpm-lock.yaml`; commit em inglês com ID; nenhum ficheiro do João alterado); C1 a C5 (cinco ficheiros, exports nos dois `index.ts`, `@import` em `styles.css`, stories `Default`, `Checked`, `Disabled`, `Sizes`, `WithField`, `DarkTheme`, `autodocs`; `Switch.css` só usa `var(--ds-*)` exceto o outline de 2px).

**Testes exigidos:** unitários (clique, `onCheckedChange`, controlado, `defaultChecked`, etiqueta, `disabled`, `FormData`), acessibilidade (axe com os quatro estados e `Field`; Tab foca; Espaço e Enter alternam; `getByRole('switch', { name })`; Tab salta o desativado) e as seis stories existem; `Sizes` tem `play` que mede a área clicável (>= 24px) no Chromium. Não são triviais.

**Acessibilidade e contraste:** focus via `:focus-visible` com `--ds-color-focus-ring` (outline 2px, offset 2px; teste novo). Axe passa em jsdom e em Chromium nas stories, incluindo `DarkTheme` (com os dois estados desativados). Etiqueta desativada em `text-muted` (igual ao Checkbox).

**Estado desativado:** pista `border-default` e manípulo `text-disabled`, o que dá aproximadamente 1,5:1 (claro) e 1,1:1 (escuro) da pista face ao fundo, e ~1,7:1 (claro) e ~2,7:1 (escuro) do manípulo face à pista. Está abaixo de 3:1, mas os componentes inativos estão isentos de WCAG 1.4.11, o critério da tarefa refere o contraste de forma geral sem tratar o desativado à parte, e o padrão é o mesmo do `Checkbox`. Considerado nota, não falha. Os estados ligado/desligado desativados distinguem-se só pela posição do manípulo (as cores são iguais), o que cumpre 1.4.1.

**Testes adicionados pelo testador:** `Switch.css.test.ts` (7 casos: contraste >= 3:1 de pista e manípulo nos dois temas, sobre canvas e surface, incluindo hover; tokens assumidos; manípulo desloca-se quando ligado; transições cobertas pela regra de movimento reduzido; focus ring). Passam. Commit 443b3ec (`test(ui): DS-017 ...`).

**Notas (não são falhas):**
- O contraste do estado desativado (acima) fica abaixo de 3:1 por isenção; se o João quiser a pista desativada visível no tema escuro (cerca de 1,1:1 face a `bg-surface`), é decisão de design a propor ao planeador.
- O `Switch` não tem `invalid`/`aria-invalid` (a tarefa não o pede).
- O movimento reduzido e a posição real do manípulo não foram medidos num browser; a verificação é sobre o CSS.
- O `<label>` envolvente e um `FieldLabel` com `htmlFor` podem nomear o mesmo controlo duas vezes; o axe não se queixa.

### DS-019 · Badge — Relatório 1 — 2026-10-16

- **Commit testado:** 15b540c (presente no histórico de `develop`; sem alterações por guardar no início; registo 9b63d26 por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 357, 18 ficheiros; Badge: 20 em `Badge.test.tsx` + `Badge.css.test.ts`) | ✔ |
| Acessibilidade | `pnpm test:a11y` (16 suites, 96 testes, incluindo as 6 stories do Badge no Chromium com axe) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] `<span class="ds-badge">`, props `variant` (omissão `neutral`), `appearance` (omissão `subtle`), `size`, `asChild`: lido `Badge.tsx`; testes de tag, classe, omissões, cada valor e `asChild` com `<a>`.
- [x] `data-variant`, `data-appearance`, `data-size`: lido o código e testados em todos os valores.
- [x] Contraste de texto >= 4,5:1 nas 12 combinações por tema: `Badge.css.test.ts` lê os tokens atribuídos em `Badge.css` e os valores de `themes.css` (claro e escuro), calcula a razão WCAG e falha se algum token não existir; mais axe com `color-contrast` em Chromium nas stories `Variants`, `Solid` e `DarkTheme` (sem violações).
- [x] Sem `role`: lido o código e teste `not.toHaveAttribute('role')`.
- [x] `white-space: nowrap`, `max-width: 100%`, `overflow: hidden`, `text-overflow: ellipsis`: lido o CSS e testado por regex; a story `LongText` tem `play` que mede no Chromium que o badge não excede o contentor e que o texto é cortado (passou no test runner).
- [x] G1 (cinco comandos verdes por mim); G2 (sem dependências novas, lockfile inalterado); G3 (commit em inglês com ID; ficheiros alterados nos 9 do `git show`, nenhum do João); C1 (cinco ficheiros mais `index.ts`, exports nos dois `index.ts`, `@import` em `styles.css`, teste de convenções passa); C2 (`forwardRef`, `displayName`, `className` acrescentada, props nativas); C3 (só `ds-*` e `var(--ds-*)`, `data-*`, Stylelint passa; sem estilos inline no componente); C4 (axe unitário, stories com `DarkTheme` em `pnpm test:a11y`, focus com `:focus-visible` e `--ds-color-focus-ring`); C5 (`Default`, `Variants`, `Solid`, `Sizes`, `LongText`, `DarkTheme`, `autodocs`, JSDoc nas props).

**Testes exigidos:** unitários (texto, omissões, variantes, aparências, tamanhos, `className`, `ref`, `asChild` com `<a>`), acessibilidade (axe nas 12 combinações com `getByText`) e as stories pedidas existem. Não são triviais: o contraste e a regra de linha única têm verificação própria e a `LongText` mede o resultado real no browser.

**Acessibilidade e casos limite:** `DarkTheme` usa `parameters.theme`, que o `preview.tsx` aplica em `data-theme`. Texto muito longo é cortado com reticências; badge vazio e `disabled` não se aplicam. Sem modo controlado (componente estático). Props nativas depois de `data-*` no JSX deixam o consumidor sobrepor `data-*` (comportamento comum aos outros componentes).

**Testes adicionados pelo testador:** nenhum; a cobertura existente chega para os critérios.

**Notas (não são falhas):**
- No jsdom o axe não mede `color-contrast`; a medição real vem do `test:a11y` (Chromium) e do cálculo em `Badge.css.test.ts`.
- Com `asChild` sobre `<a>` não há estilo de hover, só `:focus-visible` (referido pelo programador). O focus ring de 2px não foi medido numericamente (3:1) por ser o mesmo token dos restantes componentes.
- A `LongText` só tem o `play` no Chromium; não há teste unitário de layout (jsdom não calcula layout).

### DS-025 · Dialog (Modal) — Relatório 1 — 2026-10-19

- **Commit testado:** e1c2909 (presente no histórico de `develop`; sem alterações por guardar no início; registo 5ac7b7d por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 393 antes dos meus testes, 19 ficheiros; Dialog: `Dialog.test.tsx` + `Dialog.css.test.ts` = 35 depois) | ✔ |
| Acessibilidade | `pnpm test:a11y` (17 suites, 105 testes, incluindo as stories do Dialog no Chromium com axe) + teclado | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Exports dos nove componentes: lido `Dialog.tsx` e `index.ts` (componente e raiz, incluindo tipos); `DialogTrigger` e `DialogClose` aceitam `asChild` (testes usam-no).
- [x] Props de `Dialog` e `DialogContent`: lido o código (omissões `size=md`, `closeLabel="Close"`, `closeOnOverlayClick=true`; `ref`/`className`); testes de `defaultOpen`, controlado (com e sem atualização do pai), `closeLabel`, `hideClose`, `size` em `data-size`, `ref`/`className`.
- [x] ARIA: testes `getByRole('dialog', {name})`, `aria-modal="true"`, descrição ligada, ausência de `aria-describedby` e de aviso na consola sem descrição (o aviso do Radix para falta de título mantém-se).
- [x] Portal, overlay e z-index: teste de portal fora do `container`; `Dialog.css.test.ts` (novo) confirma `z-index: var(--ds-z-modal)` no overlay e no conteúdo, `--ds-color-overlay` no overlay e que todos os tokens usados existem em `tokens.css`/`themes.css`. Scroll bloqueado (`data-scroll-locked`) e conteúdo de fundo `aria-hidden` testados.
- [x] Focus ao abrir (primeiro focável) e regresso ao gatilho: testes unitários e story `KeyboardInteraction` (play em Chromium, passou no test runner).
- [x] Ecrãs estreitos e scroll interno: CSS lido e coberto por regex em `Dialog.css.test.ts` (`min(largura, 100vw - space-8)`, `max-height` com `dvh`, `overflow-y: auto` no corpo, `flex: 0 0 auto` em cabeçalho e rodapé); story `LongContent` com axe no Chromium. Layout real não medido (jsdom).
- [x] `prefers-reduced-motion`: as animações estão em `Dialog.css`; `styles/motion.css` anula `animation-duration` para todos os `[class^='ds-']`, que cobre as classes do Dialog; verificado por leitura e teste CSS (não medido em browser).
- [x] Gatilho desativado: testes com `Button disabled` e `IconButton disabled` (clique, Enter, Espaço; `onOpenChange` não chamado; sem `role="dialog"`) e Tab que salta o gatilho (Before para After); story `DisabledTrigger`.
- [x] G1 (cinco comandos verdes por mim); G2/G3 (dependência `@radix-ui/react-dialog` nomeada na tarefa, lockfile atualizado, commit em inglês com ID, nenhum ficheiro do João alterado); C1 (cinco ficheiros, exports, `@import` em `styles.css`); C2 (`forwardRef`, `displayName`, `className`); C3 (só tokens: confirmado pelo novo teste CSS, sem cores ou rem soltos; Stylelint passa); C4 (axe unitário aberto, stories incl. `DarkTheme` no `test:a11y`, `:focus-visible` com `--ds-color-focus-ring`); C5 (stories `Default`, `Sizes`, `WithForm`, `LongContent`, `Confirmation`, `NoOverlayClose`, `DisabledTrigger`, `KeyboardInteraction`, `DarkTheme`).

**Testes exigidos:** existem e testam o comportamento (abrir, `defaultOpen`, controlado, fecho por botão/`DialogClose`/overlay, `closeOnOverlayClick={false}`, `hideClose`, `size`, disabled, focus preso com Tab e Shift+Tab, Esc, regresso do focus, axe). Não são triviais.

**Acessibilidade e casos limite:** contraste nos dois temas coberto pelo axe do Chromium nas stories (incluindo `DarkTheme` aberto); sem título, o Radix avisa (comportamento exigido); sem descrição, sem `aria-describedby`; modo controlado e não controlado cobertos.

**Testes adicionados pelo testador:** `packages/ui/src/Dialog/Dialog.css.test.ts` (6 casos: tokens existentes, z-index/overlay, largura em ecrã estreito, scroll interno, sem valores soltos, cobertura de movimento reduzido, focus ring). Passam. Commit `test(ui): DS-025 add Dialog CSS tests`.

**Notas (não são falhas):**
- A story `KeyboardInteraction` usa eventos `KeyboardEvent` sintéticos (como a do Select), não teclas reais do browser; o focus preso é também testado com `userEvent` em jsdom.
- Movimento reduzido e layout estreito verificados por CSS, não por medição em browser.

### DS-026 · DropdownMenu — Relatório 1 — 2026-10-19

- **Commit testado:** d1f8738 (presente no histórico de `develop`; sem alterações por guardar no início; registo f8853c8 por cima)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 22 ficheiros, 438 testes; DropdownMenu: 33 com os 3 meus em `DropdownMenu.extra.test.tsx`) | ✔ |
| Acessibilidade | `pnpm test:a11y` (18 suites, 114 testes, stories no Chromium com axe, incluindo `DarkTheme` aberto) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Exports dos sete componentes: lido `DropdownMenu.tsx`; `DropdownMenuTrigger` aceita `asChild` (usado nos testes).
- [x] Props: `open`/`defaultOpen`/`onOpenChange`; `side='bottom'` e `align='start'` por omissão; `ref`, `className`; item com `onSelect`, `disabled`, `variant` (`data-variant`), `leadingIcon`. Verificado por leitura e testes.
- [x] ARIA: `aria-haspopup="menu"`, `aria-expanded` (sincronização testada por mim com Esc), `role="menu"`, `role="menuitem"`; portal fora do container; `z-index: var(--ds-z-dropdown)` no CSS e no teste CSS.
- [x] `data-highlighted` com focus real: os testes de teclado verificam `toHaveFocus` e `data-highlighted`; o CSS usa `[data-highlighted]`, não `:hover`.
- [x] Seleção: `onSelect` + fecho + focus no gatilho (clique, Enter e Espaço); item desativado com `aria-disabled="true"` sem `onSelect` (clique e Enter, teste meu).
- [x] Danger: `danger-text`; contraste AA coberto pelo axe do Chromium (`DangerItem`, `OnIconButton`, `DarkTheme`); com ícone (`Trash2Icon` na story `DangerItem`) a distinção não depende só da cor.
- [x] Gatilho desativado (`Button` e `IconButton`): não abre com clique, Enter, Espaço nem Seta para baixo; `onOpenChange` não chamado; Tab salta o gatilho (Before para After) sem `role="menu"`; story `DisabledTrigger`.
- [x] G1 (cinco comandos verdes por mim); G2/G3 (dependência `@radix-ui/react-dropdown-menu` nomeada na tarefa, lockfile alterado, commit em inglês com ID, nenhum ficheiro do João alterado); C1 (ficheiros, exports, `@import` em `styles.css`); C2 (`forwardRef`, `displayName`, `className`); C3 (só tokens; teste CSS e Stylelint passam; `sideOffset=4` é número passado ao Radix); C4 (axe unitário aberto, stories no `test:a11y`, realce por `data-highlighted`); C5 (as nove stories exigidas existem, `KeyboardInteraction` com `play`).

**Sobre `modal={false}`:** a especificação não exige comportamento modal (nada sobre inércia da página, bloqueio de scroll ou `aria-hidden` no fundo). Exige abrir/fechar, clicar fora fecha (testado), Esc, Tab fecha, focus no gatilho ao fechar e axe sem violações com o menu aberto. Tudo isto cumpre-se. O modo não modal evita `aria-hidden` sobre o gatilho focável (regra `aria-hidden-focus`) e está documentado no código. Não é falha. Nota de design: a página atrás continua com scroll e interativa enquanto o menu está aberto.

**Testes exigidos:** existem todos (fechado por omissão, abrir, `onSelect`, desativado, controlado, clicar fora, label/separator, gatilho desativado; Enter/Espaço/Seta para baixo com primeiro item focado, setas com salto de desativados, Home/End, letra, Enter/Espaço, Esc, Tab, Tab a saltar gatilho desativado, axe). Usam `userEvent` e `toHaveFocus`; não são triviais.

**Acessibilidade e casos limite:** teclado completo; contraste nos dois temas via axe no Chromium (`DarkTheme` aberto); gatilho e item desativados; modo controlado e não controlado (incluindo Tab em modo controlado); `open={false}` controlado.

**Testes adicionados pelo testador:** `packages/ui/src/DropdownMenu/DropdownMenu.extra.test.tsx` (3 casos: Tab fecha menu controlado com `onOpenChange(false)`; item desativado não chama `onSelect` com clique nem Enter; `aria-expanded` sincronizado). Passam; Prettier e ESLint limpos. Commit 988926b `test(ui): DS-026 add DropdownMenu controlled Tab, disabled item and aria-expanded tests`.

**Notas (não são falhas):**
- A story `KeyboardInteraction` usa `KeyboardEvent` sintéticos, como as de Select e Dialog; o teclado real está nos testes unitários.
- Layout real do popper (colisões) não medido em browser.

### DS-032 · Table: estrutura base — Relatório 1 — 2026-10-19

- **Commit testado:** 6d8452a (presente no histórico de `develop`; a761a32 por cima; sem alterações por guardar no início)
- **Resultado:** Reprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 25 ficheiros, 466 testes) | ✔ |
| Acessibilidade | `pnpm test:a11y` (19 suites, 123 testes, axe no Chromium) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Exports e elementos nativos (`table`, `caption`, `thead`, `tbody`, `tr`, `th`, `td`) — lido `Table.tsx`, `index.ts` e `packages/ui/src/index.ts`; teste de estrutura com `:scope >`.
- [x] `Table`: `size` (omissão `md`), `striped`, `stickyHeader` em `data-*`; contentor `ds-table-container` com `overflow: auto`, `role="region"`, `tabIndex=0`, nome obrigatório no tipo (união `aria-label` | `aria-labelledby`) — lido o CSS e o código; testes de região e `aria-labelledby`.
- [x] `TableHeaderCell` (`scope` col/row, `align`) e `TableCell` (`align`, `numeric` com `tabular-nums` e alinhamento ao fim) — código, CSS e testes.
- [x] `TableCaption visuallyHidden` — `data-visually-hidden` e CSS de ocultação.
- [x] `TableRow selected` — `aria-selected` e `data-selected` testados.
- [x] Contraste de striped/hover/selecionado — `text-default` sobre `bg-subtle`/`accent-subtle` (tokens: claro #0f172a sobre #f1f5f9/#eff6ff; escuro #f8fafc sobre #334155/#1e3a8a, bem acima de 4.5:1); axe passa nas stories.
- [x] G1 a G3 e C1 a C5 — cinco comandos verdes; commit em inglês com ID; só tokens no CSS (teste CSS e Stylelint); `forwardRef`, `displayName`, `className`; as nove stories existem.
- [ ] Teste exigido de acessibilidade: "as setas esquerda/direita fazem scroll horizontal quando a tabela é mais larga do que o contentor" — FALHA: não existe nenhum teste (nem unitário, nem `play` na story `HorizontalScroll`, que não tem `play`). Só se testa que Tab foca o contentor. O programador reconhece a lacuna nas notas.

**Falhas:**
1. Falta o teste exigido do scroll horizontal com as setas (esperado: teste em browser real, por exemplo `play` na story `HorizontalScroll` ou teste Playwright, que foca o contentor, prime ArrowRight e verifica `scrollLeft > 0`, e ArrowLeft que o reduz; obtido: nenhum). Ficheiro provável: `packages/ui/src/Table/Table.stories.tsx` (story `HorizontalScroll`). Passos: abrir `HorizontalScroll`, ver que não há `play` nem teste a cobrir o scroll por teclado.

**Testes adicionados pelo testador:** nenhum. Tentei validar o scroll com Playwright num script temporário, mas o ambiente não permitiu criá-lo; o comportamento não ficou verificado por mim.

**Notas (não são falhas):**
- `TableCaption` com `visuallyHidden` usa `position: absolute` sem ancestral posicionado; sugere-se `position: relative` no contentor para evitar escapar ao scroll. Não bloqueia.
- Sem `className` nem props para o contentor `ds-table-container` (sugestão do programador para o planeador).
- `stickyHeader` só tem efeito com `--ds-table-max-height` definida; sem medição em browser.

### DS-032 · Table: estrutura base — Relatório 2 — 2026-10-19

- **Commit testado:** f83f5cf (presente no histórico de `develop`; 4245322 por cima; sem alterações por guardar no início)
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 25 ficheiros, 466 testes) | ✔ |
| Acessibilidade | `pnpm test:a11y` (19 suites, 123 testes, axe no Chromium) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Todos os critérios do relatório 1 mantêm-se verificados (diff 6d8452a..HEAD só toca em `test-runner.ts` e numa linha de `Table.css`; unitários e axe continuam verdes).
- [x] Teste exigido das setas com scroll horizontal: `postVisit` em `apps/docs/.storybook/test-runner.ts` para `components-table--horizontal-scroll` confirma `scrollWidth > clientWidth`, foca a região, `scrollLeft` inicial 0, `ArrowRight` real do Playwright leva `scrollLeft > 0`, `ArrowLeft` devolve a 0. Verificado por mutação: com `scrollLeft > 99999` o `test:a11y` falha (1 falhado, 122 passados); com `> 0` passa. Mutação revertida, árvore limpa.
- [x] Nota do relatório 1 tratada: `position: relative` em `.ds-table-container` (stylelint e teste CSS verdes).

**Falhas:** nenhuma.

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):**
- O teste das setas vive no `test-runner.ts`, não na story; só corre em `pnpm test:a11y`.
- Continua sem `className`/props para o contentor `ds-table-container` (sugestão ao planeador) e `stickyHeader` depende de `--ds-table-max-height`.

### DS-050 · Pacotes do workspace resolvidos a partir do código-fonte — Relatório 1 — 2026-10-19

- **Commit testado:** fd42d21 (código) e 82b593f (registo), ambos no histórico de `develop`; sem alterações por guardar no início
- **Resultado:** Aprovado

Nota de método: o ambiente não permitiu criar um clone novo fora do repositório. Equivalente usado: `rm -rf packages/tokens/dist packages/icons/dist packages/ui/dist apps/docs/storybook-static` antes de cada comando (node_modules já instalado).

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Tipos (sem dist/) | `pnpm typecheck` | ✔ |
| Unitários (sem dist/) | `pnpm test` (ui: 25 ficheiros, 466 testes) | ✔ |
| Lint (sem dist/) | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Build | `pnpm build` | ✔ |
| Build docs (sem dist/ nem storybook-static) | `pnpm build:docs` | ✔ |
| Acessibilidade (sem dist/ de icons/ui) | `pnpm test:a11y` (19 suites, 123 testes) | ✔ |

**Critérios de aceitação:**
- [x] Inventário: tabela em `02-desenvolvimento.md` cobre ui→icons, ui→tokens (TS/CSS), docs→tokens, docs→ui (explicado: sem importação por nome) e icons indireto nas stories, com tipo e resolução.
- [x] Sem `dist/`: typecheck, test e lint com código 0, cada um isolado, após remover `dist/` e `storybook-static/`.
- [x] `pnpm build:docs` com código 0 sem `dist/`; o bundle contém o `CheckIcon` (path do ícone) e as stories Checkbox/Select passam no axe sem `dist/` de icons. Storybook interativo não aberto (sem browser): verificação visual manual não feita por mim, coberta indiretamente por build e test:a11y.
- [x] `pnpm build` com código 0; ficheiros em `dist/` iguais aos listados pelo programador (tokens 5, icons 6, ui 7).
- [x] `grep -nE "icons/src|packages/icons|src/index|IconBase|@ds/icons" packages/ui/dist/*.d.ts *.d.cts` sem resultados. `dist/index.js` e `index.cjs` importam `@ds/icons` pelo nome.
- [x] `main`, `module`, `types`, `import`, `require`, `types` de `exports` mantêm-se em `dist/`; única entrada nova: `"source"` em `packages/icons/package.json`. `require.resolve('@ds/icons')` e `import.meta.resolve` (a partir de `packages/ui`, após build) dão `packages/icons/dist/index.{cjs,js}`. Variante a partir de `apps/docs` não aplicável (o docs não declara estes pacotes), como o programador justificou.
- [x] `pnpm test:a11y` passa (123).
- [x] Verificação de regressão registada em `02-desenvolvimento.md` com comandos e códigos.
- [x] `.github/` intocado (`git diff --stat fd42d21~1 HEAD` só toca em configs, `packages/ui/test/global-setup.ts` e docs de workflow).
- [x] G1 a G3: sem dependências novas (nenhum `package.json` de dependências nem lockfile alterado).

**Testes exigidos:**
- Sem testes novos exigidos; o `pnpm test` sem `dist/` prova a resolução (globalSetup gera os tokens).
- Prova negativa (temporária, revertida, não commitada): `size?: number | string` para `size?: boolean` em `packages/icons/src/IconBase.tsx`; `pnpm --filter @ds/ui typecheck` falhou com TS2322 a apontar para `../icons/src/IconBase.tsx`. Revertido, `git status` só mostra os registos de workflow.

**Falhas:** nenhuma.

**Testes adicionados pelo testador:** nenhum.

**Notas (não são falhas):**
- O `globalSetup` do Vitest corre o build dos tokens em cada `pnpm test` do ui (custo pequeno); `@ds/tokens` segue a solução (a) aceite.
- O typecheck do `ui` passa a verificar também o código-fonte de `icons` (erros de icons aparecem em `ui`).
- O João pode reverter a reordenação provisória do `ci.yml`, como o programador sugere.

### DS-033 · Table: ordenação — Relatório 1 — 2026-10-20

- **Commit testado:** 754b37b (código) e 1db3668 (registo), no histórico de `develop`; sem alterações por guardar no início. Teste acrescentado em 36069f2.
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 27 ficheiros, 488 testes; 493 com os do testador) | ✔ |
| Acessibilidade | `pnpm test:a11y` (19 suites, 128 testes, axe no Chromium, inclui `DarkTheme`) + testes de teclado | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Props `sortable`/`sortDirection`/`onSort`, `<button>` dentro do `<th>`, `aria-sort` — lido o diff de `Table.tsx`; `TableSort.test.tsx` verifica ascending/descending/none.
- [x] Ícones ArrowUp/ArrowDown/ArrowUpDown, decorativos — `aria-hidden="true"` testado; teste do testador confirma que os três ícones são distintos; estado comunicado por `aria-sort`.
- [x] Hook `useTableSort` exportado de `packages/ui` (`src/index.ts`, tipos incluídos), devolve `{ sortedData, sort, getSortProps }`, controlado e não controlado — lido o código e `useTableSort.test.tsx`; build gera `.d.ts` com o hook.
- [x] Ciclo asc → desc → nenhum e uma coluna de cada vez — testes do hook e teste de DOM com o hook.
- [x] Ordenação por omissão (números, strings com `Intl.Collator` numeric/base, datas, nulos no fim nas duas direções) e `compare` próprio — testes do hook; código lido.
- [x] Estável (também em desc) e sem mutar `data` — testes do hook; código ordena uma cópia.
- [x] G1 a G3, C1 a C5 — sem dependências novas, sem cores/espaços à mão no CSS (só tokens), testes e stories na pasta `Table`.

**Testes exigidos:** todos existem e não são triviais. Hook: ciclo, mudar de coluna, números, acentos, datas, nulos, `compare`, estabilidade, não mutação, controlado. Componente: `onSort` por clique/Enter/Espaço, `aria-sort`, sem botão nos não ordenáveis. Acessibilidade: axe, Tab pela ordem das colunas, focus mantido, ordem das linhas no DOM. Stories `Sortable`, `SortableControlled`, `DefaultSort`, `CustomCompare`, `SortKeyboardInteraction` (com `play`) e `DarkTheme` com tabela ordenável presentes e verdes no `test:a11y`.

**Falhas:** nenhuma.

**Testes adicionados pelo testador:** `packages/ui/src/Table/TableSort.extra.test.tsx` (ícone distinto por direção, `aria-sort="none"` por omissão, sem botão com `sortDirection` sem `sortable`, clique sem `onSort`, ref e `className`).

**Notas (não são falhas):**
- O `play` de `SortKeyboardInteraction` usa `focus()` + `click()`; Enter e Espaço reais só estão nos testes unitários (limitação já indicada pelo programador).
- Props do utilizador são espalhadas depois de `aria-sort`, por isso um `aria-sort` passado manualmente sobrepõe-se ao calculado.
- Contraste do ícone e do focus nos dois temas coberto por axe nas stories; não foi feita inspeção visual (sem browser interativo).

### DS-020 · Spinner e Skeleton — Relatório 1 — 2026-10-20

- **Commit testado:** 5374d91 (código) e 9ae85cd (registo), no histórico de `develop`; sem alterações por guardar no início. Testes acrescentados em e34014a.
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 30 ficheiros, 533 testes; 545 com os do testador) | ✔ |
| Acessibilidade | `pnpm test:a11y` (21 suites, 137 testes, axe no Chromium, inclui `DarkTheme` dos dois) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] `Spinner`: `size`, `label` (omissão "Loading"), `role="status"` com nome = `label`, SVG `aria-hidden`, `currentColor` — código lido; testes de nome por omissão, `label`, `data-size`, `aria-hidden`; teste do testador confirma só `currentcolor` no CSS.
- [x] `Skeleton`: `variant` (omissão `text`), `width`/`height` por `--ds-skeleton-width`/`--ds-skeleton-height`, `lines` na variante `text`, `aria-hidden="true"` — código e testes lidos (números em px, strings tal como vêm, `lines` ignorado fora de `text`).
- [x] `prefers-reduced-motion: reduce` — lido o CSS: o Spinner fica com `animation: none` e visível; o Skeleton esconde o brilho (`display: none`). A regra global de `motion.css` não interfere. jsdom não avalia media queries: testes de CSS do testador verificam as regras; sem emulação em browser.
- [x] Cada componente na sua pasta com C1 — `Spinner/` e `Skeleton/` com `.tsx`, `.test.tsx`, `.stories.tsx`, `index.ts`; exportados em `index.ts` e `styles.css`.
- [x] G1 a G3, C1 a C5 — sem dependências novas, só tokens no CSS (testado), `forwardRef`, `className`, `displayName`, JSDoc.

**Testes exigidos:** todos existem e não são triviais: `role="status"` e nome por omissão, `label` personalizado, `data-size`, `lines={3}` com três linhas, custom properties, ref e `className` nos dois; `getByRole('status', { name })`; Skeleton fora da árvore de acessibilidade (`isInaccessible`); Tab sem focus; axe. Stories `Spinner/Sizes`, `CustomLabel`, `DarkTheme` e `Skeleton/Text`, `Rect`, `Circle`, `CardPlaceholder`, `DarkTheme` presentes e verdes no `test:a11y`.

**Falhas:** nenhuma.

**Testes adicionados pelo testador:** `Spinner/Spinner.css.test.ts` (rotação por omissão, `animation: none` em reduced motion sem esconder, `currentColor`, tokens por tamanho) e `Skeleton/Skeleton.css.test.ts` (brilho removido em reduced motion, custom properties, sem cores à mão).

**Notas (não são falhas):**
- Reduced motion verificado por leitura e testes do CSS, não por emulação num browser; contraste e aspeto nos dois temas só por axe nas stories (sem inspeção visual).
- `Spinner` com `aria-label` do consumidor: o `aria-labelledby` fica a ganhar na computação do nome, a menos que o consumidor também o sobreponha.
- O `Skeleton` com `lines` limita o mínimo a 1 e arredonda para baixo (0 ou negativos dão uma linha).

### DS-021 · Button: estado `loading` — Relatório 1 — 2026-10-21

- **Commit testado:** f9ada3d (código) e 333c98a (registo), no histórico de `develop`; sem alterações por guardar no início. Testes acrescentados em 83967fe.
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 32 ficheiros, 555 testes; 561 com os do testador) | ✔ |
| Acessibilidade | `pnpm test:a11y` (21 suites, 141 testes, axe no Chromium) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Props `loading` e `loadingLabel` (omissão "Loading"), herdadas pelo `IconButton` — `Button.tsx` lido; `IconButton` passa por `...props`; teste do `IconButton` com `loading`.
- [x] `aria-busy`, `aria-disabled`, `data-loading`, sem `disabled` nem `tabindex="-1"`, na ordem de Tab — testes do bloco `loading` e teste de Tab.
- [x] Diferença face a `disabled` no JSDoc de `loading` e `disabled` e na descrição de `Button/Loading` — lido no código e nas stories.
- [x] Clique bloqueado na captura: `fireEvent.click` devolve `false`, `onClick` não dispara, submit bloqueado com rato, Enter e Espaço; teste do testador confirma que o `onClickCapture` do consumidor só corre sem `loading`.
- [x] Spinner no span `aria-hidden` do `leadingIcon`, criado se não existir, `trailingIcon` intacto, `IconButton` continua quadrado — testes; CSS de `data-icon-only` usa largura e altura fixas por tokens.
- [x] `asChild` + `loading`: atributos, foco, clique cancelado (`onClick` do `Button` e do `<a>`), Spinner antes do texto sem elemento extra — testes; o testador acrescentou `trailingIcon` mantido e `disabled` + `loading` com `asChild` (`tabindex="-1"`, Spinner visível, fora do Tab).
- [x] Nome e descrição: nome continua "Save", descrição "Loading", `loadingLabel` próprio, `aria-describedby` acrescentado ("Hint Loading"). O testador verificou também com `asChild`, com `aria-describedby` passado ao `Button` e posto no próprio filho: ambos dão "Hint Loading" (a nota do programador sobre o filho se sobrepor não se confirma).
- [x] Resultado da ação não anunciado pelo botão: dito no JSDoc de `loading` e na descrição de `Button/Loading`.
- [x] Largura: Spinner `sm` = `--ds-space-4` (16px), igual aos ícones das stories; o `play` de `LoadingToggle` mede a largura antes e depois; sem `leadingIcon` só cresce o Spinner mais o espaçamento (por construção). Verificação por leitura de CSS e `play`, sem inspeção visual.
- [x] `disabled` + `loading`: atributo `disabled` presente, Spinner visível, `cursor: progress` só em `:not([data-disabled])`.
- [x] G1 a G3, C1 a C5 — testes, stories e JSDoc nos ficheiros existentes; só tokens no CSS novo; sem dependências novas.

**Testes exigidos:** todos existem e testam o comportamento pedido (atributos, `defaultPrevented`, submit, Tab loading vs disabled no mesmo teste, descrição acessível, `asChild`, `IconButton`, axe incluindo `asChild`). Stories `Button/Loading`, `LoadingToggle` (com `play`), `AsLinkLoading`, `IconButton/Loading` e loading em `Button/DarkTheme` presentes e verdes no `test:a11y`.

**Falhas:** nenhuma.

**Testes adicionados pelo testador:** `packages/ui/src/Button/Button.loading.test.tsx` (6: `asChild` com `trailingIcon`, `asChild` + `disabled` + `loading`, `aria-describedby` no `Button` e no filho com `asChild`, remoção dos atributos ao terminar o loading, `onClickCapture` do consumidor).

**Notas (não são falhas):**
- Contraste e aspeto nos dois temas só por axe nas stories (sem inspeção visual); o `play` de `LoadingToggle` usa `focus()` + `click()`, Enter e Espaço reais só nos testes unitários.
- Com um `leadingIcon` de largura diferente de 16px o botão muda de largura ao entrar em loading; limitação já indicada pelo programador.

### DS-022 · Alert — Relatório 1 — 2026-10-21

- **Commit testado:** 1d99eb1 (código) e 28158cd (registo), no histórico de `develop`; sem alterações por guardar no início (só as minhas de registo depois). Testes acrescentados no commit `test(ui): DS-022 …`.
- **Resultado:** Aprovado

| Verificação | Comando ou método | Resultado |
| --- | --- | --- |
| Lint | `pnpm lint` (ESLint + Stylelint + Prettier) | ✔ |
| Tipos | `pnpm typecheck` | ✔ |
| Unitários | `pnpm test` (ui: 35 ficheiros, 594 testes; 600 com os do testador) | ✔ |
| Acessibilidade | `pnpm test:a11y` (22 suites, 149 testes, axe no Chromium) | ✔ |
| Build | `pnpm build` | ✔ |

**Critérios de aceitação:**
- [x] Props `variant` (omissão `info`), `title`, `icon`, `onClose`, `closeLabel` (omissão "Close") — `Alert.tsx` lido; ícones `InfoIcon`, `CircleCheckIcon`, `TriangleAlertIcon`, `CircleXIcon` importados de `@ds/icons`; teste confirma 4 ícones diferentes.
- [x] `role`: `alert` em `danger`/`warning`, `status` em `info`/`success`; `role` personalizado prevalece — testes por variante e com `role` personalizado.
- [x] Botão de fechar só com `onClose`, é `IconButton` com `XIcon`; o Alert não se esconde — testes (sem botão, um clique = uma chamada, continua no DOM); teste do testador: `type="button"`, não submete formulário.
- [x] Ícone num `span aria-hidden`; variante comunicada por forma do ícone e texto — testes e leitura do código.
- [x] Contraste AA sobre `*-subtle` nos dois temas — `Alert.css.test.ts` (≥ 4,5:1 com os valores reais de `themes.css`); estado hover do botão (`bg-subtle`) lido: `*-text` sobre `bg-subtle` continua acima de 4,5:1 por inspeção dos valores; axe nas stories verde, incluindo `DarkTheme`.
- [x] G1 a G3, C1 a C5 — pasta `Alert/` completa (tsx, test, stories, index), exportado em `index.ts` e `styles.css`, CSS só com tokens, `forwardRef`, `className`, JSDoc.

**Testes exigidos:** todos existem e testam o comportamento (role, ícone, `icon={false}`, botão, `onClose`, `closeLabel`, Tab, Enter e Espaço com `userEvent`, axe nas 4 variantes). Stories `Info`, `Success`, `Warning`, `Danger`, `WithoutTitle`, `Dismissible`, `LongContent`, `DarkTheme` presentes e verdes no `test:a11y`.

**Falhas:** nenhuma.

**Testes adicionados pelo testador:** `packages/ui/src/Alert/Alert.edge.test.tsx` (6: `ReactNode` em título e descrição, `icon={false}` sem conteúdo, botão `type="button"`, fechar dentro de `<form>` não submete, ordem de Tab antes/dentro/depois, `role` personalizado + palavra longa + axe).

**Notas (não são falhas):**
- Aspeto visual e contraste real nos dois temas só por cálculo sobre os tokens e axe nas stories (sem inspeção visual); quebra de palavras longas (`overflow-wrap: anywhere`) verificada por leitura do CSS.
- Como `{...props}` vem depois de `data-variant`, um `data-variant` passado pelo consumidor sobrepõe-se ao interno; caso extremo fora da especificação.
