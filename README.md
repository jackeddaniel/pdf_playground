# 📄 PDF Playground

<div align="center">

**A powerful monorepo for experimenting with PDF processing workflows**

Combining Python backend services with a modern Next.js frontend for rapid prototyping and experimentation

</div>

---

## 🌟 Overview

PDF Playground is your go-to toolkit for PDF manipulation, OCR, and document analysis. Built with modularity in mind, it provides:

- 🎯 **Marker Tool** - PDF annotation, marking, splitting, and region extraction
- 🔍 **Surya Tool** - Advanced OCR and document layout analysis
- 💻 **Next.js Frontend** - Beautiful, interactive demo interface

## 🚀 Quick Start

### Prerequisites

- 🐍 Python 3.11+
- 📦 Node.js 16+
- 🔧 Git

### 🏃 Get Running in 3 Steps

#### 1️⃣ Clone the Repository

```bash
git clone <repo-url> pdf_playground
cd pdf_playground
```

#### 2️⃣ Set Up Backend Services

```bash
# Navigate to a service
cd backend/services/marker_tool

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the service
python main.py
```

> 💡 **Tip:** Backend services are deployed on Modal - you can use the live endpoints directly!

#### 3️⃣ Launch the Frontend

```bash
cd frontend/pdf-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 📁 Project Structure

```
pdf_playground/
├─ 🔧 backend/
│  └─ services/
│     ├─ marker_tool/       # PDF annotation & marking
│     └─ surya_tool/        # OCR & layout extraction
├─ 💻 frontend/
│  └─ pdf-frontend/         # Next.js application
├─ 🧪 test/                 # Testing scripts
├─ 📋 REPO_INDEX.md         # Repository contents index
└─ 🚫 .gitignore            # Git ignore rules
```

---

## 🔗 Live Services

| Service | Purpose | Link |
|---------|---------|------|
| 🎨 **Frontend** | Interactive demo interface | [Visit App](https://pdf-playground-psi.vercel.app/) |
| 📝 **Marker API** | PDF marking & annotation | [API Docs](https://siddhant-ugarkar--marker-tool-service-fastapi-app.modal.run/docs) |
| 🔍 **Surya API** | OCR & layout analysis | [API Docs](https://siddhant-ugarkar--surya-tool-service-fastapi-app.modal.run/docs) |

---

## 🛠️ Tools & Capabilities

### 📝 Marker Tool
- ✅ PDF annotation and marking workflows
- ✅ Document splitting and merging
- ✅ Region extraction and manipulation
- ✅ RESTful HTTP API (FastAPI + PyMuPDF)

### 🔍 Surya Tool
- ✅ Advanced OCR for scanned documents
- ✅ Document layout analysis
- ✅ Structured data extraction
- ✅ Text recognition and positioning

### 💻 PDF Frontend
- ✅ Drag-and-drop PDF upload
- ✅ Real-time page preview
- ✅ Backend API integration
- ✅ Processing results visualization

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=<your-backend-url>
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL of the deployed backend service |

> 🔒 **Security Note:** Never commit `.env` files or credentials to Git

---

## 📜 Available Commands

### Backend Services

```bash
# Activate virtual environment
source .venv/bin/activate

# Run service
python main.py

# Run tests (if available)
pytest

# Code formatting
black .
```

### Frontend Application

```bash
# Development mode
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🎉 **Open** a Pull Request

### Contribution Guidelines

- Keep changes small and focused
- Add tests for new features
- Update documentation as needed
- Follow existing code style
- Write clear commit messages

---

## 📝 Development Notes

### Virtual Environments
- Each backend service maintains its own Python virtual environment
- Environment folders (`.venv`, `.marker_env`, `.surya_env`) are gitignored
- Use `requirements.txt` to reproduce environments

### Dependencies
- Frontend uses `package.json` for Node dependencies
- Track lockfiles (`package-lock.json`) for consistent installs
- Keep dependencies up to date with security patches

### Best Practices
- 🔒 Keep secrets and credentials out of Git
- 📦 Use virtual environments for Python services
- 🧪 Write tests for critical functionality
- 📚 Document new features and APIs

---

## 🎯 Use Cases

- **Document Processing** - Extract text and metadata from PDFs
- **OCR Workflows** - Convert scanned documents to structured data
- **PDF Annotation** - Mark up and annotate PDF documents
- **Research & Experimentation** - Quick prototyping of PDF workflows
- **Data Extraction** - Pull structured information from documents

---



<div align="center">

