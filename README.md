# Real Estate SaaS (UI-first)

Monorepo com app **React + Vite + TypeScript + Tailwind v4** em `apps/web`, alinhado ao `docs/PROJECT_ROADMAP.md`.

## Requisitos

- Node.js 20+

## Scripts

Na raiz:

- `npm install` — instala dependências do workspace
- `npm run dev` — Vite em `http://localhost:5173`
- `npm run build` — typecheck + build de produção

## Variáveis de ambiente

Copie `apps/web/.env.example` para `apps/web/.env` e ajuste `VITE_API_BASE_URL` quando a API existir.

## Documentação de entrega (milestones)

- `docs/ARCHITECTURE.md` — visão técnica (M0)
- `docs/API_STYLE_GUIDE.md` — contrato JSON (M0)
- `docs/ERD.md` — modelo de dados preliminar (M0)
- `docs/ROLES_AND_PERMISSIONS.md` — RBAC (M0/M2)
- `docs/LAUNCH_CHECKLIST.md` — endurecimento (M10)
- `apps/api/README.md` — placeholder backend futuro

## Autenticação (mock)

Use **Entrar como demo** na tela de login ou qualquer e-mail + senha ≥ 6 caracteres. Em desenvolvimento, o **seletor de papel** na barra superior alterna `admin | broker | finance | read_only` para testar o RBAC de UI.
