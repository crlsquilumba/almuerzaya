# Almuerza Ya 🍽️

**Zero-Wait Executive Lunch Pre-Ordering Platform**

Plataforma SaaS para reserva de almuerzos ejecutivos con delivery en menos de 2 minutos. Diseñada para el mercado ecuatoriano con integración de pagos Pichincha QR.

---

## 🚀 Quick Start (Choose Your Path)

### Frontend Web Developers
```bash
cd apps/web
npm install
npm run dev
# Visit: http://localhost:5173
```
👉 [Complete Frontend Setup Guide](docs/frontend/QUICK_START_FRONTEND.md)

### Backend Developers
```bash
cd apps/backend
npm install
npm run dev
# Server: http://localhost:3000
```
👉 [Backend Documentation](docs/)

### Need Specifications?
👉 [Technical Specification](specs/TECHNICAL_SPEC.md) | [API Specs](specs/INDEX.md)

## 📁 Estructura del Proyecto

```
almuerzaya/
├── apps/
│   ├── backend/              # Node.js + Express + TypeScript
│   │   ├── src/
│   │   │   ├── index.ts      # Punto de entrada
│   │   │   ├── api/          # Controllers, Routes, Middleware
│   │   │   ├── auth/         # Servicios de autenticación
│   │   │   ├── core/         # Entidades, DTOs, Servicios
│   │   │   ├── payment/      # SPRINT 4
│   │   │   └── shared/       # Utils, Constants, Types
│   │   ├── package.json
│   │   ├── .env.local        # Variables de entorno
│   │   └── README.md
│   │
│   ├── web/                  # React 18 + Zustand + Tailwind
│   │   ├── src/
│   │   │   ├── pages/        # Vistas
│   │   │   ├── components/   # Componentes reutilizables
│   │   │   ├── store/        # Zustand stores
│   │   │   ├── services/     # API client
│   │   │   └── config/       # Configuración
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── mobile/               # Flutter + Dart
│       ├── lib/
│       │   ├── main.dart
│       │   ├── screens/      # Pantallas
│       │   ├── widgets/      # Widgets reutilizables
│       │   ├── models/       # Modelos de datos
│       │   └── services/     # Servicios API/BD
│       ├── pubspec.yaml
│       └── .env.local
│
├── sqlite/                   # Base de datos local
│   └── almuerza-ya.db
│
├── openspec/                 # Documentación (PRD, specs, tasks)
│   └── changes/prd-almuerza-ya/
│       ├── README.md                  # PRD Funcional
│       ├── PROPOSAL.md                # Propuesta ejecutiva
│       ├── TECHNICAL_SPEC.md          # Especificación técnica
│       ├── DESIGN.md                  # Diseño UI/UX
│       ├── PAYMENT_FLOW.md            # Flujo de pagos
│       ├── TASKS.md                   # Desglose de trabajo (5 sprints)
│       ├── HEXAGONAL_MINIMAL.md       # Arquitectura
│       ├── ENVIRONMENTS.md            # LOCAL vs PRODUCCIÓN
│       ├── WINDOWS11_SETUP.md         # Setup Windows 11
│       ├── EXPERT_CHECKLIST.md        # 80+ archivos a crear
│       └── PACKAGE_NAMING.md          # Convenciones de nombres
│
├── package.json              # Monorepo (workspaces)
├── tsconfig.json             # TypeScript config compartida
├── .gitignore
└── README.md                 # Este archivo
```

## 🏗️ Arquitectura

### Hexagonal Minimalista

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│  (Controllers, Routes, Middleware)      │
├─────────────────────────────────────────┤
│          Application Layer              │
│  (DTOs, Services, Business Logic)       │
├─────────────────────────────────────────┤
│          Domain Layer                   │
│  (Entities, Business Rules)             │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│  (Database, Firebase, Storage)          │
└─────────────────────────────────────────┘
```

### Stack Tecnológico

| Layer | Frontend | Backend | Mobile |
|-------|----------|---------|--------|
| UI | React 18 | Express.js | Flutter |
| State | Zustand | - | BLoC |
| Styling | Tailwind | - | Material |
| Database | SQLite (local) | SQLite (dev) | SQLite |
| Cloud | Firestore | Firestore | Firestore |
| Auth | Firebase Auth | JWT + Firebase | Firebase Auth |

## 🌍 Ambientes

### LOCAL (Desarrollo Windows 11)

```
Backend:  npm run dev → http://localhost:3000
Web:      npm run dev → http://localhost:5173
Mobile:   flutter run → Emulador Android
Database: SQLite local (sqlite/almuerza-ya.db)
```

### PRODUCCIÓN (Cloud)

```
Backend:  Google Cloud Run
Web:      Firebase Hosting
Mobile:   PlayStore (APK) / AppStore (iOS)
Database: Firestore
```

## 📋 Sprint Roadmap

### SPRINT 1 (Week 1-2) ✅ COMPLETADO
- [x] Estructura monorepo
- [x] Express + Firebase setup
- [x] SQLite con migraciones
- [x] JWT authentication
- [x] CRUD endpoints base

### SPRINT 2 (Week 2-3) ⏳ PRÓXIMO
- [ ] RestaurantService (CRUD)
- [ ] Validación de ubicación (Haversine)
- [ ] Filtrado por distancia (5km)
- [ ] MenuItemService

### SPRINT 3 (Week 3-4)
- [ ] ReservationService
- [ ] Kitchen Dashboard (Mobile)
- [ ] Real-time updates (Firestore listeners)

### SPRINT 4 (Week 4)
- [ ] Pichincha QR integration
- [ ] Payment verification flow
- [ ] Owner verification panel

### SPRINT 5 (Week 4-5)
- [ ] Unit tests & E2E tests
- [ ] Deploy local (APK generation)
- [ ] Deploy producción (Firebase + Cloud Run)

## 🔐 Seguridad

- ✅ JWT tokens (7 días expiración)
- ✅ Passwords hasheados (bcryptjs)
- ✅ Rate limiting (100 req/15 min)
- ✅ CORS configurado
- ✅ Helmet security headers
- ✅ Firebase Security Rules

## 📚 Documentation

| Topic | Link |
|-------|------|
| **Technical Specification** | [Complete spec v2.0](specs/TECHNICAL_SPEC.md) |
| **API Specifications** | [Specs Index](specs/INDEX.md) |
| **Frontend Guide** | [Quick Start + Full Docs](docs/frontend/) |
| **Project Status** | [Completion Report](docs/PROJECT_COMPLETION_REPORT.md) |
| **Development History** | [Sprint 2-4 Records](docs/history/) |
| **Glossary & Terms** | [Terminology](specs/GLOSSARY.md) |

## 📐 Repository Structure & Organization Rules

This repository follows a strict organization structure to keep files organized as the project grows.

👉 **[Read the Repository Structure Guide](openspec/REPOSITORY_STRUCTURE.md)**

**Quick reference:**
- `README.md` - Main entry point (you are here)
- `docs/` - All documentation (frontend, history, reports)
- `specs/` - Technical specifications
- `apps/` - Application source code
- `openspec/` - Repository governance rules

**Adding new files?** Always check: [File Organization Checklist](openspec/REPOSITORY_STRUCTURE.md#-file-organization-checklist)

---

## 🚦 Comandos Útiles

```bash
# Desarrollo (todas las apps)
npm run dev

# Backend solo
npm run dev:backend

# Web solo
npm run dev:web

# Mobile solo
npm run dev:mobile

# Build producción
npm run build

# Tests
npm run test

# Linting
npm run lint
```

## 🐛 Troubleshooting

### Puerto 3000 en uso
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### SQLite locked
```bash
rm sqlite/almuerza-ya.db-wal
rm sqlite/almuerza-ya.db-shm
```

### npm install falló
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📞 Contacto

- **Email:** soporte@almuerzaya.com
- **Documentación:** Ver `openspec/` folder
- **Issues:** GitHub Issues

---

**Status:** ✅ SPRINT 1 Completado
**Última actualización:** 2026-05-30
**Próximo paso:** SPRINT 2 - RestaurantService implementation
