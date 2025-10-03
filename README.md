# pdf_playground

Elegant tooling and experiments for PDF processing — a small monorepo that combines Python backend services and a Next.js frontend for quick demos.

This repository contains two principal areas:

- backend: Python services for PDF processing and tooling (marker_tool, surya_tool)
- frontend: a Next.js app (`pdf-frontend`) used to demo or interact with backend services

---

## Quick highlights

- Per-service Python virtual environments are present inside `backend/services/*` (e.g. `.marker_env`, `.surya_env`) — these are intentionally not committed and are ignored by the repo `.gitignore`.
- The frontend is a Next.js application located at `frontend/pdf-frontend/` with build output in `.next/`.
- Tests and small scripts live in the `test/` folder.

---

## Quickstart

Requirements: Git, Python 3.11+ (or 3.12 as used locally), Node 16+/npm or yarn/pnpm.

1) Clone the repo

```bash
git clone <repo-url> pdf_playground
cd pdf_playground
```

2) Backend — create a virtualenv and install dependencies for a service

```bash
cd backend/services/marker_tool
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Run the app (example)
python main.py
```

Repeat for `surya_tool` as needed.

3) Frontend — install dependencies and run the Next.js app

```bash
cd frontend/pdf-frontend
npm install
npm run dev
# or with yarn: yarn && yarn dev
```

Visit the frontend on http://localhost:3000 by default.

---

## Project structure

- backend/
  - services/
    - marker_tool/ — Python service with `main.py`, `modal_app.py`, `requirements.txt`
    - surya_tool/ — Python service with `main.py`, `modal_app.py`, `requirements.txt`

- frontend/
  - pdf-frontend/ — Next.js app: `src/app/`, `package.json`, `next.config.mjs`, built output `.next/`

- test/ — ad-hoc test scripts

- REPO_INDEX.md — human-readable index of repo contents (auto-created)
- .gitignore — repo-level ignore rules (tuned for this project)

---

## Development notes

- Virtual environments: The repo contains per-service virtualenv folders locally. Keep them out of git and use the provided `requirements.txt` files to reproduce environments.
- Lockfiles: This repo currently includes a `frontend` lockfile option. Decide whether to track the lockfile for consistent installs.
- Secrets: Keep `.env` and credential files out of the repo; see `.gitignore`.

---

## Contributing

1. Fork the repo
2. Create a feature branch
3. Keep changes small and add tests where appropriate
4. Open a PR and describe your changes

---

## Useful commands

- Backend: run tests and linters inside each service venv
- Frontend: `npm run dev`, `npm run build`, `npm run start`

---

## Helpful links

- See `REPO_INDEX.md` for a quick index of notable files and artifacts.
- This repo includes a `.gitignore` tuned to the current workspace; review it if you want to keep specific generated files under source control.

---

If you want, I can:
- Add a single `Makefile` or a top-level `scripts/` folder that runs common tasks (start backend, start frontend, run tests).
- Commit these files and create a tag/initial release.

---

## Hosted links

If you already have deployed endpoints, replace the placeholders below with the real URLs. If not, these are examples of how you'd list them once deployed.

- Marker tool (backend service): https://marker.example.com  
  - Code: `backend/services/marker_tool/`  
  - Purpose: provides PDF marking and annotation utilities via an HTTP API and optional UI (used by the frontend or other tools).

- Surya tool (backend service): https://surya.example.com  
  - Code: `backend/services/surya_tool/`  
  - Purpose: provides PDF OCR, layout detection, and extraction pipelines (batch and streaming modes).

- Frontend (Next.js demo): https://pdf-frontend.example.com  
  - Code: `frontend/pdf-frontend/`  
  - Purpose: lightweight React/Next.js interface to run file uploads, preview PDFs, and call backend endpoints for processing.

Replace the `example.com` placeholders above with your actual domains (or use localhost URLs when running locally: `http://localhost:8000` for a backend and `http://localhost:3000` for the frontend).

---

## Brief project summary

pdf_playground is a small monorepo for experimenting with PDF processing workflows. It contains two backend services and a frontend demo:

- marker_tool: focused on quick annotation and marking workflows. It exposes scripts and a small HTTP interface to run marker operations (split, annotate, extract regions). It is useful for building UI-driven marking tools or automating repetitive annotation tasks.

- surya_tool: focused on OCR and document layout analysis. It includes tools for running OCR, table detection, and structured extraction (useful for converting scanned documents into structured data).

- pdf-frontend: a Next.js demo that allows users to upload PDFs, preview pages, and trigger backend processing (annotation, OCR, extraction). The frontend can be used locally for development or deployed as a static/server-side app.

Together, the tools provide an end-to-end playground: upload or ingest PDFs in the frontend, call the backend services to analyze or annotate, and return results for display or further processing.

---

If you'd like, I can:
- Add a `DEPLOYMENT.md` describing recommended deployment options (Vercel/Netlify for the frontend; Docker/Cloud Run/EC2 for the backends).
- Replace placeholder URLs with actual hosted links if you tell me the deployed domains or provide access.
