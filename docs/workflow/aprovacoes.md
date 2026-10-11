# Aprovações e decisões do João

**Só o João edita este ficheiro.** É assim que o plano avança quando o ciclo corre sozinho: o `planeador` lê este ficheiro no início de cada `/diario` e aplica as decisões novas. Os agentes não têm permissão para o alterar.

Como usar: acrescenta uma linha por decisão (pelo GitHub, no branch `develop`, até do telemóvel). Não apagues linhas antigas.

| Data | Decisão | IDs | Nota |
| --- | --- | --- | --- |
| *AAAA-MM-DD* | *Aprovar* | *DS-001 a DS-008* | |
| 2026-10-11 | Aprovar | DS-011, DS-014, DS-015, DS-020 | |

Decisões possíveis:

- **Aprovar** — as tarefas passam de `Proposta` a `Planeado`.
- **Alterar** — o planeador revê a especificação segundo a nota; a tarefa continua `Proposta`.
- **Rejeitar** — a tarefa sai do plano (fica registada como rejeitada, não é apagada).
- **Responder** — resposta a uma pergunta deixada em "Decisões para o João" no registo diário; a nota diz a resposta.
- **Desbloquear** — autoriza o ciclo a retomar uma tarefa parada por uma violação ou por 3 reprovações, com a instrução na nota.
