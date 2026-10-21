# Registo diário

Resumo de cada execução de `/diario`, a mais recente primeiro.

## 2026-10-21

- **Decisões para o João:**
  1. Aprovar DS-036 a DS-049 em `aprovacoes.md` (14 propostas por aprovar). Não propus tarefas novas: há 8 tarefas `Planeado` com dependências satisfeitas.
  2. Opcional: ver no Storybook, nos dois temas, o contraste do botão de fechar do Alert (DS-022) sobre o fundo `*-subtle`, e a largura do Button em loading com ícones que não tenham 16px (DS-021). Ambos foram verificados só por cálculo/CSS e axe, sem inspeção visual.
  3. Pendentes das execuções anteriores: `ci.yml` já não precisa do `pnpm build` antes de `typecheck`/`test`/`lint` (DS-050; `.github/` é só teu); sugestão de tarefa para o `play` com teclado real (`@storybook/test`).
- **Concluídas:** DS-021 (Button: estado `loading`), DS-022 (Alert)
- **Testadas:** DS-021 (Aprovado), DS-022 (Aprovado), ambas ao primeiro relatório
- **Desenvolvidas:** DS-021, DS-022 (ciclo completo no mesmo dia, uma de cada vez)
- **Decisões aplicadas:** nenhuma (sem linhas novas em `aprovacoes.md`)
- **Propostas à espera de aprovação:** DS-036 a DS-049
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-023, DS-024, DS-027 (agora desbloqueada), DS-028 a DS-031, DS-034 (todas Média), DS-035 depois de DS-034. Notas: os testadores acrescentaram `Button.loading.test.tsx` e `Alert.edge.test.tsx`; o testador não confirmou o aviso do programador sobre `aria-describedby` com `asChild` (a descrição sai correta); o Alert tem uma borda `*-text` que a especificação não pedia.

## 2026-10-20

- **Decisões para o João:**
  1. Aprovar DS-036 a DS-049 em `aprovacoes.md` (14 propostas por aprovar). Não propus tarefas novas: há 11 tarefas `Planeado` à espera de desenvolvimento.
  2. Sugestão para o planeador (sem ação urgente): uma tarefa para acrescentar `@storybook/test` ou alargar o `test-runner.ts`, para que o `play` de `SortKeyboardInteraction` (Table) use teclado real; hoje usa `focus()` + `click()` e Enter/Espaço só estão nos testes unitários.
  3. Opcional: `prefers-reduced-motion` do Spinner/Skeleton foi verificado só por leitura e testes do CSS, e o contraste dos dois temas só pelo axe; sem inspeção visual.
  4. Nota antiga ainda por tratar: `ci.yml` já não precisa do `pnpm build` antes de `typecheck`/`test`/`lint` (DS-050). `.github/` é só teu.
- **Concluídas:** DS-033 (Table: ordenação), DS-020 (Spinner e Skeleton)
- **Testadas:** DS-033 (Aprovado), DS-020 (Aprovado), ambas ao primeiro relatório
- **Desenvolvidas:** DS-033, DS-020 (ciclo completo no mesmo dia, uma de cada vez)
- **Decisões aplicadas:** nenhuma (sem linhas novas em `aprovacoes.md`)
- **Propostas à espera de aprovação:** DS-036 a DS-049
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-021 (Button loading, agora desbloqueada), DS-022, DS-023, DS-024, DS-028 a DS-031, DS-034 (Média), DS-027 depois de DS-021, DS-035 depois de DS-034. Notas: os testadores acrescentaram `TableSort.extra.test.tsx`, `Spinner.css.test.ts` e `Skeleton.css.test.ts`; `useTableSort` tem um `accessor` opcional por coluna que a especificação não pedia.

## 2026-10-19 (segunda execução)

- **Decisões para o João:**
  1. Aprovar DS-036 a DS-049 em `aprovacoes.md` (14 propostas por aprovar). Não propus tarefas novas: há 13 tarefas `Planeado` à espera de desenvolvimento.
  2. Sugestão sem ação urgente: o `ci.yml` já não precisa do `pnpm build` antes de `typecheck`, `test` e `lint` (DS-050); podes reverter a reordenação provisória. `.github/` é só teu.
  3. Opcional: abrir `pnpm storybook` e ver os ícones do Checkbox e do Select (DS-050 foi validada sem browser interativo; `test:a11y` passa).
  4. Sugestão para o planeador: `Table` não aceita `className` nem props no contentor `ds-table-container` (pode importar para DS-035).
- **Concluídas:** DS-032 (Table: estrutura base), DS-050 (workspace a partir do código-fonte)
- **Testadas:** DS-032 (Reprovado no relatório 1, Aprovado no 2), DS-050 (Aprovado ao primeiro)
- **Desenvolvidas:** DS-032 (2 iterações), DS-050
- **Decisões aplicadas:** nenhuma (sem linhas novas em `aprovacoes.md`)
- **Propostas à espera de aprovação:** DS-036 a DS-049
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-033 (Alta), depois DS-020 e as restantes `Planeado`. Nota: o teste das setas da Table corre no `postVisit` de `apps/docs/.storybook/test-runner.ts` (só em `pnpm test:a11y`).

## 2026-10-19

- **Decisões para o João:**
  1. Aprovar DS-036 a DS-049 em `aprovacoes.md` (14 propostas por aprovar). Não propus tarefas novas: há 15 tarefas `Planeado` à espera de desenvolvimento.
  2. Nota de design do DropdownMenu (DS-026): usa `modal={false}` no Radix, porque o modo modal punha `aria-hidden` no `#storybook-root` e o `test:a11y` falhava. A página atrás continua com scroll e interativa com o menu aberto; clicar fora, Esc e Tab fecham. Diz se queres o modo modal (exige outra solução para o Storybook).
  3. Sem ação urgente: o Radix Dialog não define `aria-modal`, por isso o `DialogContent` acrescenta-o à mão.
- **Concluídas:** DS-025 (Dialog), DS-026 (DropdownMenu)
- **Testadas:** DS-025 (Aprovado), DS-026 (Aprovado), ambas ao primeiro relatório
- **Desenvolvidas:** DS-025, DS-026 (ciclo completo no mesmo dia, uma de cada vez)
- **Decisões aplicadas:** aprovações de 2026-10-16 (DS-021 a DS-035 e DS-050 passaram a `Planeado`)
- **Propostas à espera de aprovação:** DS-036 a DS-049
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-032 e DS-033 (Alta), DS-050 (Alta), depois DS-020 e as restantes `Planeado`. Notas: o testador acrescentou `Dialog.css.test.ts` e `DropdownMenu.extra.test.tsx`; o relatório de DS-025 refere um commit de teste separado, mas o teste foi no mesmo commit do relatório (`dbe5ab0`); o planeador não tem `git`, por isso o commit das aprovações (`1479c05`) foi feito pelo orquestrador.

## 2026-10-16

- **Decisões para o João:**
  1. Aprovar DS-021 a DS-048 em `aprovacoes.md` (28 propostas por aprovar). Só resta DS-020 `Planeado`: a próxima execução só tem essa tarefa para desenvolver. Não propus tarefas novas, porque já há 28 à espera de aprovação.
  2. Sugestões sem ação urgente, para o planeador: o estado desativado do `Switch` fica abaixo de 3:1 de contraste (isento em WCAG 1.4.11, igual ao `Checkbox`); o `Switch` não tem `invalid`; o `Badge` com `asChild` não tem hover.
- **Concluídas:** DS-017 (Switch), DS-019 (Badge). Fase Formulários completa.
- **Testadas:** DS-017 (Aprovado), DS-019 (Aprovado), ambas ao primeiro relatório
- **Desenvolvidas:** DS-017, DS-019 (ciclo completo no mesmo dia, uma de cada vez)
- **Decisões aplicadas:** nenhuma (sem linhas novas em `aprovacoes.md`)
- **Propostas à espera de aprovação:** DS-021 a DS-048
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-020 (Spinner e Skeleton). Notas: o axe em jsdom não mede contraste, por isso o Badge e o Switch têm testes de CSS que calculam rácios; `02-desenvolvimento.md` tem linhas duplicadas da entrada DS-016 no fim (não apagadas, os registos só crescem); `@ds/icons` tem de estar compilado (`pnpm build`) antes de `typecheck`/`test` num clone limpo.

## 2026-10-15

- **Decisões para o João:**
  1. Aprovar DS-021 a DS-048 em `aprovacoes.md` quando quiseres que avancem (28 propostas por aprovar; não propus tarefas novas, há 3 planeadas e livres: DS-017, DS-019, DS-020; a próxima execução já fica sem margem).
  2. Sugestões sem ação urgente, para o planeador: `FieldLabel` com `id` ou um `Fieldset`/`legend`, porque `htmlFor` não dá nome acessível ao `RadioGroup` (a story usa `aria-labelledby`); `className` no `<label>` exterior do `Radio` (e do `Checkbox`).
- **Concluídas:** DS-014 (Textarea), DS-016 (RadioGroup)
- **Testadas:** DS-014 (Aprovado), DS-016 (Aprovado), ambas ao primeiro relatório
- **Desenvolvidas:** DS-014, DS-016 (ciclo completo no mesmo dia, uma de cada vez)
- **Decisões aplicadas:** nenhuma (sem linhas novas em `aprovacoes.md`)
- **Propostas à espera de aprovação:** DS-021 a DS-048
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-017 (Switch), DS-019 (Badge), DS-020 (Spinner e Skeleton). Notas: o `RadioGroup` não passa `orientation` ao Radix (para manter as quatro setas) e põe `aria-orientation` à mão; o testador acrescentou `Textarea.css.test.ts`; o redimensionamento do Textarea e o teclado do RadioGroup em Chromium não têm teste automático.

## 2026-10-14

- **Decisões para o João:**
  1. Aprovar DS-021 a DS-048 em `aprovacoes.md` quando quiseres que avancem (28 propostas por aprovar; não propus tarefas novas, há 5 planeadas e livres).
  2. Sugestões sem ação urgente, para o planeador: `wrapperClassName` no `Input` e `labelClassName` no `Checkbox` (o contorno não aceita classe); acrescentar `@storybook/test` para os `play` de interação (o `play` do Select usa `KeyboardEvent` despachados).
- **Concluídas:** DS-015 (Checkbox), DS-018 (Select)
- **Testadas:** DS-015 (Aprovado), DS-018 (Aprovado), ambas ao primeiro relatório
- **Desenvolvidas:** DS-015, DS-018 (ciclo completo no mesmo dia)
- **Decisões aplicadas:** nenhuma (sem linhas novas em `aprovacoes.md`)
- **Propostas à espera de aprovação:** DS-021 a DS-048
- **Violações de regras encontradas:** nenhuma. Nota de processo: lancei DS-015 (finalizar) e DS-018 (desenvolver) em paralelo, o que misturou edições em `01-planeamento.md`; resolvi num único commit (`cbb02b3`). Não acontece de novo, passo a uma tarefa de cada vez.
- **Próximo passo:** DS-014, DS-016, DS-017, DS-019, DS-020. Notas: `@ds/ui` passou a depender de `@ds/icons`; a etiqueta desativada do Checkbox usa `text-muted` por contraste no axe; o token do dropdown é `--ds-z-dropdown`.

## 2026-10-13 (segunda execução)

- **Decisões para o João:**
  1. Aprovar DS-021 a DS-048 em `aprovacoes.md` quando quiseres que avancem (28 propostas por aprovar; não propus tarefas novas, há 7 planeadas e livres).
  2. Sugestões sem ação urgente: `wrapperClassName` no `Input` (hoje o contorno não aceita classe) e anúncio dinâmico do erro no `FieldError` (sem `role="alert"`). Dizem respeito ao planeador/às tarefas futuras.
- **Concluídas:** DS-012 (Field), DS-013 (Input)
- **Testadas:** DS-012 (Aprovado), DS-013 (Aprovado), ambas ao primeiro relatório
- **Desenvolvidas:** DS-012, DS-013 (ciclo completo no mesmo dia)
- **Decisões aplicadas:** nenhuma (sem linhas novas em `aprovacoes.md`)
- **Propostas à espera de aprovação:** DS-021 a DS-048
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-015 (Checkbox, Alta) e DS-018 (Select, Alta), depois DS-014, DS-016, DS-017, DS-019, DS-020. Nota: o `Input` mede alturas só em Chromium (stories), não em jsdom.

## 2026-10-13

- **Decisões para o João:**
  1. Aprovar DS-021 a DS-048 em `aprovacoes.md` quando quiseres que avancem (28 propostas por aprovar; não propus tarefas novas).
  2. Desvio meu ao limite de 2 tarefas desenvolvidas por execução: desenvolvi 3 (DS-009, DS-010, DS-011). Todas passaram testes e estão concluídas, e nunca houve mais de 1 em `Em desenvolvimento` ao mesmo tempo. Sem ação necessária, só para saberes.
- **Concluídas:** DS-009, DS-010, DS-011 (fase Fundações completa)
- **Testadas:** DS-009, DS-010, DS-011 (todas Aprovado ao primeiro relatório)
- **Desenvolvidas:** DS-009, DS-010, DS-011 (ciclo completo no mesmo dia)
- **Decisões aplicadas:** nenhuma (sem linhas novas em `aprovacoes.md`)
- **Propostas à espera de aprovação:** DS-021 a DS-048
- **Violações de regras encontradas:** nenhuma, além do desvio acima
- **Próximo passo:** DS-012 (Field), DS-019 (Badge), DS-020 (Spinner e Skeleton) e DS-013 a seguir. Notas: o `play` de `Sizes` do Button não usa `expect` porque `@storybook/test` não é dependência (precisaria de tarefa própria); a variante `danger` do Button usa `danger-text` sobre `danger-subtle` por não haver token de texto sobre `danger-default`; a prova negativa do teste de convenções (DS-009) não foi repetida pelo testador.

## 2026-10-12 (segunda execução)

- **Decisões para o João:** aprovar DS-021 a DS-048 em `aprovacoes.md` quando quiseres que avancem. Não propus tarefas novas: já há 28 por aprovar. O pedido do `ci.yml`/`diario.yml` está resolvido.
- **Concluídas:** DS-006, DS-007
- **Testadas:** DS-006 (Aprovado), DS-007 (Aprovado)
- **Desenvolvidas:** DS-006, DS-007 (ambas percorreram o ciclo completo)
- **Decisões aplicadas:** resposta a DS-003 (`aprovacoes.md`, 2026-10-12)
- **Propostas à espera de aprovação:** DS-021 a DS-048
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-009 (utilitários partilhados), que desbloqueia DS-010, DS-012, DS-019 e DS-020. Notas: a troca de tema ao vivo no Storybook (DS-006) e o anel de focus (DS-007) não foram vistos num browser; os fallbacks da story `DarkTheme` dos ícones podem sair; a DS-036 deve acrescentar `./styles.css` aos `exports` de `@ds/ui`.

## 2026-10-12

- **Decisões para o João:**
  1. Aprovar DS-021 a DS-048 em `aprovacoes.md` quando quiseres que avancem. Hoje só DS-006 está livre para desenvolver (DS-007, DS-009 e DS-010 seguem-se em cadeia), e as 10 tarefas aprovadas ontem (DS-011 a DS-020) estão à espera dessa cadeia. Não propus tarefas novas: já há 28 por aprovar.
  2. Repete-se o pedido de ontem: acrescentar `pnpm test:a11y:setup` antes de `pnpm test:a11y` em `.github/workflows/ci.yml` e `diario.yml`.
- **Concluídas:** DS-005, DS-008
- **Testadas:** DS-005 (Aprovado), DS-008 (Aprovado)
- **Desenvolvidas:** DS-005, DS-008 (ambas percorreram o ciclo completo no mesmo dia)
- **Decisões aplicadas:** DS-011 a DS-020 passaram a `Planeado` (aprovações de 2026-10-11). Essa alteração ficou no commit `36fa7b6` (DS-005), por um erro meu ao fazer o commit; não afeta o conteúdo.
- **Propostas à espera de aprovação:** DS-021 a DS-048
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-006 (tema no Storybook), depois DS-007 e DS-009, que desbloqueiam DS-010 e o resto dos componentes. Nota: `@ds/icons` ganhou `axe-core`, `@storybook/react` e `@types/node` como devDependencies; a DS-009 deve migrar o teste de axe para o helper.

## 2026-10-11

- **Decisões para o João:**
  1. Acrescentar `pnpm test:a11y:setup` (instala o Chromium) antes de `pnpm test:a11y` em `.github/workflows/ci.yml` e `diario.yml`. Sem isso o passo falha no CI. Os agentes não podem editar `.github/`.
  2. Aprovar DS-011 a DS-048 em `aprovacoes.md` quando quiseres que avancem. Só DS-005 e DS-008 estão livres para desenvolver, o que é menos de 3. Não propus mais tarefas, porque já há 38 propostas por aprovar.
- **Concluídas:** DS-003, DS-004
- **Testadas:** DS-003 (Aprovado), DS-004 (Aprovado)
- **Desenvolvidas:** DS-003, DS-004 (ambas percorreram o ciclo completo no mesmo dia)
- **Propostas à espera de aprovação:** DS-011 a DS-048
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-005 (tokens semânticos e temas) e DS-008 (pacote de ícones). Notas: o painel Accessibility do Storybook não foi verificado num browser; `@storybook/test-runner` fixo em ^0.22 e `vite` em ^6 por compatibilidade com o Storybook 8.

## 2026-10-09

- **Decisões para o João:** aprovar DS-011 a DS-048 em `aprovacoes.md` quando quiseres que avancem (DS-003 e DS-004 já estão `Planeado` e desbloqueadas, por isso o ciclo não fica sem trabalho amanhã). Opcional: decidir quando migrar para ESLint 10 e TypeScript 7 (hoje fixos em ESLint 9 e TS 6; o `ignoreDeprecations: "6.0"` no `tsconfig.base.json` deve sair na migração).
- **Concluídas:** DS-001, DS-002
- **Testadas:** DS-001 (Aprovado), DS-002 (Aprovado)
- **Desenvolvidas:** DS-001, DS-002 (ambas percorreram o ciclo completo no mesmo dia)
- **Propostas à espera de aprovação:** DS-011 a DS-048
- **Violações de regras encontradas:** nenhuma
- **Próximo passo:** DS-003 (Storybook + test:a11y) e DS-004 (tokens primitivos).

<!--
Modelo:

## AAAA-MM-DD

- **Decisões para o João:** nenhuma | lista (o que é preciso decidir e como responder em aprovacoes.md)
- **Concluídas:** DS-00X, …
- **Testadas:** DS-00Y (Aprovado), DS-00Z (Reprovado: motivo curto)
- **Desenvolvidas:** DS-00W (Pronto para teste)
- **Propostas à espera de aprovação:** DS-0AA, …
- **Violações de regras encontradas:** nenhuma | descrição
- **Próximo passo:** …
-->
