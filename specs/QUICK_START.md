# 🚀 QUICK START - Spec-Driven Development

**Para desarrolladores que necesitan empezar YA** | 5 minutos de lectura

---

## 1️⃣ Entiende la Estructura

```
specs/
├── api/              ← REST API endpoints
├── services/         ← Backend business logic
├── frontend/         ← Frontend pages, components, hooks
├── database/         ← Database schema
├── features/         ← End-to-end user flows
├── security/         ← Auth, validation, security
└── INDEX.md          ← Guía completa (léelo después)
```

**Regla de Oro**: Cada carpeta tiene specs `.md` que describen qué y cómo implementar.

---

## 2️⃣ Encuentra Tu Tarea

### Si es un endpoint API:
```
1. Navega a: specs/api/
2. Abre el archivo relevante (ej: reservations.spec.md)
3. Busca tu endpoint
4. Lee: Input, Process, Output, Errors
5. Implementa según la spec
```

**Ejemplo**: Quiero implementar `POST /reservations`
```
→ Abre: specs/api/reservations.spec.md
→ Busca: "Create Reservation"
→ Lee la sección completa
→ Implementa
```

---

### Si es un servicio backend:
```
1. Navega a: specs/services/
2. Abre el archivo relevante (ej: reservation.service.spec.md)
3. Busca tu función
4. Lee: Preconditions, Process, Postconditions, Errors
5. Implementa según la spec
```

**Ejemplo**: Quiero implementar `reservationService.create()`
```
→ Abre: specs/services/reservation.service.spec.md
→ Busca: "create(data, userId)"
→ Lee el algoritmo paso a paso
→ Implementa exactamente así
```

---

### Si es un componente frontend:
```
1. Navega a: specs/frontend/pages/ o specs/frontend/components/
2. Abre el archivo relevante
3. Lee: Functionality, Props, State, Interactions
4. Lee: Error Handling, Data Fetching
5. Implementa
```

**Ejemplo**: Quiero implementar `LoginPage`
```
→ Abre: specs/frontend/pages/login.spec.md
→ Lee qué debe hacer
→ Lee qué hooks/stores usar
→ Lee qué errores manejar
→ Implementa en React
```

---

### Si es un flujo completo:
```
1. Navega a: specs/features/
2. Abre el flujo (ej: customer-order-flow.spec.md)
3. Lee: Qué sucede de inicio a fin
4. Identifica: Qué endpoints/servicios/componentes necesitas
5. Implementa cada parte según sus specs
```

**Ejemplo**: Quiero implementar "Hacer una orden"
```
→ Abre: specs/features/customer-order-flow.spec.md
→ Lee todos los pasos
→ Identifica:
   - Backend: POST /reservations, POST /payments
   - Frontend: Checkout page, Payment page
   - Services: reservationService.create(), paymentService.create()
→ Implementa cada parte
```

---

## 3️⃣ Formato Estándar de una Spec

Cada spec sigue este patrón (búscalo):

```markdown
## [Name]

**Input**: Qué recibe (parámetros, datos)
**Output**: Qué retorna
**Process**: Paso a paso qué hace
**Errors**: Qué excepciones lanza y por qué
**Validation**: Qué reglas se aplican

## Example
Request: {...}
Response: {...}
```

---

## 4️⃣ Checklist: Antes de Implementar

```
[ ] Leí la spec completa
[ ] Entiendo los inputs y outputs
[ ] Entiendo los casos de error
[ ] Entiendo las validaciones
[ ] Entiendo los prerequisitos
[ ] Entiendo cómo se integra con otras partes
[ ] Tengo clara la lógica de negocio
[ ] Sé qué tests escribir
```

Si no puedes marcar todo → **PREGUNTA AL EQUIPO**

---

## 5️⃣ Cómo Implementar

### Pattern: Spec → Tests → Code

```
1. LEER SPEC
   └─ Entender completamente qué debe hacer

2. ESCRIBIR TEST
   └─ Basado en la spec
   └─ Test falla (RED)

3. ESCRIBIR CÓDIGO
   └─ Implementar spec exactamente
   └─ Test pasa (GREEN)

4. REFACTORIZAR
   └─ Mejorar código
   └─ Test sigue pasando

5. VERIFICAR CONTRA SPEC
   └─ Cumple 100%?
   └─ Todos los casos de error?
   └─ Todas las validaciones?
```

### Backend Example (NestJS Service):

```typescript
// 1. Leer spec: specs/services/auth.service.spec.md

// 2. Escribir test (auth.service.spec.ts)
describe('AuthService.signin', () => {
  it('should return user and tokens on valid credentials', async () => {
    const result = await authService.signin('user@example.com', 'password123');
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
  });

  it('should throw UnauthorizedException on invalid password', async () => {
    await expect(
      authService.signin('user@example.com', 'wrongpassword')
    ).rejects.toThrow(UnauthorizedException);
  });
});

// 3. Implementar el servicio
@Injectable()
export class AuthService {
  async signin(email: string, password: string): Promise<AuthResponse> {
    // Buscar usuario
    // Comparar contraseña
    // Generar tokens
    // Retornar respuesta
  }
}

// 4. Refactor si es necesario
// 5. Verificar contra spec: ✅ All cases covered
```

### Frontend Example (React Page):

```typescript
// 1. Leer spec: specs/frontend/pages/login.spec.md

// 2. Escribir test (Login.spec.tsx)
describe('LoginPage', () => {
  it('should display login form', () => {
    render(<LoginPage />);
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  });

  it('should call authService.signin on submit', async () => {
    render(<LoginPage />);
    // fill form & submit
    // expect authService.signin to be called
  });
});

// 3. Implementar página
export const LoginPage = () => {
  const { login } = useAuth();
  // render form
  // handle submit
  // handle errors
  // redirect on success
};

// 4. Test passa
// 5. Verificar contra spec
```

---

## 6️⃣ Errores Comunes

### ❌ "Implementé sin leer la spec"
**Resultado**: Código que no cumple requisitos, merge conflicts
**Solución**: Siempre lee la spec primero

### ❌ "La spec no es clara"
**Resultado**: Implementación incorrecta
**Solución**: Pregunta al equipo O actualiza la spec

### ❌ "Ignoro los casos de error en la spec"
**Resultado**: Bugs en producción
**Solución**: Implementa TODOS los errores listados

### ❌ "No escribo tests"
**Resultado**: No sabes si tu código cumple la spec
**Solución**: Escribe tests primero (TDD)

### ❌ "Cambio la spec para que sea "más fácil""
**Resultado**: Inconsistencia, breaking changes
**Solución**: Discute cambios en el equipo PRIMERO

---

## 7️⃣ Dónde Buscar Cosas

| Necesito... | Busco en... |
|------------|-----------|
| Un endpoint POST | `specs/api/{service}.spec.md` |
| Una función del servicio | `specs/services/{service}.spec.md` |
| Cómo se ve una página | `specs/frontend/pages/{page}.spec.md` |
| Cómo funciona un componente | `specs/frontend/components/{component}.spec.md` |
| Un hook de React | `specs/frontend/hooks/{hook}.spec.md` |
| Una librería del frontend | `specs/frontend/services/{service}.spec.md` |
| Cómo se guardan datos | `specs/database/{table}.spec.md` |
| Cómo se valida entrada | `specs/security/data-validation.spec.md` |
| El flujo completo de algo | `specs/features/{feature}.spec.md` |
| Qué es un término | `specs/GLOSSARY.md` |

---

## 8️⃣ Ciclo de Vida de Implementación

```
1. ASIGNADO TICKET
   ↓
2. LEO SPEC COMPLETA
   ↓
3. ESCRIBO TESTS (basado en spec)
   ↓
4. ESCRIBO CÓDIGO (implemento spec)
   ↓
5. TESTS PASAN ✅
   ↓
6. REVISO CONTRA SPEC (100%?)
   ↓
7. HAGO COMMIT
   ↓
8. CREO PR (referencio spec en descripción)
   ↓
9. CODE REVIEW (verifican contra spec)
   ↓
10. MERGE & DEPLOY
```

---

## 9️⃣ Conversación Típica

```
Dev: "¿Cómo implemento login?"
→ Respuesta: "Abre specs/api/auth.spec.md y specs/services/auth.service.spec.md"

Dev: "¿Qué campos necesita un usuario?"
→ Respuesta: "specs/database/users.spec.md"

Dev: "¿Cuál es la validación de email?"
→ Respuesta: "specs/security/data-validation.spec.md"

Dev: "¿Cómo se ordena una comida?"
→ Respuesta: "specs/features/customer-order-flow.spec.md"
```

---

## 🔟 Próximos Pasos

```
1. Identifica tu tarea
2. Encuentra el spec relevante (usa tabla arriba)
3. Lee el spec 100%
4. Si hay dudas → pregunta
5. Escribe un test basado en la spec
6. Implementa el código
7. Verifica que el test pasa
8. Verifica 100% contra la spec
9. Commit con referencia a la spec
10. PR & review
```

---

## 🎯 Reglas de Oro

1. **La Spec es la Verdad**
   - Tu código debe cumplirla exactamente
   - Si algo no está en la spec → pregunta

2. **Spec Primero, Código Después**
   - Lee la spec antes de escribir línea 1
   - No improvises

3. **Tests Validan la Spec**
   - Si el test pasa = código cumple spec
   - Si el test falla = código viola spec

4. **Specs Evolucionan**
   - Si encuentras un problema → actualiza spec
   - Luego adapta código

5. **Comunica Cambios**
   - Nunca cambles una spec en silencio
   - Siempre discute con el equipo

---

## 📝 Template: Checklist de Implementación

Copia esto a tu tarea:

```markdown
## Implementation Checklist

- [ ] Spec leída completamente
- [ ] Entendí inputs y outputs
- [ ] Entendí validaciones
- [ ] Entendí casos de error
- [ ] Tests escritos (basado en spec)
- [ ] Código implementado
- [ ] Tests pasan ✅
- [ ] Verificado 100% contra spec
- [ ] Commit hecho
- [ ] PR creado
- [ ] Review completado
- [ ] Merged a main
```

---

## 🆘 Ayuda Rápida

### Pregunta: "¿Por dónde empiezo?"
**Respuesta:**
1. Abre `specs/INDEX.md` (2 min)
2. Encuentra tu módulo
3. Abre el `.spec.md` relevante
4. Sigue la guía en el spec

### Pregunta: "¿Qué es lo mínimo que debo hacer?"
**Respuesta:**
1. Leer tu spec
2. Escribir tests
3. Implementar código
4. Pasar tests
5. Verificar contra spec

### Pregunta: "¿Cómo reporto un problema con la spec?"
**Respuesta:**
1. Crea issue en GitHub
2. Linkea la spec
3. Explica el problema
4. Propón solución

### Pregunta: "¿Puedo cambiar la spec?"
**Respuesta:**
```
NO:
- Cambies en silencio ❌
- Hagas un PR sin discutir ❌
- Asumas que es "mejor así" ❌

SÍ:
- Discusses con el equipo ✅
- Creates una propuesta ✅
- Gets approval antes de cambiar ✅
```

---

## ✨ Tips Pro

1. **Markdown Reader**: Usa VS Code Preview para leer specs cómodamente
2. **Search**: Usa Ctrl+F para buscar dentro de las specs
3. **Examples**: Cada spec tiene ejemplos reales - estudialos
4. **Tests First**: Siempre escribe tests antes del código
5. **Review Spec**: Revisa la spec otra vez antes de hacer commit

---

**Última actualización**: 2025-02-05
**Estado**: Production-Ready
**Siguiente paso**: Abre tu spec y empieza! 🚀
