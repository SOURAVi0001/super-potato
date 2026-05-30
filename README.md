# Loan Management System (LMS)

A full-stack, state-of-the-art Loan Management System (LMS) featuring a borrower application portal and an internal operations dashboard.

---

## 🏗️ Architecture & Modules

The system is structured as a TypeScript monorepo using **NPM Workspaces**:

- **`packages/shared`**: Shared type definitions and business engine interfaces.
- **`apps/server`**: Production-ready Express.js REST API with Mongoose, JWT, and bcrypt.
- **`apps/client`**: Premium Next.js 14 (App Router) client utilizing custom HSL theme styles.

---

## ⚡ Setup & Run Instructions

Follow these numbered steps to run the application locally:

### 1. Prerequisite Installations
Ensure Node.js (v18+) and MongoDB are installed and running locally.

### 2. Configure Environment Variables
Copy the server variables:
```bash
cp apps/server/.env.example apps/server/.env
```
*(Verify and adjust the environment variables as needed, e.g. MONGODB_URI).*

### 3. Install Workspace Dependencies
From the root workspace directory, run:
```bash
npm install
```

### 4. Populate Database Seeds
Seed the database with default accounts representing all system roles:
```bash
npm run seed
```

### 5. Launch Development Servers
Run the full application stack concurrently in development mode:
```bash
npm run dev
```

The services will launch on:
- **Frontend Client**: `http://localhost:3000`
- **Backend API Server**: `http://localhost:5000`
