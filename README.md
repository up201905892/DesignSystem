# Kit de fluxo de trabalho — Design System com Claude Code

Este kit põe o Claude Code a gerir o projeto em quatro fases, com quatro agentes especializados e um ciclo diário que corre sozinho no GitHub Actions.

```
Planeamento ──► Desenvolvimento ──► Testing ──► Concluded
 (planeador)     (programador)      (testador)   (finalizador)
     ▲                 ▲                │
     │                 └── Reprovado ◄──┘
 aprovacoes.md
  (o João)
```

## O dia a dia, depois de instalado

1. Todos os dias úteis de manhã, o GitHub Actions corre `/diario autonomo` no branch `develop`.
2. O ciclo aplica as tuas decisões, fecha o que foi aprovado, testa o que está pronto, desenvolve até 2 tarefas e propõe novas quando o backlog está a acabar.
3. Os commits vão para o `develop`, o CI corre sobre eles e o resumo do dia aparece como comentário no pull request `develop → main`. Recebes a notificação do GitHub por email ou na app.
4. **O teu trabalho:**
   - aprovar tarefas e responder a perguntas, acrescentando linhas a `docs/workflow/aprovacoes.md` no branch `develop` (dá para fazer pelo telemóvel, no site do GitHub);
   - rever o pull request e fazer merge para o `main` quando uma fase fica fechada.

Se não aprovares nada, o ciclo continua a desenvolver o que já está planeado e, quando acabar, só propõe e espera. Nunca avança sem ti.

## Conteúdo

| Ficheiro | Para que serve |
| --- | --- |
| `CLAUDE.md` | Regras do projeto e do fluxo; o Claude Code lê-o em todas as sessões |
| `PROMPT-INICIAL.md` | O prompt para a primeira sessão (criar o backlog contigo) |
| `.claude/agents/` | Os quatro agentes: `planeador`, `programador`, `testador`, `finalizador` |
| `.claude/skills/diario/SKILL.md` | O ciclo diário (`/diario` à mão, `/diario autonomo` no agendamento) |
| `.claude/settings.json` | Permissões: o que os agentes podem e não podem fazer |
| `.github/workflows/diario.yml` | O agendamento diário |
| `.github/workflows/ci.yml` | Verificações independentes (lint, tipos, testes, build) |
| `docs/workflow/01…04` | Os quatro registos |
| `docs/workflow/aprovacoes.md` | As tuas decisões (só tu editas) |
| `docs/workflow/registo-diario.md` | Resumo de cada dia |

## Instalação (uma vez, cerca de 20 minutos)

1. **Repositório:** cria um repositório no GitHub (ex.: `design-system`) e copia para lá todo o conteúdo desta pasta, incluindo as pastas escondidas `.claude/` e `.github/`. Faz commit e push para o `main`.
2. **App do Claude no GitHub:** instala a [Claude GitHub App](https://github.com/apps/claude) no repositório.
3. **Autenticação:** escolhe uma das opções e cria o secret em *Settings → Secrets and variables → Actions*:
   - **Subscrição Claude (Pro ou Max):** corre `claude setup-token` no teu computador e guarda o token como `CLAUDE_CODE_OAUTH_TOKEN`. As execuções gastam o limite de uso da tua subscrição.
   - **Chave da API:** cria uma chave na Claude Console, guarda-a como `ANTHROPIC_API_KEY` e troca a linha `claude_code_oauth_token` pela `anthropic_api_key` em `diario.yml`. As execuções são pagas por tokens.

   Alternativa: no Claude Code, `/install-github-app` faz os passos 2 e 3 por ti.
4. **Primeira sessão:** abre o Claude Code no repositório, cola o texto de `PROMPT-INICIAL.md`, toma as decisões técnicas e aprova as tarefas. Faz push.
5. **Primeiro ciclo:** no GitHub, *Actions → Ciclo diário → Run workflow*. Na primeira vez, cria o branch `develop` sozinho. Vê o log para confirmar que correu bem.
6. **Proteger o `main`:** em *Settings → Branches*, exige pull request para o `main`. Assim, nada chega lá sem a tua revisão.

## Segurança: o que os agentes não conseguem fazer

Definido em `.claude/settings.json`, e não depende de os agentes "se portarem bem":

- fazer push, mudar de branch, `reset` ou `rebase` (o push é feito pelo workflow, só para o `develop`);
- publicar no npm;
- editar `CLAUDE.md`, `.claude/`, `.github/` ou `aprovacoes.md`. Ou seja, não conseguem mudar as próprias regras nem aprovar o próprio trabalho.

Limites do workflow: 90 minutos por execução, 200 turnos, e uma execução de cada vez.

## Ajustes comuns

- **Hora ou dias:** linha `cron` em `diario.yml` (horas em UTC; `47 6 * * 1-5` = dias úteis às 07:47 em Lisboa no inverno). Escolhe um minuto que não seja `:00`, que é a hora com mais filas no GitHub.
- **Mais ou menos trabalho por dia:** "Máximo de 2 tarefas desenvolvidas por execução" no `SKILL.md`.
- **Correr à mão:** `/diario` no Claude Code (modo interativo, faz-te perguntas) ou *Run workflow* no GitHub (modo autónomo).
- **Pausar:** desativa o workflow em *Actions → Ciclo diário → ⋯ → Disable workflow*.

Nota: num repositório público, o GitHub desativa agendamentos ao fim de 60 dias sem atividade. Com commits diários isso não acontece, mas se pausares muito tempo, reativa o workflow.

## Porque está desenhado assim

- **Gates explícitos:** cada agente verifica a condição de entrada e devolve "BLOQUEADO" se não estiver cumprida. Nenhuma fase é saltada.
- **Separação de papéis:** quem desenvolve não aprova, quem testa não corrige código de produção. É o que dá valor ao "Aprovado".
- **Só tu aprovas o plano**, num ficheiro que os agentes não conseguem editar. É a parte de PM do projeto.
- **Registos que só crescem:** o histórico mostra o caminho completo, incluindo reprovações. É material para entrevistas.
- **Paragem segura:** uma tarefa reprovada 3 vezes, ou com uma violação das regras, fica parada à espera de decisão em vez de entrar em ciclo.
