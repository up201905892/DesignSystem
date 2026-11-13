# Aprovações e decisões do João

**Só o João edita este ficheiro.** É assim que o plano avança quando o ciclo corre sozinho: o `planeador` lê este ficheiro no início de cada `/diario` e aplica as decisões novas. Os agentes não têm permissão para o alterar.

Como usar: acrescenta uma linha por decisão (pelo GitHub, no branch `develop`, até do telemóvel). Não apagues linhas antigas.

| Data | Decisão | IDs | Nota |
| --- | --- | --- | --- |
| *AAAA-MM-DD* | *Aprovar* | *DS-001 a DS-008* | |
| 2026-10-11 | Aprovar | DS-011, DS-014, DS-015, DS-020 | |
| 2026-10-11 | Aprovar | DS-012, DS-013, DS-016 a DS-019 | |
| 2026-10-12 | Responder | DS-003 | Passo pnpm test:a11y:setup já acrescentado ao ci.yml e ao diario.yml em 2026-10-11, antes de pnpm test:a11y. Pedido resolvido; não repetir. |
| 2026-10-16 | Aprovar | DS-021 a DS-035 | |
| 2026-10-16 | Aprovar | DS-050 | |
| 2026-11-04 | Aprovar | DS-036, DS-037, DS-039, DS-041 a DS-049 | |
| 2026-11-04 | Aprovar | DS-051 a DS-057 | |
| 2026-11-04 | Alterar | DS-038, DS-040 | Passam a depender também de DS-051 a DS-057, para a medição do bundle e a auditoria de acessibilidade correrem sobre o código final dos componentes. |
| 2026-11-13 | Aprovar | DS-038, DS-040 | |
| 2026-11-13 | Aprovar | DS-058 | |
| 2026-11-13 | Responder | DS-036 | Manter `up201905892` como autor, no repository e no copyright dos LICENSE. Não voltar a perguntar. |
| 2026-11-13 | Responder | DS-044, DS-045 | Não acrescentar dependência das DS-051 a DS-057; ambas já estão concluídas. Pedido fechado. |
| 2026-11-13 | Responder | DS-035 | `pageSize={0}` sem resumo fica como está. A revisão visual do DataTable no Storybook passa para a auditoria da DS-040. Pedido fechado. |
| 2026-11-13 | Responder | DS-009 | Propor uma tarefa para o teste intermitente "fails for an img without alt" no helper de axe (encontrar a causa e estabilizar). |


Decisões possíveis:

- **Aprovar** — as tarefas passam de `Proposta` a `Planeado`.
- **Alterar** — o planeador revê a especificação segundo a nota; a tarefa continua `Proposta`.
- **Rejeitar** — a tarefa sai do plano (fica registada como rejeitada, não é apagada).
- **Responder** — resposta a uma pergunta deixada em "Decisões para o João" no registo diário; a nota diz a resposta.
- **Desbloquear** — autoriza o ciclo a retomar uma tarefa parada por uma violação ou por 3 reprovações, com a instrução na nota.
