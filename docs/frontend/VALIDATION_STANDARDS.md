# 📋 Estándares de Validación - Almuerza Ya

## Patrón Profesional de Validación de Formularios

Este documento define el estándar de validación para **todos los formularios** en Almuerza Ya. Todos los formularios DEBEN seguir este patrón exacto para mantener consistencia y profesionalismo.

---

## 🎯 Principios

1. **Validación inmediata**: Los errores se limpian cuando el usuario escribe
2. **Feedback visual**: Campos con error tienen borde rojo + fondo rojo claro
3. **Mensajes claros**: Texto en rojo debajo del campo explicando el error
4. **Prevención**: No se permite enviar si hay errores
5. **Trim automático**: Espacios en blanco al inicio/final se ignoran

---

## 📐 Estructura del Estado

```typescript
const [formData, setFormData] = useState({
  // ... todos los campos del formulario
});

const [errors, setErrors] = useState<Record<string, string>>({});
// Objeto que almacena mensajes de error por campo
// Ejemplo: { nombre: 'Campo requerido', email: 'Email inválido' }
```

---

## 🔄 Funciones Requeridas

### 1. **handleChange** - Limpiar errores al escribir

```typescript
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  // ✅ IMPORTANTE: Limpiar error del campo cuando escribe
  setErrors((prev) => ({ ...prev, [name]: '' }));
};
```

**Propósito**: Cuando el usuario empieza a escribir, el error desaparece inmediatamente (mejor UX).

---

### 2. **validateForm** - Validar antes de enviar

```typescript
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  // Validación 1: Campo requerido (NO vacío, NO solo espacios)
  if (!formData.nombre || !formData.nombre.trim()) {
    newErrors.nombre = 'Nombre del menú requerido';
  }

  // Validación 2: Número con 2 decimales
  if (!formData.price || isNaN(parseFloat(formData.price as any))) {
    newErrors.price = 'PVP debe ser un número válido';
  } else if (!/^\d+(\.\d{1,2})?$/.test(formData.price.toString())) {
    newErrors.price = 'PVP debe tener máximo 2 decimales (ej: 5.99)';
  }

  // Validación 3: Sopa requerida
  if (!formData.sopa || !formData.sopa.trim()) {
    newErrors.sopa = 'Nombre de la sopa requerido';
  }

  // Validación 4: Proteína requerida
  if (!formData.proteina || !formData.proteina.trim()) {
    newErrors.proteina = 'Proteína principal requerida';
  }

  // Validación 5: Guarniciones requeridas
  if (!formData.guarniciones || !formData.guarniciones.trim()) {
    newErrors.guarniciones = 'Guarniciones requeridas';
  }

  // Validación 6: Bebida requerida
  if (!formData.bebida || !formData.bebida.trim()) {
    newErrors.bebida = 'Bebida requerida';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

**Reglas**:
- ✅ Campo vacío → Error requerido
- ✅ Solo espacios → Error requerido (usar `.trim()`)
- ✅ Número inválido → Error específico
- ✅ Formato incorrecto → Error específico

---

## 🎨 Estilos Condicionales del Input

**Patrón CSS para inputs con validación:**

```typescript
className={`w-full text-xs p-2 rounded-lg border-2 font-semibold focus:outline-none focus:ring-1 transition ${
  errors.nombre
    ? 'border-red-600 bg-red-50 focus:ring-red-100'           // ← CON ERROR
    : 'border-gray-300 bg-white focus:border-red-600 focus:ring-red-100'  // ← SIN ERROR
}`}
```

**Componentes del estilo**:
- `border-2` → Borde de 2px (visible)
- `border-red-600` → Rojo cuando hay error
- `bg-red-50` → Fondo rojo CLARO cuando hay error
- `focus:border-red-600` → Enfoque rojo siempre
- `focus:ring-red-100` → Outline rojo claro

---

## 💬 Mensaje de Error Debajo del Campo

**Renderizar solo si existe error:**

```typescript
{errors.nombre && (
  <p className="text-xs text-red-600 font-bold mt-1">
    {errors.nombre}
  </p>
)}
```

**Estilos del mensaje**:
- `text-xs` → Pequeño
- `text-red-600` → Color rojo
- `font-bold` → Negrita para visibilidad
- `mt-1` → Margen superior pequeño

---

## 🔐 Validaciones Comunes

### Campo Requerido (Texto)
```typescript
if (!formData.fieldName || !formData.fieldName.trim()) {
  newErrors.fieldName = 'Campo requerido';
}
```

### Número con 2 Decimales (PVP)
```typescript
if (!formData.price || isNaN(parseFloat(formData.price as any))) {
  newErrors.price = 'PVP debe ser un número válido';
} else if (!/^\d+(\.\d{1,2})?$/.test(formData.price.toString())) {
  newErrors.price = 'PVP debe tener máximo 2 decimales';
}
```

### Email Válido
```typescript
if (!formData.email || !isValidEmail(formData.email)) {
  newErrors.email = 'Email inválido (ej: usuario@dominio.com)';
}
```

### Longitud Mínima
```typescript
if (formData.password && formData.password.length < 8) {
  newErrors.password = 'Mínimo 8 caracteres';
}
```

### Confirmación de Contraseña
```typescript
if (formData.password !== formData.confirmPassword) {
  newErrors.confirmPassword = 'Las contraseñas no coinciden';
}
```

---

## 📝 Flujo Completo de Validación

```
1. Usuario escribe en campo
        ↓
2. onChange → handleChange limpia error del campo
        ↓
3. Usuario hace click en "Guardar"
        ↓
4. onClick → validateForm valida TODOS los campos
        ↓
5. Si hay errores → Mostrar errores, NO enviar
        ↓
6. Si NO hay errores → Enviar datos al backend
```

---

## ✅ Checklist para Nuevos Formularios

Cuando crees un nuevo formulario, asegúrate de:

- [ ] Crear estado `errors`: `useState<Record<string, string>>({})`
- [ ] Implementar `handleChange` que limpia errores
- [ ] Implementar `validateForm` con todas las validaciones
- [ ] Llamar `validateForm()` antes de enviar
- [ ] Todos los inputs tienen clases condicionales (con/sin error)
- [ ] Todos los campos requeridos tienen mensaje de error debajo
- [ ] El botón submit solo funciona si `validateForm()` retorna true
- [ ] Usar mismo color rojo (`red-600`) para errores
- [ ] Usar mismo fondo claro (`bg-red-50`) para errores

---

## 🎯 Campos Requeridos por Formulario

### RegisterAlmuerzo (Crear/Editar Menú)
**REQUERIDOS SIEMPRE:**
- ✅ Nombre del Menú
- ✅ PVP (formato: número con máx 2 decimales)
- ✅ Nombre de la Sopa
- ✅ Proteína Principal
- ✅ Guarniciones
- ✅ Bebida

**OPCIONALES:**
- ⭕ Foto/Imagen
- ⭕ Extras de Sopa
- ⭕ Ensalada
- ⭕ Postre

---

## 📌 Ejemplo Completo

Ver `apps/web/src/pages/OnboardingRestaurant.tsx` como referencia implementada correctamente.

---

## 🚀 Aplicación Inmediata

Este patrón debe aplicarse a:
1. **RegisterAlmuerzo** ← EN PROGRESO
2. MenuManagement (futuro)
3. Profile (futuro)
4. Cualquier nuevo formulario

---

**Versión**: 1.0
**Fecha**: 2026-05-31
**Estado**: Activo
