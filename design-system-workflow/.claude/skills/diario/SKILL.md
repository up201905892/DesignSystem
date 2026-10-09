---
name: diario
description: Corre o ciclo diário do design system — aplica as decisões do João, verifica as regras, conclui, testa, desenvolve, planeia e regista. Usar quando o João escreve /diario ou quando o agendamento diário corre.
argument-hint: "[autonomo]"
---

Corre o ciclo diário do design system seguindo o fluxo de quatro fases do `CLAUDE.md`. És o orquestrador: não escreves código nem relatórios tu próprio; delegas cada tarefa no agente certo, **uma tarefa de cada vez**, e esperas pelo resultado antes de passar à seguinte.

Argumentos recebidos: `$ARGUMENTS`

## Modo de execução

- **Interativo** (sem argumentos): o João está presente. Podes fazer-lhe perguntas quando houver decisões a tomar.
- **Autónomo** (argumento `autonomo`, usado pelo agendamento no GitHub Actions): ninguém está a ver.
  - Nunca fiques à espera de resposta. Uma decisão que precise do João vai para a secção "Decisões para o João" do registo do dia, e a tarefa afetada fica parada.
  - Nunca mudes de branch, nunca faças push, nunca publiques no npm. Só fazes commits no branch atual; o workflow trata do push.
  - Nunca editas `CLAUDE.md`, `.claude/`, `.github/` nem `docs/workflow/aprovacoes.md` (são do João; as permissões também o impedem).
  - Se um comando falhar por falta de permissão, não tentes contornar: regista o comando e o motivo em "Decisões para o João".

## 0. Decisões do João

Se `docs/workflow/aprovacoes.md` tiver linhas que ainda não estão registadas em "Decisões aplicadas" de `01-planeamento.md` → delega no agente `planeador` para as aplicar. Assim, tarefas aprovadas ontem à noite já podem ser desenvolvidas hoje.

## 1. Estado atual

1. Lê `CLAUDE.md` e os ficheiros em `docs/workflow/`.
2. Corre `git status` e `git log --oneline -20`.
3. Se houver alterações por guardar que não pertencem a nenhuma tarefa: em modo interativo, pergunta ao João; em modo autónomo, não lhes toques e regista-as em "Decisões para o João".

## 2. Auditoria das regras

Verifica e lista qualquer violação:
- tarefa fora de `Proposta`/`Planeado` sem histórico que justifique o estado;
- tarefa em `Pronto para teste` ou posterior sem entrada em `02-desenvolvimento.md`;
- tarefa `Aprovado`/`Concluído` cujo relatório mais recente em `03-testing.md` não é `Aprovado`;
- tarefa `Concluído` sem entrada em `04-concluded.md`;
- commits com `DS-XXX` de uma tarefa que nunca esteve `Planeado`;
- mais de 2 tarefas `Em desenvolvimento`;
- tarefa parada em `Em desenvolvimento` ou `Em teste` há mais de 3 dias.

Violações **não se corrigem em silêncio**: as tarefas afetadas ficam paradas e a violação vai para o registo do dia. As outras tarefas seguem normalmente.

## 3. Concluded (primeiro, para libertar o fluxo)

Para cada tarefa `Aprovado` → delega no agente `finalizador` com o ID.

## 4. Testing

Para cada tarefa `Pronto para teste` → delega no agente `testador` com o ID.

## 5. Desenvolvimento

1. Primeiro, as tarefas `Reprovado` (mais antigas primeiro) → agente `programador`.
2. Depois, enquanto houver menos de 2 tarefas em `Em desenvolvimento`, escolhe a próxima tarefa `Planeado` com dependências `Concluído` (prioridade Alta → Média → Baixa, depois ID mais baixo) → agente `programador`.
3. Máximo de 2 tarefas desenvolvidas por execução.
4. Quando o `programador` termina uma tarefa como `Pronto para teste`, delega logo no `testador` e, se for `Aprovado`, no `finalizador`. Uma tarefa pode percorrer o ciclo completo no mesmo dia.
5. Se uma tarefa for reprovada 3 vezes seguidas, para de a desenvolver e regista-a em "Decisões para o João" (provavelmente a especificação precisa de ser revista).

## 6. Planeamento

Se houver menos de 3 tarefas `Planeado` com dependências satisfeitas → delega no agente `planeador` para propor as próximas. As propostas ficam como `Proposta` até o João as aprovar.

## 7. Registo do dia

1. Acrescenta o resumo do dia no topo de `docs/workflow/registo-diario.md`, logo a seguir à introdução, com o título `## AAAA-MM-DD` (modelo no ficheiro). Em modo autónomo, o workflow publica esta secção como comentário no pull request, por isso escreve-a para o João ler no telemóvel: curta e com as decisões pendentes em primeiro lugar.
2. Commit: `chore(workflow): registo diário AAAA-MM-DD`.
3. Em modo interativo, responde ao João com o mesmo resumo.
