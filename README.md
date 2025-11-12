# 🌱 EcoShop E-commerce Platform - Backend - Equipo 50

> Plataforma de e-commerce sostenible que integra indicadores de impacto ambiental, educación sobre consumo responsable y trazabilidad de productos ecológicos.

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Objetivo](#objetivo)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requerimientos Funcionales](#requerimientos-funcionales)
- [Flujo de Trabajo con Git](#flujo-de-trabajo-con-git)
- [Estándares de Código](#estándares-de-código)
- [Variables de Entorno](#variables-de-entorno)
- [Contribuciones](#contribuciones)

---

## 📌 Descripción del Proyecto

**EcoShop** es una plataforma de e-commerce diseñada para marcas sostenibles que buscan no solo vender productos, sino también medir, visualizar y comunicar el impacto ambiental de cada compra.

### Sector
E-commerce de Sostenibilidad

### Necesidad del Cliente
Marcas sostenibles requieren una tienda online ecológica con un enfoque educativo y transparente que fortalezca la confianza de los consumidores y promueva decisiones de compra responsables.

---

## 🎯 Objetivo

Desarrollar una plataforma web de comercio electrónico sostenible que integre:

- ✅ Indicadores de impacto ambiental por producto (huella de carbono, materiales, origen, transporte)
- ✅ Trazabilidad completa de productos
- ✅ Experiencia de usuario fluida y moderna
- ✅ Panel administrativo para marcas
- ✅ Integración con pasarelas de pago seguras
- ✅ Reportes visuales de impacto ecológico

---

## 🛠️ Stack Tecnológico

### Backend Framework
- **NestJS** (^11.0.1) - Framework TypeScript progresivo
- **TypeScript** (^5.7.3) - Tipado estático

### Base de Datos
- **MongoDB** - Base de datos NoSQL
- **Mongoose** (^8.19.3) - ODM para MongoDB

### Autenticación
- **JWT (@nestjs/jwt)** (^11.0.1) - JSON Web Tokens
- **Passport** (^0.7.0) - Autenticación flexible
- **Bcrypt** (^6.0.0) - Encriptación de contraseñas
- **Passport-JWT** (^4.0.1) - Estrategia JWT

### Validación
- **class-validator** (^0.14.2) - Validación de DTOs
- **class-transformer** (^0.5.1) - Transformación de objetos

### Herramientas de Desarrollo
- **ESLint** + **Prettier** - Linting y formateado
- **Jest** (^30.0.0) - Testing
- **Supertest** (^7.0.0) - Testing de HTTP
- **ts-jest** - Soporte TypeScript en Jest

### Configuración
- **@nestjs/config** (^4.0.2) - Gestión de variables de entorno

---

## 📦 Requisitos Previos

- **Node.js** >= 18.x
- **pnpm** >= 8.x (recomendado) o **npm** >= 9.x
- **MongoDB** (local o Atlas)
- **Git** para control de versiones

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd ecommerce
```

### 2. Instalar dependencias

```bash
pnpm install
# o
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
MONGO_URI=mongodb://localhost:27017/ecoshop
# o para MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecoshop

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Puerto
PORT=3000

# Entorno
NODE_ENV=development
```

### 4. Iniciar el servidor

```bash
# Desarrollo (con hot reload)
pnpm start:dev

# Producción
pnpm start
```

Por defecto, el servidor estará disponible en `http://localhost:3000`

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm start              # Inicia el servidor
pnpm start:dev         # Inicia en modo desarrollo con watch
pnpm start:debug       # Inicia en modo debug
pnpm start:prod        # Inicia versión compilada

# Compilación
pnpm build             # Compila el proyecto a ./dist

# Testing
pnpm test              # Ejecuta tests unitarios
pnpm test:watch       # Tests en modo watch
pnpm test:cov         # Tests con cobertura
pnpm test:e2e         # Tests end-to-end
pnpm test:debug       # Tests en modo debug

# Calidad de Código
pnpm lint              # Ejecuta ESLint y corrige
pnpm format            # Formatea código con Prettier
```

---

## 📁 Estructura del Proyecto

```
src/
├── auth/                      # Módulo de autenticación
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── *.spec.ts             # Tests unitarios
│
├── users/                     # Módulo de usuarios
│   ├── users.service.ts
│   ├── users.module.ts
│   └── *.spec.ts
│
├── common/                    # Utilidades compartidas
│   ├── middlewares/           # Middlewares globales
│   └── utils/                 # Funciones auxiliares
│       └── hash.utils.ts
│
├── app.controller.ts          # Controlador raíz
├── app.service.ts             # Servicio raíz
├── app.module.ts              # Módulo raíz
└── main.ts                    # Punto de entrada

test/                          # Tests E2E
├── app.e2e-spec.ts
└── jest-e2e.json

dist/                          # Compilado (generado)
coverage/                      # Cobertura de tests (generado)
```

---

## 🔧 Requerimientos Funcionales

### 1. Autenticación y Usuarios
- [ ] Registro de usuarios (clientes y marcas)
- [ ] Login con JWT
- [ ] Validación de email
- [ ] Recuperación de contraseña
- [ ] Refresh tokens

### 2. Catálogo de Productos
- [ ] CRUD de productos
- [ ] Filtrado por sostenibilidad
- [ ] Búsqueda avanzada
- [ ] Datos ambientales por producto

### 3. Carrito y Checkout
- [ ] Gestión del carrito
- [ ] Cálculo de huella de carbono por pedido
- [ ] Proceso de checkout
- [ ] Integración con pasarelas de pago

### 4. Panel de Administración
- [ ] Gestión de inventario
- [ ] Métricas de vendedor
- [ ] Reportes de impacto ambiental
- [ ] Gestión de certificaciones

### 5. Indicadores de Impacto Ambiental
- [ ] Cálculo de huella de carbono
- [ ] Eco-badges y niveles de sostenibilidad
- [ ] Reportes visuales
- [ ] Comparativa entre productos

### 6. Funcionalidades Bonus
- [ ] Eco-wallet (puntos verdes)
- [ ] Modo comparativo de impacto
- [ ] Contenido educativo sobre consumo responsable

---

## 🌿 Flujo de Trabajo con Git

### Estrategia de Ramas

```
main (producción)
  ↑
develop (pre-producción)
  ↑
feature/* (nuevas funcionalidades)
bugfix/* (correcciones de bugs)
hotfix/* (urgentes en producción)
```

### Convenciones de Rama

```bash
# Nuevas funcionalidades
git checkout -b feature/nombre-funcionalidad

# Correcciones
git checkout -b bugfix/descripcion-bug

# Correcciones urgentes en producción
git checkout -b hotfix/descripcion-urgente

# Ejemplos
git checkout -b feature/carrito-productos
git checkout -b bugfix/validacion-email
git checkout -b hotfix/seguridad-jwt
```

### Flujo de Trabajo Típico

1. **Crear rama desde `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/mi-funcionalidad
   ```

2. **Desarrollar y hacer commits**
   ```bash
   git add .
   git commit -m "feat: agregar funcionalidad X"
   ```

3. **Push a la rama**
   ```bash
   git push origin feature/mi-funcionalidad
   ```

4. **Crear Pull Request** hacia `develop`
   - Asignar reviewers
   - Esperar aprobación

5. **Mergear a `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git merge feature/mi-funcionalidad
   git push origin develop
   ```

6. **Eliminar rama local y remota**
   ```bash
   git branch -d feature/mi-funcionalidad
   git push origin --delete feature/mi-funcionalidad
   ```

### Mensajes de Commit

Usar formato convencional:

```
<tipo>(<alcance>): <descripción>

<cuerpo opcional>

<pie de página opcional>
```

**Tipos:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no funcionalidad)
- `refactor:` Refactorización de código
- `perf:` Mejoras de rendimiento
- `test:` Agregación o modificación de tests
- `chore:` Cambios en build, dependencies, etc.

**Ejemplos:**
```
feat(auth): agregar autenticación con JWT
fix(products): corregir cálculo de huella de carbono
docs(readme): actualizar instrucciones de instalación
```

---

## 📏 Estándares de Código

### Convenciones

- **Lenguaje:** TypeScript estricto
- **Formato:** Prettier con ancho 80 caracteres
- **Linting:** ESLint con reglas de NestJS

### Estructura de Módulos

```typescript
// module.ts
import { Module } from '@nestjs/common';
import { MyController } from './my.controller';
import { MyService } from './my.service';

@Module({
  controllers: [MyController],
  providers: [MyService],
  exports: [MyService],
})
export class MyModule {}
```

### DTOs (Data Transfer Objects)

```typescript
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

### Servicios

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class MyService {
  constructor() {}

  // implementar métodos
}
```

### Tests

- Usar Jest con `describe` y `it`
- Un archivo `.spec.ts` por clase
- Mínimo 70% de cobertura

---

## 🔐 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGO_URI` | Conexión a MongoDB | `mongodb://localhost:27017/ecoshop` |
| `JWT_SECRET` | Clave secreta JWT | `your_secret_key_min_32_chars` |
| `EXPIRES_IN` | Expiración del token | `24h`, `7d`, `60s` |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno | `development`, `production` |

---

## 🤝 Contribuciones

### Antes de hacer Push

1. **Ejecutar tests**
   ```bash
   pnpm test
   ```

2. **Verificar linting**
   ```bash
   pnpm lint
   ```

3. **Formatear código**
   ```bash
   pnpm format
   ```

### Checklist de PR

- [ ] Tests pasando (`pnpm test`)
- [ ] Linting correcto (`pnpm lint`)
- [ ] Código formateado (`pnpm format`)
- [ ] Documentación actualizada
- [ ] Mensajes de commit claros
- [ ] Sin console.log en código

---

## 📞 Contacto y Soporte

Para dudas o problemas, comunícate con el equipo de desarrollo.

---

**Última actualización:** Noviembre 2025 | **Versión:** 0.0.1
