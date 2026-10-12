# Registo diário

Resumo de cada execução de `/diario`, a mais recente primeiro.

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
