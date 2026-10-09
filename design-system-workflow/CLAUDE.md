# Design System — instruções para o Claude Code

Biblioteca de componentes React acessível, documentada e publicada no npm. Serve de base visual aos restantes projetos do portfólio. Todo o trabalho segue o fluxo de quatro fases descrito abaixo, registado em `docs/workflow/`.

## Stack

- pnpm workspaces (monorepo): `packages/tokens`, `packages/ui`, `packages/icons`, `apps/docs`
- React + TypeScript (`strict`), Radix UI primitives ou React Aria para comportamento acessível
- Design tokens em JSON → CSS variables; temas claro e escuro
- Storybook 8 + addon-a11y; Vitest + Testing Library; Playwright para testes de interação
- Build com tsup (ESM + CJS + `.d.ts`); versionamento com Changesets
- ESLint + Prettier; Conventional Commits

## O fluxo de quatro fases

| Fase | Ficheiro | Quem escreve | Entra quando |
| --- | --- | --- | --- |
| Planeamento | `docs/workflow/01-planeamento.md` | `planeador` | O João aprova uma tarefa proposta |
| Desenvolvimento | `docs/workflow/02-desenvolvimento.md` | `programador` | A tarefa está `Planeado` e as dependências estão `Concluído` |
| Testing | `docs/workflow/03-testing.md` | `testador` | A tarefa está `Pronto para teste` |
| Concluded | `docs/workflow/04-concluded.md` | `finalizador` | O último relatório de testes da tarefa é `Aprovado` |

O Planeamento é a fonte da verdade: cada tarefa existe lá com um ID (`DS-001`, `DS-002`, …) e a tabela-índice no topo mostra o estado atual de todas.

### Estados de uma tarefa (por esta ordem)

`Proposta` → `Planeado` → `Em desenvolvimento` → `Pronto para teste` → `Em teste` → `Aprovado` → `Concluído`

Desvio permitido: `Em teste` → `Reprovado` → `Em desenvolvimento` (volta ao programador com as falhas).

### Regras de passagem (obrigatórias)

1. **Nada é desenvolvido sem estar no Planeamento.** O programador só pega em tarefas com estado `Planeado`, cujo ID exista em `01-planeamento.md` e cujas dependências estejam `Concluído`. Trabalho fora do plano → para e propõe-se primeiro uma tarefa nova.
2. **Nada é testado sem ter sido desenvolvido.** O testador só pega em tarefas `Pronto para teste` que tenham registo em `02-desenvolvimento.md` com os ficheiros alterados e o commit.
3. **Nada é concluído sem passar em todos os testes.** O finalizador só fecha tarefas cujo relatório mais recente em `03-testing.md` diga `Aprovado`, com todos os critérios de aceitação verificados e zero falhas.
4. **Só o João aprova o plano.** O `planeador` cria tarefas como `Proposta`; só passam a `Planeado` depois de o João aprovar, na conversa ou numa linha de `docs/workflow/aprovacoes.md`.
5. **Limite de trabalho em curso:** no máximo 2 tarefas em `Em desenvolvimento` ao mesmo tempo.
6. **Cada mudança de estado** atualiza a tabela-índice do Planeamento e acrescenta uma linha ao histórico da tarefa: `- AAAA-MM-DD · <agente> · <estado anterior> → <novo estado> · <nota curta>`.
7. **Nunca apagar registos.** Os ficheiros de registo só crescem; correções fazem-se com uma nova linha de histórico.

## Comandos do projeto

```
pnpm install
pnpm lint          # ESLint + Prettier
pnpm typecheck     # tsc --noEmit em todos os pacotes
pnpm test          # Vitest
pnpm test:a11y     # testes de acessibilidade das stories (Storybook test runner + axe)
pnpm build         # tsup em todos os pacotes
pnpm storybook     # documentação local
```

Se um comando ainda não existir, criá-lo faz parte da tarefa de setup correspondente (DS-001 a DS-003).

## Convenções de código

- Um componente por pasta: `packages/ui/src/<Componente>/` com `<Componente>.tsx`, `<Componente>.test.tsx`, `<Componente>.stories.tsx`, `index.ts`
- API consistente: `variant`, `size`, `asChild`, `forwardRef`, `className`; suporte controlado e não controlado (`value` / `defaultValue`)
- Sem cores, espaçamentos ou raios escritos à mão: usar sempre tokens
- Todo o componente interativo funciona só com teclado e tem focus visível
- Commits: `feat(ui): DS-012 Button com variantes e tamanhos` (o ID da tarefa vai sempre na mensagem)

## Ficheiros que são só do João

Os agentes nunca alteram estes ficheiros (as permissões em `.claude/settings.json` também o impedem):

- `CLAUDE.md`, `.claude/` (regras, agentes, permissões)
- `.github/` (workflows; o CI já existe em `.github/workflows/ci.yml`, não é uma tarefa a planear)
- `docs/workflow/aprovacoes.md` (decisões do João)

Se uma tarefa precisar de mudar algum destes ficheiros, regista o pedido em "Decisões para o João" no registo diário.

## Rotina diária

`/diario` corre o ciclo completo: aplica as decisões do João, verifica as regras, fecha o que foi aprovado, testa o que está pronto, desenvolve o que está planeado e regista tudo em `docs/workflow/registo-diario.md`.

- **Interativo:** o João escreve `/diario` no Claude Code.
- **Autónomo:** o workflow `.github/workflows/diario.yml` corre `/diario autonomo` todos os dias úteis no branch `develop`, envia os commits e publica o resumo no pull request `develop → main`. O João só intervém para aprovar tarefas (em `aprovacoes.md`) e fazer merge para o `main`.
- Nenhum agente faz push, muda de branch ou publica no npm.
