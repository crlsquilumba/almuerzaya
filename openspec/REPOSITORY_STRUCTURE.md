# Repository Structure & Organization Rules

**Document Type:** Technical Rule for Repository Management
**Version:** 1.0
**Last Updated:** 2026-05-31
**Author:** Almuerza Ya Development Team

---

## 🎯 Purpose

This document establishes the canonical structure for the Almuerza Ya repository. All new files, documentation, and code should follow these rules to maintain consistency, discoverability, and professional organization.

**Golden Rule:** *"The repository structure must remain clean and logical, with files organized by purpose, not scattered randomly."*

---

## 📁 Canonical Structure

```
/almuerzaya
│
├── README.md                         ← UNIQUE ENTRY POINT (GitHub main page)
│
├── apps/                             💻 SOURCE CODE
│   ├── backend/                      (Node.js / NestJS)
│   ├── web/                          (React 18 + Vite)
│   └── [other apps]
│
├── docs/                             📚 DOCUMENTATION
│   ├── README.md                     (Navigation index)
│   ├── frontend/                     (Frontend-specific docs)
│   │   ├── README.md
│   │   ├── QUICK_START_FRONTEND.md
│   │   ├── WEB_FRONTEND_COMPLETE.md
│   │   ├── IMPLEMENTATION_SUMMARY.md
│   │   ├── PUBLICATION_CHECKBOX_GUIDE.md
│   │   ├── VALIDATION_STANDARDS.md
│   │   └── VALIDATION_IMPLEMENTATION_REFERENCE.md
│   ├── history/                      (Sprint records)
│   │   ├── README.md
│   │   ├── SPRINT2_COMPLETE.md
│   │   ├── SPRINT3_COMPLETE.md
│   │   └── SPRINT4_COMPLETE.md
│   ├── PROJECT_COMPLETION_REPORT.md  (Final status)
│   └── IMPLEMENTACION.md             (v2.0 architecture)
│
├── specs/                            📋 TECHNICAL SPECIFICATIONS
│   ├── README.md                     (Navigation index)
│   ├── TECHNICAL_SPEC.md             (Main spec v2.0)
│   ├── SPECS.md                      (API endpoints)
│   ├── SPECS_MODULES.md              (Module details)
│   ├── SPECS_STRUCTURE.md            (Structure index)
│   ├── INDEX.md                      (Complete index)
│   ├── QUICK_START.md                (Specs reference)
│   ├── GLOSSARY.md                   (Terminology)
│   └── README_SPECS.txt              (Specs notes)
│
├── openspec/                         🔧 REPOSITORY RULES & CONFIG
│   ├── REPOSITORY_STRUCTURE.md       (This file - repo organization rules)
│   └── [other governance docs]
│
└── [Standard files]
    ├── package.json
    ├── .gitignore
    ├── tsconfig.json
    └── etc.
```

---

## 📋 Filing Rules by Category

### 1️⃣ ROOT DIRECTORY
**Only permitted files:**
- `README.md` - Single entry point (auto-displayed by GitHub)
- `package.json` - Monorepo configuration
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git configuration
- Standard config files (eslint, prettier, etc.)

**NEVER put in root:**
- ❌ Documentation files (use `docs/`)
- ❌ Specification files (use `specs/`)
- ❌ Quick start guides (integrate in README or put in `docs/`)
- ❌ Historical/archived docs (use `docs/history/`)

---

### 2️⃣ DOCS/ - DOCUMENTATION
**Purpose:** All project documentation organized by audience and purpose

**Subdirectories:**

#### `docs/frontend/`
- Frontend-specific documentation
- How-to guides for web implementation
- Component patterns and validation rules
- **Contents:**
  - `QUICK_START_FRONTEND.md` - Get web app running (5 min)
  - `WEB_FRONTEND_COMPLETE.md` - Full status
  - `IMPLEMENTATION_SUMMARY.md` - Implementation approach
  - `PUBLICATION_CHECKBOX_GUIDE.md` - Checkbox patterns
  - `VALIDATION_STANDARDS.md` - Validation patterns
  - `VALIDATION_IMPLEMENTATION_REFERENCE.md` - Implementation examples

#### `docs/history/`
- Sprint-by-sprint development records
- Historical milestones and achievements
- **Contents:**
  - `SPRINT2_COMPLETE.md` - Restaurants & Geolocation
  - `SPRINT3_COMPLETE.md` - Reservations & Kitchen
  - `SPRINT4_COMPLETE.md` - Payments & QR

#### `docs/` (Root level files)
- `PROJECT_COMPLETION_REPORT.md` - Final project status
- `IMPLEMENTACION.md` - v2.0 SaaS architecture
- `README.md` - Documentation navigation

---

### 3️⃣ SPECS/ - TECHNICAL SPECIFICATIONS
**Purpose:** All technical specifications and API documentation

**Only specifications belong here:**
- API endpoint definitions
- Database schemas
- Architecture diagrams
- Technical design documents
- Reference guides

**Contents:**
- `TECHNICAL_SPEC.md` - Master specification v2.0
- `SPECS.md` - Detailed API specs
- `SPECS_MODULES.md` - Module specifications
- `SPECS_STRUCTURE.md` - Technical structure
- `INDEX.md` - Complete navigation
- `QUICK_START.md` - Specs quick reference
- `GLOSSARY.md` - Terminology
- `README.md` - Specs navigation

---

### 4️⃣ APPS/ - SOURCE CODE
**Purpose:** All application source code

**Structure:**
- `apps/backend/` - Backend API (Node.js)
- `apps/web/` - Frontend (React 18)
- `[apps/other-app]/` - Additional applications

**Each app should have its own:**
- `README.md` - App-specific documentation
- `.env.example` - Environment template
- `package.json` - Dependencies
- `src/` - Source code

---

### 5️⃣ OPENSPEC/ - REPOSITORY GOVERNANCE
**Purpose:** Rules, governance, and configuration for the repository

**Contents:**
- `REPOSITORY_STRUCTURE.md` - This file
- Repository governance rules
- Coding standards
- Contribution guidelines

---

## ✅ File Organization Checklist

When creating or adding files, ask:

1. **Is it documentation?**
   - ✅ → Put in `docs/`
   - Sub-question: Is it frontend-specific?
     - ✅ → `docs/frontend/`
     - Is it historical?
       - ✅ → `docs/history/`

2. **Is it a technical specification?**
   - ✅ → Put in `specs/`

3. **Is it application code?**
   - ✅ → Put in `apps/[app-name]/`

4. **Is it a repository rule or governance?**
   - ✅ → Put in `openspec/`

5. **Is it configuration for the whole repo?**
   - ✅ → Put in root (only if necessary)

---

## 🚫 Anti-Patterns to Avoid

### ❌ Don't do this:
```
/almuerzaya
├── README.md
├── QUICK_START.md              ❌ Duplicate/redundant
├── QUICK_START_FRONTEND.md     ❌ Should be in docs/frontend/
├── TECHNICAL_SPEC.md           ❌ Should be in specs/
├── PROJECT_COMPLETION_REPORT.md ❌ Should be in docs/
├── IMPLEMENTATION_SUMMARY.md   ❌ Should be in docs/frontend/
├── SPRINT2_COMPLETE.md         ❌ Should be in docs/history/
├── WEB_FRONTEND_COMPLETE.md    ❌ Should be in docs/frontend/
└── IMPLEMENTATION_STATUS.md    ❌ Outdated/redundant
```

### ✅ Do this instead:
```
/almuerzaya
├── README.md                   ✅ Single entry point
├── docs/
│   ├── frontend/
│   │   ├── QUICK_START_FRONTEND.md
│   │   └── WEB_FRONTEND_COMPLETE.md
│   ├── history/
│   │   └── SPRINT2_COMPLETE.md
│   └── PROJECT_COMPLETION_REPORT.md
└── specs/
    └── TECHNICAL_SPEC.md
```

---

## 📝 README.md Strategy

### Every Directory Should Have README.md

**Root README.md** (`README.md`)
- Project overview
- Quick start (integrated, not separate file)
- Link to other documentation
- Entry point for new users

**Directory READMEs** (`docs/README.md`, `specs/README.md`, etc.)
- Navigation for that section
- Description of contents
- Links to specific documents
- Purpose of the directory

**Example: docs/frontend/README.md**
```markdown
# Frontend Documentation

Quick Start: [5-minute guide](QUICK_START_FRONTEND.md)

## Complete Status
- [WEB_FRONTEND_COMPLETE.md](WEB_FRONTEND_COMPLETE.md)

## Patterns & Guides
- [Validation Standards](VALIDATION_STANDARDS.md)
- [Checkbox Guide](PUBLICATION_CHECKBOX_GUIDE.md)
```

---

## 🔄 When Adding New Documentation

### Step 1: Determine Category
- Is it frontend-specific? → `docs/frontend/`
- Is it a specification? → `specs/`
- Is it project-wide? → `docs/`
- Is it historical? → `docs/history/`

### Step 2: Create File
- Use descriptive names: `QUICK_START_FRONTEND.md` (not just `QUICK_START.md`)
- Add to appropriate subdirectory
- Create/update `README.md` in that directory

### Step 3: Link It
- Add link to parent `README.md`
- Add link to main `README.md` if top-level
- Update documentation index

### Step 4: No Duplicates
- Check if content already exists elsewhere
- If similar content exists, consolidate (don't duplicate)

---

## 🎯 Key Principles

1. **Single Source of Truth**
   - Each piece of information should exist in ONE place
   - No duplicate content across root and subdirectories

2. **Logical Organization**
   - Files grouped by purpose, not by creation date
   - Clear navigation through README files

3. **Discoverability**
   - Main entry point is `README.md` (auto-shown on GitHub)
   - Navigation guides in each directory
   - Clear links between related documents

4. **Scalability**
   - Structure can handle new applications, new sprints, new documentation
   - Adding new docs doesn't require restructuring

5. **Professionalism**
   - Clean directory structure
   - No scattered files
   - Professional appearance

---

## 📊 Summary Table

| Type | Location | Examples |
|------|----------|----------|
| **Main Entry Point** | Root | `README.md` |
| **Frontend Docs** | `docs/frontend/` | Setup, guides, patterns |
| **Sprint History** | `docs/history/` | SPRINT2, SPRINT3, etc. |
| **Project Reports** | `docs/` | Completion report |
| **Technical Specs** | `specs/` | TECHNICAL_SPEC.md, SPECS.md |
| **Architecture** | `specs/` or `docs/` | Design documents |
| **App Code** | `apps/[app]/` | Source code |
| **Governance** | `openspec/` | Rules, standards, processes |
| **Config Files** | Root | package.json, tsconfig.json |

---

## ❓ Questions & Answers

**Q: Can I put documentation in the root?**
A: Only `README.md`. Everything else goes in `docs/` or `specs/`.

**Q: What if I have multiple quick start guides?**
A: Put each in its specific location (`docs/frontend/QUICK_START_FRONTEND.md`, `specs/QUICK_START.md`) with integrated quick start in main `README.md`.

**Q: Where do I put archived/deprecated docs?**
A: `docs/history/` for sprint records, or consider deletion if no longer relevant.

**Q: What if a file doesn't fit these categories?**
A: Create a new subdirectory in `docs/` (e.g., `docs/devops/`, `docs/database/`) and add a `README.md` explaining its purpose.

**Q: How do I keep this structure updated?**
A: Review this document regularly, link to it in contributing guidelines, and enforce it in code reviews.

---

## 🔗 Related Documents

- [Main README.md](../README.md) - Project overview
- [docs/README.md](../docs/README.md) - Documentation navigation
- [specs/README.md](../specs/README.md) - Specifications navigation

---

**Last Reviewed:** 2026-05-31
**Status:** ✅ Active and enforced
**Review Cycle:** Quarterly or as needed
