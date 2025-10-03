# Repository index — pdf_playground

This file indexes the workspace contents and highlights generated files, virtualenvs, and build artifacts you may want to ignore in source control.

## Top-level folders

- `backend/` — Python backend services
  - `services/marker_tool/` — contains `main.py`, `modal_app.py`, `requirements.txt` and a full virtualenv in `.marker_env/` (includes `bin/`, `lib/`, etc.).
  - `services/surya_tool/` — contains `main.py`, `modal_app.py`, `requirements.txt` and a full virtualenv in `.surya_env/`.

- `frontend/` — Frontend app(s)
  - `pdf-frontend/` — Next.js app with `package.json`, `next.config.mjs`, `src/app/` and a built `.next/` directory with server and static build outputs.

- `test/` — test scripts (`docling_test.py`, `surya_test.py`).

## Notable generated and environment artifacts

- Python virtualenvs (created by venv or virtualenv)
  - `backend/services/marker_tool/.marker_env/` — full venv; contains `bin/`, `lib/`, packages, and executables.
  - `backend/services/surya_tool/.surya_env/` — full venv.

- Python cache and compiled files
  - `__pycache__/` directories inside services.
  - `*.pyc`, `*.pyo` compiled artifacts.

- Frontend build artifacts
  - `frontend/pdf-frontend/.next/` — Next.js build output (server, client bundles, static assets).
  - `frontend/pdf-frontend/node_modules/` — dependencies installed by npm/yarn/pnpm.

- Environment files and credentials
  - `.env`, `.env.*`, and `.env.production` (present in `pdf-frontend`) — may contain secrets.

## Files to ignore (high-level)

- Virtual environments and their contents
- Build outputs (`.next/`, `dist/`, `build/`)
- Dependency folders (`node_modules/`)
- Editor and OS files (`.vscode/`, `.DS_Store`, `Thumbs.db`)
- Secrets and env files (`.env`, `*.key`, `*.pem`)

## Where to look for source entry points

- Backend services:
  - `backend/services/marker_tool/main.py`
  - `backend/services/marker_tool/modal_app.py`
  - `backend/services/surya_tool/main.py`
  - `backend/services/surya_tool/modal_app.py`

- Frontend app:
  - `frontend/pdf-frontend/src/app/page.jsx`
  - `frontend/pdf-frontend/src/app/layout.js`

---

If you'd like, I can also add a per-service `.gitignore` inside `backend/services/*` or commit the `.gitignore` to the repository root. Next I'll create a comprehensive repository `.gitignore` file tuned to this project.
