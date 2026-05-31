# 📢 Checkbox de Publicación en Modal de Edición

## ✅ Implementado: Control Profesional de Publicación

**Fecha**: 2026-05-31 | **Componente**: RegisterAlmuerzo.tsx

---

## 🎯 Objetivo

Consolidar **toda la edición** del menú en un solo lugar profesional:
- Editar datos (nombre, PVP, sopa, proteína, etc.)
- Publicar/Despublicar el menú
- Todo en el mismo modal ✅

---

## 📋 Visual del Nuevo Campo

```
┌──────────────────────────────────────────────────────────┐
│ 📢 Estado de Publicación                                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ☐  📌 ✓ PUBLICADO                                      │
│      Este menú está visible en el Tablero de Pedidos   │
│                                                          │
│  o                                                      │
│                                                          │
│  ☑  📌 ⊘ NO PUBLICADO                                   │
│      Este menú está oculto. Publícalo para que          │
│      aparezca en el Tablero                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Uso

### Crear Nuevo Menú
```
1. Click ➕ Registrar
   ↓
2. Modal abre (vacío)
   - isActive = false (por defecto no publicado)
   ↓
3. Completa todos los campos
   ↓
4. OPCIÓN A: Dejar desmarcado = crear sin publicar
   OPCIÓN B: Marcar checkbox = crear y publicar
   ↓
5. Click ✓ Guardar Cambios
   ↓
6. Menú se crea con el estado elegido
```

### Editar Menú Existente
```
1. Click ✎ Editar en la tarjeta del menú
   ↓
2. Modal abre con datos pre-llenados
   - Nombre: "Almuerzo de la Casa"
   - Sopa: "De camarón"
   - Bebida: "Jugo de maracuyá"
   - isActive: TRUE (si estaba publicado)
   ↓
3. OPCIÓN A: Cambiar solo datos, dejar estado igual
   OPCIÓN B: También cambiar estado de publicación
   ↓
4. Click ✓ Guardar Cambios
   ↓
5. Menú se actualiza con cambios + nuevo estado
```

---

## 💻 Código de Referencia

### Interfaz de Datos
```typescript
interface AlmuerzoFormData {
  nombre: string;
  precio: number;
  sopa: string;
  proteina: string;
  guarniciones: string;
  bebida: string;
  // ... otros campos
  isActive?: boolean; // ✅ NUEVO: Estado de publicación
}
```

### Estado Inicial
```typescript
const [formData, setFormData] = useState<AlmuerzoFormData>({
  // ... otros campos
  isActive: false, // ✅ No publicado por defecto
});
```

### Checkbox Renderizado
```tsx
<label className="flex items-center gap-3 cursor-pointer hover:bg-green-50 p-2 rounded-lg transition">
  <input
    type="checkbox"
    name="isActive"
    checked={formData.isActive || false}
    onChange={(e) => {
      setFormData({ ...formData, isActive: e.target.checked });
      setErrors((prev) => ({ ...prev, isActive: '' }));
    }}
    className="w-5 h-5 rounded accent-green-600 cursor-pointer"
  />
  <div>
    <p className="text-xs font-black text-gray-900 uppercase tracking-wider">
      📌 {formData.isActive ? '✓ PUBLICADO' : '⊘ NO PUBLICADO'}
    </p>
    <p className="text-[11px] text-gray-500 font-medium mt-0.5">
      {formData.isActive
        ? 'Este menú está visible en el Tablero de Pedidos'
        : 'Este menú está oculto. Publícalo para que aparezca en el Tablero'}
    </p>
  </div>
</label>
```

---

## 🧪 Casos de Prueba

### Test 1: Crear menú sin publicar
```
1. Click ➕ Registrar
2. Completa campos requeridos
3. Deja checkbox SIN marcar
4. Click ✓ Guardar Cambios
✅ Resultado: Menú aparece en gris (no activo)
```

### Test 2: Crear menú y publicar
```
1. Click ➕ Registrar
2. Completa campos requeridos
3. Marca checkbox ☑️
4. Click ✓ Guardar Cambios
✅ Resultado: Menú aparece en rojo (activo) en el tablero
```

### Test 3: Editar y cambiar publicación
```
1. Click ✎ Editar en un menú NO publicado
2. Modal abre con checkbox sin marcar
3. Marca el checkbox ☑️
4. Click ✓ Guardar Cambios
✅ Resultado: Menú ahora aparece publicado en el tablero
```

### Test 4: Despublicar un menú
```
1. Click ✎ Editar en un menú PUBLICADO
2. Modal abre con checkbox marcado ☑️
3. Desmarca el checkbox
4. Click ✓ Guardar Cambios
✅ Resultado: Menú desaparece del tablero (se oculta)
```

### Test 5: Editar datos sin cambiar publicación
```
1. Click ✎ Editar un menú
2. Cambiar nombre, precio, bebida
3. NO tocar el checkbox (mantener estado igual)
4. Click ✓ Guardar Cambios
✅ Resultado: Datos actualizados, publicación sigue igual
```

---

## 🎨 Estilos Aplicados

### Checkbox Styling
```css
/* Contenedor */
- cursor-pointer: Cursor de mano al pasar
- hover:bg-green-50: Fondo verde claro al pasar
- p-2: Padding cómodo
- rounded-lg: Bordes redondeados
- transition: Animación suave

/* Checkbox Input */
- w-5 h-5: Tamaño 20x20px
- rounded: Bordes redondeados
- accent-green-600: Color verde personalizado ✅
- cursor-pointer: Cursor de mano

/* Texto Principal */
- text-xs font-black: Pequeño y negrita
- text-gray-900: Gris oscuro
- uppercase tracking-wider: MAYÚSCULAS con espaciado

/* Texto Secundario */
- text-[11px]: Muy pequeño
- text-gray-500: Gris medio
- font-medium: Peso medio
```

---

## 🌈 Estados Visuales

### Estado NO PUBLICADO
```
☐  📌 ⊘ NO PUBLICADO
   Este menú está oculto. Publícalo para que aparezca en el Tablero
```
- Checkbox: Vacío ☐
- Icono: ⊘ (Prohibido)
- Texto: GRIS
- Tarjeta en dashboard: GRIS (no resaltada)

### Estado PUBLICADO
```
☑  📌 ✓ PUBLICADO
   Este menú está visible en el Tablero de Pedidos
```
- Checkbox: Marcado ☑️
- Icono: ✓ (Checkmark)
- Texto: VERDE
- Tarjeta en dashboard: ROJO (resaltada, activa)

---

## 📊 Cambios en RestaurantDashboard.tsx

### Al Editar: Pre-llenar isActive
```typescript
setEditingMenu({
  // ... otros campos
  isActive: menu.isActive || false, // ✅ Pasar estado
});
```

### Al Guardar: Usar valor del checkbox
```typescript
const menuPayload = {
  // ... otros campos
  isActive: data.isActive || false, // ✅ Del checkbox
};
```

### Al Actualizar UI: Reflejar cambio
```typescript
setMenus(
  menus.map((m) =>
    m.id === editingMenu.id
      ? {
          ...m,
          // ... otros campos
          isActive: data.isActive || false, // ✅ Actualizar estado
        }
      : m
  )
);
```

---

## ✨ Ventajas de Esta Implementación

| Aspecto | Beneficio |
|--------|----------|
| **UX Profesional** | Todo en un solo lugar |
| **Claridad Visual** | Estados claros con iconos |
| **Flexibilidad** | Editar datos y publicación juntos |
| **Consistencia** | Mismo patrón que otros checkboxes |
| **Validación** | Campos requeridos validados, publicación libre |
| **Eficiencia** | Sin tener que ir a otro lugar a publicar |

---

## 🔗 Relación con Otro Checkbox en Dashboard

**ANTES** (en la tarjeta del menú):
```
☑ Publicar  ← Checkbox de publicación (en la tarjeta)
```

**AHORA** (en el modal de edición):
```
☑ Publicar  ← Mismo checkbox pero en el modal
           ← MÁS profesional: todo junto
```

El checkbox en la tarjeta **PODRÍA eliminarse** o mantenerse para rápido acceso.

---

## 📌 Checklist

- [x] Agregar campo `isActive` a AlmuerzoFormData
- [x] Agregar estado `isActive: false` a formData
- [x] Pre-llenar `isActive` en useEffect
- [x] Reset `isActive` en resetForm
- [x] Crear sección visual profesional
- [x] Checkbox con estilos verdes
- [x] Textos descriptivos claros
- [x] Cambiar estado al hacer check/uncheck
- [x] Pasar `isActive` a RestaurantDashboard
- [x] Usar `isActive` en menuPayload
- [x] Actualizar UI con nuevo `isActive`
- [x] Documentación completada

---

## 🚀 Próximos Pasos

1. **Test**: Prueba crear/editar menúes con diferentes estados de publicación
2. **Opcional**: Considerar eliminar checkbox de la tarjeta (redundante ahora)
3. **Monitor**: Verificar que backend guarde correctamente `isActive`
4. **Feedback**: Ajustar textos si es necesario

---

**Estado**: ✅ LISTO PARA PROBAR
**Calidad**: Profesional y consistente
