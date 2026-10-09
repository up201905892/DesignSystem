# 01 · Planeamento

Fonte da verdade do projeto: todas as tarefas existem aqui. Só o `planeador` cria ou altera especificações; os outros agentes só atualizam a coluna **Estado** da tabela e o **Histórico** da tarefa.

Estados: `Proposta` → `Planeado` → `Em desenvolvimento` → `Pronto para teste` → `Em teste` → `Aprovado` → `Concluído` (desvios: `Reprovado` → `Em desenvolvimento`; `Proposta` → `Rejeitada`).

## Tabela-índice

| ID | Tarefa | Fase do MVP | Prioridade | Depende de | Estado |
| --- | --- | --- | --- | --- | --- |
| — | *(vazio: o planeador preenche no arranque)* | — | — | — | — |

## Decisões aplicadas

Linhas de `aprovacoes.md` já tratadas pelo planeador (evita aplicar a mesma decisão duas vezes).

| Data da decisão | Decisão | IDs | Aplicada em |
| --- | --- | --- | --- |

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
