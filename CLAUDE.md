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

## 📝 Commits - Rastreo Total de Cambios

### 🎯 Principio: Un Commit = Un Cambio Completo

Cada commit debe ser **atómico y completo**: contiene TODOS los archivos relacionados a esa tarea para que alguien entienda qué se hizo leyendo el commit.

### Formato Estándar

```
type(scope): descripción breve (máx 72 caracteres)

## Qué cambió (punto a punto)
- Cambio 1 realizado
- Cambio 2 realizado
- Cambio 3 realizado

## Por qué se hizo
Razón o contexto del cambio

## Archivos afectados
- apps/backend/src/auth/auth.service.ts
- apps/backend/src/auth/jwt.strategy.ts
- apps/web/src/hooks/useAuth.ts
- apps/web/src/store/authStore.ts

Co-Authored-By: Claude <claude@anthropic.com>
```

### Tipos de Commits (Convencionalmente)

| Tipo | Uso | Ejemplo |
|------|-----|---------|
| `feat` | Nueva funcionalidad | `feat(auth): implementar JWT` |
| `fix` | Corrección de bug | `fix(payment): validar monto` |
| `docs` | Solo documentación | `docs(readme): actualizar setup` |
| `style` | Formateo/linting (no lógica) | `style(auth): formatear imports` |
| `refactor` | Reorganizar código | `refactor(api): simplificar auth` |
| `test` | Agregar/modificar tests | `test(auth): validar JWT` |
| `chore` | Dependencias, config | `chore(deps): actualizar nestjs` |
| `perf` | Mejora de rendimiento | `perf(api): cache usuarios` |

### ✅ Ejemplos Prácticos

#### ✅ Commit BIEN Estructurado
```
feat(restaurant-dashboard): implementar dashboard completo

## Qué cambió
- Crear componentes de dashboard (header, estadísticas, gráficos)
- Implementar servicios para traer datos de restaurantes
- Agregar estados en Zustand para manejo de datos
- Integrar gráficas con Chart.js
- Agregar filtros por fecha y categoría
- Agregar tests unitarios para servicios

## Por qué se hizo
El usuario necesitaba visualizar en tiempo real sus ventas
y datos del restaurante en un dashboard intuitivo.

## Archivos afectados
- apps/web/src/pages/RestaurantDashboard.tsx (915 líneas)
- apps/web/src/components/restaurant/StatCard.tsx (nuevo)
- apps/web/src/components/restaurant/SalesChart.tsx (nuevo)
- apps/web/src/services/analytics.service.ts (nuevo)
- apps/web/src/store/dashboardStore.ts (nuevo)
- apps/web/src/types/dashboard.types.ts (nuevo)
- apps/backend/src/modules/analytics/analytics.controller.ts (nuevo)
- apps/backend/test/analytics.spec.ts (nuevo)

Co-Authored-By: Claude <claude@anthropic.com>
```

#### ❌ Commit MAL (evitar esto)
```
fix: arreglos varios
```
↑ No explica qué se hizo, qué archivos cambió, ni por qué

---

### 🔄 Flujo de Commits en una Tarea

**Ejemplo: Implementar autenticación JWT**

```bash
# 1. Crear rama
git checkout -b feature/jwt-authentication

# 2. Commit 1: Backend - Servicios de auth
git add apps/backend/src/modules/auth/
git commit -m "feat(auth-backend): servicios JWT y estrategias

## Qué cambió
- Crear AuthService con métodos login y refresh
- Implementar JwtStrategy y JwtGuard
- Agregar validación de tokens

## Archivos
- apps/backend/src/modules/auth/services/auth.service.ts
- apps/backend/src/modules/auth/strategies/jwt.strategy.ts
- apps/backend/src/modules/auth/guards/jwt.guard.ts
- apps/backend/test/auth.spec.ts
"

# 3. Commit 2: Frontend - Hooks y store
git add apps/web/src/hooks/useAuth.ts apps/web/src/store/authStore.ts
git commit -m "feat(auth-frontend): hooks y estado global

## Qué cambió
- Crear useAuth hook para acceso a autenticación
- Implementar Zustand store (cpos-auth-storage)
- Agregar interceptor de Axios para JWT

## Archivos
- apps/web/src/hooks/useAuth.ts
- apps/web/src/store/authStore.ts
- apps/web/src/config/axios.ts (modificado)
"

# 4. Commit 3: Frontend - Login UI
git add apps/web/src/pages/Login.tsx
git commit -m "feat(auth-ui): página de login completa

## Qué cambió
- Crear componente Login con validaciones
- Formulario con email y password
- Manejo de errores y loading

## Archivos
- apps/web/src/pages/Login.tsx
"

# 5. Commit 4: Documentación
git add docs/
git commit -m "docs(auth): guía de autenticación JWT

## Qué cambió
- Agregar documentación de endpoints de auth
- Explicar flujo de tokens
- Ejemplos de uso con curl

## Archivos
- docs/backend/AUTH_GUIDE.md
"

# 6. Push a remoto
git push -u origin feature/jwt-authentication

# 7. Crear PR en GitHub
```

---

### ⚡ Reglas Prácticas para Commits

#### ✅ BUENA PRÁCTICA

```
1. Un commit = una característica o fix completo
   - Si es grande, dividir en commits lógicos
   - Cada commit debe ser independiente

2. Commits antes de cambiar de tarea
   git add .
   git commit -m "tipo(scope): descripción"

3. Incluir archivos relacionados
   - Si modificas backend, incluye servicios + tests
   - Si modificas frontend, incluye componentes + hooks + store

4. Mensaje descriptivo
   - Primera línea: qué se hizo (72 caracteres máx)
   - Cuerpo: por qué se hizo y qué cambió
   - Listar archivos afectados

5. Push regularmente
   git push origin feature/tu-rama
   - No acumular 20 commits sin push
```

#### ❌ MALO

```
- Commits vagos: "fix stuff", "wip", "arreglos"
- Cambios sin relación en un commit
- Cambios sin documentar en el mensaje
- No hacer push hasta el final
- Commits que rompen la rama intermedia
```

---

### 🤖 Comando Rápido (Plantilla)

Copia y modifica esta plantilla para commits consistentes:

```bash
git commit -m "tipo(scope): descripción breve

## Qué cambió
- Cambio 1
- Cambio 2

## Archivos
- archivo1.ts
- archivo2.ts

Co-Authored-By: Claude <claude@anthropic.com>"
```

---

### 📊 Ver Historial de Cambios

```bash
# Ver commits con cambios
git log --oneline -10

# Ver cambios en detalle
git log --stat -5

# Ver commits de una rama
git log develop..feature/tu-rama

# Ver gráfico de commits
git log --graph --oneline --all
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

