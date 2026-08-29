# Absenin - Employee Attendance & Activity Logging System

A containerized microservices platform for employee attendance tracking and asynchronous audit logging, built with NestJS, React (Vite), PostgreSQL, RabbitMQ, and MinIO.

---

## Architecture & Port Mapping

| Service | Description | Host Port | Access URL |
| --- | --- | --- | --- |
| **Admin Web** | Admin portal for attendance overview, approval, and user management | `3001` | `http://localhost:3001` |
| **User Web** | Employee portal for clock-in/out and profile management | `3000` | `http://localhost:3000` |
| **Attendance Service** | Core REST API, JWT auth, SSE notifications, and MinIO file uploads | `8000` | `http://localhost:8000` |
| **Logging Service** | Asynchronous RabbitMQ consumer and audit log processor | Internal | - |
| **PostgreSQL** | Multi-database instance (`attendance_postgres`, `log_postgres`) | `5432` | `localhost:5432` |
| **RabbitMQ Dashboard** | Message broker management interface | `15672` | `http://localhost:15672` |
| **MinIO Console** | S3-compatible object storage dashboard | `9001` | `http://localhost:9001` |
| **pgAdmin 4** | Web-based database management interface | `5050` | `http://localhost:5050` |

---

## Prerequisites

* Docker Engine (v24.x or newer)
* Docker Compose v2

---

## Quick Start

Run the entire application stack with a single command from the project root:

```bash
docker compose up --build

```

> **Automated Initialization:**
> 1. Multi-database provisioning (`attendance_postgres` and `log_postgres`) via `init-multi-db.sql`.
> 2. PostgreSQL extension registration (`uuid-ossp`).
> 3. Automatic TypeORM migration execution during container startup.
> 4. Database seeding for admin, users, and attendance records.
> 
> 

To stop the containers and remove persistent volumes:

```bash
docker compose down -v

```

---

## Default Seeded Accounts

Default password for all accounts: **`password123`**

| Role | Name | Email | Initial Data |
| --- | --- | --- | --- |
| **Admin** | Super Admin | `admin@mail.com` | Full administrative access (`:3001`) |
| **User** | Budi Santoso | `user1@mail.com` | Attendance records: July 30, 2026 – August 25, 2026 |
| **User** | Siti Rahma | `user2@mail.com` | Attendance record: August 26, 2026 |

---

## Infrastructure Credentials

* **MinIO Console** (`http://localhost:9001`)
* **Username:** `minioadmin`
* **Password:** `minioadmin`


* **RabbitMQ Management** (`http://localhost:15672`)
* **Username:** `guest`
* **Password:** `guest`


* **pgAdmin 4** (`http://localhost:5050`)
* **Email:** `admin@admin.com`
* **Password:** `admin`
* **Database Host (within Docker network):** `absenin-postgres`
* **Database User / Password:** `postgres` / `postgres`



---

## Tech Stack

* **Backend:** NestJS, TypeScript, TypeORM, JWT, Server-Sent Events (SSE)
* **Frontend:** React, Vite, Tailwind CSS, Nginx (Alpine)
* **Infrastructure:** PostgreSQL, RabbitMQ, MinIO, Docker