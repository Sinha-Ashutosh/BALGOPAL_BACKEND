# Bal Gopal Preschool Management System - Backend

A production-ready REST API for the **Bal Gopal Preschool Management System**, built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **Drizzle ORM**.

This backend powers both the **public preschool website** and the **admin dashboard**, providing secure APIs for managing admissions, gallery, announcements, testimonials, settings, and authentication.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL (Neon)
- Drizzle ORM
- JWT Authentication
- Pino Logger
- Zod
- Helmet
- CORS
- Compression
- Cookie Parser

---

## 📁 Project Structure

```
src/
│
├── config/
│   ├── env.ts
│   ├── logger.ts
│   └── index.ts
│
├── database/
│   ├── connection.ts
│   ├── schema/
│   ├── migrations/
│   ├── seed/
│   └── index.ts
│
├── modules/
│   ├── auth/
│   ├── admissions/
│   ├── announcements/
│   ├── gallery/
│   ├── testimonials/
│   └── settings/
│
├── middlewares/
│
├── routes/
│
├── utils/
│
├── app.ts
└── server.ts
```

---

## ✨ Features

- JWT Authentication
- Role-Based Authorization
- Admission Management
- Gallery Management
- Announcement Management
- Testimonials Management
- Website Settings Management
- Secure REST APIs
- Request Validation
- Global Error Handling
- Logging with Pino
- Database Migrations
- Production Ready Folder Structure

---

## ⚙️ Installation

Clone the repository

```bash
git clone <repository-url>
```

Move into the project

```bash
cd backend
```

Install dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root.

```env
NODE_ENV=development

PORT=5000

DATABASE_URL=your_neon_database_url

JWT_SECRET=your_super_secret_key

CORS_ORIGIN=http://localhost:5173
```

---

## ▶️ Running the Project

Development

```bash
npm run dev
```

Build

```bash
npm run build
```

Production

```bash
npm start
```

---

## 🗄 Database Commands

Generate Migration

```bash
npm run db:generate
```

Run Migration

```bash
npm run db:migrate
```

Open Drizzle Studio

```bash
npm run db:studio
```

---

## 📌 API Base URL

```
http://localhost:5000/api/v1
```

Example

```
GET /api/v1/gallery
```

```
POST /api/v1/auth/login
```

---

## 🔒 Authentication

Authentication is implemented using **JWT (JSON Web Tokens)**.

Protected routes require a valid access token.

---

## 📄 License

This project is developed for the **Bal Gopal Preschool Management System**.

Copyright © 2026.