# 🎯 Validación Profesional - Implementación en RegisterAlmuerzo

## ✅ Estado: IMPLEMENTADO Y LISTO PARA PROBAR

Fecha: 2026-05-31 | Componente: `apps/web/src/components/common/RegisterAlmuerzo.tsx`

---

## 📋 Campos Validados (Requeridos)

| Campo | Validación | Mensajes |
|-------|-----------|----------|
| **Nombre del Menú** | No vacío, sin espacios en blanco | ❌ "Nombre del menú requerido" |
| **PVP** | Número válido, máx 2 decimales | ❌ "PVP debe ser un número válido"<br>❌ "PVP debe tener máximo 2 decimales" |
| **Nombre de la Sopa** | No vacío, sin espacios en blanco | ❌ "Nombre de la sopa requerido" |
| **Proteína Principal** | No vacío, sin espacios en blanco | ❌ "Proteína principal requerida" |
| **Guarniciones** | No vacío, sin espacios en blanco | ❌ "Guarniciones requeridas" |
| **Bebida** | No vacío, sin espacios en blanco | ❌ "Bebida requerida" |

---

## 🎨 Visual de Campos con Error

```
┌─────────────────────────────────────────┐
│ Nombre del Menú                         │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ ← BORDE ROJO (border-2)
│ │        (fondo rojo claro)           │ ← FONDO ROJO CLARO (bg-red-50)
│ └─────────────────────────────────────┘ │
│ ❌ Nombre del menú requerido            │ ← MENSAJE ROJO (text-red-600)
└─────────────────────────────────────────┘
```

---

## 🔄 Flujo de Validación

### 1️⃣ **Usuario Escribe**
```
Input onChange →
  handleChange() limpia error del campo inmediatamente ⚡
  (El campo vuelve a color normal aunque esté vacío)
```

### 2️⃣ **Usuario Hace Click en Guardar**
```
Button onClick →
  handleSubmit() llama validateForm() →
    Valida TODOS los 6 campos requeridos →
    Si hay errores: Muestra errores en rojo, NO envía ❌
    Si NO hay errores: Envía datos al backend ✅
```

### 3️⃣ **Cerrar Modal**
```
Button "Cancelar" →
  handleClose() →
    resetForm() limpia datos Y errores
    Modal se cierra
```

---

## 💻 Código de Referencia

### Estado de Errores
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});
```

### Función de Validación
```typescript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  // Nombre del Menú
  if (!formData.nombre || !formData.nombre.trim()) {
    newErrors.nombre = 'Nombre del menú requerido';
  }

  // PVP (número con máx 2 decimales)
  if (!formData.price || isNaN(formData.price)) {
    newErrors.price = 'PVP debe ser un número válido';
  } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price.toString())) {
    newErrors.price = 'PVP debe tener máximo 2 decimales (ej: 5.99)';
  }

  // Sopa
  if (!formData.sopa || !formData.sopa.trim()) {
    newErrors.sopa = 'Nombre de la sopa requerido';
  }

  // Proteína
  if (!formData.proteina || !formData.proteina.trim()) {
    newErrors.proteina = 'Proteína principal requerida';
  }

  // Guarniciones
  if (!formData.guarniciones || !formData.guarniciones.trim()) {
    newErrors.guarniciones = 'Guarniciones requeridas';
  }

  // Bebida
  if (!formData.bebida || !formData.bebida.trim()) {
    newErrors.bebida = 'Bebida requerida';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Limpieza Automática al Escribir
```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, files } = e.target;

  // ... actualizar formData

  // ✅ LIMPIAR ERROR cuando escribe
  setErrors((prev) => ({ ...prev, [name]: '' }));
};
```

### Estilos Condicionales en Input
```typescript
className={`w-full text-xs p-2 rounded-lg border-2 font-semibold focus:outline-none focus:ring-1 transition ${
  errors.nombre
    ? 'border-red-600 bg-red-50 focus:ring-red-100'           // ← CON ERROR
    : 'border-gray-300 bg-white focus:border-red-600 focus:ring-red-100'  // ← SIN ERROR
}`}
```

### Mensaje de Error (Condicional)
```typescript
{errors.nombre && (
  <p className="text-xs text-red-600 font-bold mt-1">
    {errors.nombre}
  </p>
)}
```

---

## 🧪 Casos de Prueba

### Test 1: Guardar sin datos
```
Acción: Click en "Guardar" sin completar nada
Resultado Esperado:
  ❌ Aparecen 6 errores en rojo (los 6 campos requeridos)
  ❌ Modal NO se cierra
  ✅ Puedes seguir editando
```

### Test 2: Guardar con solo espacios en blanco
```
Acción: Escribir "    " (solo espacios) en un campo, click guardar
Resultado Esperado:
  ❌ El campo muestra error "requerido"
  ❌ No se envía aunque parezca que hay algo
  ✅ .trim() valida correctamente
```

### Test 3: PVP con formato incorrecto
```
Acción: Escribir "5.999" (3 decimales), click guardar
Resultado Esperado:
  ❌ Error: "PVP debe tener máximo 2 decimales"
  ❌ No se envía

Acción: Escribir "abc" (no número), click guardar
Resultado Esperado:
  ❌ Error: "PVP debe ser un número válido"
  ❌ No se envía
```

### Test 4: Limpieza de errores
```
Acción: Click guardar (sin datos, muestra errores)
        Escribir algo en un campo
Resultado Esperado:
  ✅ El error de ese campo desaparece inmediatamente
  ❌ Los otros errores siguen visibles
```

### Test 5: Formulario completo válido
```
Acción: Completar todos los campos requeridos correctamente
        Click guardar
Resultado Esperado:
  ✅ Modal se cierra
  ✅ Dashboard muestra el menú actualizado
  ✅ No hay mensajes de error
```

---

## 📊 Comparación Antes vs Después

### ANTES (Sin Validación Profesional)
```
❌ Usuario escribía solo espacios → Se aceptaba
❌ No había feedback visual de errores
❌ PVP sin validación de decimales
❌ Mensajes de error poco claros
❌ Modal se cerraba incluso con datos inválidos
```

### DESPUÉS (Con Validación Profesional)
```
✅ Espacios en blanco son rechazados
✅ Borde rojo + fondo rojo cuando hay error
✅ PVP valida número y máximo 2 decimales
✅ Mensajes claros y específicos
✅ Modal NO se cierra hasta completar correctamente
✅ Errores desaparecen mientras escribes
✅ Consistente con OnboardingRestaurant
```

---

## 🎯 Checklist de Implementación

- [x] Estado `errors` agregado
- [x] Función `validateForm()` implementada
- [x] Función `handleChange()` con limpieza de errores
- [x] Estilos condicionales en todos los inputs requeridos
- [x] Mensajes de error visibles debajo de cada campo
- [x] Validación de `nombre` (requerido, sin espacios)
- [x] Validación de `price` (número, máx 2 decimales)
- [x] Validación de `sopa` (requerida, sin espacios)
- [x] Validación de `proteina` (requerida, sin espacios)
- [x] Validación de `guarniciones` (requeridas, sin espacios)
- [x] Validación de `bebida` (requerida, sin espacios)
- [x] Campos opcionales sin validación (foto, extras, ensalada, postre)
- [x] Limpieza de errores en `resetForm()`
- [x] Documento de estándares creado (VALIDATION_STANDARDS.md)

---

## 🚀 Próximos Pasos

1. **Test Manual**: Abre el dashboard, crea/edita un menú y prueba los 5 casos
2. **Aplicar a otros formularios**: MenuManagement, Profile, etc. (usar como referencia)
3. **Actualizaciones futuras**: Agregar más validaciones si es necesario

---

## 📌 Archivos Relacionados

- **Componente**: `apps/web/src/components/common/RegisterAlmuerzo.tsx`
- **Estándares**: `VALIDATION_STANDARDS.md`
- **Referencia**: `apps/web/src/pages/OnboardingRestaurant.tsx`

---

**Versión**: 1.0
**Estado**: ✅ LISTO PARA PROBAR
**Calidad**: Profesional (patrón consistente con el resto de la app)
