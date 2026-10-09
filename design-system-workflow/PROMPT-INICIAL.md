# Prompt inicial — Design System

Cola o texto abaixo no Claude Code na primeira sessão, com a pasta do repositório aberta e os ficheiros deste kit já copiados.

---

```
Vamos começar o projeto Design System. Lê primeiro o CLAUDE.md e os ficheiros em docs/workflow/ — descrevem o fluxo de quatro fases (Planeamento → Desenvolvimento → Testing → Concluded) e as regras de passagem que tens de cumprir sempre.

Contexto:
- Sou estudante universitário e este é o primeiro projeto do meu portfólio para ser contratado como engenheiro de software (front-end) e, mais tarde, chegar a project manager.
- O objetivo é uma biblioteca de componentes React acessível (WCAG 2.1 AA), com design tokens, temas claro/escuro, documentação em Storybook e publicada no npm.
- Duração alvo: 5–6 semanas a part-time (cerca de 8–10 horas por semana).
- O processo conta tanto como o código: o histórico em docs/workflow/ vai ser mostrado em entrevistas.

O que te peço agora (só planeamento, sem código):
1. Usa o agente planeador para criar o backlog completo do MVP em docs/workflow/01-planeamento.md, por fases: Fundações, Formulários, Overlays e feedback, Layout e dados, Publicação, Documentação.
2. As primeiras tarefas têm de ser de setup: monorepo pnpm com TypeScript strict, ESLint/Prettier, Vitest, Storybook com addon-a11y, os scripts pnpm do CLAUDE.md (o CI já existe e usa-os) e a estrutura de design tokens.
3. Todas as tarefas entram como Proposta. Mostra-me a tabela-índice e um resumo por fase, para eu aprovar ou pedir alterações.
4. Sinaliza qualquer decisão técnica que precise da minha escolha (ex.: Radix vs React Aria, Vanilla Extract vs Tailwind) como pergunta, com a tua recomendação.

Depois de eu aprovar, faz commit do plano. A partir daí o ciclo diário corre sozinho no GitHub Actions; eu aprovo as tarefas seguintes em docs/workflow/aprovacoes.md.
```
