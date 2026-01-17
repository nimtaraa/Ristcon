# RISTCON - Research Conference Management System

A comprehensive full-stack platform for managing the annual RISTCON (Research Conference) organized by the Faculty of Science, University of Ruhuna, Sri Lanka.

## 🏗️ Architecture

The system consists of three main components:

- **Public Frontend** (`ristcon-2026/`) - React-based public website
- **Admin Panel** (`ristcon-admin/`) - Management interface for organizers
- **Backend API** (`ristcon-backend/`) - Laravel REST API for data management

All services are containerized using Docker Compose for easy deployment and development.

## 🚀 Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite, TailwindCSS, shadcn/ui
- React Router, TanStack Query
- React Hook Form + Zod

**Backend**
- Laravel 12 (PHP 8.2+)
- Laravel Sanctum
- MariaDB

**Infrastructure**
- Docker & Docker Compose
- Nginx

## 📦 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- PHP 8.2+ & Composer (for local backend development)

### Docker Deployment (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd Ristcon

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start all services
docker-compose up -d
```

**Services:**
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3001
- Backend API: http://localhost:8080/api/v1

### Local Development

**Frontend:**
```bash
cd ristcon-2026
npm install
npm run dev
```

**Backend:**
```bash
cd ristcon-backend
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

## 🔑 Features

- Multi-edition conference management
- Speaker management (keynote, plenary, invited)
- Registration system
- Author submission guidelines
- Important dates and timeline tracking
- Research areas and topics
- Committee management
- Past events archive

## 📁 Project Structure

```
Ristcon/
├── ristcon-2026/      # Public frontend
├── ristcon-admin/     # Admin panel
├── ristcon-backend/   # Laravel API
└── docker/            # Docker configurations
```

## 📝 Configuration

Key environment variables:
- `DB_*` - Database credentials
- `APP_KEY` - Laravel application key
- `VITE_API_BASE_URL` - API endpoint URL
- `FRONTEND_URL`, `ADMIN_URL` - Application URLs

## 📚 Documentation

For detailed development guides, see component-specific READMEs:
- `ristcon-2026/README.md`
- `ristcon-admin/README.md`
- `ristcon-backend/README.md`

---

**RISTCON** - Advancing Research Excellence in Science and Technology  
Faculty of Science, University of Ruhuna
