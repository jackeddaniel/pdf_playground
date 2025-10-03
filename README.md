PDF Playground

PDF Playground is a monorepo for experimenting with PDF processing workflows. It combines Python backend services and a Next.js frontend for quick demos and experimentation.

The repository contains two principal areas:

backend: Python services for PDF processing (marker_tool, surya_tool)

frontend: Next.js app (pdf-frontend) to demo or interact with backend services

Hosted Links

Frontend: https://pdf-playground-psi.vercel.app/

Backend Services:

Marker tool (FastAPI + PyMuPDF): https://siddhant-ugarkar--marker-tool-service-fastapi-app.modal.run/docs

Surya tool (FastAPI): https://siddhant-ugarkar--surya-tool-service-fastapi-app.modal.run/docs

Quick Highlights

Each backend service has its own Python virtual environment (.marker_env, .surya_env), intentionally not committed.

The frontend is a Next.js app at frontend/pdf-frontend/ with build output in .next/.

Ad-hoc scripts and tests live in the test/ folder.

Project Structure
pdf_playground/
├─ backend/
│  └─ services/
│     ├─ marker_tool/       # PDF annotation and marking service
│     └─ surya_tool/        # OCR and layout extraction service
├─ frontend/
│  └─ pdf-frontend/         # Next.js frontend
├─ test/                     # Scripts and test files
├─ REPO_INDEX.md             # Human-readable index of repo contents
└─ .gitignore                # Repo-level ignore rules

Quickstart

Requirements: Git, Python 3.11+, Node 16+

1. Clone the repo
git clone <repo-url> pdf_playground
cd pdf_playground

2. Backend

Create a virtual environment and install dependencies for a service:

cd backend/services/marker_tool
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# Run the service locally (example)
python main.py


Repeat for surya_tool as needed.

Note: Backend services are deployed on Modal, so you can also access the live endpoints directly.

3. Frontend

Install dependencies and run the Next.js app:

cd frontend/pdf-frontend
npm install
npm run dev


Visit http://localhost:3000
 in your browser.

Environment Variables

The frontend uses environment variables to communicate with backend services:

Key	Description
NEXT_PUBLIC_API_URL	URL of the deployed backend service

Set these in .env.local for local development or via the hosting provider for production.

Development Notes

Virtual Environments: Use each service’s requirements.txt to reproduce environments. Virtualenv folders are ignored in Git.

Lockfiles: The frontend may include a lockfile. Track it if consistent installs are required.

Secrets: Keep .env and credential files out of Git.

Contributing

Fork the repo

Create a feature branch

Keep changes small and add tests if needed

Open a Pull Request describing your changes

Commands

Backend: run tests, linters, or start services inside each service venv

Frontend:

npm run dev     # development
npm run build   # production build
npm run start   # start production server

Summary of Tools

marker_tool: PDF annotation and marking workflows; exposes HTTP API for marking, splitting, and extracting PDF regions.

surya_tool: OCR and document layout analysis; useful for converting scanned documents into structured data.

pdf-frontend: Next.js demo app for uploading PDFs, previewing pages, and calling backend processing APIs.

Together, these components provide an end-to-end PDF playground: upload PDFs → call backend → get processed outputs.
