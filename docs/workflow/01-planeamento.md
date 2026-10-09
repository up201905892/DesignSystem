# 01 · Planeamento

Fonte da verdade do projeto: todas as tarefas existem aqui. Só o `planeador` cria ou altera especificações; os outros agentes só atualizam a coluna **Estado** da tabela e o **Histórico** da tarefa.

Estados: `Proposta` → `Planeado` → `Em desenvolvimento` → `Pronto para teste` → `Em teste` → `Aprovado` → `Concluído` (desvios: `Reprovado` → `Em desenvolvimento`; `Proposta` → `Rejeitada`).

## Tabela-índice

| ID | Tarefa | Fase do MVP | Prioridade | Depende de | Estado |
| --- | --- | --- | --- | --- | --- |
| DS-001 | Monorepo pnpm, TypeScript strict, ESLint e Prettier | Fundações | Alta | — | Proposta |
| DS-002 | Vitest + Testing Library e build com tsup | Fundações | Alta | DS-001 | Proposta |
| DS-003 | Storybook 8 com addon-a11y e `pnpm test:a11y` | Fundações | Alta | DS-002 | Proposta |
| DS-004 | Tokens primitivos com Style Dictionary | Fundações | Alta | DS-002 | Proposta |
| DS-005 | Tokens semânticos e temas claro/escuro | Fundações | Alta | DS-004 | Proposta |
| DS-006 | Tema no Storybook: toggle e páginas de tokens | Fundações | Alta | DS-003, DS-005 | Proposta |
| DS-007 | CSS base, focus visível, `styles.css` agregado e Stylelint | Fundações | Alta | DS-006 | Proposta |
| DS-008 | Pacote de ícones (subconjunto do Lucide com SVGR) | Fundações | Alta | DS-003 | Proposta |
| DS-009 | Utilitários partilhados, helper de axe e teste de convenções | Fundações | Alta | DS-007 | Proposta |
| DS-010 | Button | Formulários | Alta | DS-009 | Proposta |
| DS-011 | IconButton | Formulários | Alta | DS-008, DS-010 | Proposta |
| DS-012 | Field (label, descrição e mensagem de erro) | Formulários | Alta | DS-009 | Proposta |
| DS-013 | Input | Formulários | Alta | DS-012 | Proposta |
| DS-014 | Textarea | Formulários | Média | DS-013 | Proposta |
| DS-015 | Checkbox | Formulários | Alta | DS-008, DS-012 | Proposta |
| DS-016 | RadioGroup | Formulários | Média | DS-012 | Proposta |
| DS-017 | Switch | Formulários | Média | DS-012 | Proposta |
| DS-018 | Select | Formulários | Alta | DS-008, DS-012 | Proposta |
| DS-019 | Badge | Overlays e feedback | Média | DS-009 | Proposta |
| DS-020 | Spinner e Skeleton | Overlays e feedback | Média | DS-009 | Proposta |
| DS-021 | Button: estado `loading` | Overlays e feedback | Média | DS-010, DS-020 | Proposta |
| DS-022 | Alert | Overlays e feedback | Média | DS-011 | Proposta |
| DS-023 | Tooltip | Overlays e feedback | Média | DS-011 | Proposta |
| DS-024 | Popover | Overlays e feedback | Média | DS-011 | Proposta |
| DS-025 | Dialog (Modal) | Overlays e feedback | Alta | DS-011 | Proposta |
| DS-026 | DropdownMenu | Overlays e feedback | Alta | DS-011 | Proposta |
| DS-027 | Toast | Overlays e feedback | Média | DS-011 | Proposta |
| DS-028 | Stack e Grid | Layout e dados | Média | DS-009 | Proposta |
| DS-029 | Card | Layout e dados | Média | DS-009 | Proposta |
| DS-030 | Tabs | Layout e dados | Média | DS-009 | Proposta |
| DS-031 | Accordion | Layout e dados | Média | DS-008, DS-009 | Proposta |
| DS-032 | Table: estrutura base | Layout e dados | Alta | DS-009 | Proposta |
| DS-033 | Table: ordenação | Layout e dados | Alta | DS-008, DS-032 | Proposta |
| DS-034 | Pagination | Layout e dados | Média | DS-011 | Proposta |
| DS-035 | DataTable: Table com ordenação e paginação integradas | Layout e dados | Média | DS-033, DS-034 | Proposta |
| DS-036 | Metadados dos pacotes: `exports`, `sideEffects`, `files` e licença | Publicação | Alta | DS-008, DS-009 | Proposta |
| DS-037 | Changesets: versionamento e changelog | Publicação | Alta | DS-036 | Proposta |
| DS-038 | Limite de tamanho de bundle (< 5 kB gzip por componente) | Publicação | Alta | DS-036, DS-010 a DS-035 | Proposta |
| DS-039 | Verificação do pacote: `pnpm pack`, publint e projeto consumidor | Publicação | Alta | DS-037, DS-038 | Proposta |
| DS-040 | Auditoria final de acessibilidade (WCAG 2.1 AA) | Publicação | Alta | DS-010 a DS-035 | Proposta |
| DS-041 | Preparação da versão 1.0.0 e guia de publicação manual | Publicação | Alta | DS-039, DS-040 | Proposta |
| DS-042 | Página "Getting started" no Storybook | Documentação | Alta | DS-006, DS-036 | Proposta |
| DS-043 | Guias de temas, tokens e acessibilidade | Documentação | Média | DS-042 | Proposta |
| DS-044 | App de exemplo: estrutura, layout e tema | Documentação | Alta | DS-036, DS-010 a DS-035 | Proposta |
| DS-045 | App de exemplo: formulário e tabela de dados | Documentação | Alta | DS-044 | Proposta |
| DS-046 | README do repositório e dos pacotes | Documentação | Média | DS-042, DS-045 | Proposta |

## Decisões aplicadas

Linhas de `aprovacoes.md` já tratadas pelo planeador (evita aplicar a mesma decisão duas vezes).

| Data da decisão | Decisão | IDs | Aplicada em |
| --- | --- | --- | --- |

## Decisões técnicas

Decisões do João que condicionam as especificações. Não são linhas de `aprovacoes.md`; ficam aqui para que qualquer agente (ou leitor) saiba porque é que as tarefas estão escritas assim.

| Data | Origem | Tema | Decisão |
| --- | --- | --- | --- |
| 2026-10-09 | conversa | Primitivos de comportamento | **Radix UI**, um pacote `@radix-ui/react-*` por primitivo. Componentes simples (Button, Input, Badge, Stack, etc.) não usam Radix, exceto `@radix-ui/react-slot` para `asChild`. |
| 2026-10-09 | conversa | Estilos | **CSS simples + CSS variables**. Um `.css` por componente, classes com prefixo `ds-` (ex.: `ds-button`), variantes/tamanhos/estados por atributos `data-*`, sem valores escritos à mão (só tokens). O pacote `ui` publica um `styles.css` agregado; zero runtime de CSS-in-JS. |
| 2026-10-09 | conversa | Tokens | **Style Dictionary** (JSON → CSS variables + exportação TypeScript). Temas claro e escuro via `[data-theme]`, com fallback para `prefers-color-scheme`. |
| 2026-10-09 | conversa | Ícones | **Subconjunto do Lucide** (20–30 SVG, licença ISC, com atribuição), convertidos em componentes React com SVGR em `packages/icons`, com API própria (`size`, `title`, `aria-hidden` por omissão). |

Decisões ainda pendentes (cada uma está assinalada na tarefa que afeta): nome do scope npm `@<utilizador>` (DS-036), licença dos pacotes (DS-036), língua dos textos por omissão e da documentação (DS-010, DS-042).

### Critérios comuns

Para não repetir o mesmo texto 46 vezes, cada tarefa refere estes critérios pelo código. Valem como critérios de aceitação da tarefa que os cita.

**Gerais (todas as tarefas):**

- **G1 · Verificações verdes.** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:a11y` e `pnpm build` saem com código 0. Um script que ainda não foi criado (os scripts nascem nas tarefas DS-001 a DS-003) conta como "não aplicável" nessa tarefa, não como falha.
- **G2 · Dependências controladas.** A tarefa só acrescenta as dependências que a especificação nomeia; `pnpm-lock.yaml` fica atualizado e commitado, e `pnpm install --frozen-lockfile` passa.
- **G3 · Commits.** Conventional Commits com o ID da tarefa (ex.: `feat(ui): DS-010 Button com variantes e tamanhos`). Nenhum ficheiro do João é alterado (`CLAUDE.md`, `.claude/`, `.github/`, `docs/workflow/aprovacoes.md`).

**Componentes (tarefas que criam ou alteram um componente em `packages/ui`):**

- **C1 · Estrutura.** Pasta `packages/ui/src/<Componente>/` com `<Componente>.tsx`, `<Componente>.test.tsx`, `<Componente>.stories.tsx`, `<Componente>.css` e `index.ts`; o componente e os seus tipos de props são exportados em `packages/ui/src/index.ts`; o `.css` entra no `styles.css` agregado. O teste de convenções (DS-009) passa.
- **C2 · API base.** `forwardRef` para o elemento DOM raiz, `displayName` definido, `className` do consumidor acrescentada à classe base (nunca a substitui) e as restantes props nativas passam para o elemento raiz.
- **C3 · Estilos.** O `.css` usa só classes `ds-*` e `var(--ds-*)`; variantes, tamanhos e estados são atributos `data-*`; não há cores, espaçamentos, raios nem sombras escritos à mão (o Stylelint da DS-007 passa); não há estilos inline nem CSS-in-JS.
- **C4 · Acessibilidade.** Teste unitário com axe sem violações; todas as stories passam `pnpm test:a11y`, incluindo a story `DarkTheme` (tema escuro); texto com contraste ≥ 4,5:1 e limites de controlos e indicador de focus ≥ 3:1 nos dois temas; focus visível com `:focus-visible` e os tokens de focus; os padrões de teclado seguem o WAI-ARIA Authoring Practices Guide (APG).
- **C5 · Stories.** Uma story por variante e estado listados na tarefa, mais a story `DarkTheme`, com `tags: ['autodocs']` e descrição das props via JSDoc.

## Especificações

<!--
Modelo de tarefa (copiar para cada nova tarefa):

### DS-000 · Título curto

- **Fase do MVP:** Fundações | Formulários | Overlays e feedback | Layout e dados | Publicação | Documentação
- **Prioridade:** Alta | Média | Baixa
- **Depende de:** DS-00X, DS-00Y (ou —)
- **Estimativa:** S (≤ 2h) | M (≤ 1 dia) | L (≤ 3 dias); tarefas maiores dividem-se

**Objetivo:** uma ou duas frases sobre o que fica feito e porquê.

**Critérios de aceitação:**
- [ ] critério verificável 1
- [ ] critério verificável 2

**Testes exigidos:**
- Unitários: o que testar (renderização, props, eventos)
- Acessibilidade: axe sem violações; navegação por teclado (que teclas, que resultado)
- Visual/Storybook: stories obrigatórias (variantes, estados, tema escuro)

**Fora de âmbito:** o que não faz parte desta tarefa.

**Histórico:**
- AAAA-MM-DD · planeador · criada como Proposta
-->

### DS-001 · Monorepo pnpm, TypeScript strict, ESLint e Prettier

- **Fase do MVP:** Fundações
- **Prioridade:** Alta
- **Depende de:** —
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** criar o esqueleto do monorepo com os quatro workspaces e as verificações estáticas, para que todas as tarefas seguintes tenham onde pôr código e o CI tenha o que correr.

**Critérios de aceitação:**
- [ ] `package.json` na raiz com `"private": true`, `"packageManager": "pnpm@10.x"` (versão exata) e `"engines": { "node": ">=22" }`.
- [ ] `pnpm-workspace.yaml` declara `packages/*` e `apps/*`; existem `packages/tokens`, `packages/ui`, `packages/icons` e `apps/docs`, cada um com `package.json` (`"private": true`, nomes provisórios `@ds/tokens`, `@ds/ui`, `@ds/icons` e `docs`) e um `src/index.ts` mínimo.
- [ ] `tsconfig.base.json` na raiz com `"strict": true`, `"noUncheckedIndexedAccess": true`, `"jsx": "react-jsx"` e `"moduleResolution": "bundler"`; cada workspace tem um `tsconfig.json` que o estende.
- [ ] `pnpm typecheck` corre `tsc --noEmit` em todos os workspaces e sai com 0; um erro de tipos introduzido de propósito num pacote faz o comando sair com código ≠ 0.
- [ ] ESLint 9 em flat config (`eslint.config.js`) com `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks` e `eslint-plugin-jsx-a11y`; Prettier com `.prettierrc` e `"endOfLine": "lf"`.
- [ ] `pnpm lint` corre `eslint .` e `prettier --check .` e sai com 0; `pnpm format` corre `prettier --write .`.
- [ ] `.prettierignore` exclui `pnpm-lock.yaml`, `dist/`, `storybook-static/`, `docs/workflow/`, `.claude/`, `.github/` e `CLAUDE.md` (os registos e os ficheiros do João não são reformatados).
- [ ] `.gitignore` cobre `node_modules/`, `dist/`, `storybook-static/`, `coverage/`, `*.tsbuildinfo`, `*.tgz` e `.DS_Store`.
- [ ] `pnpm-lock.yaml` está commitado e `pnpm install --frozen-lockfile` sai com 0 num clone limpo.
- [ ] Os scripts funcionam em Windows e em Linux (sem `rm -rf`, `cp` ou variáveis de ambiente em sintaxe de shell nos scripts do `package.json`).
- [ ] G1 (só `lint` e `typecheck` existem nesta tarefa), G2, G3.

**Testes exigidos:**
- Unitários: não aplicável (ainda não há test runner; chega na DS-002).
- Acessibilidade: não aplicável; confirmar apenas que `eslint-plugin-jsx-a11y` está ativo (um `<img>` sem `alt` num ficheiro `.tsx` temporário faz `pnpm lint` falhar; o ficheiro não é commitado).
- Visual/Storybook: não aplicável.
- Verificação manual no terminal: `pnpm install --frozen-lockfile && pnpm lint && pnpm typecheck` com código 0.

**Fora de âmbito:** Vitest e tsup (DS-002), Storybook (DS-003), qualquer componente ou token, hooks de git (husky/lint-staged), alterações ao CI.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta

### DS-002 · Vitest + Testing Library e build com tsup

- **Fase do MVP:** Fundações
- **Prioridade:** Alta
- **Depende de:** DS-001
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** ter testes unitários e build a funcionar de ponta a ponta com um exemplo mínimo, para que as tarefas de componentes só tenham de escrever código e testes.

**Critérios de aceitação:**
- [ ] Vitest configurado com ambiente `jsdom`, `@testing-library/react`, `@testing-library/user-event` e `@testing-library/jest-dom` (matchers carregados num ficheiro de setup partilhado, com tipos reconhecidos pelo `tsc`).
- [ ] `pnpm test` corre o Vitest uma vez (sem modo watch) em todos os pacotes e sai com 0; `pnpm test:watch` existe para uso local.
- [ ] `react` e `react-dom` são `peerDependencies` de `packages/ui` e `packages/icons` (`^18.0.0 || ^19.0.0`) e `devDependencies` para desenvolvimento.
- [ ] `packages/ui` e `packages/icons` têm `tsup.config.ts` com formatos `esm` e `cjs`, `dts: true`, `sourcemap: true`, `clean: true` e `react`/`react-dom` externos.
- [ ] `pnpm build` corre o build de todos os pacotes por ordem topológica e sai com 0; depois do build existem `packages/ui/dist/index.js` (ESM), `packages/ui/dist/index.cjs` (CJS) e `packages/ui/dist/index.d.ts`, e o mesmo em `packages/icons/dist/`.
- [ ] `packages/ui/src/index.ts` tem uma exportação mínima (ex.: `VisuallyHidden`, um `<span>` com `forwardRef`) e existe um teste que a renderiza e usa um matcher do jest-dom, para provar que React + jsdom + Testing Library funcionam.
- [ ] `node -e "require('./packages/ui/dist/index.cjs')"` e `node --input-type=module -e "import('./packages/ui/dist/index.js')"` terminam sem erro.
- [ ] Os scripts de build de dependências necessários ao pnpm 10 (ex.: `esbuild`) estão autorizados em `onlyBuiltDependencies`, para que `pnpm install --frozen-lockfile` não deixe avisos de scripts ignorados que partam o build.
- [ ] G1 (existem `lint`, `typecheck`, `test` e `build`), G2, G3.

**Testes exigidos:**
- Unitários: um teste de renderização da exportação mínima (elemento presente no documento, `ref` encaminhada); um teste que falha de propósito faz `pnpm test` sair com código ≠ 0 (verificação temporária, não commitada).
- Acessibilidade: não aplicável nesta tarefa.
- Visual/Storybook: não aplicável (chega na DS-003).

**Fora de âmbito:** Storybook, tokens, estilos CSS, cobertura mínima de testes, campos `exports`/`files` finais do `package.json` (DS-036).

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta

### DS-003 · Storybook 8 com addon-a11y e `pnpm test:a11y`

- **Fase do MVP:** Fundações
- **Prioridade:** Alta
- **Depende de:** DS-002
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** montar a documentação viva em `apps/docs` e o teste automático de acessibilidade das stories, que passa a ser a rede de segurança de todos os componentes.

**Critérios de aceitação:**
- [ ] `apps/docs` tem Storybook 8 com `@storybook/react-vite`, `@storybook/addon-essentials` e `@storybook/addon-a11y`; o glob de stories apanha `packages/*/src/**/*.stories.tsx` e `apps/docs/src/**/*.mdx`.
- [ ] `pnpm storybook` na raiz arranca o Storybook em `http://localhost:6006` sem erros na consola do terminal.
- [ ] `pnpm build:docs` gera `apps/docs/storybook-static/` e sai com 0 (o `pnpm build` continua a construir só os pacotes).
- [ ] `pnpm test:a11y` constrói o Storybook estático, serve-o e corre o `@storybook/test-runner` com `axe-playwright` (`injectAxe` + `checkA11y` em cada story, configurado em `apps/docs/.storybook/test-runner.ts`), termina sozinho e sai com 0.
- [ ] `pnpm test:a11y` sai com código ≠ 0 quando uma story tem uma violação do axe (ver testes exigidos).
- [ ] As regras do axe correm com as tags `wcag2a`, `wcag2aa`, `wcag21a` e `wcag21aa`.
- [ ] Existe o script `pnpm test:a11y:setup` que instala o browser necessário (`playwright install chromium`), e a necessidade de o correr uma vez fica documentada em `apps/docs/README.md`.
- [ ] Existe uma story de exemplo para a exportação mínima da DS-002, com `tags: ['autodocs']`, que aparece no Storybook e passa o teste.
- [ ] G1 (todos os scripts do `CLAUDE.md` existem a partir desta tarefa), G2, G3.

**Testes exigidos:**
- Unitários: não aplicável.
- Acessibilidade: `pnpm test:a11y` passa com a story de exemplo; prova negativa: acrescentar temporariamente uma story com `<button></button>` sem nome acessível e confirmar que o comando falha e identifica a regra `button-name` (a story temporária não é commitada).
- Visual/Storybook: a story de exemplo abre com o painel "Accessibility" visível e sem violações.

**Fora de âmbito:** toggle de tema e páginas de tokens (DS-006), página "Getting started" (DS-042), publicação do Storybook online, testes de regressão visual, alterações aos workflows (se o ciclo diário precisar de um passo para instalar o Chromium, regista-se em "Decisões para o João").

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta

### DS-004 · Tokens primitivos com Style Dictionary

- **Fase do MVP:** Fundações
- **Prioridade:** Alta
- **Depende de:** DS-002
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** definir os valores de base do sistema (cor, espaço, tipografia, raios, sombras) numa única fonte JSON e gerá-los como CSS variables e TypeScript.

**Critérios de aceitação:**
- [ ] Fontes em `packages/tokens/src/primitives/*.json`, no formato do Style Dictionary 4 (`value` + `type`), com um ficheiro por categoria.
- [ ] Cor: paletas `neutral`, `primary`, `success`, `warning`, `danger` e `info`, cada uma com exatamente os 10 passos `50, 100, 200, 300, 400, 500, 600, 700, 800, 900`, mais `white` e `black`.
- [ ] Espaçamento: escala de 4px expressa em `rem` (`0`, `1` = 0.25rem, `2` = 0.5rem, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`); todos os valores são múltiplos de 4px.
- [ ] Tipografia: famílias (`sans`, `mono`, com pilha de fontes do sistema), tamanhos (`xs` a `3xl`), pesos (`regular`, `medium`, `semibold`, `bold`) e alturas de linha (`tight`, `normal`, `relaxed`).
- [ ] Raios (`none`, `sm`, `md`, `lg`, `full`), sombras (`sm`, `md`, `lg`), durações de transição (`fast`, `normal`) e camadas `z-index` (`dropdown`, `overlay`, `modal`, `toast`, `tooltip`).
- [ ] O build do pacote corre o Style Dictionary e gera `packages/tokens/dist/tokens.css` (variáveis em `:root`, todas com prefixo `--ds-`, ex.: `--ds-color-primary-500`, `--ds-space-4`) e `packages/tokens/dist/index.js` + `index.cjs` + `index.d.ts` (objeto `tokens` tipado com os mesmos nomes e valores).
- [ ] `pnpm build` constrói `tokens` antes de `ui` (o `ui` declara `@ds/tokens` como dependência `workspace:*`).
- [ ] Nenhum valor é repetido à mão fora dos JSON: o CSS e o TypeScript são sempre gerados.
- [ ] G1, G2 (dependência nova: `style-dictionary`), G3.

**Testes exigidos:**
- Unitários (Vitest, sobre o resultado do build ou os JSON): cada paleta tem os 10 passos; todos os espaçamentos são múltiplos de 4px; todas as variáveis de `tokens.css` começam por `--ds-`; o número de variáveis no CSS é igual ao número de folhas do objeto TypeScript; não há valores vazios nem referências por resolver (`{...}`).
- Acessibilidade: não aplicável (o contraste é verificado na DS-005, sobre os pares semânticos).
- Visual/Storybook: não aplicável (as páginas de tokens são da DS-006).

**Fora de âmbito:** tokens semânticos e temas (DS-005), tokens por componente, exportação para Figma/JSON de design, fontes web carregadas por ficheiro.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta

### DS-005 · Tokens semânticos e temas claro/escuro

- **Fase do MVP:** Fundações
- **Prioridade:** Alta
- **Depende de:** DS-004
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** dar significado aos tokens primitivos (fundo, texto, borda, destaque, estados) e resolvê-los de forma diferente em cada tema, com contraste AA garantido por teste automático.

**Critérios de aceitação:**
- [ ] Fontes em `packages/tokens/src/semantic/light.json` e `dark.json`, que só referenciam tokens primitivos (nenhum valor de cor literal).
- [ ] Existem, no mínimo: `color-bg-canvas`, `color-bg-surface`, `color-bg-subtle`, `color-bg-inverse`, `color-text-default`, `color-text-muted`, `color-text-disabled`, `color-text-on-accent`, `color-border-default`, `color-border-strong`, `color-accent-default|hover|active|subtle`, e para cada estado `success`, `warning`, `danger` e `info`: `-default`, `-subtle` e `-text`; mais `color-focus-ring` e `color-overlay`.
- [ ] O build gera `packages/tokens/dist/themes.css` com três blocos: `:root, [data-theme="light"]` (tema claro), `[data-theme="dark"]` (tema escuro) e `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }` (fallback para a preferência do sistema).
- [ ] Cada bloco de tema define também `color-scheme` (`light` ou `dark`).
- [ ] Os nomes semânticos são os mesmos nos dois temas (mesmo conjunto de variáveis) e são exportados no objeto TypeScript do pacote.
- [ ] Pares de contraste documentados em `packages/tokens/src/contrast-pairs.ts` e verificados por teste: texto sobre fundo ≥ 4,5:1; bordas de controlos (`border-strong`) e `focus-ring` sobre os fundos ≥ 3:1; nos dois temas.
- [ ] G1, G2, G3.

**Testes exigidos:**
- Unitários: os dois temas têm exatamente o mesmo conjunto de chaves; nenhuma referência por resolver; `themes.css` contém os três seletores acima.
- Acessibilidade: teste Vitest que calcula o rácio de contraste WCAG para cada par de `contrast-pairs.ts` nos dois temas e falha abaixo do limite (4,5:1 texto, 3:1 elementos não textuais); inclui, no mínimo, `text-default`, `text-muted` e os quatro `*-text` sobre `bg-canvas`, `bg-surface` e o respetivo `*-subtle`, e `text-on-accent` sobre `accent-default|hover|active`.
- Visual/Storybook: não aplicável (DS-006).

**Fora de âmbito:** toggle de tema no Storybook (DS-006), temas adicionais (alto contraste, marcas), componente `ThemeProvider` em React.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta

### DS-006 · Tema no Storybook: toggle e páginas de tokens

- **Fase do MVP:** Fundações
- **Prioridade:** Alta
- **Depende de:** DS-003, DS-005
- **Estimativa:** S (≤ 2h)

**Objetivo:** ver e testar qualquer story nos dois temas e documentar visualmente os tokens, fixando a convenção da story de tema escuro que todos os componentes vão seguir.

**Critérios de aceitação:**
- [ ] `apps/docs/.storybook/preview.ts` importa `tokens.css` e `themes.css` do pacote de tokens.
- [ ] A barra de ferramentas do Storybook tem um seletor "Theme" com `light` e `dark` (global `theme`); um decorator aplica o valor como `data-theme` no elemento `<html>` do iframe e o fundo da story usa `--ds-color-bg-canvas`.
- [ ] Uma story pode forçar o tema com `parameters: { theme: 'dark' }` (ou `globals` da story), e esse valor tem prioridade sobre a barra de ferramentas; assim as stories `DarkTheme` são testadas em tema escuro pelo `pnpm test:a11y`.
- [ ] A convenção fica escrita em `apps/docs/README.md`: cada componente tem uma story exportada como `DarkTheme` que mostra as variantes principais em tema escuro.
- [ ] Existem páginas de documentação em "Foundations": cores (todas as paletas e os tokens semânticos nos dois temas), espaçamento, tipografia, raios e sombras, geradas a partir do objeto `tokens` (sem listas escritas à mão).
- [ ] G1, G2, G3.

**Testes exigidos:**
- Unitários: não aplicável.
- Acessibilidade: `pnpm test:a11y` passa em todas as páginas de tokens, incluindo uma story `DarkTheme` de exemplo; prova negativa temporária: uma story com `parameters.theme = 'dark'` e texto `--ds-color-neutral-700` sobre o fundo escuro falha por `color-contrast` (não commitada).
- Visual/Storybook: stories `Colors`, `Spacing`, `Typography`, `Radii`, `Shadows` e a de exemplo em `DarkTheme`; mudar o seletor de tema altera o fundo e o texto sem recarregar a página.

**Fora de âmbito:** componente `ThemeProvider`/`useTheme` para as aplicações consumidoras (o guia de temas é da DS-043), persistência do tema, tema "system" no seletor.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta

### DS-007 · CSS base, focus visível, `styles.css` agregado e Stylelint

- **Fase do MVP:** Fundações
- **Prioridade:** Alta
- **Depende de:** DS-006
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** fixar a arquitetura de CSS da biblioteca antes do primeiro componente: estilos base, anel de focus comum, um único `styles.css` publicado e uma regra automática que impede valores escritos à mão.

**Critérios de aceitação:**
- [ ] `packages/ui/src/styles/base.css` define o mínimo necessário sem reset global agressivo: `box-sizing: border-box` e família tipográfica aplicados apenas a elementos `[class^="ds-"], [class*=" ds-"]`.
- [ ] `packages/ui/src/styles/focus.css` define o anel de focus comum com `:focus-visible` (`outline` de 2px com `--ds-color-focus-ring` e `outline-offset`), reutilizável pelos componentes, e nunca remove o `outline` sem alternativa.
- [ ] `packages/ui/src/styles/motion.css` reduz transições e animações a zero dentro de `@media (prefers-reduced-motion: reduce)` para elementos `ds-*`.
- [ ] `packages/ui/src/styles.css` é a entrada que importa, por esta ordem, tokens, temas, base, focus, motion e depois o `.css` de cada componente.
- [ ] `pnpm build` gera `packages/ui/dist/styles.css` como ficheiro único, sem `@import` por resolver, que inclui as variáveis dos tokens e dos temas; os ficheiros `.tsx` não importam `.css` (o consumidor importa `styles.css` uma vez).
- [ ] O Storybook carrega `packages/ui/src/styles.css` no `preview.ts` (substitui as importações diretas da DS-006).
- [ ] Stylelint configurado e incluído em `pnpm lint`: em `packages/ui/src/**/*.css` proíbe cores literais (hex, `rgb()`, `hsl()`, nomes), unidades `px`/`rem`/`em` em `margin`, `padding`, `gap`, `border-radius`, `font-size` e `box-shadow` (obriga a `var(--ds-*)`), e classes que não comecem por `ds-`. Exceções permitidas e documentadas: `0`, `1px`/`2px` em `border`/`outline`, `currentColor`, `transparent`, `inherit`, percentagens.
- [ ] Um ficheiro CSS temporário com `color: #ff0000` ou `.button {}` faz `pnpm lint` falhar (não commitado).
- [ ] G1, G2 (dependências novas: `stylelint` e configuração base), G3.

**Testes exigidos:**
- Unitários: teste Vitest sobre `dist/styles.css` (ou sobre o resultado do passo de build): contém `--ds-color-bg-canvas`, `[data-theme="dark"]` e `:focus-visible`, e não contém `@import`.
- Acessibilidade: story `FocusRing` com um botão e uma ligação nativos com a classe de focus; com Tab o anel fica visível nos dois temas; `pnpm test:a11y` passa.
- Visual/Storybook: stories `FocusRing` e `FocusRing/DarkTheme`.

**Fora de âmbito:** estilos de qualquer componente, reset global opcional (`reset.css`), ficheiros CSS por componente publicados em separado, CSS Modules, PostCSS com plugins de transformação.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta

### DS-008 · Pacote de ícones (subconjunto do Lucide com SVGR)

- **Fase do MVP:** Fundações
- **Prioridade:** Alta
- **Depende de:** DS-003
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** disponibilizar em `packages/icons` os ícones de que os componentes precisam, como componentes React acessíveis por omissão e com uma API própria e estável.

**Critérios de aceitação:**
- [ ] Os SVG vêm do pacote `lucide-static` (devDependency com versão exata) e ficam copiados em `packages/icons/svg/`; a lista é: `check`, `x`, `minus`, `plus`, `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `chevrons-up-down`, `arrow-up`, `arrow-down`, `arrow-up-down`, `info`, `circle-check`, `circle-alert`, `triangle-alert`, `circle-x`, `search`, `ellipsis`, `eye`, `eye-off`, `sun`, `moon`, `loader-circle`, `external-link`, `menu`, `trash-2`, `pencil`, `settings`, `user` (30 ícones).
- [ ] `pnpm --filter @ds/icons generate` converte os SVG com SVGR em componentes `packages/icons/src/generated/<Nome>Icon.tsx` (ex.: `CheckIcon`, `ChevronDownIcon`) e regenera `src/index.ts`; os ficheiros gerados ficam commitados e correr o comando outra vez não produz diferenças (`git diff` vazio).
- [ ] API de cada ícone: `size?: number | string` (por omissão `"1em"`, aplicado a `width` e `height`), `title?: string`, `className`, restantes props de `<svg>`, `forwardRef<SVGSVGElement>`; `stroke="currentColor"`.
- [ ] Sem `title`: o `<svg>` tem `aria-hidden="true"` e `focusable="false"`. Com `title`: tem `role="img"`, um elemento `<title>` com esse texto, e não tem `aria-hidden`.
- [ ] Atribuição: `packages/icons/LICENSE-LUCIDE` com o texto da licença ISC do Lucide e uma secção "Créditos" em `packages/icons/README.md`.
- [ ] `pnpm build` gera `packages/icons/dist` (ESM + CJS + `.d.ts`) e cada ícone é importável pelo nome (`import { CheckIcon } from '@ds/icons'`); `"sideEffects": false` no `package.json`.
- [ ] G1, G2 (dependências novas: `lucide-static`, `@svgr/core` ou `@svgr/cli` e plugins), G3.

**Testes exigidos:**
- Unitários: há um componente exportado por cada ficheiro em `svg/` (teste que compara as duas listas); `size={24}` define `width` e `height` a 24; `ref` aponta para o `<svg>`; `className` é aplicada.
- Acessibilidade: sem `title` → `aria-hidden="true"` e o ícone não aparece em `getByRole('img')`; com `title="Fechar"` → `getByRole('img', { name: 'Fechar' })` encontra-o; axe sem violações nos dois casos.
- Visual/Storybook: story `Gallery` com todos os ícones e o respetivo nome, story `Sizes` (16, 20, 24), story `WithTitle` e story `DarkTheme` (os ícones herdam a cor do texto).

**Fora de âmbito:** ícones fora da lista (acrescentam-se por tarefa nova), ícones preenchidos ou a duas cores, sprite SVG, componente `<Icon name="…">` com carregamento dinâmico.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta

### DS-009 · Utilitários partilhados, helper de axe e teste de convenções

- **Fase do MVP:** Fundações
- **Prioridade:** Alta
- **Depende de:** DS-007
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** preparar as peças comuns que todos os componentes vão usar e automatizar a verificação da estrutura de pastas, para que os critérios C1 a C4 sejam testáveis sem inspeção manual.

**Critérios de aceitação:**
- [ ] `packages/ui/src/utils/cx.ts`: função `cx(...valores)` que junta nomes de classes e ignora `false`, `null`, `undefined` e strings vazias (sem dependências externas).
- [ ] `@radix-ui/react-slot` instalado em `packages/ui` e reexportado internamente em `packages/ui/src/utils/Slot.ts` para uso do `asChild`.
- [ ] `VisuallyHidden` (da DS-002) passa a seguir os critérios de componente: pasta própria, classe `ds-visually-hidden` em CSS (técnica de `clip`, sem `display: none`), suporte a `asChild`.
- [ ] `packages/ui/test/a11y.ts` exporta `expectNoA11yViolations(container)` baseado em `vitest-axe` (ou `jest-axe`), usável em qualquer `*.test.tsx`.
- [ ] O setup de testes inclui os polyfills de jsdom de que os primitivos Radix precisam: `ResizeObserver`, `Element.prototype.hasPointerCapture`/`setPointerCapture`/`releasePointerCapture`, `Element.prototype.scrollIntoView` e `window.matchMedia`.
- [ ] `packages/ui/src/conventions.test.ts` percorre as pastas de componente em `packages/ui/src/` (as que começam por maiúscula) e falha se alguma: não tiver os cinco ficheiros de C1; não estiver exportada em `src/index.ts`; não tiver o `.css` importado em `src/styles.css`; não tiver uma story exportada como `DarkTheme`.
- [ ] `packages/ui/README.md` tem uma secção "Como criar um componente" que resume C1 a C5 e aponta para o `VisuallyHidden` como exemplo.
- [ ] G1, G2 (dependências novas: `@radix-ui/react-slot`, `vitest-axe` ou `jest-axe`), G3; C1 a C5 para o `VisuallyHidden`.

**Testes exigidos:**
- Unitários: `cx('a', false, undefined, 'b')` devolve `'a b'`; `VisuallyHidden` renderiza o texto, aceita `className` e `ref`, e com `asChild` aplica a classe ao filho sem criar um `<span>` extra; o teste de convenções falha quando se remove temporariamente um dos cinco ficheiros (prova negativa, não commitada).
- Acessibilidade: o texto dentro de `VisuallyHidden` é encontrado por `getByText` e conta para o nome acessível de um botão só com ícone; `expectNoA11yViolations` falha para um `<img>` sem `alt` (teste do próprio helper).
- Visual/Storybook: stories `VisuallyHidden/Default` e `VisuallyHidden/DarkTheme`.

**Fora de âmbito:** gerador de componentes por linha de comando, hooks utilitários que nenhum componente ainda usa, `ThemeProvider`.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
