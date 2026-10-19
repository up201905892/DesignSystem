# 01 · Planeamento

Fonte da verdade do projeto: todas as tarefas existem aqui. Só o `planeador` cria ou altera especificações; os outros agentes só atualizam a coluna **Estado** da tabela e o **Histórico** da tarefa.

Estados: `Proposta` → `Planeado` → `Em desenvolvimento` → `Pronto para teste` → `Em teste` → `Aprovado` → `Concluído` (desvios: `Reprovado` → `Em desenvolvimento`; `Proposta` → `Rejeitada`).

## Tabela-índice

| ID | Tarefa | Fase do MVP | Prioridade | Depende de | Estado |
| --- | --- | --- | --- | --- | --- |
| DS-001 | Monorepo pnpm, TypeScript strict, ESLint e Prettier | Fundações | Alta | — | Concluído |
| DS-002 | Vitest + Testing Library e build com tsup | Fundações | Alta | DS-001 | Concluído |
| DS-003 | Storybook 8 com addon-a11y e `pnpm test:a11y` | Fundações | Alta | DS-002 | Concluído |
| DS-004 | Tokens primitivos com Style Dictionary | Fundações | Alta | DS-002 | Concluído |
| DS-005 | Tokens semânticos e temas claro/escuro | Fundações | Alta | DS-004 | Concluído |
| DS-006 | Tema no Storybook: toggle e páginas de tokens | Fundações | Alta | DS-003, DS-005 | Concluído |
| DS-007 | CSS base, focus visível, `styles.css` agregado e Stylelint | Fundações | Alta | DS-006 | Concluído |
| DS-008 | Pacote de ícones (subconjunto do Lucide com SVGR) | Fundações | Alta | DS-003 | Concluído |
| DS-009 | Utilitários partilhados, helper de axe e teste de convenções | Fundações | Alta | DS-007 | Concluído |
| DS-010 | Button | Formulários | Alta | DS-009 | Concluído |
| DS-011 | IconButton | Formulários | Alta | DS-008, DS-010 | Concluído |
| DS-012 | Field (label, descrição e mensagem de erro) | Formulários | Alta | DS-009 | Concluído |
| DS-013 | Input | Formulários | Alta | DS-010, DS-012 | Concluído |
| DS-014 | Textarea | Formulários | Média | DS-013 | Concluído |
| DS-015 | Checkbox | Formulários | Alta | DS-008, DS-012 | Concluído |
| DS-016 | RadioGroup | Formulários | Média | DS-012 | Concluído |
| DS-017 | Switch | Formulários | Média | DS-012 | Concluído |
| DS-018 | Select | Formulários | Alta | DS-008, DS-013 | Concluído |
| DS-019 | Badge | Overlays e feedback | Média | DS-009 | Concluído |
| DS-020 | Spinner e Skeleton | Overlays e feedback | Média | DS-009 | Planeado |
| DS-021 | Button: estado `loading` | Overlays e feedback | Média | DS-011, DS-020 | Planeado |
| DS-022 | Alert | Overlays e feedback | Média | DS-011 | Planeado |
| DS-023 | Tooltip | Overlays e feedback | Média | DS-011 | Planeado |
| DS-024 | Popover | Overlays e feedback | Média | DS-011, DS-013 | Planeado |
| DS-025 | Dialog (Modal) | Overlays e feedback | Alta | DS-011, DS-013 | Concluído |
| DS-026 | DropdownMenu | Overlays e feedback | Alta | DS-011 | Concluído |
| DS-027 | Toast | Overlays e feedback | Média | DS-011, DS-021 | Planeado |
| DS-028 | Stack e Grid | Layout e dados | Média | DS-009 | Planeado |
| DS-029 | Card | Layout e dados | Média | DS-010 | Planeado |
| DS-030 | Tabs | Layout e dados | Média | DS-009 | Planeado |
| DS-031 | Accordion | Layout e dados | Média | DS-008, DS-009 | Planeado |
| DS-032 | Table: estrutura base | Layout e dados | Alta | DS-019 | Concluído |
| DS-033 | Table: ordenação | Layout e dados | Alta | DS-008, DS-032 | Planeado |
| DS-034 | Pagination | Layout e dados | Média | DS-011 | Planeado |
| DS-035 | DataTable: Table com ordenação e paginação integradas | Layout e dados | Média | DS-033, DS-034 | Planeado |
| DS-036 | Metadados dos pacotes: `exports`, `sideEffects`, `files` e licença | Publicação | Alta | DS-008, DS-010 | Proposta |
| DS-037 | Changesets: versionamento e changelog | Publicação | Alta | DS-036 | Proposta |
| DS-038 | Limite de tamanho de bundle (< 5 kB gzip por componente) | Publicação | Alta | DS-036, DS-010 a DS-035 | Proposta |
| DS-039 | Verificação do pacote: `pnpm pack`, publint e projeto consumidor | Publicação | Alta | DS-037, DS-038 | Proposta |
| DS-040 | Auditoria final de acessibilidade (WCAG 2.1 AA) | Publicação | Alta | DS-010 a DS-035 | Proposta |
| DS-041 | Preparação da versão 1.0.0 e guia de publicação manual | Publicação | Alta | DS-039, DS-040 | Proposta |
| DS-042 | Página "Getting started" no Storybook | Documentação | Alta | DS-036, DS-040 | Proposta |
| DS-043 | Guias de temas e de personalização de estilos | Documentação | Média | DS-042 | Proposta |
| DS-044 | App de exemplo: estrutura, layout e tema | Documentação | Alta | DS-036, DS-010 a DS-035 | Proposta |
| DS-045 | App de exemplo: formulário e tabela de dados | Documentação | Alta | DS-044 | Proposta |
| DS-046 | README do repositório e dos pacotes | Documentação | Média | DS-039, DS-042, DS-045 | Proposta |
| DS-047 | Storybook no GitHub Pages: build estático e proposta de workflow | Documentação | Média | DS-042, DS-046 | Proposta |
| DS-048 | App de exemplo no GitHub Pages (subpasta `example/`) | Documentação | Média | DS-045, DS-047 | Proposta |
| DS-049 | Referência técnica e apresentação do projeto (versão inicial) | Documentação | Média | DS-041, DS-048 | Proposta |
| DS-050 | Pacotes do workspace resolvidos a partir do código-fonte (typecheck e testes sem build prévio) | Fundações | Alta | — | Concluído |

## Decisões aplicadas

Linhas de `aprovacoes.md` já tratadas pelo planeador (evita aplicar a mesma decisão duas vezes).

| Data da decisão | Decisão | IDs | Aplicada em |
| --- | --- | --- | --- |
| 2026-10-11 | Aprovar | DS-011, DS-014, DS-015, DS-020 | 2026-10-12 |
| 2026-10-11 | Aprovar | DS-012, DS-013, DS-016 a DS-019 | 2026-10-12 |
| 2026-10-12 | Responder | DS-003 | 2026-10-12 |
| 2026-10-16 | Aprovar | DS-021 a DS-035 | 2026-10-19 |
| 2026-10-16 | Aprovar | DS-050 | 2026-10-19 |

## Decisões técnicas

Decisões do João que condicionam as especificações. Não são linhas de `aprovacoes.md`; ficam aqui para que qualquer agente (ou leitor) saiba porque é que as tarefas estão escritas assim.

| Data | Origem | Tema | Decisão |
| --- | --- | --- | --- |
| 2026-10-09 | conversa | Primitivos de comportamento | **Radix UI**, um pacote `@radix-ui/react-*` por primitivo. Componentes simples (Button, Input, Badge, Stack, etc.) não usam Radix, exceto `@radix-ui/react-slot` para `asChild`. |
| 2026-10-09 | conversa | Estilos | **CSS simples + CSS variables**. Um `.css` por componente, classes com prefixo `ds-` (ex.: `ds-button`), variantes/tamanhos/estados por atributos `data-*`, sem valores escritos à mão (só tokens). O pacote `ui` publica um `styles.css` agregado; zero runtime de CSS-in-JS. |
| 2026-10-09 | conversa | Tokens | **Style Dictionary** (JSON → CSS variables + exportação TypeScript). Temas claro e escuro via `[data-theme]`, com fallback para `prefers-color-scheme`. |
| 2026-10-09 | conversa | Ícones | **Subconjunto do Lucide** (20–30 SVG, licença ISC, com atribuição), convertidos em componentes React com SVGR em `packages/icons`, com API própria (`size`, `title`, `aria-hidden` por omissão). |
| 2026-10-09 | conversa | Língua | **Inglês** no código, nos textos por omissão dos componentes (sempre substituíveis por prop), no Storybook, nos README (títulos de secção incluídos), nos nomes de exemplo em testes e stories nas mensagens de commit e nos documentos em `docs/` fora de `docs/workflow/` (ex.: `docs/publishing.md`, `docs/github-pages.md`). **Português** em tudo o que está em `docs/workflow/`. |
| 2026-10-09 | conversa | Licença | **MIT** para os três pacotes publicados e para o repositório. |
| 2026-10-09 | conversa | Scope npm | **`@up201905892`**. Os pacotes publicados são `@up201905892/ui`, `@up201905892/icons` e `@up201905892/tokens`. Até à DS-036 os pacotes mantêm os nomes internos `@ds/*` e `"private": true`; a DS-036 faz a mudança de nome. |
| 2026-10-09 | conversa | Storybook online | O Storybook é publicado no **GitHub Pages**. Os agentes preparam o build e propõem o workflow (DS-047); o ficheiro em `.github/` é acrescentado pelo João. |

Decisões ainda pendentes: nenhuma.

### Critérios comuns

Para não repetir o mesmo texto em todas as tarefas, cada tarefa refere estes critérios pelo código. Valem como critérios de aceitação da tarefa que os cita.

**Gerais (todas as tarefas):**

- **G1 · Verificações verdes.** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:a11y` e `pnpm build` saem com código 0. Um script que ainda não foi criado (os scripts nascem nas tarefas DS-001 a DS-003) conta como "não aplicável" nessa tarefa, não como falha.
- **G2 · Dependências controladas.** A tarefa só acrescenta as dependências que a especificação nomeia; `pnpm-lock.yaml` fica atualizado e commitado, e `pnpm install --frozen-lockfile` passa.
- **G3 · Commits.** Conventional Commits com o ID da tarefa e mensagem em inglês (ex.: `feat(ui): DS-010 Button with variants and sizes`). Nenhum ficheiro do João é alterado (`CLAUDE.md`, `.claude/`, `.github/`, `docs/workflow/aprovacoes.md`).

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
- 2026-10-09 · planeador · Proposta → Planeado · aprovada pelo João (conversa)
- 2026-10-09 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-09 · programador · Em desenvolvimento → Pronto para teste · commit d42f1ce
- 2026-10-09 · testador · Pronto para teste → Em teste · início da verificação
- 2026-10-09 · testador · Em teste → Aprovado · relatório 1 em 03-testing.md, todos os critérios verificados
- 2026-10-09 · finalizador · Aprovado → Concluído · relatório 1 aprovado (d42f1ce); tarefa de infraestrutura, changeset não aplicável

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
- 2026-10-09 · planeador · Proposta → Planeado · aprovada pelo João (conversa)
- 2026-10-09 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-09 · programador · Em desenvolvimento → Pronto para teste · commit b305745
- 2026-10-09 · testador · Pronto para teste → Em teste · início da verificação
- 2026-10-09 · testador · Em teste → Aprovado · relatório 1 em 03-testing.md, todos os critérios verificados
- 2026-10-09 · finalizador · Aprovado → Concluído · relatório 1 aprovado (b305745); tarefa de infraestrutura, changeset não aplicável

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
- 2026-10-09 · planeador · Proposta → Planeado · aprovada pelo João (conversa)
- 2026-10-11 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-11 · programador · Em desenvolvimento → Pronto para teste · commit 3f25ff9
- 2026-10-11 · testador · Pronto para teste → Em teste · início dos testes
- 2026-10-11 · testador · Em teste → Aprovado · relatório 1, todos os critérios verificados
- 2026-10-11 · finalizador · Aprovado → Concluído · relatório 1 aprovado (3f25ff9); infraestrutura, changeset não aplicável
- 2026-10-12 · planeador · Concluído (sem mudança de estado) · resposta do João (aprovacoes.md, 2026-10-12): passo `pnpm test:a11y:setup` acrescentado ao ci.yml e ao diario.yml em 2026-10-11, antes de `pnpm test:a11y`; pedido de instalar o Chromium no CI resolvido, não repetir

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
- 2026-10-09 · planeador · Proposta → Planeado · aprovada pelo João (conversa)
- 2026-10-11 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-11 · programador · Em desenvolvimento → Pronto para teste · commit 7598497
- 2026-10-11 · testador · Pronto para teste → Em teste · início dos testes
- 2026-10-11 · testador · Em teste → Aprovado · relatório 1 aprovado (7598497)
- 2026-10-11 · finalizador · Aprovado → Concluído · relatório 1 verificado; sem changeset (pacotes privados)

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
- 2026-10-09 · planeador · Proposta → Planeado · aprovada pelo João (conversa)
- 2026-10-12 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-12 · programador · Em desenvolvimento → Pronto para teste · commit 36fa7b6
- 2026-10-12 · testador · Pronto para teste → Em teste · início dos testes (commit 36fa7b6)
- 2026-10-12 · testador · Em teste → Aprovado · relatório 1; todos os critérios verificados, zero falhas
- 2026-10-12 · finalizador · Aprovado → Concluído · relatório 1 verificado; sem changeset (pacotes privados)

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
- 2026-10-09 · planeador · Proposta → Planeado · aprovada pelo João (conversa)
- 2026-10-12 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-12 · programador · Em desenvolvimento → Pronto para teste · commit 5ffc6f1
- 2026-10-12 · testador · Pronto para teste → Em teste · início dos testes (commit 5ffc6f1)
- 2026-10-12 · testador · Em teste → Aprovado · relatório 1; todos os critérios verificados, zero falhas
- 2026-10-12 · finalizador · Aprovado → Concluído · relatório 1 verificado; sem changeset (apps/docs privado)

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
- 2026-10-09 · planeador · Proposta → Planeado · aprovada pelo João (conversa)
- 2026-10-12 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-12 · programador · Em desenvolvimento → Pronto para teste · commit fdb215a
- 2026-10-12 · testador · Pronto para teste → Em teste · início dos testes
- 2026-10-12 · testador · Em teste → Aprovado · relatório 1, commit fdb215a, zero falhas
- 2026-10-12 · finalizador · Aprovado → Concluído · relatório 1 verificado; sem changeset (pacote ui privado)

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
- [ ] Atribuição: `packages/icons/LICENSE-LUCIDE` com o texto da licença ISC do Lucide e uma secção "Credits" em `packages/icons/README.md`.
- [ ] `pnpm build` gera `packages/icons/dist` (ESM + CJS + `.d.ts`) e cada ícone é importável pelo nome (`import { CheckIcon } from '@ds/icons'`); `"sideEffects": false` no `package.json`.
- [ ] G1, G2 (dependências novas: `lucide-static`, `@svgr/core` ou `@svgr/cli` e plugins), G3.

**Testes exigidos:**
- Unitários: há um componente exportado por cada ficheiro em `svg/` (teste que compara as duas listas); `size={24}` define `width` e `height` a 24; `ref` aponta para o `<svg>`; `className` é aplicada.
- Acessibilidade: sem `title` → `aria-hidden="true"` e o ícone não aparece em `getByRole('img')`; com `title="Close"` → `getByRole('img', { name: 'Close' })` encontra-o; axe sem violações nos dois casos.
- Visual/Storybook: story `Gallery` com todos os ícones e o respetivo nome, story `Sizes` (16, 20, 24), story `WithTitle` e story `DarkTheme` (os ícones herdam a cor do texto).

**Fora de âmbito:** ícones fora da lista (acrescentam-se por tarefa nova), ícones preenchidos ou a duas cores, sprite SVG, componente `<Icon name="…">` com carregamento dinâmico.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · Proposta → Planeado · aprovada pelo João (conversa)
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): regra de língua, secção do README passa a "Credits" e o nome de exemplo do teste passa a 'Close'; estado mantém-se Planeado
- 2026-10-12 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-12 · programador · Em desenvolvimento → Pronto para teste · commit 7e74ced
- 2026-10-12 · testador · Pronto para teste → Em teste · início do relatório 1
- 2026-10-12 · testador · Em teste → Aprovado · relatório 1, todos os critérios verificados
- 2026-10-12 · finalizador · Aprovado → Concluído · changeset não aplicável (pacote privado)

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
- [ ] `packages/ui/README.md` tem uma secção "How to create a component" que resume C1 a C5 e aponta para o `VisuallyHidden` como exemplo.
- [ ] G1, G2 (dependências novas: `@radix-ui/react-slot`, `vitest-axe` ou `jest-axe`), G3; C1 a C5 para o `VisuallyHidden`.

**Testes exigidos:**
- Unitários: `cx('a', false, undefined, 'b')` devolve `'a b'`; `VisuallyHidden` renderiza o texto, aceita `className` e `ref`, e com `asChild` aplica a classe ao filho sem criar um `<span>` extra; o teste de convenções falha quando se remove temporariamente um dos cinco ficheiros (prova negativa, não commitada).
- Acessibilidade: o texto dentro de `VisuallyHidden` é encontrado por `getByText` e conta para o nome acessível de um botão só com ícone; `expectNoA11yViolations` falha para um `<img>` sem `alt` (teste do próprio helper).
- Visual/Storybook: stories `VisuallyHidden/Default` e `VisuallyHidden/DarkTheme`.

**Fora de âmbito:** gerador de componentes por linha de comando, hooks utilitários que nenhum componente ainda usa, `ThemeProvider`.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · Proposta → Planeado · aprovada pelo João (conversa)
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): regra de língua, secção do README passa a "How to create a component"; estado mantém-se Planeado
- 2026-10-13 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-13 · programador · Em desenvolvimento → Pronto para teste · commit d729d7e
- 2026-10-13 · testador · Pronto para teste → Em teste · início do relatório 1
- 2026-10-13 · testador · Em teste → Aprovado · relatório 1, todos os critérios verificados
- 2026-10-13 · finalizador · Aprovado → Concluído · changeset não aplicável (pacotes privados)

### DS-010 · Button

- **Fase do MVP:** Formulários
- **Prioridade:** Alta
- **Depende de:** DS-009
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** criar o primeiro componente da biblioteca, que serve de referência de API, estilos e testes para todos os seguintes.

**Critérios de aceitação:**
- [ ] `Button` renderiza um `<button>` com `type="button"` por omissão (o consumidor pode passar `type="submit"`).
- [ ] Props: `variant: 'primary' | 'secondary' | 'ghost' | 'danger'` (omissão `primary`), `size: 'sm' | 'md' | 'lg'` (omissão `md`), `fullWidth?: boolean`, `leadingIcon?` e `trailingIcon?` (`ReactNode`), `asChild?: boolean`, `disabled`.
- [ ] `variant` e `size` aparecem no DOM como `data-variant` e `data-size`; a classe base é `ds-button`.
- [ ] Com `asChild`, o `Button` não cria um `<button>`: aplica classes, `data-*` e `ref` ao filho (ex.: `<a href>`), e não lhe passa `type`.
- [ ] `disabled` sem `asChild` usa o atributo nativo `disabled` do `<button>`: o botão não recebe focus com Tab e `onClick` não dispara.
- [ ] `disabled` com `asChild` (o filho, ex.: `<a>`, não tem `disabled` nativo): o filho recebe `aria-disabled="true"` e `tabIndex={-1}` e não recebe o atributo `disabled`; o clique é bloqueado na fase de captura (`preventDefault` + `stopPropagation`), de modo que nem o `onClick` passado ao `Button` nem o do próprio filho disparam e a navegação da ligação não acontece.
- [ ] Nos dois casos de `disabled` o elemento raiz tem `data-disabled`, e é esse o seletor usado no CSS para o estado desativado (o mesmo aspeto com e sem `asChild`).
- [ ] Estados `:hover`, `:active`, `:focus-visible` e desativado (`[data-disabled]`) estilizados para as quatro variantes.
- [ ] Alturas mínimas por tokens da escala de espaçamento (DS-004): `Button.css` declara `min-height: var(--ds-space-8)` para `data-size="sm"` (2rem = 32px), `var(--ds-space-10)` para `md` (2.5rem = 40px) e `var(--ds-space-12)` para `lg` (3rem = 48px); com o tamanho de letra de base de 16px, a altura renderizada é ≥ 32px, ≥ 40px e ≥ 48px, respetivamente.
- [ ] Os ícones passados em `leadingIcon`/`trailingIcon` ficam dentro de um `<span aria-hidden="true">` e não alteram o nome acessível.
- [ ] Com `asChild`, os ícones são renderizados dentro do filho, nos mesmos `<span aria-hidden="true">`, antes e depois do conteúdo do filho, usando `Slottable` de `@radix-ui/react-slot` (acrescentado à reexportação de `packages/ui/src/utils/Slot.ts`); não é criado nenhum elemento à volta do filho.
- [ ] As stories e os testes usam um `<svg>` de exemplo definido no próprio ficheiro: a DS-010 não depende do pacote de ícones (DS-008).
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários: renderiza o texto filho; valores por omissão de `variant`/`size` nos `data-*`; cada variante e tamanho; `className` acrescentada a `ds-button`; `ref` aponta para o `<button>`; `onClick` chamado uma vez ao clicar; `asChild` com `<a href="/x">` renderiza uma ligação com a classe `ds-button` e sem atributo `type`; `type="submit"` dentro de um `<form>` submete.
- Unitários (`disabled`): sem `asChild`, o `<button>` tem o atributo `disabled` e `data-disabled`, e clicar não chama `onClick`; com `asChild` e `<a href="/x">`, a ligação tem `aria-disabled="true"`, `data-disabled` e `tabindex="-1"`, não tem o atributo `disabled`, e clicar não chama o `onClick` do `Button` nem o do `<a>`, com o evento de clique cancelado (`defaultPrevented`).
- Unitários (ícones com `asChild`): `asChild` com `<a href="/x">Docs</a>` e `leadingIcon` → o `<span aria-hidden="true">` do ícone está dentro do `<a>` e antes do texto; com `trailingIcon`, está dentro do `<a>` e depois do texto; o `<a>` é o elemento raiz (não há elemento à volta); `getByRole('link', { name: 'Docs' })` encontra a ligação (o nome acessível é só o texto).
- Acessibilidade: axe sem violações (incluindo `asChild` com ícones e `asChild` desativado); Tab foca o botão; Enter e Espaço chamam `onClick` uma vez cada; com `disabled`, Tab salta o botão e Enter/Espaço não chamam `onClick`; com `asChild` + `disabled`, Tab salta a ligação (o focus passa do elemento anterior para o seguinte); `getByRole('button', { name })` devolve o texto mesmo com ícones.
- Visual/Storybook: `Primary`, `Secondary`, `Ghost`, `Danger`, `Sizes` (com `play` que mede a altura de cada botão: ≥ 32px em `sm`, ≥ 40px em `md`, ≥ 48px em `lg`), `WithIcons`, `FullWidth`, `Disabled`, `AsLink` (`asChild` com `<a>`, com `leadingIcon` e `trailingIcon`), `AsLinkDisabled` (`asChild` + `disabled`), `DarkTheme` (as quatro variantes, o estado disabled e uma ligação com `asChild`).

**Fora de âmbito:** estado `loading` (DS-021), botão só com ícone (DS-011), grupo de botões, variante "link".

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): critério de língua removido; disabled com asChild; alturas mínimas 32/40/48px por tokens; ícones com asChild via Slottable
- 2026-10-09 · planeador · Proposta → Planeado · aprovada pelo João (conversa), após revisão
- 2026-10-13 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-13 · programador · Em desenvolvimento → Pronto para teste · commit dcf7d57
- 2026-10-13 · testador · Pronto para teste → Em teste · início do teste
- 2026-10-13 · testador · Em teste → Aprovado · relatório 1, zero falhas
- 2026-10-13 · finalizador · Aprovado → Concluído · JSDoc com exemplo e notas de acessibilidade; changeset não aplicável (pacote privado)

### DS-011 · IconButton

- **Fase do MVP:** Formulários
- **Prioridade:** Alta
- **Depende de:** DS-008, DS-010
- **Estimativa:** S (≤ 2h)

**Objetivo:** ter um botão só com ícone que nunca fica sem nome acessível, reutilizado por Alert, Dialog, Toast, Popover e Pagination.

**Critérios de aceitação:**
- [ ] `IconButton` é implementado sobre o `Button` da DS-010 (o `icon` é passado como `leadingIcon`, sem texto) e reutiliza os seus estilos e variantes (`variant`, `size`, `disabled`, `asChild`) com formato quadrado (`data-icon-only`), sem duplicar as regras de cor nem a lógica de `disabled`.
- [ ] A prop `aria-label` é obrigatória no tipo TypeScript (omiti-la é erro de compilação), exceto quando é passada `aria-labelledby`.
- [ ] A prop `icon: ReactNode` é obrigatória; o ícone é renderizado dentro de um `<span aria-hidden="true">`.
- [ ] Dimensões pelos mesmos tokens do `Button`: com `data-icon-only`, a largura e a altura são `var(--ds-space-8)` em `sm` (32×32px), `var(--ds-space-10)` em `md` (40×40px) e `var(--ds-space-12)` em `lg` (48×48px), com o tamanho de letra de base de 16px; o botão é sempre quadrado e tem a mesma altura de um `Button` do mesmo `size`.
- [ ] `disabled` sem `asChild` usa o atributo nativo `disabled`; `disabled` com `asChild` comporta-se como no `Button`: o filho recebe `aria-disabled="true"`, `data-disabled` e `tabIndex={-1}`, não recebe o atributo `disabled`, e o clique é bloqueado na fase de captura (nem o `onClick` do `IconButton` nem o do filho disparam, e a navegação não acontece).
- [ ] Com `asChild`, o `<span aria-hidden="true">` do ícone é renderizado dentro do filho (via `Slottable`, como na DS-010), e o `aria-label` é aplicado ao filho; não é criado nenhum elemento à volta do filho.
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários: renderiza um `<button>` com o ícone; `variant` e `size` nos `data-*`; `ref` e `className`; `onClick`; teste de tipos (`// @ts-expect-error`) que prova que falta de `aria-label` não compila.
- Unitários (`asChild`): com `<a href="/x" />` como filho, o `<a>` é o elemento raiz, tem a classe `ds-button`, `data-icon-only` e o `<span aria-hidden="true">` do ícone lá dentro, e `getByRole('link', { name: 'Settings' })` encontra-o; com `asChild` + `disabled`, a ligação tem `aria-disabled="true"`, `data-disabled` e `tabindex="-1"`, não tem o atributo `disabled`, e clicar não chama nenhum `onClick`, com o evento cancelado (`defaultPrevented`).
- Acessibilidade: axe sem violações (incluindo `asChild` e `asChild` desativado); `getByRole('button', { name: 'Close' })` encontra o botão; Tab foca; Enter e Espaço ativam; `disabled` não recebe focus; com `asChild` + `disabled`, Tab salta a ligação.
- Visual/Storybook: `Default`, `Variants`, `Sizes` (com `play` que mede cada botão: largura igual à altura, ≥ 32px em `sm`, ≥ 40px em `md`, ≥ 48px em `lg`), `Disabled`, `AsLink` (`asChild` com `<a>`), `AsLinkDisabled`, `NextToButton` (com `play`: um `IconButton` e um `Button` do mesmo `size` têm a mesma altura), `DarkTheme`.

**Fora de âmbito:** tooltip automático com o texto do `aria-label` (compõe-se com a DS-023), botão de alternância (`aria-pressed`).

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): dimensões 32/40/48px pelos tokens do Button; disabled com asChild igual ao Button; ícone com asChild via Slottable; nomes de exemplo em inglês
- 2026-10-12 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-11)
- 2026-10-13 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-13 · programador · Em desenvolvimento → Pronto para teste · commit 53148f3
- 2026-10-13 · testador · Pronto para teste → Em teste · início da verificação
- 2026-10-13 · testador · Em teste → Aprovado · relatório 1 em 03-testing.md, todos os critérios verificados
- 2026-10-13 · finalizador · Aprovado → Concluído · JSDoc com exemplo e notas de acessibilidade já presentes; changeset não aplicável (pacote privado)

### DS-012 · Field (label, descrição e mensagem de erro)

- **Fase do MVP:** Formulários
- **Prioridade:** Alta
- **Depende de:** DS-009
- **Estimativa:** S (≤ 2h)

**Objetivo:** resolver uma vez a ligação acessível entre um controlo de formulário, a sua etiqueta, o texto de ajuda e o erro, para que Input, Textarea, Select, Checkbox, RadioGroup e Switch a reutilizem.

**Critérios de aceitação:**
- [ ] Exporta `Field`, `FieldLabel`, `FieldDescription` e `FieldError`, mais o hook `useFieldControl()` que devolve `{ id, 'aria-describedby', 'aria-invalid', 'aria-required', disabled }` para o controlo filho.
- [ ] `Field` aceita `id?` (gerado com `useId` se faltar), `invalid?`, `required?` e `disabled?`, e expõe-nos por contexto e como `data-invalid`/`data-disabled` no elemento raiz.
- [ ] `FieldLabel` renderiza um `<label>` com `htmlFor` igual ao `id` do controlo; quando `required`, mostra um indicador visual com `aria-hidden="true"` (a obrigatoriedade é comunicada pelo `aria-required` do controlo).
- [ ] `aria-describedby` do controlo inclui o `id` de `FieldDescription` quando existe e o de `FieldError` só quando `invalid` é verdadeiro.
- [ ] `FieldError` só é renderizado quando `invalid` é verdadeiro e usa o token `color-danger-text`; o erro nunca é comunicado só pela cor (inclui texto).
- [ ] Um controlo usado fora de um `Field` continua a funcionar (o hook devolve valores vazios).
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários: com um `<input>` nativo ligado pelo hook: `getByLabelText('Name')` devolve o input; `aria-describedby` contém os ids certos com e sem `invalid`; `FieldError` não existe no DOM quando `invalid` é falso; `disabled` do `Field` chega ao controlo; ids diferentes para dois `Field` na mesma página.
- Acessibilidade: axe sem violações nos estados normal, inválido e desativado; clicar na etiqueta foca o controlo; `toHaveAccessibleDescription` devolve descrição + erro quando inválido.
- Visual/Storybook: `Default`, `WithDescription`, `Required`, `Invalid`, `Disabled`, `DarkTheme` (usando um `<input>` nativo até existir a DS-013).

**Fora de âmbito:** validação de formulários, integração com bibliotecas de formulários, `Fieldset`/`legend` (o agrupamento de rádios é tratado na DS-016), layout horizontal.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): nome de exemplo do teste em inglês ('Name')
- 2026-10-12 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-11)
- 2026-10-13 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-13 · programador · Em desenvolvimento → Pronto para teste · commit 4363736
- 2026-10-13 · testador · Pronto para teste → Em teste · início dos testes
- 2026-10-13 · testador · Em teste → Aprovado · relatório 1 (03-testing.md)
- 2026-10-13 · finalizador · Aprovado → Concluído · registada em 04-concluded.md

### DS-013 · Input

- **Fase do MVP:** Formulários
- **Prioridade:** Alta
- **Depende de:** DS-010, DS-012
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** campo de texto de uma linha, integrado com o `Field`, com tamanhos, estado inválido e elementos decorativos à esquerda e à direita.

**Critérios de aceitação:**
- [ ] `Input` renderiza um `<input>` nativo (`type` por omissão `text`; aceita `email`, `password`, `search`, `number`, `tel`, `url`) e o `ref` aponta para esse `<input>`.
- [ ] Props: `size: 'sm' | 'md' | 'lg'` (o atributo HTML `size` é omitido do tipo), `invalid?`, `leadingAddon?` e `trailingAddon?` (`ReactNode`, ex.: ícone de pesquisa).
- [ ] Dentro de um `Field`, recebe automaticamente `id`, `aria-describedby`, `aria-invalid`, `aria-required` e `disabled`; props passadas diretamente ao `Input` têm prioridade.
- [ ] Suporta modo controlado (`value` + `onChange`) e não controlado (`defaultValue`), sem avisos do React na consola em nenhum dos dois.
- [ ] Estados estilizados: `:hover`, `:focus-visible`, `disabled`, `readOnly`, inválido (`data-invalid`, borda `color-danger-default` com contraste ≥ 3:1) e placeholder com contraste ≥ 4,5:1.
- [ ] Os addons são decorativos (`aria-hidden="true"`), ficam dentro do contorno do campo e clicar neles foca o input.
- [ ] Alturas pelos mesmos tokens do `Button` (DS-010): `Input.css` declara `min-height: var(--ds-space-8)` para `data-size="sm"` (32px), `var(--ds-space-10)` para `md` (40px) e `var(--ds-space-12)` para `lg` (48px), aplicado ao contorno do campo (o elemento que inclui os addons); com o tamanho de letra de base de 16px, a altura renderizada é ≥ 32px, ≥ 40px e ≥ 48px, e é igual à de um `Button` do mesmo `size`.
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários: escrever "abc" com `userEvent.type` altera o valor (não controlado) e chama `onChange` três vezes (controlado); `defaultValue`; `disabled` impede a escrita; `readOnly` não altera o valor; `size` em `data-size`; `ref.current` é um `HTMLInputElement`; `className` aplicada; dentro de `Field invalid` tem `aria-invalid="true"` e `aria-describedby` com o id do erro.
- Acessibilidade: axe sem violações (com etiqueta via `Field` e via `aria-label`); Tab foca o input; `getByLabelText` encontra-o; com `disabled`, Tab salta-o.
- Visual/Storybook: `Default`, `Sizes` (com `play` que mede a altura do campo: ≥ 32px em `sm`, ≥ 40px em `md`, ≥ 48px em `lg`), `WithButton` (um `Input` e um `Button` lado a lado em cada `size`, com `play` que confirma que têm a mesma altura), `WithField`, `WithAddons`, `Invalid`, `Disabled`, `ReadOnly`, `Password`, `DarkTheme`.

**Fora de âmbito:** máscaras de formatação, botão de limpar, alternância de visibilidade da palavra-passe, input numérico com botões de incremento.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): alturas 32/40/48px pelos tokens do Button, medidas nas stories Sizes e WithButton; DS-010 acrescentada às dependências
- 2026-10-12 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-11)
- 2026-10-13 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-13 · programador · Em desenvolvimento → Pronto para teste · commit 97b7644
- 2026-10-13 · testador · Pronto para teste → Em teste · início dos testes
- 2026-10-13 · testador · Em teste → Aprovado · relatório 1 (03-testing.md)
- 2026-10-13 · finalizador · Aprovado → Concluído · registada em 04-concluded.md

### DS-014 · Textarea

- **Fase do MVP:** Formulários
- **Prioridade:** Média
- **Depende de:** DS-013
- **Estimativa:** S (≤ 2h)

**Objetivo:** campo de texto de várias linhas com a mesma aparência e a mesma integração com o `Field` do `Input`.

**Critérios de aceitação:**
- [ ] `Textarea` renderiza um `<textarea>` nativo; props `size: 'sm' | 'md' | 'lg'`, `invalid?`, `rows` (omissão 3) e `resize: 'none' | 'vertical' | 'both'` (omissão `vertical`, exposto como `data-resize`).
- [ ] Reutiliza os tokens e os estados visuais do `Input` (mesma borda, raio, focus, inválido, desativado) sem copiar valores literais; para cada `size`, o tamanho de letra e o padding horizontal são os do `Input`.
- [ ] Alturas: como o campo é multilinha, os 32/40/48px aplicam-se como altura **mínima** e não como altura fixa. `Textarea.css` declara `min-height: var(--ds-space-8)` para `data-size="sm"`, `var(--ds-space-10)` para `md` e `var(--ds-space-12)` para `lg`; a altura real resulta de `rows` × altura de linha + padding vertical, e nunca fica abaixo do mínimo, nem com `rows={1}` nem quando o utilizador redimensiona. Com `rows={1}`, a altura é igual à de um `Input` do mesmo `size`.
- [ ] Integra com o `Field` da mesma forma que o `Input` (id, `aria-describedby`, `aria-invalid`, `aria-required`, `disabled`).
- [ ] Suporta modo controlado e não controlado sem avisos do React.
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários: escrever texto com quebras de linha altera o valor; `onChange` em modo controlado; `defaultValue`; `rows` por omissão e personalizado; `data-resize`; `disabled` e `readOnly`; `ref.current` é um `HTMLTextAreaElement`; integração com `Field invalid`.
- Acessibilidade: axe sem violações; Tab foca; `getByLabelText` encontra-o; Enter insere uma nova linha (não submete o formulário).
- Visual/Storybook: `Default`, `Sizes` (com `play`: com `rows={1}`, a altura é ≥ 32px em `sm`, ≥ 40px em `md` e ≥ 48px em `lg`, e igual à de um `Input` do mesmo `size` ao lado; com `rows` por omissão, a altura é maior do que esse mínimo), `WithField`, `Invalid`, `Disabled`, `ResizeNone`, `DarkTheme`.

**Fora de âmbito:** altura automática conforme o conteúdo, contador de caracteres.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): 32/40/48px como altura mínima por tamanho (a altura real depende de rows), medida na story Sizes
- 2026-10-09 · planeador · interpretação da altura mínima confirmada pelo João (conversa)
- 2026-10-12 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-11)
- 2026-10-15 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-15 · programador · Em desenvolvimento → Pronto para teste · commit 3ece050
- 2026-10-15 · testador · Pronto para teste → Em teste · início dos testes
- 2026-10-15 · testador · Em teste → Aprovado · relatório 1 (03-testing.md)
- 2026-10-15 · finalizador · Aprovado → Concluído · registada em 04-concluded.md

### DS-015 · Checkbox

- **Fase do MVP:** Formulários
- **Prioridade:** Alta
- **Depende de:** DS-008, DS-012
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** caixa de seleção acessível com três estados (marcada, desmarcada, indeterminada), baseada em `@radix-ui/react-checkbox`.

**Critérios de aceitação:**
- [ ] Usa `@radix-ui/react-checkbox`; o elemento raiz tem `role="checkbox"` e `aria-checked` com `true`, `false` ou `mixed`.
- [ ] Props: `checked?: boolean | 'indeterminate'`, `defaultChecked?`, `onCheckedChange?`, `disabled?`, `required?`, `name?`, `value?`, `size: 'sm' | 'md'`, e `children` como etiqueta opcional associada ao controlo.
- [ ] Modo controlado e não controlado; dentro de um `<form>` com `name`, o valor é incluído no `FormData` quando marcada.
- [ ] Indicador com `CheckIcon` (marcada) e `MinusIcon` (indeterminada) do pacote de ícones; estado exposto como `data-state`.
- [ ] Integra com o `Field` (id, `aria-describedby`, `aria-invalid`, `disabled`); a área clicável inclui a etiqueta e mede pelo menos 24×24px.
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-checkbox`); C1 a C5.

**Testes exigidos:**
- Unitários: clicar alterna `aria-checked` (não controlado); em modo controlado `onCheckedChange` recebe o novo valor e o estado só muda quando a prop muda; `checked="indeterminate"` → `aria-checked="mixed"`; clicar na etiqueta alterna; `disabled` não alterna; valor presente no `FormData` de um formulário submetido.
- Acessibilidade: axe sem violações; Tab foca a checkbox; Espaço alterna o estado; Enter não alterna; `getByRole('checkbox', { name: 'I accept the terms' })` encontra-a; com `disabled`, Tab salta-a.
- Visual/Storybook: `Default`, `Checked`, `Indeterminate`, `Disabled`, `Sizes`, `WithField` (com descrição e erro), `Group` (lista com "Select all" em estado indeterminado), `DarkTheme`.

**Fora de âmbito:** componente `CheckboxGroup` com estado próprio, cartões selecionáveis.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): nomes de exemplo em inglês ('I accept the terms', "Select all")
- 2026-10-12 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-11)
- 2026-10-14 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-14 · programador · Em desenvolvimento → Pronto para teste · commit 4467da0
- 2026-10-14 · testador · Pronto para teste → Em teste · início da verificação
- 2026-10-14 · testador · Em teste → Aprovado · relatório 1, todos os critérios verificados
- 2026-10-14 · finalizador · Aprovado → Concluído · DoD verificada; changeset não aplicável (@ds/ui privado)

### DS-016 · RadioGroup

- **Fase do MVP:** Formulários
- **Prioridade:** Média
- **Depende de:** DS-012
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** grupo de opções exclusivas com navegação por setas, baseado em `@radix-ui/react-radio-group` (cobre o componente "Radio" do âmbito do MVP).

**Critérios de aceitação:**
- [ ] Exporta `RadioGroup` (`role="radiogroup"`) e `Radio` (item com `role="radio"` e etiqueta via `children`).
- [ ] `RadioGroup`: `value?`, `defaultValue?`, `onValueChange?`, `name?`, `disabled?`, `required?`, `orientation: 'vertical' | 'horizontal'` (omissão `vertical`, com `aria-orientation`), e nome acessível por `aria-label` ou `aria-labelledby` (um dos dois obrigatório no tipo).
- [ ] `Radio`: `value` (obrigatório), `disabled?`, `size: 'sm' | 'md'`.
- [ ] Modo controlado e não controlado; com `name`, o valor selecionado entra no `FormData`.
- [ ] Tabindex itinerante: só um rádio do grupo está na ordem de tabulação (o selecionado, ou o primeiro ativo se nenhum estiver selecionado).
- [ ] Integra com o `Field` para descrição e erro do grupo (`aria-describedby`, `aria-invalid`).
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-radio-group`); C1 a C5.

**Testes exigidos:**
- Unitários: clicar num rádio seleciona-o e desmarca o anterior; `onValueChange` recebe o `value`; `defaultValue`; modo controlado; rádio `disabled` não é selecionável; grupo `disabled` desativa todos; valor no `FormData`.
- Acessibilidade: axe sem violações; Tab entra no grupo no rádio selecionado e o Tab seguinte sai do grupo; Seta para baixo e Seta para a direita movem o focus para o rádio seguinte e selecionam-no; Seta para cima e Seta para a esquerda fazem o inverso; as setas dão a volta do último para o primeiro; rádios desativados são saltados; Espaço seleciona o rádio focado.
- Visual/Storybook: `Default`, `Horizontal`, `WithDefaultValue`, `DisabledItem`, `DisabledGroup`, `WithField` (erro), `DarkTheme`.

**Fora de âmbito:** cartões de rádio, botões segmentados.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-12 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-11)
- 2026-10-15 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-15 · programador · Em desenvolvimento → Pronto para teste · commit 4aa0448
- 2026-10-15 · testador · Pronto para teste → Em teste · início da verificação
- 2026-10-15 · testador · Em teste → Aprovado · relatório 1, todos os critérios verificados
- 2026-10-15 · finalizador · Aprovado → Concluído · relatório 1 aprovado, documentação em ordem, changeset não aplicável

### DS-017 · Switch

- **Fase do MVP:** Formulários
- **Prioridade:** Média
- **Depende de:** DS-012
- **Estimativa:** S (≤ 2h)

**Objetivo:** interruptor ligado/desligado para definições com efeito imediato, baseado em `@radix-ui/react-switch`.

**Critérios de aceitação:**
- [ ] Usa `@radix-ui/react-switch`; o elemento raiz é um `<button role="switch">` com `aria-checked` `true`/`false` e `data-state`.
- [ ] Props: `checked?`, `defaultChecked?`, `onCheckedChange?`, `disabled?`, `required?`, `name?`, `value?`, `size: 'sm' | 'md'`, e `children` como etiqueta opcional associada.
- [ ] Modo controlado e não controlado; com `name`, o valor entra no `FormData` quando ligado.
- [ ] O estado ligado/desligado distingue-se pela posição do manípulo e não só pela cor (WCAG 1.4.1); pista e manípulo com contraste ≥ 3:1 face ao fundo nos dois temas.
- [ ] A transição do manípulo respeita `prefers-reduced-motion`.
- [ ] Integra com o `Field` (id, `aria-describedby`, `disabled`).
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-switch`); C1 a C5.

**Testes exigidos:**
- Unitários: clicar alterna `aria-checked`; `onCheckedChange` recebe o novo valor; modo controlado; `defaultChecked`; clicar na etiqueta alterna; `disabled` não alterna; valor no `FormData`.
- Acessibilidade: axe sem violações; Tab foca; Espaço alterna; Enter alterna; `getByRole('switch', { name: 'Notifications' })` encontra-o; com `disabled`, Tab salta-o.
- Visual/Storybook: `Default`, `Checked`, `Disabled`, `Sizes`, `WithField`, `DarkTheme`.

**Fora de âmbito:** texto "On/Off" dentro da pista, ícones no manípulo.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): nome de exemplo do teste em inglês ('Notifications')
- 2026-10-12 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-11)
- 2026-10-16 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-16 · programador · Em desenvolvimento → Pronto para teste · commit 3fbd332
- 2026-10-16 · testador · Pronto para teste → Em teste · início da verificação
- 2026-10-16 · testador · Em teste → Aprovado · relatório 1, todos os critérios verificados
- 2026-10-16 · finalizador · Aprovado → Concluído · relatório 1 aprovado, documentação em ordem, changeset não aplicável

### DS-018 · Select

- **Fase do MVP:** Formulários
- **Prioridade:** Alta
- **Depende de:** DS-008, DS-013
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** lista de seleção única com aparência própria e teclado completo, baseada em `@radix-ui/react-select`.

**Critérios de aceitação:**
- [ ] Exporta `Select` (raiz + gatilho + lista numa API simples), `SelectItem`, `SelectGroup` e `SelectSeparator`.
- [ ] `Select`: `value?`, `defaultValue?`, `onValueChange?`, `open?`, `defaultOpen?`, `onOpenChange?`, `placeholder?`, `disabled?`, `required?`, `name?`, `size: 'sm' | 'md' | 'lg'`, `invalid?`; `ref` e `className` aplicam-se ao gatilho.
- [ ] `SelectItem`: `value` (obrigatório), `disabled?`, `children`; `SelectGroup`: `label` (obrigatório).
- [ ] O gatilho tem `role="combobox"`, `aria-expanded` e mostra o `ChevronDownIcon`; a lista tem `role="listbox"`, é renderizada num portal, usa o token `z-index-dropdown` e tem a mesma largura mínima do gatilho; o item selecionado mostra o `CheckIcon` e `aria-selected="true"`.
- [ ] Modo controlado e não controlado; com `name`, o valor entra no `FormData`.
- [ ] Integra com o `Field`: a etiqueta fica associada ao gatilho e `aria-describedby`/`aria-invalid` são aplicados.
- [ ] O gatilho tem a mesma borda, raio e estados do `Input` para cada `size`.
- [ ] Alturas do gatilho pelos mesmos tokens do `Button` e do `Input`: `Select.css` declara `min-height: var(--ds-space-8)` para `data-size="sm"` (32px), `var(--ds-space-10)` para `md` (40px) e `var(--ds-space-12)` para `lg` (48px); com o tamanho de letra de base de 16px, a altura renderizada do gatilho é ≥ 32px, ≥ 40px e ≥ 48px, e é igual à de um `Input` do mesmo `size`.
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-select`); C1 a C5.

**Testes exigidos:**
- Unitários: mostra o `placeholder` sem valor; `defaultValue` mostra o texto do item; selecionar um item chama `onValueChange` e fecha a lista; modo controlado; item `disabled` não é selecionável; `disabled` no `Select` impede abrir; valor no `FormData`.
- Acessibilidade: axe sem violações com a lista fechada e aberta. Teclado (em teste unitário ou em `play` de uma story, executado pelo `pnpm test:a11y`): com o gatilho focado, Enter, Espaço, Seta para baixo e Seta para cima abrem a lista; Seta para baixo/cima movem o item ativo; Home e End vão ao primeiro e ao último; escrever uma letra salta para o item que começa por ela; Enter ou Espaço selecionam o item ativo, fecham e devolvem o focus ao gatilho; Esc fecha sem alterar o valor e devolve o focus ao gatilho; itens desativados são saltados.
- Visual/Storybook: `Default`, `WithDefaultValue`, `Sizes` (com `play` que mede a altura do gatilho: ≥ 32px em `sm`, ≥ 40px em `md`, ≥ 48px em `lg`, e igual à de um `Input` do mesmo `size` ao lado), `Groups`, `DisabledItem`, `Disabled`, `WithField` (inválido), `LongList` (30 itens com scroll), `KeyboardInteraction` (com `play`), `DarkTheme` (com a lista aberta).

**Fora de âmbito:** seleção múltipla, pesquisa/filtro dentro da lista (combobox com autocomplete), carregamento assíncrono de opções, virtualização.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): alturas do gatilho 32/40/48px pelos tokens do Button e do Input, medidas na story Sizes
- 2026-10-12 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-11)
- 2026-10-14 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-14 · programador · Em desenvolvimento → Pronto para teste · commit 74464f5
- 2026-10-14 · testador · Pronto para teste → Em teste · início dos testes
- 2026-10-14 · testador · Em teste → Aprovado · relatório 1, todos os critérios verificados, zero falhas
- 2026-10-14 · finalizador · Aprovado → Concluído · verificação de entrada ok, changeset não aplicável

### DS-019 · Badge

- **Fase do MVP:** Overlays e feedback
- **Prioridade:** Média
- **Depende de:** DS-009
- **Estimativa:** S (≤ 2h)

**Objetivo:** etiqueta curta para estados e contagens (ex.: "Active", "3"), usada em tabelas e cartões.

**Critérios de aceitação:**
- [ ] `Badge` renderiza um `<span>` com a classe `ds-badge`; props `variant: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info'` (omissão `neutral`), `appearance: 'subtle' | 'solid'` (omissão `subtle`), `size: 'sm' | 'md'`, `asChild?`.
- [ ] `variant`, `appearance` e `size` são expostos como `data-*`.
- [ ] Texto com contraste ≥ 4,5:1 em todas as combinações de variante × aparência × tema (12 combinações por tema).
- [ ] Não tem `role` próprio: é texto estático; o significado está sempre no texto e não só na cor.
- [ ] Texto longo não parte a linha dentro do badge (`white-space: nowrap`) e não faz o badge ultrapassar o contentor (reticências a partir da largura máxima).
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários: renderiza o texto; valores por omissão nos `data-*`; cada variante e aparência; `className`; `ref`; `asChild` com `<a>`.
- Acessibilidade: axe sem violações (incluindo `color-contrast`) para as 12 combinações; o texto é encontrado por `getByText`.
- Visual/Storybook: `Variants`, `Solid`, `Sizes`, `LongText`, `DarkTheme` (todas as variantes nas duas aparências).

**Fora de âmbito:** badge com ponto de notificação posicionado sobre outro elemento, badge removível (tag com botão de fechar).

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): texto de exemplo em inglês ("Active")
- 2026-10-12 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-11)
- 2026-10-16 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-16 · programador · Em desenvolvimento → Pronto para teste · commit 15b540c
- 2026-10-16 · testador · Pronto para teste → Em teste · início dos testes
- 2026-10-16 · testador · Em teste → Aprovado · relatório 1, todos os critérios verificados, zero falhas
- 2026-10-16 · finalizador · Aprovado → Concluído · changeset não aplicável (pacote privado), documentação e stories verificadas

### DS-020 · Spinner e Skeleton

- **Fase do MVP:** Overlays e feedback
- **Prioridade:** Média
- **Depende de:** DS-009
- **Estimativa:** S (≤ 2h)

**Objetivo:** dois indicadores de carregamento: `Spinner` para ações em curso e `Skeleton` para conteúdo ainda não carregado.

**Critérios de aceitação:**
- [ ] `Spinner`: `size: 'sm' | 'md' | 'lg'`, `label?: string` (omissão `"Loading"`); renderiza um elemento com `role="status"` cujo nome acessível é o `label` (texto em `VisuallyHidden`); a parte gráfica tem `aria-hidden="true"` e usa `currentColor`.
- [ ] `Skeleton`: `variant: 'text' | 'rect' | 'circle'` (omissão `text`), `width?` e `height?` (`number | string`, aplicados por CSS custom properties `--ds-skeleton-width`/`--ds-skeleton-height`), `lines?: number` para a variante `text`; tem `aria-hidden="true"`.
- [ ] As duas animações param com `prefers-reduced-motion: reduce` (o Spinner mantém-se visível e estático; o Skeleton fica sem brilho).
- [ ] Cada componente tem a sua pasta e cumpre C1 separadamente.
- [ ] G1 a G3; C1 a C5 (para os dois).

**Testes exigidos:**
- Unitários: `Spinner` tem `role="status"` e nome por omissão; `label` personalizado; `data-size`; `Skeleton` com `lines={3}` renderiza três linhas; `width`/`height` chegam às custom properties; `ref` e `className` nos dois.
- Acessibilidade: axe sem violações; `getByRole('status', { name: 'Saving' })` encontra o Spinner; o Skeleton não aparece na árvore de acessibilidade (`aria-hidden`); nenhum dos dois recebe focus com Tab.
- Visual/Storybook: `Spinner/Sizes`, `Spinner/CustomLabel`, `Spinner/DarkTheme`, `Skeleton/Text`, `Skeleton/Rect`, `Skeleton/Circle`, `Skeleton/CardPlaceholder`, `Skeleton/DarkTheme`.

**Fora de âmbito:** barra de progresso, overlay de carregamento de página inteira, estado `loading` do Button (DS-021).

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): nome de exemplo do teste em inglês ('Saving')
- 2026-10-12 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-11)

### DS-021 · Button: estado `loading`

- **Fase do MVP:** Overlays e feedback
- **Prioridade:** Média
- **Depende de:** DS-011, DS-020
- **Estimativa:** S (≤ 2h)

**Objetivo:** permitir que `Button` e `IconButton` mostrem que uma ação está em curso sem mudar de tamanho nem perder o focus.

**Critérios de aceitação:**
- [ ] Nova prop `loading?: boolean` em `Button` (herdada pelo `IconButton`) e `loadingLabel?: string` (omissão `"Loading"`).
- [ ] Com `loading`, o elemento raiz tem `aria-busy="true"`, `aria-disabled="true"` e `data-loading`, **não** recebe o atributo `disabled` nem `tabIndex={-1}`, e continua na ordem de Tab.
- [ ] Diferença intencional face a `disabled`: `disabled` tira o elemento da ordem de Tab (DS-010); `loading` mantém-no focável, para que quem usa teclado ou leitor de ecrã não perca o focus enquanto a ação decorre e possa continuar a partir do mesmo ponto quando ela termina. Esta diferença fica escrita no JSDoc das props `loading` e `disabled` (aparece no autodocs) e na descrição da story `Button/Loading`.
- [ ] Com `loading`, o clique é bloqueado na fase de captura (`preventDefault` + `stopPropagation`), como no `disabled` com `asChild` da DS-010: o `onClick` não dispara com rato, Enter ou Espaço, e um botão `type="submit"` não submete o formulário.
- [ ] Posição do `Spinner`: é renderizado no `<span aria-hidden="true">` do `leadingIcon`, substituindo o ícone enquanto `loading` for verdadeiro (o span é criado se não houver `leadingIcon`); no `IconButton`, substitui o `icon` no mesmo span, e o botão continua quadrado. O `trailingIcon` não muda.
- [ ] Com `asChild` + `loading`: o filho (ex.: `<a>`) continua focável, recebe `aria-disabled="true"`, `aria-busy="true"` e `data-loading`, o clique é bloqueado na fase de captura (nem o `onClick` do `Button` nem o do filho disparam, e a navegação não acontece), e o `Spinner` é renderizado dentro do filho, no mesmo span do `leadingIcon`, via `Slottable`; não é criado nenhum elemento à volta do filho.
- [ ] Nome e descrição acessíveis: o nome do botão não muda com `loading` (o `Spinner` está dentro de um span `aria-hidden`); o `loadingLabel` fica num elemento visualmente escondido dentro desse span, referenciado por `aria-describedby` do elemento raiz (acrescentado a um `aria-describedby` que o consumidor já tenha passado), de modo que a descrição acessível passa a incluir o `loadingLabel` enquanto `loading` for verdadeiro.
- [ ] O botão não anuncia o resultado da ação: o JSDoc da prop `loading` e a descrição da story `Button/Loading` dizem que o sucesso ou o erro é comunicado pelo consumidor, com um `Toast` (DS-027) ou outro feedback visível e anunciado, e não pelo botão.
- [ ] A largura do botão é igual com e sem `loading` quando há `leadingIcon`; sem `leadingIcon`, o texto mantém-se visível e o botão só cresce a largura do `Spinner` mais o espaçamento.
- [ ] Com `disabled` e `loading` em simultâneo, prevalece o comportamento de `disabled` (fora da ordem de Tab); o `Spinner` continua visível.
- [ ] G1 a G3; C1 a C5 (os testes e as stories acrescentam-se aos ficheiros existentes do `Button` e do `IconButton`).

**Testes exigidos:**
- Unitários: com `loading`, o `Spinner` está presente dentro do span do `leadingIcon` e substitui o ícone; o elemento raiz tem `aria-busy="true"`, `aria-disabled="true"` e `data-loading`, e não tem `disabled` nem `tabindex="-1"`; clicar não chama `onClick` e o evento fica cancelado (`defaultPrevented`); um botão `type="submit"` com `loading` dentro de um `<form>` não chama `onSubmit`; sem `loading`, nada muda face à DS-010 (os testes existentes continuam a passar sem alterações); `loadingLabel` personalizado; `disabled` + `loading` → atributo `disabled` presente.
- Unitários (`asChild` + `loading`): com `<a href="/x">Save</a>`, a ligação tem `aria-disabled="true"`, `aria-busy="true"` e `data-loading`, não tem `tabindex="-1"`, tem o `Spinner` dentro do `<a>` e antes do texto, e clicar não chama o `onClick` do `Button` nem o do `<a>`, com o evento cancelado.
- Unitários (`IconButton`): com `loading`, o `Spinner` substitui o ícone e o nome acessível continua a ser o `aria-label`.
- Acessibilidade: axe sem violações (incluindo `asChild` + `loading`); com `loading`, Tab ainda foca o botão; Enter e Espaço não chamam `onClick`; `getByRole('button', { name: 'Save' })` continua a encontrá-lo (o nome é exatamente "Save") e `toHaveAccessibleDescription('Loading')` passa; com `asChild` + `loading`, Tab foca a ligação e Enter não navega; comparação explícita num teste: o mesmo botão com `disabled` é saltado pelo Tab e com `loading` não é.
- Visual/Storybook: `Button/Loading` (as quatro variantes, com a nota sobre a diferença face a `disabled` na descrição), `Button/LoadingToggle` (com `play`: clicar ativa o loading, o focus mantém-se no botão e a largura não muda), `Button/AsLinkLoading` (`asChild` + `loading`), `IconButton/Loading`, e o estado loading acrescentado a `Button/DarkTheme`.

**Fora de âmbito:** texto alternativo durante o carregamento (ex.: "Saving…" a substituir o texto), barra de progresso dentro do botão, anúncio automático do fim da ação (fica a cargo do consumidor, por exemplo com um Toast).

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): loading focável com aria-disabled documentado como diferença intencional face a disabled; clique bloqueado na captura; asChild + loading; posição do Spinner via Slottable; loadingLabel por aria-describedby em vez de role="status"; nomes de exemplo em inglês
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): loadingLabel por aria-describedby, bloqueio da submissão e largura sem leadingIcon confirmados; novo critério: a documentação diz que o resultado da ação é anunciado pelo Toast ou por outro feedback do consumidor, não pelo botão
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-022 · Alert

- **Fase do MVP:** Overlays e feedback
- **Prioridade:** Média
- **Depende de:** DS-011
- **Estimativa:** S (≤ 2h)

**Objetivo:** mensagem de feedback em linha (informação, sucesso, aviso, erro) com título, descrição, ícone e fecho opcional.

**Critérios de aceitação:**
- [ ] `Alert` com props `variant: 'info' | 'success' | 'warning' | 'danger'` (omissão `info`), `title?: ReactNode`, `children` (descrição), `icon?: ReactNode | false` (por omissão o ícone da variante: `InfoIcon`, `CircleCheckIcon`, `TriangleAlertIcon`, `CircleXIcon`), `onClose?`, `closeLabel?: string` (omissão `"Close"`).
- [ ] `role` por omissão: `"alert"` para `danger` e `warning`, `"status"` para `info` e `success`; o consumidor pode passar outro `role`.
- [ ] O botão de fechar (um `IconButton` com `XIcon`) só existe quando `onClose` é passado; o `Alert` não se esconde sozinho (quem controla a visibilidade é o consumidor).
- [ ] O ícone é decorativo (`aria-hidden`); a variante é comunicada por ícone + texto, não só pela cor.
- [ ] Texto e ícone com contraste AA sobre o fundo `*-subtle` de cada variante, nos dois temas.
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários: renderiza título e descrição; `role` certo por variante; `role` personalizado; ícone por omissão por variante; `icon={false}` remove-o; sem `onClose` não há botão; clicar no botão chama `onClose` uma vez; `closeLabel` personalizado.
- Acessibilidade: axe sem violações nas quatro variantes; `getByRole('alert')`/`getByRole('status')`; Tab foca o botão de fechar; Enter e Espaço chamam `onClose`.
- Visual/Storybook: `Info`, `Success`, `Warning`, `Danger`, `WithoutTitle`, `Dismissible`, `LongContent`, `DarkTheme` (as quatro variantes).

**Fora de âmbito:** ações dentro do alerta (botões), fecho automático por tempo (isso é o Toast, DS-027), banner de página inteira.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-023 · Tooltip

- **Fase do MVP:** Overlays e feedback
- **Prioridade:** Média
- **Depende de:** DS-011
- **Estimativa:** S (≤ 2h)

**Objetivo:** texto de ajuda curto que aparece ao passar o rato ou ao focar um elemento, baseado em `@radix-ui/react-tooltip`.

**Critérios de aceitação:**
- [ ] Exporta `TooltipProvider` (atraso partilhado) e `Tooltip` com API simples: `content: ReactNode` (obrigatório), `children` (um único elemento gatilho), `side: 'top' | 'right' | 'bottom' | 'left'` (omissão `top`), `align?`, `delayDuration?` (omissão 400 ms), `open?`, `defaultOpen?`, `onOpenChange?`.
- [ ] O conteúdo tem `role="tooltip"`, é renderizado num portal com o token `z-index-tooltip`, e o gatilho recebe `aria-describedby` enquanto o tooltip está aberto.
- [ ] Cumpre WCAG 1.4.13: abre com hover e com focus de teclado; fecha com Esc sem mover o focus; mantém-se aberto enquanto o ponteiro está sobre o conteúdo; não fecha sozinho por tempo.
- [ ] `ref` e `className` aplicam-se ao conteúdo; largura máxima definida por token e texto longo quebra em várias linhas.
- [ ] A animação de entrada respeita `prefers-reduced-motion`.
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-tooltip`); C1 a C5.

**Testes exigidos:**
- Unitários: fechado por omissão (o conteúdo não está no DOM); `defaultOpen` mostra-o; modo controlado com `open`/`onOpenChange`; `side` exposto em `data-side`.
- Acessibilidade: axe sem violações com o tooltip aberto; focar o gatilho com Tab abre o tooltip e o gatilho passa a ter descrição acessível igual ao `content`; Esc fecha e o focus continua no gatilho; Tab para fora fecha; hover abre depois do atraso (com timers falsos ou em `play`).
- Visual/Storybook: `Default`, `Sides`, `OnIconButton`, `LongContent`, `KeyboardInteraction` (com `play`), `DarkTheme` (com `defaultOpen`).

**Fora de âmbito:** conteúdo interativo dentro do tooltip (usar Popover, DS-024), tooltip em elementos desativados, seta personalizável.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-024 · Popover

- **Fase do MVP:** Overlays e feedback
- **Prioridade:** Média
- **Depende de:** DS-011, DS-013
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** painel flutuante não modal, ancorado a um gatilho, para conteúdo interativo (filtros, formulários curtos), baseado em `@radix-ui/react-popover`.

**Critérios de aceitação:**
- [ ] Exporta `Popover`, `PopoverTrigger` (com `asChild`), `PopoverContent` e `PopoverClose`.
- [ ] `Popover`: `open?`, `defaultOpen?`, `onOpenChange?`; `PopoverContent`: `side` (omissão `bottom`), `align` (omissão `center`), `sideOffset` por token, `showClose?: boolean` com `closeLabel?` (omissão `"Close"`), `ref` e `className`.
- [ ] O gatilho tem `aria-haspopup="dialog"`, `aria-expanded` e `aria-controls`; o conteúdo tem `role="dialog"`, é renderizado num portal com o token `z-index-dropdown` e exige nome acessível (`aria-label` ou `aria-labelledby`).
- [ ] Ao abrir, o focus passa para o conteúdo; ao fechar (Esc, clique fora, `PopoverClose`), o focus volta ao gatilho.
- [ ] O conteúdo reposiciona-se quando não cabe no lado pedido (comportamento de colisão do Radix ativo) e não ultrapassa a largura do viewport.
- [ ] Gatilho desativado: com `<PopoverTrigger asChild>` à volta de um `Button disabled` (ou `IconButton disabled`), o popover não abre com clique, Enter nem Espaço, `onOpenChange` não é chamado, e o gatilho não recebe focus com Tab.
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-popover`); C1 a C5.

**Testes exigidos:**
- Unitários: fechado por omissão; clicar no gatilho abre e volta a fechar; `defaultOpen`; modo controlado; `onOpenChange` chamado com `true`/`false`; clicar fora fecha; `PopoverClose` fecha; `showClose` renderiza o botão com o `closeLabel`; com um `Button disabled` como gatilho, clicar não abre o popover e `onOpenChange` não é chamado.
- Acessibilidade: axe sem violações com o popover aberto; Enter e Espaço no gatilho abrem; o focus fica dentro do conteúdo depois de abrir; Tab percorre os elementos focáveis do conteúdo; Esc fecha e devolve o focus ao gatilho; `aria-expanded` alterna entre `false` e `true`; com o gatilho desativado, Tab salta-o (o focus passa do elemento anterior para o seguinte) e o conteúdo nunca aparece no DOM.
- Visual/Storybook: `Default`, `Placement` (lados e alinhamentos), `WithForm` (Input + Button), `WithCloseButton`, `Controlled`, `DisabledTrigger`, `KeyboardInteraction` (com `play`), `DarkTheme` (aberto).

**Fora de âmbito:** popover modal com bloqueio de fundo (usar Dialog), seta decorativa, abertura por hover.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): gatilho com Button disabled não abre o popover nem recebe focus, com critério, testes e story DisabledTrigger
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-025 · Dialog (Modal)

- **Fase do MVP:** Overlays e feedback
- **Prioridade:** Alta
- **Depende de:** DS-011, DS-013
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** janela modal acessível com focus preso, baseada em `@radix-ui/react-dialog` (cobre "Modal/Dialog" do âmbito do MVP).

**Critérios de aceitação:**
- [ ] Exporta `Dialog`, `DialogTrigger` (com `asChild`), `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogFooter` e `DialogClose`.
- [ ] `Dialog`: `open?`, `defaultOpen?`, `onOpenChange?`; `DialogContent`: `size: 'sm' | 'md' | 'lg'`, `closeLabel?` (omissão `"Close"`), `hideClose?`, `closeOnOverlayClick?` (omissão `true`), `ref` e `className`.
- [ ] O conteúdo tem `role="dialog"`, `aria-modal="true"`, `aria-labelledby` a apontar para o `DialogTitle` e `aria-describedby` para o `DialogDescription` quando existe; `DialogTitle` é obrigatório (em desenvolvimento, a falta dele gera o aviso do Radix na consola).
- [ ] Renderizado num portal com overlay (`color-overlay`) e token `z-index-modal`; enquanto está aberto, o scroll da página fica bloqueado e o conteúdo por trás fica inacessível a leitores de ecrã.
- [ ] Ao abrir, o focus vai para o primeiro elemento focável do diálogo; ao fechar, volta ao gatilho.
- [ ] Em ecrãs estreitos ocupa a largura disponível com margem definida por token; conteúdo longo faz scroll dentro do `DialogBody`, com cabeçalho e rodapé sempre visíveis.
- [ ] Animações de entrada e saída respeitam `prefers-reduced-motion`.
- [ ] Gatilho desativado: com `<DialogTrigger asChild>` à volta de um `Button disabled` (ou `IconButton disabled`), o diálogo não abre com clique, Enter nem Espaço, `onOpenChange` não é chamado, e o gatilho não recebe focus com Tab.
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-dialog`); C1 a C5.

**Testes exigidos:**
- Unitários: fechado por omissão; clicar no gatilho abre; `defaultOpen`; modo controlado; `onOpenChange(false)` ao clicar no botão de fechar, em `DialogClose` e no overlay; com `closeOnOverlayClick={false}` o clique no overlay não fecha; `hideClose` remove o botão; `size` em `data-size`; com um `Button disabled` como gatilho, clicar não abre o diálogo e `onOpenChange` não é chamado.
- Acessibilidade: axe sem violações com o diálogo aberto; `getByRole('dialog', { name: <título> })`; ao abrir, o focus está dentro do diálogo; Tab no último elemento focável volta ao primeiro e Shift+Tab no primeiro vai para o último (focus preso); Esc fecha; depois de fechar, o gatilho tem o focus; com o gatilho desativado, Tab salta-o (o focus passa do elemento anterior para o seguinte) e não existe nenhum elemento com `role="dialog"`. A verificação do focus preso é feita também numa story com `play`, em browser real.
- Visual/Storybook: `Default`, `Sizes`, `WithForm`, `LongContent` (scroll interno), `Confirmation` (ação destrutiva com `Button variant="danger"`), `NoOverlayClose`, `DisabledTrigger`, `KeyboardInteraction` (com `play`), `DarkTheme` (aberto).

**Fora de âmbito:** `AlertDialog` separado (confirmação que não fecha com Esc/overlay), painel lateral (drawer), diálogos empilhados, ecrã inteiro.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): gatilho com Button disabled não abre o diálogo nem recebe focus, com critério, testes e story DisabledTrigger
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)
- 2026-10-19 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-19 · programador · Em desenvolvimento → Pronto para teste · commit e1c2909
- 2026-10-19 · testador · Pronto para teste → Em teste · início dos testes
- 2026-10-19 · testador · Em teste → Aprovado · relatório 1 em 03-testing.md, todos os critérios verificados
- 2026-10-19 · finalizador · Aprovado → Concluído · definição de concluído verificada; changeset não aplicável (pacote privado)

### DS-026 · DropdownMenu

- **Fase do MVP:** Overlays e feedback
- **Prioridade:** Alta
- **Depende de:** DS-011
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** menu de ações aberto por um botão, com navegação completa por teclado, baseado em `@radix-ui/react-dropdown-menu`.

**Critérios de aceitação:**
- [ ] Exporta `DropdownMenu`, `DropdownMenuTrigger` (com `asChild`), `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuGroup` e `DropdownMenuSeparator`.
- [ ] `DropdownMenu`: `open?`, `defaultOpen?`, `onOpenChange?`; `DropdownMenuContent`: `side` (omissão `bottom`), `align` (omissão `start`), `ref`, `className`; `DropdownMenuItem`: `onSelect?`, `disabled?`, `variant: 'default' | 'danger'`, `leadingIcon?`.
- [ ] O gatilho tem `aria-haspopup="menu"` e `aria-expanded`; o conteúdo tem `role="menu"` e os itens `role="menuitem"`; renderizado num portal com o token `z-index-dropdown`.
- [ ] O item ativo é realçado por `data-highlighted` (o focus real está no item, não é simulado só por hover).
- [ ] Selecionar um item chama `onSelect`, fecha o menu e devolve o focus ao gatilho; itens desativados têm `aria-disabled="true"` e não chamam `onSelect`.
- [ ] O item `variant="danger"` distingue-se por cor com contraste AA e a distinção não depende só da cor quando tem ícone.
- [ ] Gatilho desativado: com `<DropdownMenuTrigger asChild>` à volta de um `Button disabled` (ou `IconButton disabled`), o menu não abre com clique, Enter, Espaço nem Seta para baixo, `onOpenChange` não é chamado, e o gatilho não recebe focus com Tab.
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-dropdown-menu`); C1 a C5.

**Testes exigidos:**
- Unitários: fechado por omissão; abre ao clicar no gatilho; `onSelect` chamado ao clicar num item e o menu fecha; item `disabled` não chama `onSelect`; modo controlado; clicar fora fecha; `DropdownMenuLabel` e `DropdownMenuSeparator` renderizam com os papéis certos (`separator`); com um `Button disabled` como gatilho, clicar não abre o menu e `onOpenChange` não é chamado.
- Acessibilidade: axe sem violações com o menu aberto. Teclado (unitário ou `play`): no gatilho, Enter, Espaço e Seta para baixo abrem o menu com o primeiro item focado; Seta para baixo/cima movem o focus entre itens e saltam os desativados; Home e End vão ao primeiro e ao último; escrever uma letra foca o item que começa por ela; Enter e Espaço ativam o item focado e fecham; Esc fecha e devolve o focus ao gatilho; Tab fecha o menu; com o gatilho desativado, Tab salta-o (o focus passa do elemento anterior para o seguinte) e não existe nenhum elemento com `role="menu"`.
- Visual/Storybook: `Default`, `WithIcons`, `WithGroupsAndLabels`, `DisabledItem`, `DangerItem`, `OnIconButton` (gatilho com `EllipsisIcon`), `DisabledTrigger`, `KeyboardInteraction` (com `play`), `DarkTheme` (aberto).

**Fora de âmbito:** submenus, itens de checkbox e de rádio, atalhos de teclado apresentados à direita, menu de contexto (botão direito).

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): gatilho com Button disabled não abre o menu (clique, Enter, Espaço, Seta para baixo) nem recebe focus, com critério, testes e story DisabledTrigger
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)
- 2026-10-19 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-19 · programador · Em desenvolvimento → Pronto para teste · commit d1f8738
- 2026-10-19 · testador · Pronto para teste → Em teste · início do relatório 1
- 2026-10-19 · testador · Em teste → Aprovado · relatório 1 em 03-testing.md
- 2026-10-19 · finalizador · Aprovado → Concluído · definição de concluído verificada; changeset não aplicável (pacote privado)

### DS-027 · Toast

- **Fase do MVP:** Overlays e feedback
- **Prioridade:** Média
- **Depende de:** DS-011, DS-021
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** notificações temporárias não bloqueantes, disparadas por código, baseadas em `@radix-ui/react-toast`.

**Critérios de aceitação:**
- [ ] Exporta `ToastProvider` (inclui a região onde os toasts aparecem) e o hook `useToast()` que devolve `toast(opções)` e `dismiss(id?)`.
- [ ] `toast({ title, description?, variant?, duration?, action? })`: `variant: 'info' | 'success' | 'warning' | 'danger'` (omissão `info`), `duration` em ms (omissão 5000; `Infinity` não fecha sozinho), `action?: { label: string; onClick: () => void; altText: string }`; devolve o `id` do toast.
- [ ] `ToastProvider`: `position: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'` (omissão `bottom-right`), `max?: number` (omissão 3; os mais antigos saem primeiro), `label?` (nome da região, omissão `"Notifications"`), `closeLabel?` (omissão `"Close"`).
- [ ] Cada toast é anunciado por leitores de ecrã sem roubar o focus: `danger` e `warning` com prioridade `assertive` (`type="foreground"` do Radix), `info` e `success` com `polite` (`type="background"`).
- [ ] A contagem do tempo pausa enquanto o ponteiro está sobre o toast ou o focus está dentro da região, e retoma ao sair (WCAG 2.2.1).
- [ ] Cada toast tem botão de fechar (`IconButton`); a região usa o token `z-index-toast`; em ecrãs estreitos os toasts ocupam a largura disponível.
- [ ] Usar `useToast` fora de um `ToastProvider` lança um erro com mensagem explícita.
- [ ] Animações de entrada/saída respeitam `prefers-reduced-motion`.
- [ ] Padrão "botão em loading → Toast com o resultado" documentado: a story `AfterLoading` mostra um `Button` que fica `loading` durante uma espera simulada e, no fim, dispara um toast de sucesso (ou de erro); a descrição da story explica que é o toast que anuncia o resultado e que o focus fica no botão (complementa a nota da DS-021).
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-toast`); C1 a C5.

**Testes exigidos:**
- Unitários (com timers falsos): `toast()` mostra título e descrição; fecha sozinho ao fim de `duration`; `duration: Infinity` não fecha; `dismiss(id)` fecha um e `dismiss()` fecha todos; com `max={3}`, o quarto toast remove o mais antigo; clicar na ação chama `onClick` e fecha; o botão de fechar fecha; erro fora do provider; variante em `data-variant`.
- Acessibilidade: axe sem violações com um toast visível; a região tem o nome do `label`; abrir um toast não altera `document.activeElement`; F8 move o focus para a região; com o focus num toast, Tab chega à ação e ao botão de fechar e Esc fecha esse toast; o temporizador pausa com o focus na região (o toast continua presente depois de `duration`).
- Visual/Storybook: `Default` (botão que dispara um toast), `Variants`, `WithAction`, `Persistent`, `Stacked` (vários seguidos), `Positions`, `AfterLoading` (com `play`: clicar no botão põe-no em `loading`; quando a espera termina, o toast de sucesso aparece, o botão deixa de ter `aria-busy` e `document.activeElement` continua a ser o botão), `DarkTheme` (com um toast de cada variante aberto).

**Fora de âmbito:** toasts de promessa na API do `toast()` (ex.: `toast.promise`, com o próprio toast a passar de loading a sucesso/erro), barra de progresso do tempo restante, API imperativa fora do React (`toast()` global sem hook).

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): story AfterLoading com o padrão "botão em loading → Toast com o resultado"; DS-021 acrescentada às dependências
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-028 · Stack e Grid

- **Fase do MVP:** Layout e dados
- **Prioridade:** Média
- **Depende de:** DS-009
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** dois primitivos de layout que aplicam o espaçamento dos tokens, para que as aplicações não precisem de escrever CSS de margens e grelhas.

**Critérios de aceitação:**
- [ ] `Stack` (flexbox): `direction: 'vertical' | 'horizontal'` (omissão `vertical`), `gap` (chave da escala de espaçamento: `0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16`, omissão `4`), `align: 'start' | 'center' | 'end' | 'stretch' | 'baseline'`, `justify: 'start' | 'center' | 'end' | 'between'`, `wrap?: boolean`, `asChild?`.
- [ ] `Grid` (CSS grid): `columns: 1 | 2 | 3 | 4 | 6 | 12` ou `minColumnWidth: string` (grelha responsiva com `auto-fit` + `minmax`, sem media queries), `gap` (mesma escala), `asChild?`; `GridItem` com `colSpan?: number`.
- [ ] O `gap` é resolvido sempre para `var(--ds-space-*)`; o tipo TypeScript só aceita chaves da escala (um valor como `gap={7}` não compila).
- [ ] As props são expostas como `data-*` ou como CSS custom properties locais (ex.: `--ds-grid-columns`); os valores passados em `minColumnWidth` são a única exceção permitida a "só tokens" e ficam documentados.
- [ ] Renderizam `<div>` por omissão e não têm `role`; com `asChild` aplicam-se a elementos semânticos (`<ul>`, `<section>`, `<nav>`).
- [ ] Cada componente tem a sua pasta e cumpre C1 separadamente.
- [ ] G1 a G3; C1 a C5 (para os dois).

**Testes exigidos:**
- Unitários: valores por omissão; cada prop refletida no `data-*` ou na custom property correspondente; `asChild` com `<ul>` mantém os `<li>` como filhos diretos; `GridItem colSpan={2}`; `className` e `ref`; teste de tipos com `// @ts-expect-error` para um `gap` fora da escala.
- Acessibilidade: axe sem violações; a ordem do DOM é igual à ordem visual (não se usa `order` nem `row-reverse`); nenhum dos dois é focável.
- Visual/Storybook: `Stack/Vertical`, `Stack/Horizontal`, `Stack/Gaps`, `Stack/AlignAndJustify`, `Stack/Wrap`, `Stack/DarkTheme`, `Grid/Columns`, `Grid/Responsive` (`minColumnWidth`), `Grid/Spans`, `Grid/DarkTheme`.

**Fora de âmbito:** props responsivas por breakpoint (ex.: `columns={{ sm: 1, md: 3 }}`), `Box` com props de estilo, `Container`, `Divider`.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-029 · Card

- **Fase do MVP:** Layout e dados
- **Prioridade:** Média
- **Depende de:** DS-010
- **Estimativa:** S (≤ 2h)

**Objetivo:** contentor de superfície para agrupar conteúdo relacionado, com cabeçalho, corpo e rodapé opcionais.

**Critérios de aceitação:**
- [ ] Exporta `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardBody` e `CardFooter`.
- [ ] `Card`: `variant: 'outlined' | 'elevated'` (omissão `outlined`), `padding: 'none' | 'sm' | 'md' | 'lg'` (omissão `md`), `asChild?` (ex.: `<article>`, `<section>`, `<li>`).
- [ ] `CardTitle` aceita `as: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'` (omissão `h3`), para o consumidor manter a hierarquia de títulos da página.
- [ ] Usa `color-bg-surface`, `color-border-default`, raio e sombra dos tokens; a borda da variante `outlined` é visível nos dois temas.
- [ ] O `Card` não é interativo por si (sem `role`, sem `tabIndex`); um cartão clicável constrói-se com `asChild` sobre um `<a>` e fica com focus visível.
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários: renderiza as subpartes; valores por omissão nos `data-*`; `CardTitle as="h2"` gera um `<h2>`; `asChild` com `<article>`; `className` e `ref` em cada subparte.
- Acessibilidade: axe sem violações; `getByRole('heading', { level: 3 })` encontra o título por omissão; na story `AsLink`, Tab foca o cartão e Enter segue a ligação.
- Visual/Storybook: `Outlined`, `Elevated`, `Paddings`, `WithHeaderAndFooter` (com `Button` no rodapé), `AsLink`, `InGrid` (três cartões num `Grid`, se a DS-028 já estiver concluída; caso contrário num contentor flex da própria story), `DarkTheme`.

**Fora de âmbito:** cartão com imagem de capa, cartão selecionável, cartão colapsável.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-030 · Tabs

- **Fase do MVP:** Layout e dados
- **Prioridade:** Média
- **Depende de:** DS-009
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** separadores para alternar entre painéis de conteúdo, com o padrão de teclado do APG, baseados em `@radix-ui/react-tabs`.

**Critérios de aceitação:**
- [ ] Exporta `Tabs`, `TabsList`, `TabsTrigger` e `TabsContent`.
- [ ] `Tabs`: `value?`, `defaultValue?`, `onValueChange?`, `orientation: 'horizontal' | 'vertical'` (omissão `horizontal`), `activationMode: 'automatic' | 'manual'` (omissão `automatic`); `TabsTrigger`: `value` (obrigatório), `disabled?`; `TabsContent`: `value` (obrigatório).
- [ ] Papéis: `tablist` (com `aria-orientation`), `tab` (com `aria-selected` e `aria-controls`) e `tabpanel` (com `aria-labelledby`); `TabsList` exige `aria-label` ou `aria-labelledby` no tipo.
- [ ] Só o separador ativo está na ordem de tabulação; o painel ativo é focável (`tabIndex=0`) para que o Tab a seguir à lista chegue ao conteúdo.
- [ ] O separador ativo distingue-se por um indicador (barra) além da cor; o indicador tem contraste ≥ 3:1.
- [ ] Quando os separadores não cabem na largura, a `TabsList` faz scroll horizontal sem partir o layout.
- [ ] Modo controlado e não controlado.
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-tabs`); C1 a C5.

**Testes exigidos:**
- Unitários: `defaultValue` mostra o painel certo e os outros não estão visíveis; clicar num separador muda o painel e chama `onValueChange`; modo controlado; separador `disabled` não ativa.
- Acessibilidade: axe sem violações. Teclado: Tab foca o separador ativo e o Tab seguinte vai para o painel; Seta para a direita/esquerda movem o focus para o separador seguinte/anterior, dão a volta nas pontas e (em `automatic`) ativam-no; Home e End vão ao primeiro e ao último; separadores desativados são saltados; em `orientation="vertical"` as teclas são Seta para baixo/cima; em `activationMode="manual"` as setas só movem o focus e Enter ou Espaço ativam.
- Visual/Storybook: `Default`, `Vertical`, `ManualActivation`, `DisabledTab`, `ManyTabs` (scroll), `Controlled`, `DarkTheme`.

**Fora de âmbito:** separadores que se podem fechar ou reordenar, variante "pills", carregamento preguiçoso dos painéis, sincronização com o URL.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-031 · Accordion

- **Fase do MVP:** Layout e dados
- **Prioridade:** Média
- **Depende de:** DS-008, DS-009
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** secções que se expandem e recolhem, com o padrão de teclado do APG, baseadas em `@radix-ui/react-accordion`.

**Critérios de aceitação:**
- [ ] Exporta `Accordion`, `AccordionItem`, `AccordionTrigger` e `AccordionContent`.
- [ ] `Accordion`: `type: 'single' | 'multiple'` (obrigatório), `collapsible?` (só em `single`), `value?`, `defaultValue?`, `onValueChange?` (string em `single`, array em `multiple`), `disabled?`, `headingLevel: 2 | 3 | 4 | 5 | 6` (omissão 3); `AccordionItem`: `value` (obrigatório), `disabled?`.
- [ ] Cada `AccordionTrigger` é um `<button>` dentro de um título do nível `headingLevel`, com `aria-expanded` e `aria-controls`; o painel tem `role="region"` e `aria-labelledby`.
- [ ] O gatilho mostra o `ChevronDownIcon`, que roda quando o item está aberto (`data-state="open"`); a rotação e a animação de altura respeitam `prefers-reduced-motion`.
- [ ] O conteúdo fechado não é focável nem lido por leitores de ecrã (fica `hidden`).
- [ ] Modo controlado e não controlado.
- [ ] G1 a G3 (dependência nova: `@radix-ui/react-accordion`); C1 a C5.

**Testes exigidos:**
- Unitários: em `single`, abrir um item fecha o anterior; com `collapsible`, clicar no item aberto fecha-o, sem `collapsible` mantém-se aberto; em `multiple`, vários itens ficam abertos e `onValueChange` recebe um array; `defaultValue`; modo controlado; item `disabled` não abre; `headingLevel={2}` gera `<h2>`.
- Acessibilidade: axe sem violações com itens abertos e fechados. Teclado: Tab percorre os gatilhos; Enter e Espaço alternam o item focado e atualizam `aria-expanded`; Seta para baixo/cima movem o focus para o gatilho seguinte/anterior e dão a volta nas pontas; Home e End vão ao primeiro e ao último gatilho; com um item aberto, Tab entra nos elementos focáveis do painel.
- Visual/Storybook: `Single`, `SingleCollapsible`, `Multiple`, `DisabledItem`, `LongContent`, `Controlled`, `DarkTheme`.

**Fora de âmbito:** acordeão aninhado, ícone personalizável por item, variante com bordas separadas (cartões).

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-032 · Table: estrutura base

- **Fase do MVP:** Layout e dados
- **Prioridade:** Alta
- **Depende de:** DS-019
- **Estimativa:** S (≤ 2h)

**Objetivo:** tabela de dados semântica e estilizada, por composição de elementos HTML nativos; é a base da ordenação (DS-033) e da `DataTable` (DS-035).

**Critérios de aceitação:**
- [ ] Exporta `Table`, `TableCaption`, `TableHead`, `TableBody`, `TableRow`, `TableHeaderCell` e `TableCell`, que renderizam respetivamente `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tr>`, `<th>` e `<td>`.
- [ ] `Table`: `size: 'sm' | 'md'` (densidade, omissão `md`), `striped?: boolean`, `stickyHeader?: boolean`; fica dentro de um contentor `ds-table-container` com `overflow-x: auto`, `role="region"`, `tabIndex=0` e nome acessível (prop `aria-label` ou `aria-labelledby`, obrigatória no tipo) para que o scroll horizontal funcione com teclado.
- [ ] `TableHeaderCell`: `scope` por omissão `"col"` (aceita `"row"`), `align: 'start' | 'center' | 'end'`; `TableCell`: `align` e `numeric?: boolean` (alinha à direita e usa algarismos tabulares).
- [ ] `TableCaption` aceita `visuallyHidden?: boolean` para dar nome à tabela sem a mostrar.
- [ ] `TableRow` aceita `selected?: boolean` (exposto como `aria-selected` e `data-selected`).
- [ ] Linhas com `striped` e com hover mantêm contraste de texto AA nos dois temas.
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários: a composição gera a estrutura HTML correta (`table > thead > tr > th`, `tbody > tr > td`); `scope` por omissão e personalizado; `align` e `numeric` nos `data-*`; `size`, `striped`, `stickyHeader` nos `data-*`; `ref` e `className` em cada subparte.
- Acessibilidade: axe sem violações; `getByRole('table', { name: <legenda> })`; `getAllByRole('columnheader')` e `getAllByRole('row')` devolvem as contagens esperadas; Tab foca o contentor com scroll e as setas esquerda/direita fazem scroll horizontal quando a tabela é mais larga do que o contentor.
- Visual/Storybook: `Default`, `Striped`, `Dense` (`size="sm"`), `WithCaption`, `NumericColumns`, `StickyHeader`, `HorizontalScroll` (contentor estreito), `WithBadges` (coluna de estado), `DarkTheme`.

**Fora de âmbito:** ordenação (DS-033), paginação (DS-034 e DS-035), seleção de linhas com checkbox, colunas redimensionáveis, virtualização, estado vazio.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)
- 2026-10-19 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-19 · programador · Em desenvolvimento → Pronto para teste · commit 6d8452a
- 2026-10-19 · testador · Pronto para teste → Em teste · início dos testes
- 2026-10-19 · testador · Em teste → Reprovado · relatório 1: falta o teste exigido das setas a fazer scroll horizontal (ver 03-testing.md)
- 2026-10-19 · programador · Reprovado → Em desenvolvimento · correção da falha do relatório 1
- 2026-10-19 · programador · Em desenvolvimento → Pronto para teste · commit f83f5cf
- 2026-10-19 · testador · Pronto para teste → Em teste · início do reteste (iteração 2)
- 2026-10-19 · testador · Em teste → Aprovado · relatório 2: todas as verificações verdes, scroll por setas coberto no test-runner
- 2026-10-19 · finalizador · Aprovado → Concluído · relatório 2 aprovado; sem changeset (pacote privado); documentação e stories verificadas

### DS-033 · Table: ordenação

- **Fase do MVP:** Layout e dados
- **Prioridade:** Alta
- **Depende de:** DS-008, DS-032
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** permitir ordenar a tabela por coluna com um cabeçalho acessível e um hook que gere o estado e ordena os dados.

**Critérios de aceitação:**
- [ ] `TableHeaderCell` ganha as props `sortable?: boolean`, `sortDirection?: 'asc' | 'desc' | 'none'` e `onSort?: () => void`; quando `sortable`, o conteúdo fica dentro de um `<button>` e o `<th>` tem `aria-sort` com `ascending`, `descending` ou `none`.
- [ ] O botão mostra `ArrowUpIcon` (asc), `ArrowDownIcon` (desc) ou `ArrowUpDownIcon` (sem ordenação); os ícones são decorativos e o estado é comunicado por `aria-sort`.
- [ ] Hook `useTableSort<T>({ data, columns, sort?, defaultSort?, onSortChange? })` exportado de `packages/ui`: devolve `{ sortedData, sort, getSortProps(columnId) }`; o estado `sort` é `{ columnId, direction } | null`; suporta modo controlado (`sort` + `onSortChange`) e não controlado (`defaultSort`).
- [ ] Ativar um cabeçalho segue o ciclo `asc → desc → sem ordenação`; ativar outra coluna começa em `asc` e limpa a anterior (uma coluna ordenada de cada vez).
- [ ] Ordenação por omissão: números por valor, strings com `localeCompare` (com `numeric: true` e insensível a maiúsculas), datas por tempo, `null`/`undefined` sempre no fim; cada coluna pode fornecer `compare(a, b)` próprio.
- [ ] A ordenação é estável e não altera o array `data` original.
- [ ] G1 a G3; C1 a C5 (testes e stories acrescentam-se à pasta `Table`).

**Testes exigidos:**
- Unitários (hook, com `renderHook`): ciclo asc → desc → nenhum; mudar de coluna; números, strings com acentos, datas e nulos ordenados como especificado; `compare` personalizado; estabilidade (elementos iguais mantêm a ordem original); `data` não é mutado; modo controlado chama `onSortChange` e não altera o estado interno.
- Unitários (componente): clicar num cabeçalho `sortable` chama `onSort`; `aria-sort` reflete `sortDirection`; cabeçalhos não ordenáveis não têm botão nem `aria-sort`.
- Acessibilidade: axe sem violações; Tab percorre os botões dos cabeçalhos ordenáveis pela ordem das colunas; Enter e Espaço ativam a ordenação; depois de ativar, o focus continua no mesmo botão e `aria-sort` muda; a ordem das linhas no DOM corresponde à ordenação.
- Visual/Storybook: `Table/Sortable` (não controlado), `Table/SortableControlled`, `Table/DefaultSort`, `Table/CustomCompare`, `Table/SortKeyboardInteraction` (com `play`), e uma tabela ordenável acrescentada a `Table/DarkTheme`.

**Fora de âmbito:** ordenação por várias colunas, ordenação no servidor com estado de carregamento, filtros por coluna.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-034 · Pagination

- **Fase do MVP:** Layout e dados
- **Prioridade:** Média
- **Depende de:** DS-011
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** navegação entre páginas acessível e independente da tabela, mais o hook que calcula o intervalo de páginas e de itens.

**Critérios de aceitação:**
- [ ] `Pagination`: `page?`, `defaultPage?` (omissão 1), `onPageChange?`, `pageCount` (obrigatório), `siblingCount?` (omissão 1), `size: 'sm' | 'md'`, e etiquetas configuráveis com valores por omissão em inglês: `label` (`"Pagination"`), `previousLabel` (`"Previous page"`), `nextLabel` (`"Next page"`), `getPageLabel(page)` (`"Page 3"`).
- [ ] Renderiza `<nav aria-label={label}>` com uma lista (`<ul>`/`<li>`) de botões; a página atual tem `aria-current="page"`; os botões anterior/seguinte usam `ChevronLeftIcon`/`ChevronRightIcon` com nome acessível.
- [ ] Na primeira página o botão "anterior" está desativado, e na última o "seguinte"; a desativação usa `aria-disabled="true"` e `data-disabled`, sem o atributo `disabled` e sem `tabIndex={-1}`: o botão continua focável e o clique é bloqueado (não chama `onPageChange`).
- [ ] Exceção intencional face ao `disabled` do `Button` (DS-010), que tira o elemento da ordem de Tab: aqui, quem navega com teclado carrega em "seguinte" até à última página e o botão que tem o focus passa a desativado; se saísse da ordem de Tab, o focus perdia-se. Por isso a `Pagination` não usa a prop `disabled` do `IconButton` nestes botões. A exceção e o motivo ficam escritos no JSDoc do componente (aparece no autodocs) e na descrição das stories `FirstPage` e `LastPage`.
- [ ] Com muitas páginas mostra reticências: primeira, última, atual e `siblingCount` de cada lado (ex.: `1 … 4 5 6 … 20`); as reticências são `aria-hidden` e não são focáveis.
- [ ] Hook `usePagination({ totalItems, pageSize, page?, defaultPage?, onPageChange? })` exportado: devolve `{ page, pageCount, startIndex, endIndex, setPage, next, previous, canNext, canPrevious }`; `page` é limitado ao intervalo `[1, pageCount]`, e quando `totalItems` diminui a página atual é corrigida.
- [ ] `pageCount <= 1` renderiza a navegação com uma única página e os dois botões desativados (não desaparece, para o layout não saltar).
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários (componente): clicar numa página chama `onPageChange` com o número; anterior/seguinte; limites desativados não chamam `onPageChange`; intervalos com reticências para `pageCount=20` nas páginas 1, 5 e 20; `siblingCount={2}`; modo controlado e não controlado.
- Unitários (hook): `startIndex`/`endIndex` para `totalItems=95`, `pageSize=10` nas páginas 1 e 10 (última página com 5 itens); `page` fora do intervalo é corrigida; `totalItems=0` devolve `pageCount=1` e intervalo vazio.
- Acessibilidade: axe sem violações; `getByRole('navigation', { name: 'Pagination' })`; a página atual é encontrada por `aria-current="page"`; Tab percorre anterior, páginas e seguinte por ordem; Enter e Espaço mudam de página e o focus fica no botão ativado; na primeira página, Tab ainda foca o botão "anterior" (que tem `aria-disabled="true"` e não tem `disabled`) e Enter/Espaço não chamam `onPageChange`; estando na penúltima página com o focus em "seguinte", Enter leva à última página e `document.activeElement` continua a ser o botão "seguinte".
- Visual/Storybook: `Default`, `ManyPages`, `FirstPage`, `LastPage`, `SinglePage`, `Sizes`, `Controlled`, `KeyboardInteraction` (com `play`: avançar até à última página só com Enter e confirmar que o focus nunca sai do botão "seguinte"), `DarkTheme`.

**Fora de âmbito:** seletor de itens por página, campo "ir para a página", paginação por cursor ou "carregar mais", páginas como ligações com `href`.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): botões anterior/seguinte focáveis com aria-disabled nos limites documentados como exceção intencional face ao disabled do Button, com teste e story de teclado
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-035 · DataTable: Table com ordenação e paginação integradas

- **Fase do MVP:** Layout e dados
- **Prioridade:** Média
- **Depende de:** DS-033, DS-034
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** componente de conveniência que junta `Table`, `useTableSort`, `usePagination` e `Pagination` a partir de uma definição de colunas; fecha o requisito "Table com ordenação e paginação" do MVP.

**Critérios de aceitação:**
- [ ] `DataTable<T>`: `data: T[]`, `columns: Array<{ id: string; header: ReactNode; accessor: keyof T | ((row: T) => unknown); cell?: (row: T) => ReactNode; sortable?: boolean; compare?; align?; numeric? }>`, `getRowId: (row: T) => string`, `caption` (obrigatório; `captionHidden?`), `pageSize?` (omissão 10; `pageSize={0}` desliga a paginação), `defaultSort?`, `sort?`/`onSortChange?`, `page?`/`onPageChange?`, `emptyMessage?: ReactNode` (omissão `"No results"`), `size?`, `striped?`.
- [ ] É implementado só por composição das peças das DS-032 a DS-034 (não duplica a lógica de ordenação nem a de paginação).
- [ ] A ordenação aplica-se a todos os dados antes da paginação; mudar a ordenação volta à página 1.
- [ ] Por baixo da tabela mostra o resumo "`<início>`–`<fim>` of `<total>`" (texto configurável por `getRangeLabel`), dentro de um elemento com `aria-live="polite"`, e a `Pagination`.
- [ ] Com `data` vazio mostra uma única linha com `emptyMessage` a ocupar todas as colunas (`colSpan`) e não mostra a paginação.
- [ ] Os tipos são genéricos: `accessor` só aceita chaves existentes em `T`, e `cell` recebe a linha tipada.
- [ ] G1 a G3; C1 a C5.

**Testes exigidos:**
- Unitários: com 25 linhas e `pageSize=10` mostra 10 linhas e 3 páginas; ir para a página 3 mostra 5 linhas; ordenar por uma coluna numérica em `desc` põe o maior valor de todos os dados na primeira linha da página 1; ordenar estando na página 2 volta à página 1; `pageSize={0}` mostra todas as linhas sem `Pagination`; `data=[]` mostra `emptyMessage`; `cell` personalizado; modo controlado de `sort` e de `page`; teste de tipos (`// @ts-expect-error`) para um `accessor` inexistente.
- Acessibilidade: axe sem violações (com dados e vazia); a tabela tem o nome da `caption`; depois de mudar de página o resumo anunciado é atualizado e o focus mantém-se no botão da paginação; a ordem de tabulação é cabeçalhos ordenáveis → células interativas → paginação.
- Visual/Storybook: `Default` (50 linhas de dados de exemplo), `WithCustomCells` (Badge e IconButton nas células), `Empty`, `NoPagination`, `Controlled`, `KeyboardInteraction` (com `play`: ordenar e mudar de página só com teclado), `DarkTheme`.

**Fora de âmbito:** dados do servidor (ordenação e paginação remotas com loading), filtros e pesquisa, seleção de linhas, linhas expansíveis, exportação.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)

### DS-036 · Metadados dos pacotes: `exports`, `sideEffects`, `files` e licença

- **Fase do MVP:** Publicação
- **Prioridade:** Alta
- **Depende de:** DS-008, DS-010
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** deixar os `package.json` de `tokens`, `icons` e `ui` prontos para serem consumidos fora do monorepo, com nomes finais, pontos de entrada corretos e só os ficheiros necessários.

**Decisões do João (2026-10-09, conversa; ver "Decisões técnicas"):** scope npm `@up201905892` e licença MIT.

**Critérios de aceitação:**
- [ ] Os pacotes passam a chamar-se `@up201905892/tokens`, `@up201905892/icons` e `@up201905892/ui`; todas as referências a `@ds/*` no repositório são atualizadas (`grep -r "@ds/"` fora de `docs/workflow/` não devolve resultados) e o `pnpm-lock.yaml` é regenerado.
- [ ] Os três pacotes deixam de ter `"private": true` e têm `version`, `description`, `"license": "MIT"`, `author`, `repository` (com `directory`), `homepage`, `keywords` e `"publishConfig": { "access": "public" }`; `apps/docs` continua `"private": true`.
- [ ] `ui`: `"type": "module"`, `exports` com `"."` (`types` + `import` + `require`, com declarações separadas para ESM e CJS), `"./styles.css"` e `"./package.json"`; `main`, `module` e `types` como fallback; `"sideEffects": ["**/*.css"]`; `"files": ["dist"]`.
- [ ] `ui`: `react` e `react-dom` em `peerDependencies`; os pacotes `@radix-ui/react-*` e `@up201905892/icons` (`workspace:^`) em `dependencies`; nada que só serve para desenvolvimento em `dependencies`; nenhuma dependência é incluída no bundle do `dist` (ficam externas).
- [ ] `icons`: `exports` com `"."` e `"./package.json"`, `"sideEffects": false`, `"files": ["dist", "LICENSE-LUCIDE"]`.
- [ ] `tokens`: `exports` com `"."`, `"./tokens.css"`, `"./themes.css"` e `"./package.json"`; `"sideEffects": ["**/*.css"]`; `"files": ["dist"]`.
- [ ] Ficheiro `LICENSE` com o texto da licença MIT na raiz e em cada pacote publicado, e um `README.md` mínimo em cada pacote (nome, instalação, exemplo de três linhas); a versão completa é da DS-046.
- [ ] `import { Button } from '@up201905892/ui'` e `import '@up201905892/ui/styles.css'` resolvem a partir de `apps/docs` usando o campo `exports` (sem aliases para `src`).
- [ ] G1 a G3.

**Testes exigidos:**
- Unitários: teste Vitest que lê cada `package.json` publicado e verifica que todos os caminhos referidos em `exports`, `main`, `module` e `types` existem depois de `pnpm build`, e que `files` não inclui `src`.
- Acessibilidade: não aplicável (sem alterações de interface); `pnpm test:a11y` continua a passar.
- Visual/Storybook: o Storybook arranca e todas as stories existentes continuam a funcionar depois da mudança de nome.
- Verificação manual no terminal: `node -e "require('@up201905892/ui')"` e o `import()` equivalente em ESM, executados a partir de `apps/docs`, terminam sem erro.

**Fora de âmbito:** Changesets (DS-037), limite de tamanho (DS-038), verificação do tarball (DS-039), entradas por componente (`@up201905892/ui/button`), publicação.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): scope npm `@up201905892` e licença MIT decididos; marcas de decisão pendente removidas e placeholder substituído

### DS-037 · Changesets: versionamento e changelog

- **Fase do MVP:** Publicação
- **Prioridade:** Alta
- **Depende de:** DS-036
- **Estimativa:** S (≤ 2h)

**Objetivo:** configurar o Changesets para gerir versões e changelogs dos três pacotes, sem dar a nenhum agente a capacidade de publicar.

**Critérios de aceitação:**
- [ ] `@changesets/cli` instalado na raiz; `.changeset/config.json` com `"access": "public"`, `"baseBranch": "main"`, os três pacotes num grupo `fixed` (partilham sempre a mesma versão) e `apps/*` em `ignore`.
- [ ] Scripts na raiz: `pnpm changeset` (criar um changeset) e `pnpm version-packages` (`changeset version`).
- [ ] Não existe nenhum script que chame `changeset publish`, `pnpm publish` ou `npm publish`; a publicação é um passo manual do João, descrito na DS-041.
- [ ] `.changeset/README.md` explica, em poucas linhas, quando criar um changeset e que tipo usar (patch, minor, major).
- [ ] Existe um primeiro changeset de exemplo válido (tipo `minor`, com a descrição dos componentes já entregues) e `pnpm changeset status` sai com 0 e lista os três pacotes.
- [ ] A regra fica escrita em `packages/ui/README.md` (secção "How to create a component"): a partir desta tarefa, qualquer tarefa que altere o comportamento de um pacote publicado inclui um ficheiro em `.changeset/`.
- [ ] G1 a G3 (dependência nova: `@changesets/cli`).

**Testes exigidos:**
- Unitários: não aplicável.
- Acessibilidade: não aplicável.
- Visual/Storybook: não aplicável.
- Verificação manual no terminal: `pnpm changeset status` com código 0; `grep -rE "(changeset|pnpm|npm) publish" package.json packages/*/package.json` não devolve resultados. Não correr `pnpm version-packages` nesta tarefa (a alteração de versões é da DS-041).

**Fora de âmbito:** ação do GitHub para releases automáticas (ficheiro do João), pré-lançamentos (`alpha`/`beta`), geração de notas de release no GitHub.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): a secção do README de `ui` passa a chamar-se "How to create a component" (regra de língua)

### DS-038 · Limite de tamanho de bundle (< 5 kB gzip por componente)

- **Fase do MVP:** Publicação
- **Prioridade:** Alta
- **Depende de:** DS-036, DS-010 a DS-035
- **Estimativa:** S (≤ 2h)

**Objetivo:** provar com um comando que importar um componente custa menos de 5 kB gzip e que o tree-shaking funciona, para o requisito de tamanho do MVP não depender de promessas.

**Critérios de aceitação:**
- [ ] `size-limit` com `@size-limit/preset-small-lib` configurado em `packages/ui`, e script `pnpm size` na raiz que corre depois do build e sai com código ≠ 0 se algum limite for ultrapassado.
- [ ] Há uma entrada por componente exportado (ex.: `import { Button } from './dist/index.js'`), cada uma com limite de **5 kB** gzip, medindo o código da biblioteca com `react`, `react-dom`, `react/jsx-runtime`, `@radix-ui/*` e `@up201905892/icons` como externos (são dependências instaladas pelo consumidor; o método de medição fica explicado no README do pacote).
- [ ] A lista de entradas é gerada a partir das exportações de `packages/ui/src/index.ts` (ou validada por um teste), para que um componente novo não fique sem limite.
- [ ] Há uma entrada adicional para `dist/styles.css` com limite de 15 kB gzip e uma entrada informativa (sem limite) para a biblioteca inteira.
- [ ] Tree-shaking verificado: o bundle gerado para `import { Button }` não contém referências a `@radix-ui/react-dialog` nem a classes `ds-dialog`.
- [ ] Se algum componente ultrapassar os 5 kB, o limite não é aumentado: a tarefa regista o componente e o valor medido em "Decisões para o João" e fica por aprovar até haver decisão.
- [ ] G1 a G3 (dependências novas: `size-limit`, `@size-limit/preset-small-lib`).

**Testes exigidos:**
- Unitários: teste Vitest que compara a lista de componentes exportados com as entradas do `size-limit` e falha se faltar alguma; teste do tree-shaking descrito acima (bundle com esbuild em memória e verificação por texto).
- Acessibilidade: não aplicável.
- Visual/Storybook: não aplicável.
- Verificação manual no terminal: `pnpm build && pnpm size` com código 0; baixar temporariamente um limite para `100 B` faz o comando falhar (não commitado). A tabela de tamanhos obtida é colada no registo de desenvolvimento.

**Fora de âmbito:** acrescentar o passo `pnpm size` ao CI (ficheiro do João; fica como pedido em "Decisões para o João"), análise visual do bundle, otimizações que mudem a API pública.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): placeholder do scope substituído por `@up201905892`

### DS-039 · Verificação do pacote: `pnpm pack`, publint e projeto consumidor

- **Fase do MVP:** Publicação
- **Prioridade:** Alta
- **Depende de:** DS-037, DS-038
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** garantir, antes de qualquer publicação, que os ficheiros `.tgz` que iriam para o npm instalam e funcionam num projeto exterior ao monorepo, em ESM, CJS, TypeScript e renderização no servidor.

**Critérios de aceitação:**
- [ ] Script `pnpm verify:package` na raiz que: faz o build; corre `pnpm pack` nos três pacotes para uma pasta temporária ignorada pelo git; corre `publint` e `@arethetypeswrong/cli` sobre cada tarball; instala os tarballs no projeto consumidor e corre as verificações dele; sai com 0 só se tudo passar.
- [ ] `publint` sem erros e `attw` sem problemas de resolução de tipos para `node16` (ESM e CJS) e `bundler`, nos três pacotes.
- [ ] Cada tarball contém só `dist/`, `package.json`, `README.md` e licenças: não contém `src/`, testes, stories nem ficheiros de configuração; nas dependências não resta nenhum `workspace:` (o pnpm substitui pela versão).
- [ ] Projeto consumidor em `tests/consumer/` (fora do workspace do pnpm, com o seu próprio `package.json`), que instala os três tarballs e verifica: (a) `import` em ESM e `require` em CJS de `@up201905892/ui` em Node 22; (b) `tsc --noEmit` com `strict` sobre um ficheiro que usa `Button`, `DataTable` tipada, um ícone e o objeto `tokens`; (c) `renderToString(<Button>OK</Button>)` devolve HTML com a classe `ds-button`, o que prova que importar a biblioteca não acede a `window`/`document`; (d) o ficheiro `@up201905892/ui/styles.css` resolve e contém `--ds-color-bg-canvas`.
- [ ] Nenhum agente corre `pnpm publish`, nem com `--dry-run` (as permissões bloqueiam-no); o dry-run de publicação é um passo manual do João, descrito na DS-041.
- [ ] G1 a G3 (dependências novas: `publint`, `@arethetypeswrong/cli`).

**Testes exigidos:**
- Unitários: as verificações (a) a (d) do projeto consumidor são testes automatizados dentro de `tests/consumer/`, corridos pelo `pnpm verify:package`.
- Acessibilidade: não aplicável.
- Visual/Storybook: não aplicável.
- Verificação manual no terminal: `pnpm verify:package` com código 0; listar o conteúdo de um tarball (`tar -tf`) e confirmar a ausência de `src/`; prova negativa temporária: remover `"./styles.css"` de `exports` faz a verificação (d) falhar (não commitado).

**Fora de âmbito:** publicação, registo npm local (Verdaccio), testes do consumidor com Next.js ou outros frameworks, acrescentar `verify:package` ao CI (pedido para "Decisões para o João").

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): placeholder do scope substituído por `@up201905892`

### DS-040 · Auditoria final de acessibilidade (WCAG 2.1 AA)

- **Fase do MVP:** Publicação
- **Prioridade:** Alta
- **Depende de:** DS-010 a DS-035
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** rever todos os componentes em conjunto antes da versão 1.0, fechar lacunas de acessibilidade e publicar no Storybook uma declaração de conformidade honesta, componente a componente.

**Critérios de aceitação:**
- [ ] Página "Accessibility/Conformance" no Storybook (`apps/docs/src/accessibility.mdx`) com uma tabela por componente: papéis e atributos ARIA usados, padrão do APG seguido, teclas suportadas, critérios WCAG 2.1 AA relevantes e como foram verificados (teste unitário, story com `play`, axe, verificação manual).
- [ ] Todos os componentes interativos têm testes de teclado que cobrem as teclas listadas na respetiva especificação; as lacunas encontradas são colmatadas com testes novos.
- [ ] `pnpm test:a11y` passa com todas as stories, e todos os componentes têm story `DarkTheme` (teste de convenções a passar).
- [ ] Reflow (WCAG 1.4.10): script `pnpm test:a11y:reflow` que corre o test runner com viewport de 320px de largura e falha se alguma story tiver scroll horizontal na página; as exceções (ex.: `Table/HorizontalScroll`, que faz scroll dentro do seu contentor) ficam listadas e justificadas na página.
- [ ] Movimento (WCAG 2.3.3): `grep` de `animation` e `transition` em `packages/ui/src/**/*.css` confirma que todas as ocorrências estão cobertas pela regra de `prefers-reduced-motion` da DS-007.
- [ ] Alturas do projeto: script `pnpm test:a11y:sizes` (ou verificação equivalente no test runner) que mede, em browser real e com tamanho de letra de base de 16px, a altura renderizada de `Button`, `IconButton` (também a largura), `Input`, gatilho do `Select` e `Textarea` com `rows={1}` em cada `size`, e falha se alguma for inferior a 32px em `sm`, 40px em `md` ou 48px em `lg`.
- [ ] Alvos de toque (WCAG 2.5.8): 24×24px é o mínimo absoluto para qualquer alvo interativo da biblioteca (inclui Checkbox, Radio, Switch, separadores, gatilhos do Accordion, botões da Pagination, cabeçalhos ordenáveis, botões de fechar e itens de menu); a mesma verificação mede cada um nas respetivas stories e falha se algum tiver menos de 24px de largura ou de altura. As exceções permitidas pela WCAG (ex.: ligações dentro de uma frase) ficam listadas e justificadas na página de conformidade.
- [ ] Defeitos encontrados: os que se corrigem em menos de 30 minutos cada são corrigidos nesta tarefa (com teste que os cobre); os restantes ficam listados na página como "limitações conhecidas" e em "Decisões para o João", para o planeador propor tarefas novas.
- [ ] G1 a G3; alterações a componentes incluem um changeset `patch`.

**Testes exigidos:**
- Unitários: os testes de teclado em falta, por componente.
- Acessibilidade: `pnpm test:a11y`, `pnpm test:a11y:reflow` e `pnpm test:a11y:sizes` com código 0; prova negativa temporária da verificação de tamanhos: reduzir o `min-height` de um `size` do `Button` faz `pnpm test:a11y:sizes` falhar e identificar o componente e o tamanho (não commitado); verificação manual só com teclado das stories `KeyboardInteraction` de Select, Dialog, DropdownMenu, Popover, Tooltip e DataTable, nos dois temas, com o resultado registado no relatório de testes.
- Visual/Storybook: a página "Accessibility/Conformance" abre sem erros e tem uma linha por cada componente exportado (verificado por um teste que compara com as exportações de `packages/ui/src/index.ts`).

**Fora de âmbito:** testes com leitores de ecrã reais (NVDA, VoiceOver) feitos por agentes (ficam como verificação manual recomendada ao João), modo de alto contraste do Windows (`forced-colors`), WCAG 2.2 e nível AAA, certificação externa.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): a auditoria verifica as alturas do projeto (32/40/48px em Button, IconButton, Input, Select e Textarea mínima) e mantém 24×24px como mínimo absoluto para qualquer alvo interativo, com script que falha abaixo desses valores

### DS-041 · Preparação da versão 1.0.0 e guia de publicação manual

- **Fase do MVP:** Publicação
- **Prioridade:** Alta
- **Depende de:** DS-039, DS-040
- **Estimativa:** S (≤ 2h)

**Objetivo:** deixar o repositório no estado exato em que a publicação da 1.0.0 é um conjunto curto de comandos que só o João executa, com um guia passo a passo.

**Critérios de aceitação:**
- [ ] Existe um changeset `major` que descreve a versão 1.0.0, e `pnpm version-packages` foi corrido: os três pacotes ficam com `"version": "1.0.0"` e cada um tem `CHANGELOG.md` gerado; não restam changesets pendentes (`pnpm changeset status` indica que não há alterações por lançar).
- [ ] `pnpm build`, `pnpm size` e `pnpm verify:package` passam com as versões 1.0.0.
- [ ] `docs/publishing.md`, escrito em inglês (regra de língua em "Decisões técnicas"), descreve o **passo manual do João**, por esta ordem: (1) pré-requisitos: conta npm, scope criado, autenticação de dois fatores, `npm login`; (2) confirmar que o `main` tem o merge do `develop` e que o CI está verde; (3) `pnpm install --frozen-lockfile && pnpm build && pnpm verify:package`; (4) dry-run: `pnpm -r publish --dry-run --access public` e o que conferir na saída; (5) publicação: `pnpm changeset publish`; (6) `git push --follow-tags`; (7) confirmar com `npm view @up201905892/ui version` e instalar num projeto vazio; (8) criar a release no GitHub com o conteúdo do `CHANGELOG.md`; (9) o que fazer se correr mal (versão já publicada, `npm deprecate`, lançar um `patch`).
- [ ] O guia recomenda publicar só depois de a fase Documentação (DS-042 a DS-048) estar `Concluído`, para que os README e o campo `homepage` incluídos nos pacotes sejam os finais, e explica como lançar versões seguintes (changeset → `version-packages` → publicar).
- [ ] O guia afirma explicitamente que nenhum agente publica nem faz push e que os comandos dos passos 4 a 6 estão bloqueados nas permissões.
- [ ] Nenhum comando de publicação foi executado nesta tarefa (`npm view @up201905892/ui` continua a não encontrar a versão 1.0.0, salvo se o João já a tiver publicado).
- [ ] G1 a G3.

**Testes exigidos:**
- Unitários: teste que verifica que os três `package.json` publicados têm a mesma versão e que essa versão é a primeira entrada de cada `CHANGELOG.md`.
- Acessibilidade: não aplicável; `pnpm test:a11y` continua a passar.
- Visual/Storybook: não aplicável.
- Verificação manual no terminal: `pnpm changeset status`; `pnpm verify:package` com código 0; leitura do guia confirmando os nove passos e que os nomes dos pacotes coincidem com os dos `package.json`.

**Fora de âmbito:** a publicação efetiva no npm, tags e releases no GitHub (passos do João), publicação do Storybook online (DS-047), automação de releases por GitHub Actions.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): placeholder do scope substituído por `@up201905892`; a publicação do Storybook online passa a remeter para a DS-047
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): o guia recomenda publicar só depois de DS-042 a DS-047 (inclui a DS-047, que altera o campo `homepage` dos pacotes)
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): o guia passa a `docs/publishing.md`, em inglês; a lista de tarefas a concluir antes de publicar passa a DS-042 a DS-048

### DS-042 · Página "Getting started" no Storybook

- **Fase do MVP:** Documentação
- **Prioridade:** Alta
- **Depende de:** DS-036, DS-040
- **Estimativa:** S (≤ 2h)

**Objetivo:** primeira página que um programador lê: como instalar, importar os estilos e usar o primeiro componente em menos de cinco minutos.

**Critérios de aceitação:**
- [ ] A página está escrita em inglês (regra de língua em "Decisões técnicas"), incluindo títulos, texto, comentários dos exemplos e nomes na barra lateral.
- [ ] `apps/docs/src/getting-started.mdx` é a página de entrada do Storybook (primeira na barra lateral, com a ordem definida em `storySort`).
- [ ] Secções, por esta ordem: o que é a biblioteca (duas frases); requisitos (versões de React e de Node); instalação com pnpm, npm e yarn; importar `@up201905892/ui/styles.css` uma vez; primeiro exemplo com `Button`; ativar o tema escuro com `data-theme="dark"` no `<html>`; usar ícones; utilização com TypeScript; ligações para as páginas de tokens (DS-006), para a página de acessibilidade (DS-040) e para o repositório (as ligações para os guias são acrescentadas pela DS-043).
- [ ] Os nomes dos pacotes na página são os reais dos `package.json` (sem placeholder).
- [ ] Os exemplos de código não se podem desatualizar: vivem em `apps/docs/src/snippets/*.tsx`, são verificados pelo `pnpm typecheck` e importados para a página como texto (`?raw`), e o primeiro exemplo aparece também renderizado.
- [ ] Texto sem erros ortográficos e sem conteúdo provisório ("TODO", "lorem ipsum").
- [ ] G1 a G3.

**Testes exigidos:**
- Unitários: os snippets compilam (`pnpm typecheck`); teste que verifica que todos os ficheiros de `snippets/` são referenciados na página.
- Acessibilidade: `pnpm test:a11y` passa na página (hierarquia de títulos sem saltos, ligações com texto descritivo, contraste dos blocos de código nos dois temas).
- Visual/Storybook: a página abre como página inicial; o exemplo renderizado funciona; os blocos de código são legíveis em tema claro e escuro.

**Fora de âmbito:** guias de temas e de personalização (DS-043), tutoriais para frameworks específicos (Next.js, Remix), documentação de cada componente (gerada por autodocs nas respetivas tarefas), tradução para outras línguas.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação alinhada com a regra de língua decidida pelo João (conversa): marca de decisão pendente removida; a página é escrita em inglês
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): placeholder do scope substituído por `@up201905892`

### DS-043 · Guias de temas e de personalização de estilos

- **Fase do MVP:** Documentação
- **Prioridade:** Média
- **Depende de:** DS-042
- **Estimativa:** S (≤ 2h)

**Objetivo:** explicar a quem usa a biblioteca como funcionam os temas e como adaptar os estilos sem sair do sistema de tokens.

**Critérios de aceitação:**
- [ ] Página "Guides/Theming" (`apps/docs/src/guides/theming.mdx`): como os temas são resolvidos (`[data-theme]` e fallback para `prefers-color-scheme`); exemplo de botão de alternância de tema com persistência em `localStorage`; como evitar o "flash" de tema errado no carregamento (script em linha no `<head>`); como criar um tema próprio redefinindo os tokens semânticos; como aplicar um tema só a uma parte da página.
- [ ] Página "Guides/Styling" (`apps/docs/src/guides/styling.mdx`): a convenção de classes `ds-*` e atributos `data-*`; como personalizar um componente com `className` e CSS variables; como usar os tokens em CSS e em TypeScript; o que é API pública (props, classes base, tokens) e o que pode mudar sem aviso (estrutura interna do DOM).
- [ ] Os exemplos seguem a regra da DS-042: ficheiros em `snippets/` verificados pelo `pnpm typecheck` (os de CSS passam o Stylelint), e pelo menos um exemplo por página aparece renderizado.
- [ ] O exemplo de tema próprio cumpre contraste AA (passa `pnpm test:a11y`).
- [ ] As duas páginas estão ligadas a partir de "Getting started" e entre si.
- [ ] G1 a G3.

**Testes exigidos:**
- Unitários: os snippets compilam; o exemplo de alternância de tema tem um teste: clicar muda `data-theme` no elemento raiz e grava a escolha em `localStorage`.
- Acessibilidade: `pnpm test:a11y` passa nas duas páginas; o botão de alternância de tema do exemplo tem nome acessível e funciona com Enter e Espaço.
- Visual/Storybook: páginas `Guides/Theming` e `Guides/Styling`; o exemplo de tema próprio renderizado; o exemplo de tema aplicado só a uma secção.

**Fora de âmbito:** componente `ThemeProvider` publicado na biblioteca (pode ser proposto para a v1.1), guia de contribuição, guia de migração entre versões.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta

### DS-044 · App de exemplo: estrutura, layout e tema

- **Fase do MVP:** Documentação
- **Prioridade:** Alta
- **Depende de:** DS-036, DS-010 a DS-035
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** criar a aplicação de demonstração (um gestor de tarefas de equipa fictício) que consome a biblioteca como um projeto real, com a estrutura, a navegação e a alternância de tema.

**Critérios de aceitação:**
- [ ] Novo workspace `apps/example` (Vite + React + TypeScript `strict`, `"private": true`) que depende de `@up201905892/ui` e `@up201905892/icons` por `workspace:*` e importa `@up201905892/ui/styles.css` (pelo campo `exports`, sem aliases para `src`).
- [ ] Scripts: `pnpm example` na raiz arranca o servidor de desenvolvimento; `apps/example` tem scripts `build`, `typecheck` e `test`, incluídos nos comandos da raiz (`pnpm build` constrói a app e sai com 0).
- [ ] "Feita só com a biblioteca": em `apps/example/src` uma regra do ESLint (`no-restricted-syntax`) proíbe os elementos JSX `button`, `input`, `textarea`, `select`, `table` e `dialog`; não há atributos `style` com cores ou espaçamentos; o CSS próprio da app limita-se a um ficheiro de layout que passa o Stylelint da DS-007 (só tokens).
- [ ] Estrutura da app: cabeçalho com o nome, navegação entre as vistas "Overview" e "Tasks" com `Tabs`, menu de utilizador com `DropdownMenu`, e alternância de tema (`IconButton` com `SunIcon`/`MoonIcon`) que muda `data-theme`, persiste em `localStorage` e respeita `prefers-color-scheme` na primeira visita.
- [ ] Vista "Overview": `Grid` de `Card` com indicadores e `Badge`, um `Alert` informativo, estado de carregamento simulado com `Skeleton` e `Spinner`, e uma secção de perguntas frequentes com `Accordion`.
- [ ] Os dados são fictícios e locais (ficheiro `src/data.ts`); não há chamadas de rede nem dependências além de React, Vite e os pacotes da biblioteca.
- [ ] O layout funciona a 320px de largura sem scroll horizontal e tem um link "Skip to content" como primeiro elemento focável.
- [ ] G1 a G3.

**Testes exigidos:**
- Unitários (Vitest + Testing Library em `apps/example`): a app renderiza a vista "Overview"; mudar de separador mostra a vista "Tasks" (pode ser um marcador até à DS-045); clicar na alternância de tema muda `data-theme` e grava em `localStorage`; a preferência guardada é aplicada ao recarregar.
- Acessibilidade: axe sem violações nas duas vistas (helper da DS-009); marcos `banner`, `navigation` e `main` presentes; um único `<h1>` por vista; percurso só com teclado: Tab chega ao "Skip to content", à navegação, à alternância de tema e ao menu de utilizador, por esta ordem.
- Visual/Storybook: não aplicável (a app não tem stories); verificação manual com `pnpm example` nos dois temas, registada no relatório de testes.
- Verificação manual no terminal: um `<button>` nativo acrescentado temporariamente a `apps/example/src` faz `pnpm lint` falhar (não commitado).

**Fora de âmbito:** vista "Tasks" completa (DS-045), router com URLs, autenticação, backend, publicação online da app (precisa de um workflow, que é do João), testes ponta a ponta com Playwright.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): placeholder do scope substituído por `@up201905892`

### DS-045 · App de exemplo: formulário e tabela de dados

- **Fase do MVP:** Documentação
- **Prioridade:** Alta
- **Depende de:** DS-044
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** completar a app de exemplo com um fluxo real de criar, editar e apagar tarefas, que usa todos os componentes de formulário e de overlay e mostra a biblioteca a funcionar em conjunto.

**Critérios de aceitação:**
- [ ] Vista "Tasks": `DataTable` com pelo menos 30 tarefas fictícias, colunas ordenáveis (título, responsável, prioridade, data limite), estado em `Badge`, paginação de 10 em 10, e um `DropdownMenu` de ações por linha ("Edit", "Delete") aberto por um `IconButton`.
- [ ] Botão "New task" abre um `Dialog` com um formulário feito com `Field`: `Input` (título, obrigatório), `Textarea` (descrição), `Select` (responsável), `RadioGroup` (prioridade), `Checkbox` (marcar como urgente) e `Switch` (notificar a equipa); "Edit" abre o mesmo formulário preenchido.
- [ ] Validação ao submeter: título vazio mostra o `FieldError`, marca o campo com `aria-invalid` e move o focus para o primeiro campo inválido; o diálogo não fecha enquanto houver erros.
- [ ] Submeter com sucesso fecha o diálogo, atualiza a tabela, mostra um `Toast` de sucesso e devolve o focus ao elemento que abriu o diálogo; o botão de submeter mostra `loading` durante uma espera simulada.
- [ ] "Delete" abre um `Dialog` de confirmação com `Button variant="danger"`; confirmar remove a linha e mostra um `Toast` com a ação "Undo", que repõe a tarefa.
- [ ] Um `Popover` de filtros (por estado) junto à tabela, e `Tooltip` nos botões só com ícone.
- [ ] Cobertura da biblioteca: um teste percorre as exportações de componentes de `@up201905892/ui` e falha se alguma não for importada em `apps/example/src` (exceções justificadas numa lista no próprio teste).
- [ ] A regra "só com a biblioteca" da DS-044 continua a passar.
- [ ] G1 a G3.

**Testes exigidos:**
- Unitários (testes de integração com `userEvent`): criar uma tarefa válida acrescenta-a à tabela e mostra o toast; submeter sem título mostra o erro e mantém o diálogo aberto; editar altera a linha; apagar remove a linha e "Undo" repõe-na; ordenar por data limite e mudar de página funciona; o filtro por estado reduz as linhas.
- Acessibilidade: axe sem violações na vista, com o diálogo aberto e com o formulário em erro; fluxo completo só com teclado, automatizado num teste: Tab até "New task", Enter, preencher o título, escolher o responsável no `Select` com as setas e Enter, escolher a prioridade com as setas, Espaço na checkbox, Enter para submeter, e confirmar que o focus volta ao botão "New task"; Esc fecha o diálogo sem guardar.
- Visual/Storybook: não aplicável; verificação manual com `pnpm example` nos dois temas e a 320px de largura, registada no relatório de testes.

**Fora de âmbito:** persistência das tarefas (o estado perde-se ao recarregar), pesquisa por texto, arrastar e largar, datas com seletor de calendário (não existe DatePicker no MVP; usa-se `Input type="date"`), internacionalização.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): placeholder do scope substituído por `@up201905892`

### DS-046 · README do repositório e dos pacotes

- **Fase do MVP:** Documentação
- **Prioridade:** Média
- **Depende de:** DS-039, DS-042, DS-045
- **Estimativa:** S (≤ 2h)

**Objetivo:** dar ao repositório e a cada pacote uma página de entrada profissional, que explica o produto a quem o vai usar e o método de trabalho a quem o vai avaliar numa entrevista.

**Critérios de aceitação:**
- [ ] `README.md` da raiz, em inglês (regra de língua em "Decisões técnicas"), com: descrição numa frase; lista do que inclui (componentes, tokens, temas, ícones); instalação e exemplo mínimo (iguais aos de "Getting started"); tabela dos pacotes com nome e descrição; tabela dos componentes por fase; comandos de desenvolvimento (os do `CLAUDE.md`); secção "Accessibility" com ligação à página de conformidade; secção "How this project is built" que explica o fluxo de quatro fases e aponta para `docs/workflow/`; secções "License" (MIT) e "Credits" (Lucide, Radix UI).
- [ ] O conteúdo atual do `README.md` sobre o fluxo de trabalho não se perde: é integrado na secção "How this project is built" ou movido para `docs/` com ligação.
- [ ] `README.md` de `packages/ui`, `packages/tokens` e `packages/icons` (são os que aparecem na página do npm), em inglês e com títulos de secção em inglês: instalação, utilização, API principal ou ligação para a documentação, licença (MIT); o de `icons` mantém a secção "Credits" com os créditos do Lucide; o de `ui` mantém a secção "How to create a component".
- [ ] Os nomes dos pacotes (`@up201905892/ui`, `@up201905892/icons`, `@up201905892/tokens`) e os comandos são os reais; não há placeholders, "TODO" nem ligações para recursos que não existem (a ligação para o Storybook publicado é acrescentada pela DS-047; as ligações para o npm só entram se o João confirmar que os pacotes já estão publicados; caso contrário ficam omitidas e registadas em "Decisões para o João").
- [ ] Todas as ligações relativas apontam para ficheiros que existem (verificado por teste).
- [ ] G1 a G3 (o Prettier passa nos ficheiros Markdown alterados).

**Testes exigidos:**
- Unitários: teste Vitest que extrai as ligações relativas dos quatro README e verifica que os ficheiros existem; teste que verifica que o nome de cada pacote aparece no respetivo README.
- Acessibilidade: imagens (se houver) com texto alternativo; títulos sem saltos de nível; texto das ligações descritivo (sem "clica aqui").
- Visual/Storybook: não aplicável; `pnpm verify:package` continua a passar e os tarballs incluem os README atualizados.

**Fora de âmbito:** capturas de ecrã e GIF animados, badges de CI e de versão do npm (dependem da publicação e podem ser acrescentados pelo João depois), `CONTRIBUTING.md` e código de conduta, site de documentação separado.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação alinhada com a regra de língua decidida pelo João (conversa): o README da raiz é escrito em inglês, sem remeter para uma decisão pendente
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): títulos de secção em inglês ("Credits", "How to create a component", "License"); licença MIT; nomes reais dos pacotes com o scope `@up201905892`; a ligação para o Storybook publicado passa para a DS-047

### DS-047 · Storybook no GitHub Pages: build estático e proposta de workflow

- **Fase do MVP:** Documentação
- **Prioridade:** Média
- **Depende de:** DS-042, DS-046
- **Estimativa:** S (≤ 2h)

**Objetivo:** deixar o Storybook pronto a ser publicado no GitHub Pages, com um build que funciona debaixo do caminho base do repositório e um workflow proposto que o João só tem de copiar para `.github/`.

**Critérios de aceitação:**
- [ ] Script `pnpm build:pages` na raiz: constrói os pacotes, gera o Storybook estático e deixa o site completo em `apps/docs/storybook-static/` (a pasta de saída já usada pelo `pnpm build:docs`, ignorada pelo git), incluindo um ficheiro `.nojekyll` na raiz dessa pasta.
- [ ] O build funciona debaixo de um caminho base: todos os recursos (JS, CSS, iframe das stories, tipos de letra, imagens) são referenciados por caminhos relativos, de modo que o site abre tanto em `/` como em `/<nome-do-repositório>/`; não há caminhos absolutos começados por `/` no `index.html` nem no `iframe.html` gerados.
- [ ] Script `pnpm preview:pages` que serve a pasta de saída em `http://localhost:<porta>/<nome-do-repositório>/`, com o nome do repositório lido do campo `repository` do `package.json` da raiz (não fica escrito à mão nos scripts).
- [ ] Verificação automática `pnpm test:pages`: com o site servido debaixo do caminho base, abre a página inicial num browser (Playwright, já instalado pela DS-003), confirma que a página "Getting started" aparece, que uma story de componente (ex.: `Button/Primary`) renderiza dentro do iframe, e que nenhum pedido de rede termina em 404; sai com código ≠ 0 se algo falhar.
- [ ] `docs/github-pages.md`, em inglês, com: (1) o conteúdo completo proposto para `.github/workflows/pages.yml` (disparo em `push` para `main` e `workflow_dispatch`; pnpm 10 e Node 22; `pnpm install --frozen-lockfile`; `pnpm build:pages`; `actions/configure-pages`, `actions/upload-pages-artifact` com `apps/docs/storybook-static` e `actions/deploy-pages`; permissões `contents: read`, `pages: write` e `id-token: write`; grupo de `concurrency`); (2) os passos manuais do João: copiar o ficheiro para `.github/workflows/`, ativar Pages em Settings → Pages com a origem "GitHub Actions", e confirmar o URL; (3) como testar localmente com `pnpm preview:pages`; (4) o URL esperado, `https://<dono>.github.io/<nome-do-repositório>/`, calculado a partir do campo `repository`.
- [ ] Nenhum ficheiro em `.github/` é criado ou alterado por esta tarefa; o pedido para o João acrescentar o workflow e ativar o Pages fica registado em "Decisões para o João" no registo diário, com ligação para `docs/github-pages.md`.
- [ ] O `README.md` da raiz ganha, numa secção "Documentation", a ligação para o URL esperado do Storybook, e o campo `homepage` dos `package.json` publicados aponta para o mesmo URL; o registo em "Decisões para o João" avisa que a ligação só funciona depois de o João ativar o Pages.
- [ ] G1 a G3 (sem dependências novas além de um servidor estático de desenvolvimento, se o já usado pelo `pnpm test:a11y` não servir).

**Testes exigidos:**
- Unitários: teste Vitest que, depois de `pnpm build:pages`, verifica que `apps/docs/storybook-static/index.html`, `iframe.html` e `.nojekyll` existem e que os dois HTML não contêm `src="/` nem `href="/`; teste que confirma que o URL escrito no README e em `homepage` coincide com o calculado a partir de `repository`.
- Acessibilidade: não aplicável a esta tarefa (o conteúdo é o mesmo já testado); `pnpm test:a11y` continua a passar.
- Visual/Storybook: `pnpm test:pages` com código 0; verificação manual com `pnpm preview:pages`: a página inicial abre debaixo do caminho base, o seletor de tema funciona e a navegação entre stories não dá erros na consola.
- Verificação manual no terminal: `pnpm build:pages && pnpm test:pages` com código 0; `git status` confirma que nada mudou em `.github/`; prova negativa temporária: servir a pasta na raiz e pedir um recurso por `/<nome-do-repositório>/…` inexistente faz `pnpm test:pages` falhar (não commitado).

**Fora de âmbito:** criar ou alterar ficheiros em `.github/` e ativar o Pages (passos do João), publicar a app de exemplo (`apps/example`) no mesmo site (DS-048), domínio próprio, pré-visualizações por pull request, publicação em serviços externos (Chromatic, Netlify, Vercel).

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta
- 2026-10-09 · planeador · especificação revista a pedido do João (conversa): a publicação da app de exemplo no mesmo site passa a remeter para a DS-048

### DS-048 · App de exemplo no GitHub Pages (subpasta `example/`)

- **Fase do MVP:** Documentação
- **Prioridade:** Média
- **Depende de:** DS-045, DS-047
- **Estimativa:** S (≤ 2h)

**Objetivo:** publicar a app de exemplo no mesmo site do Storybook, numa subpasta, para que o portfólio tenha uma demonstração ao vivo da biblioteca sem precisar de outro workflow.

**Critérios de aceitação:**
- [ ] O build de `apps/example` usa caminho base relativo (`base: './'` na configuração do Vite): o `index.html` gerado não tem caminhos absolutos começados por `/` e a app abre a partir de qualquer subpasta.
- [ ] `pnpm build:pages` (DS-047) passa também a construir a app de exemplo e a copiar o resultado para `apps/docs/storybook-static/example/`; o Storybook continua na raiz do site e nenhum ficheiro dele é substituído. A cópia é feita por um script Node que funciona em Windows e em Linux.
- [ ] Com `pnpm preview:pages`, a app abre em `http://localhost:<porta>/<nome-do-repositório>/example/` e o Storybook continua a abrir em `/<nome-do-repositório>/`.
- [ ] `pnpm test:pages` (DS-047) passa também a abrir `/<nome-do-repositório>/example/` e confirma que a vista "Overview" renderiza, que mudar para "Tasks" mostra a tabela, que a alternância de tema muda `data-theme`, e que nenhum pedido de rede termina em 404.
- [ ] Ligações: o `README.md` da raiz ganha, na secção "Documentation", a ligação "Live example" para `https://<dono>.github.io/<nome-do-repositório>/example/` (calculada a partir do campo `repository`); a página "Getting started" do Storybook ganha uma ligação relativa para `example/`; `docs/github-pages.md` é atualizado com o URL da app e com a nota de que o workflow proposto não muda (o mesmo artefacto passa a incluir a subpasta).
- [ ] Nenhum ficheiro em `.github/` é criado ou alterado; se o João já tiver copiado o workflow da DS-047, não precisa de fazer mais nada, e isso fica dito no registo diário.
- [ ] `pnpm example` (servidor de desenvolvimento) e os testes da app (DS-044 e DS-045) continuam a funcionar com o caminho base relativo.
- [ ] G1 a G3 (sem dependências novas).

**Testes exigidos:**
- Unitários: teste Vitest que, depois de `pnpm build:pages`, verifica que `apps/docs/storybook-static/example/index.html` existe, que não contém `src="/` nem `href="/`, e que `apps/docs/storybook-static/index.html` (Storybook) continua a existir; teste que confirma que o URL "Live example" do README coincide com o calculado a partir de `repository`.
- Acessibilidade: não aplicável a esta tarefa (a app é a mesma já testada nas DS-044 e DS-045); `pnpm test:a11y` e os testes de `apps/example` continuam a passar.
- Visual/Storybook: `pnpm test:pages` com código 0, cobrindo o Storybook e a app; verificação manual com `pnpm preview:pages`: a app abre na subpasta nos dois temas e a ligação a partir de "Getting started" funciona.
- Verificação manual no terminal: `pnpm build:pages && pnpm test:pages` com código 0; `git status` confirma que nada mudou em `.github/`; prova negativa temporária: repor `base: '/'` no Vite faz `pnpm test:pages` falhar com pedidos 404 na subpasta (não commitado).

**Fora de âmbito:** router com URLs e tratamento de 404 para rotas (a app não tem router), dados persistentes ou backend, alterar o workflow proposto na DS-047, publicar a app num site ou domínio separado, incorporar a app dentro de uma story do Storybook.

**Histórico:**
- 2026-10-09 · planeador · criada como Proposta

### DS-049 · Referência técnica e apresentação do projeto (versão inicial)

- **Fase do MVP:** Documentação
- **Prioridade:** Média
- **Depende de:** DS-041, DS-048 (é a última tarefa do plano: corre depois de todas as outras tarefas do MVP; a DS-048 já depende, de forma transitiva, da maior parte delas)
- **Estimativa:** L (≤ 3 dias)

**Objetivo:** criar a primeira versão de dois documentos em inglês que descrevem tudo o que existe no repositório nesse momento (todo o trabalho das tarefas DS-001 a DS-048): uma referência técnica ficheiro a ficheiro para quem mantém o código e uma apresentação para leitores não técnicos. A partir daí, o `finalizador` mantém os dois documentos atualizados ao fechar cada tarefa, seguindo **exatamente o formato definido abaixo** (a regra é acrescentada pelo João a `.claude/agents/finalizador.md`; esta tarefa não altera esse ficheiro).

**Formato de `docs/technical-reference.md`** (é o formato que o finalizador vai seguir):
- Referência técnica de todos os ficheiros versionados do repositório, **exceto**: ficheiros gerados (`dist/`, `storybook-static/`, ficheiros produzidos pelo Style Dictionary ou pelo SVGR, incluindo `packages/icons/src/generated/` e o `packages/icons/src/index.ts` regenerado pelo script `generate`), `pnpm-lock.yaml` e `docs/workflow/`.
- Agrupada por pacote, com um `##` por grupo, por esta ordem: `packages/tokens`, `packages/ui`, `packages/icons`, `apps/docs`, `apps/example` (criada pela DS-044), raiz (a raiz inclui os ficheiros de configuração, `.claude/`, `.github/`, `docs/` fora de `docs/workflow/` e os próprios dois documentos desta tarefa).
- Uma secção `###` por ficheiro, com o caminho relativo à raiz como título (ex.: `### packages/ui/src/Button/Button.tsx`).
- Para cada ficheiro:
  - **Purpose:** uma frase.
  - **Exports and functions:** cada função, componente, hook, tipo ou constante exportada, numa linha no formato `` `name` — `path:line` — what it does ``, em que `line` é a linha onde a declaração começa no commit atual.
  - **Patterns:** metodologias usadas (ex.: `forwardRef`, `Slot` do Radix / `asChild`, variantes por atributos `data-*`, controlado/não controlado).
  - **Tools:** bibliotecas e ferramentas de que o ficheiro depende.
  - **Tasks:** IDs das tarefas que o criaram ou alteraram.
- Ficheiros de teste (`*.test.ts(x)`) e stories (`*.stories.tsx`): uma linha só, a dizer o que cobrem, sem lista de funções.
- Os ícones gerados não têm secção própria: a secção do script de geração lista os nomes dos componentes que ele produz.

**Formato de `docs/project-overview.md`** (é o formato que o finalizador vai seguir):
- Apresentação para um leitor não técnico (cliente, recrutador, gestor): sem código, sem nomes de ficheiros nem caminhos, sem jargão por explicar (cada termo técnico inevitável, ex.: "design tokens", "componente", é explicado na primeira vez que aparece).
- Secções: o que é o projeto e para que serve; o que está pronto (tabela de componentes com o estado `Ready`, `In progress` ou `Planned` e uma frase por componente); como se garante a qualidade (acessibilidade WCAG 2.1 AA, testes automáticos, temas claro e escuro), em linguagem simples; próximos passos por fase do MVP (Fundações, Formulários, Overlays e feedback, Layout e dados, Publicação, Documentação, com os nomes das fases em inglês); data da última atualização.
- Correspondência entre os estados da tabela-índice e os da apresentação: `Concluído` → `Ready`; `Em desenvolvimento`, `Pronto para teste`, `Em teste`, `Aprovado` e `Reprovado` → `In progress`; `Proposta` e `Planeado` → `Planned`.

**Critérios de aceitação:**
- [ ] `docs/technical-reference.md` e `docs/project-overview.md` existem e estão escritos em inglês (regra de língua em "Decisões técnicas").
- [ ] Cobertura: cada ficheiro de `git ls-files` que não esteja nas exclusões acima tem uma secção `###` em `technical-reference.md` com o caminho exato como título; não há secções para ficheiros que não existem nem para ficheiros excluídos. O programador regista no `02-desenvolvimento.md` o comando usado para fazer esta comparação, para o testador o repetir.
- [ ] Cada secção de ficheiro que não seja teste nem story tem as cinco entradas **Purpose**, **Exports and functions**, **Patterns**, **Tools** e **Tasks** (com "None" quando não se aplica); cada secção de teste ou story tem uma só linha a dizer o que cobre.
- [ ] Todos os símbolos exportados pelos `packages/*/src/**/index.ts` não gerados (incluindo `packages/ui/src/index.ts`, os `index.ts` de cada componente e `packages/tokens/src/index.ts`) aparecem em `technical-reference.md` com uma referência `path:line` no formato definido.
- [ ] As referências `path:line` apontam para a linha onde a declaração começa (linha do `export`, `function`, `const`, `type` ou `interface`) no commit registado em `02-desenvolvimento.md`.
- [ ] A coluna **Tasks** de cada ficheiro é coerente com o histórico (`git log --follow` do ficheiro mostra commits com esses IDs).
- [ ] `project-overview.md` não contém caminhos de ficheiros (nenhum texto com `/` seguido de nome de ficheiro, nem extensões como `.ts`, `.tsx`, `.css`, `.json`, `.md`) nem blocos de código (nenhuma linha com ` ``` `), e não tem código inline.
- [ ] `project-overview.md` lista na tabela todos os componentes do âmbito do MVP (Button, IconButton, Field, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Alert, Toast, Spinner, Skeleton, Badge, Dialog, Popover, Tooltip, DropdownMenu, Stack, Grid, Card, Tabs, Accordion, Table e Pagination), cada um com um estado coerente com a tabela-índice à data do commit, segundo a correspondência acima; tem as secções de qualidade, próximos passos por fase e a data da última atualização (formato `YYYY-MM-DD`).
- [ ] `pnpm lint` continua a passar (o Prettier verifica os ficheiros Markdown em `docs/` fora de `docs/workflow/`).
- [ ] Nenhum outro ficheiro do repositório é alterado além dos dois documentos (e dos registos do fluxo); `.claude/agents/finalizador.md` não é tocado.
- [ ] G1 a G3 (sem dependências novas; changeset não aplicável).

**Testes exigidos:**
- Unitários: não aplicável (tarefa só de documentação; não se acrescentam testes Vitest).
- Verificação do testador (cobertura): repetir a comparação entre `git ls-files` (menos as exclusões) e os títulos `###` de `technical-reference.md`, e entre os símbolos exportados dos `index.ts` não gerados e as referências do documento; zero ficheiros e zero símbolos em falta.
- Verificação do testador (amostra de referências): escolher pelo menos 10 referências `path:line`, de pelo menos três grupos diferentes (ex.: `packages/ui`, `packages/tokens`, `apps/docs`), e confirmar que cada uma aponta para a linha onde a declaração começa; uma referência errada reprova a tarefa.
- Verificação do testador (apresentação): procurar em `project-overview.md` blocos de código, código inline e caminhos/extensões de ficheiros (zero resultados); comparar a tabela de componentes com a tabela-índice do Planeamento.
- Acessibilidade: títulos dos dois documentos sem saltos de nível; tabelas com linha de cabeçalho.
- Visual/Storybook: não aplicável.
- Verificação manual no terminal: `pnpm lint` com código 0.

**Fora de âmbito:** a regra de manutenção no `finalizador` (acrescentada pelo João em `.claude/agents/finalizador.md`), documentar ficheiros de tarefas que ainda não estejam `Concluído`, gerar os documentos automaticamente por script, documentação da API em Storybook (DS-042, DS-043), README do repositório e dos pacotes (DS-046), traduções.

**Histórico:**
- 2026-10-16 · planeador · — → Proposta · pedida pelo João na conversa

### DS-050 · Pacotes do workspace resolvidos a partir do código-fonte (typecheck e testes sem build prévio)

- **Fase do MVP:** Fundações
- **Prioridade:** Alta
- **Depende de:** — (DS-008 e DS-015 já estão `Concluído`)
- **Estimativa:** M (≤ 1 dia)

**Objetivo:** fazer com que os comandos do `CLAUDE.md` funcionem num clone limpo, sem `pnpm build` prévio. Em desenvolvimento (typecheck, Vitest, Storybook), os pacotes `@ds/*` do workspace passam a ser resolvidos a partir do código-fonte (`src/index.ts`); o resultado construído e publicado continua a resolver para `dist/`.

**Contexto (verificado pelo João num clone limpo de `develop` em 2026-10-16):** `packages/icons/package.json` só expõe tipos a partir de `./dist/index.d.ts` (campo `types` e `exports["."].types`). Desde a DS-015 (Checkbox) e a DS-018 (Select), o `@ds/ui` importa `@ds/icons`. Por isso, num clone limpo, `pnpm typecheck` falha com `TS2307: Cannot find module '@ds/icons'` em `src/Checkbox/Checkbox.tsx` e `src/Select/Select.tsx`, e só passa depois de `pnpm build`. O CI do GitHub corre os passos de tipos e de testes antes do build, e por isso está vermelho desde 2026-10-14. O João vai reordenar o `ci.yml` como solução provisória, mas essa mudança não substitui esta tarefa.

**Abordagem sugerida (não obrigatória):** `paths` no `tsconfig.base.json`, ou uma condição de exportação própria (ex.: `"source"` em `exports`, a apontar para `./src/index.ts`) com `customConditions` no TypeScript; nos dois casos, acompanhada de `resolve.alias` ou `resolve.conditions` equivalentes nas configurações do Vitest e na configuração Vite do Storybook. O programador escolhe o mecanismo e regista a escolha e o motivo em `02-desenvolvimento.md`. Os `.d.ts` construídos e os `exports` para `dist/` ficam iguais para quem consome os pacotes.

**Nota sobre `@ds/tokens`:** o `src/index.ts` deste pacote está vazio (`export {}`). O objeto `tokens`/`themes` e os ficheiros `tokens.css`/`themes.css` são produzidos pelo Style Dictionary e só existem em `dist/`. Hoje, os scripts de `apps/docs` (`storybook`, `build-storybook`, `typecheck`, `test:a11y`) e o `test` do próprio pacote correm `pnpm --filter @ds/tokens build` antes. Para este pacote há duas soluções aceites: (a) manter a geração automática como passo prévio dentro de cada comando que precisa dela, ou (b) expor uma fonte TypeScript sem geração. Em qualquer dos casos, a solução tem de cobrir todos os consumidores e fica registada.

**Critérios de aceitação:**
- [ ] Inventário: `02-desenvolvimento.md` lista todas as dependências `@ds/*` entre workspaces, no mínimo `ui → icons`, `ui → tokens`, `docs → ui`, `docs → icons` e `docs → tokens` (incluindo importações diretas nas stories, mesmo sem dependência declarada). Para cada uma, indica o tipo de importação (TS/JS ou CSS) e como passa a ser resolvida em desenvolvimento.
- [ ] Clone limpo: depois de `git clone` + `pnpm install --frozen-lockfile`, sem nenhuma pasta `dist/` nem `storybook-static/` no repositório, `pnpm typecheck`, `pnpm test` e `pnpm lint` saem com código 0, cada um corrido isoladamente e sem `pnpm build` antes.
- [ ] Num clone limpo, `pnpm build:docs` sai com código 0, e `pnpm storybook` arranca sem erros de resolução de módulos; as stories do Checkbox e do Select mostram os ícones.
- [ ] `pnpm build` continua a sair com código 0 e gera os mesmos ficheiros em `packages/*/dist/` que antes da tarefa (mesma lista de ficheiros).
- [ ] Os `dist/*.d.ts` do `@ds/ui` importam `@ds/icons` pelo nome do pacote: não contêm caminhos para o código-fonte de outros pacotes (nem `../icons/src`, nem `packages/icons`, nem `src/index`), e não copiam as declarações dos ícones para dentro (`grep` sem resultados).
- [ ] Os campos `main`, `module`, `types` e as entradas `import`/`require`/`types` de `exports` dos três pacotes continuam a apontar para `dist/`. Se for acrescentada uma condição de desenvolvimento (ex.: `"source"`), ela é a única entrada nova e não é usada pelo `tsup` nem por um consumidor normal: `node -e "require('@ds/ui')"`, a partir de `apps/docs`, depois do build, resolve para `dist/`.
- [ ] `pnpm test:a11y` continua a passar.
- [ ] Verificação de regressão registada em `02-desenvolvimento.md` com os comandos exatos usados, incluindo a forma de remover `dist/` (clone novo, ou `git clean -xdf` seguido de `pnpm install --frozen-lockfile`), e o código de saída de cada comando.
- [ ] Nenhum ficheiro em `.github/` é alterado. Se o CI precisar de alguma mudança (ex.: deixar de depender da ordem dos passos), o pedido fica em "Decisões para o João" no registo diário.
- [ ] G1 a G3 (sem dependências novas de runtime; uma devDependency só entra se o mecanismo a exigir e se ficar justificada no registo).

**Testes exigidos:**
- Unitários: não são precisos testes novos, salvo se o mecanismo escolhido precisar de um (ex.: um teste que confirma que `@ds/icons` resolve para `src/` no Vitest). Os testes existentes continuam a passar sem build prévio.
- Verificação do testador: repetir a verificação de clone limpo (clone novo ou `git clean -xdf`, depois `pnpm install --frozen-lockfile`, depois `pnpm typecheck`, `pnpm test` e `pnpm lint`, cada um com código 0); depois `pnpm build`, inspeção com `grep` dos `packages/ui/dist/*.d.ts` (sem caminhos de código-fonte de outros pacotes) e `pnpm build:docs` com código 0.
- Prova negativa (temporária, não commitada): num clone limpo, introduzir um erro de tipos em `packages/icons/src`, por exemplo mudando o tipo de `size` de um ícone usado pelo Checkbox, e confirmar que `pnpm typecheck` no `@ds/ui` falha. Isto prova que os tipos vêm do código-fonte e não de um `dist/` antigo.
- Acessibilidade: não aplicável (sem alterações a componentes); `pnpm test:a11y` continua a passar.
- Visual/Storybook: verificação manual de que as stories do Checkbox e do Select mostram os ícones com `pnpm storybook` num clone limpo.

**Fora de âmbito:** alterar a ordem dos passos em `ci.yml` ou `diario.yml` (é do João), metadados de publicação e mudança de nome dos pacotes (DS-036), project references do TypeScript (`tsc -b`) com build incremental, alterar o Style Dictionary ou os tokens.

**Histórico:**
- 2026-10-16 · planeador · — → Proposta · pedida pelo João na conversa
- 2026-10-19 · planeador · Proposta → Planeado · aprovada pelo João (aprovacoes.md, 2026-10-16)
- 2026-10-19 · programador · Planeado → Em desenvolvimento · início da implementação
- 2026-10-19 · programador · Em desenvolvimento → Pronto para teste · commit fd42d21
- 2026-10-19 · testador · Pronto para teste → Em teste · início do teste (commits fd42d21, 82b593f)
- 2026-10-19 · testador · Em teste → Aprovado · relatório 1, todos os critérios verificados, zero falhas
- 2026-10-19 · finalizador · Aprovado → Concluído · changeset não aplicável (infraestrutura, pacotes privados); verificação visual dos ícones em browser não feita, coberta por build:docs e test:a11y (ver 04-concluded.md)
