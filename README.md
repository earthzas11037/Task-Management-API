# 🚀 NestJS Template

A production-ready backend template built with **NestJS** — designed for scalable enterprise apps with built-in support for relational databases, Redis, config management, file uploads to GCP, and access control.

---

## 📦 Features

- 🗄️ **MySQL / PostgreSQL / MongoDB Connection**  
  Connect to either MySQL or PostgreSQL via ORM (TypeORM / Prisma ready) or NoSQL MongoDB for inbound log.

- ⚡ **Redis Connection**  
  Use for caching, pub-sub, or queuing mechanisms.

- ⚙️ **Config Management**  
  Supports both `.env` and [`node-config`](https://github.com/node-config/node-config) for environment-based configs.

- 🔁 **Server Configuration Fetching**  
  Automatically fetches remote configuration every minute.

- 🌐 **Client Configuration API**  
  Serves dynamic frontend configuration (e.g., feature flags).

- ☁️ **File Upload with Google Cloud Storage**  
  Upload files directly to a GCS bucket using service account credentials.

---

## 🧠 Tech Stack

- [NestJS](https://nestjs.com/)
- TypeScript
- MySQL / PostgreSQL / Mongodb
- Redis
- dotenv + node-config
- Google Cloud Storage SDK
- Scheduler (`@nestjs/schedule`)
- Authen
- Users
- Task Manangement

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/earthzas11037/Task-Management-API.git
cd Task-Management-API
```

### 2. Setup environment variables

```bash
cp .env.example .env
```

### 3. Create Schema Mysql

- สร้าง database schema ชื่อ template_api ใน MySQL

```bash
CREATE DATABASE template_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Install dependencies

```bash
yarn install
```

### 5. Run the development server

```bash
yarn start:local
```

### 6. API server

```bash
http://localhost:5000
```

### list of improvements will make with more time
- Unit test
