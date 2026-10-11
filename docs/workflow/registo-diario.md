# Registo diário

Resumo de cada execução de `/diario`, a mais recente primeiro.

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
