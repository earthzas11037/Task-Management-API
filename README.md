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
git clone https://gitlab.com/your-name/nestjs-template.git
cd nestjs-template
```
