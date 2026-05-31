# CLAUDE.md - Almuerzaya Project

## 🏗️ Arquitectura del Proyecto

**Almuerzaya** es una plataforma web de reservas y compra de almuerzos en restaurantes.

### Estructura
```
apps/
  ├── backend/     # NestJS + Prisma + PostgreSQL
  ├── web/         # React + TypeScript + Tailwind
docs/               # Documentación y especificaciones
specs/              # Especificaciones técnicas detalladas
```

### Tech Stack
- **Backend**: NestJS, Prisma ORM, PostgreSQL
- **Frontend**: React 18, TypeScript, Tailwind CSS, Zustand
- **Testing**: Vitest (backend), Playwright (e2e)

---

## 🌳 Estrategia de Branching (Git Workflow)

### Reglas OBLIGATORIAS

#### 1. **Ramas Principales** (Protegidas)
```
main/       → PRODUCCIÓN (nunca se toca directamente)
develop/    → INTEGRACIÓN (rama de desarrollo)
```

#### 2. **Ramas de Características/Cambios** (Creadas desde develop)
```
feature/*   → Nuevas funcionalidades (ej: feature/kitchen-dashboard)
fix/*       → Corrección de bugs (ej: fix/login-validation)
chore/*     → Tareas de mantenimiento (ej: chore/update-dependencies)
docs/*      → Solo cambios de documentación (ej: docs/api-guide)
```

#### 3. **Nomenclatura de Ramas**
- Usar kebab-case (minúsculas, guiones)
- Descripción clara: `feature/nombre-descriptivo`
- Ejemplos válidos:
  - ✅ `feature/restaurant-dashboard`
  - ✅ `fix/payment-validation`
  - ✅ `chore/upgrade-nestjs`
  - ❌ `feature/new-stuff` (vago)
  - ❌ `Feature/Dashboard` (mayúsculas)

### Flujo de Trabajo Correcto

```
1. Crear rama desde develop
   git checkout develop
   git pull origin develop
   git checkout -b feature/tu-actividad

2. Hacer cambios y commits
   git add .
   git commit -m "descripción clara"

3. Push a rama remota
   git push -u origin feature/tu-actividad

4. Crear Pull Request en GitHub
   - Base: develop (NUNCA main)
   - Head: feature/tu-actividad

5. Revisión y merge a develop
   - Pedir revisión antes de mergear
   - Merge automático desde GitHub

6. Eliminar rama después de merge
   git branch -D feature/tu-actividad
   git push origin --delete feature/tu-actividad
```

### ❌ PROHIBIDO

```
❌ Hacer commits directamente en develop
❌ Hacer commits directamente en main
❌ Mergear directo en main (solo desde develop después de testing)
❌ Force push a develop o main
❌ Crear ramas sin prefijo (feature/, fix/, etc)
❌ Mantener ramas viejas sin usar
```

### ✅ PERMITIDO

```
✅ Crear tantas ramas feature/* como necesites
✅ Actualizar feature/* desde develop regularmente
✅ Hacer tantos commits como necesites en feature/*
✅ Pedir revisión en GitHub antes de mergear
✅ Mergear a develop desde PR
✅ Mergear develop a main solo en releases
```

---

## 🔧 Desarrollo Local

### Backend Setup
```bash
cd apps/backend
npm install
npm run dev          # Development mode
npm run build:prod   # Production build
npm test             # Run tests
```

### Frontend Setup
```bash
cd apps/web
npm install
npm run dev          # Dev server
npm run build        # Build
npm run typecheck    # Type validation
```

### Database (Prisma)
```bash
npm run prisma:migrate  # Nueva migración
npm run prisma:studio   # Visualizar datos
npm run prisma:seed     # Seed datos
```

---

## 📋 Tipos de PR

### Feature PR
```
Title: Feature: [nombre-descriptivo]
Branch: feature/nombre-actividad
Base: develop
```

### Fix PR
```
Title: Fix: [descripción del bug]
Branch: fix/nombre-actividad
Base: develop
```

### Chore PR
```
Title: Chore: [descripción]
Branch: chore/nombre-actividad
Base: develop
```

---

## 🚀 Deploy

### Development
- Rama: `develop`
- Disparador: Merge a develop
- Ambiente: staging/development

### Production
- Rama: `main`
- Disparador: Merge desde develop (después de testing)
- Proceso: Tag + Release en GitHub

---

## 📝 Commits

### Formato
```
type(scope): descripción breve

Descripción más detallada si es necesario.
Puedes agregar múltiples líneas.

Co-Authored-By: Tu Nombre <email@example.com>
```

### Tipos
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios de documentación
- `style:` formateo de código (sin cambiar lógica)
- `refactor:` refactorización
- `test:` agregar/modificar tests
- `chore:` tareas de mantenimiento

### Ejemplos
```
feat(auth): agregar autenticación JWT
fix(payment): validar monto de pago
docs(readme): actualizar instrucciones setup
chore(deps): actualizar dependencias
```

---

## ✅ Checklist Antes de Mergear

- [ ] Código revisado
- [ ] Tests pasando (`npm test`)
- [ ] Build funciona (`npm run build`)
- [ ] Sin conflictos de merge
- [ ] PR description clara
- [ ] Rama sincronizada con develop
- [ ] Cambios documentados si es necesario

---

## 🔒 Protecciones de Rama

Configurado en GitHub:

**main**
- ✅ Require pull request reviews
- ✅ Dismiss stale PR approvals
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ No force push

**develop**
- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date

---

## 📚 Referencias

- [Convencional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

