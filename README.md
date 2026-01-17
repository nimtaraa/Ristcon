# RISTCON - Research Conference Management System

A comprehensive full-stack platform for managing the annual RISTCON (Research Conference) organized by the Faculty of Science, University of Ruhuna, Sri Lanka.

## 🏗️ Architecture

A modern, containerized application with three main components:

- **Frontend** (`ristcon-2026/`) - Public-facing React application for conference information
- **Admin Panel** (`ristcon-admin/`) - Management interface for conference organizers  
- **Backend** (`ristcon-backend/`) - Laravel REST API for data management

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** + **shadcn/ui** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **React Hook Form** + **Zod** for form validation

### Backend
- **Laravel 12** (PHP 8.2+)
- **Laravel Sanctum** for authentication
- **MariaDB** for database
- RESTful API architecture

### Infrastructure
- **Docker** & **Docker Compose** for containerization
- **Nginx** for web servers
- Multi-container orchestration

## 📦 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- PHP 8.2+ & Composer (for local backend development)

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Ristcon
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start all services:
   ```bash
   docker-compose up -d
   ```

4. Access the applications:
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3001
   - Backend API: http://localhost:8080/api/v1

### Local Development

#### Frontend
```bash
cd ristcon-2026
npm install
npm run dev
```

#### Backend
```bash
cd ristcon-backend
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

## 📁 Project Structure

```
Ristcon/
├── ristcon-2026/          # Public frontend (React + TypeScript)
├── ristcon-admin/          # Admin panel (React + TypeScript)
├── ristcon-backend/        # Laravel API backend
└── docker/                 # Docker configurations
    ├── frontend/
    ├── backend/
    └── admin/
```

## 🔑 Key Features

- **Multi-Edition Support** - Manage multiple conference years
- **Speaker Management** - Keynote, plenary, and invited speakers
- **Registration System** - Attendee registration and management
- **Author Instructions** - Submission guidelines and templates
- **Important Dates** - Timeline tracking for submissions and events
- **Research Areas** - Conference topics and tracks
- **Committee Management** - Organizing committee details
- **Past Events Archive** - Historical conference information

## 🌐 API Endpoints

The backend provides RESTful APIs at `/api/v1/` for:
- Conference editions and details
- Speakers and presentations
- Registrations
- Important dates and deadlines
- Research areas and topics
- Document management

## 🐳 Docker Services

- `ristcon-db` - MariaDB database
- `ristcon-backend` - Laravel API (port 8080)
- `ristcon-frontend` - Public website (port 3000)
- `ristcon-admin` - Admin interface (port 3001)

## 📝 Environment Variables

Key configuration variables:
- `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` - Database credentials
- `APP_KEY` - Laravel application key
- `VITE_API_BASE_URL` - API endpoint for frontends
- `FRONTEND_URL`, `ADMIN_URL` - Application URLs

## 🔧 Development

See individual component READMEs for detailed development guides:
- `ristcon-2026/README.md`
- `ristcon-admin/README.md`
- `ristcon-backend/README.md`

## 📄 License

MIT

---

**RISTCON** - Advancing Research Excellence in Science and Technology | Faculty of Science, University of Ruhuna

