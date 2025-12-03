# 📚 Guía de Pruebas con Swagger - EcoShop API

Esta guía te ayudará a probar todos los endpoints de la API usando Swagger UI.

## 🚀 Acceso a Swagger

1. **Inicia el servidor:**
   ```
   npm run start
   ```

2. **Abre Swagger en tu navegador:**
   ```
   http://localhost:8080/api/docs
   ```

## 🔑 Autenticación con JWT

La mayoría de los endpoints requieren autenticación. Sigue estos pasos:

### Paso 1: Registra o inicia sesión

Dependiendo del rol que quieras probar, usa uno de estos endpoints:

#### **Para Clientes:**
- **Endpoint:** `POST /api/cliente/registro`
- **Body ejemplo:**
  ```json
  {
    "email": "cliente@test.com",
    "password": "Password123!",
    "name": "Juan Pérez"
  }
  ```

#### **Para Vendedores/Marcas:**
- **Endpoint:** `POST /api/marcas/registro`
- **Body ejemplo:**
  ```json
  {
    "email": "vendedor@ecobrand.com",
    "password": "Password123!",
    "brandName": "EcoBrand"
  }
  ```

### Paso 2: Obtén el token

Después de registrarte o hacer login, recibirás una respuesta como esta:

```json
{
  "message": "User registered successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "cliente@test.com",
    "name": "Juan Pérez",
    "role": "client"
  }
}
```

**Copia el `accessToken`** (todo el texto después de "accessToken" sin las comillas).

### Paso 3: Autorízate en Swagger

1. Busca el botón **🔒 Authorize** en la parte superior derecha de Swagger
2. Haz clic en él
3. Pega el token en el campo **Value**
4. Haz clic en **Authorize**
5. Cierra el modal haciendo clic en **Close**

✅ **¡Listo!** Ahora puedes usar todos los endpoints protegidos (los que tienen un candado 🔒) si pusiste un idtoken de cliente solo podras 
hacer uso de los edpoint de cliente yviceversa para vendedor si quieres acceder a los edpoonts de vendedor tendras que poner el idtoken que te genero al crear la cuenta de vendedor.

---

## 📋 Flujos de Prueba por Rol

### 🛍️ Flujo de Cliente

1. **Registro/Login** → `POST /api/cliente/registro` o `/api/cliente/login`
2. **Ver productos** → `GET /api/productos` (no requiere auth)
3. **Agregar al carrito** → `POST /api/carrito/add` 🔒
   ```json
   {
     "productId": "ID_DEL_PRODUCTO",
     "quantity": 2
   }
   ```
4. **Ver carrito** → `GET /api/carrito` 🔒
5. **Crear orden** → `POST /api/ordenes` 🔒
6. **Ver mis órdenes** → `GET /api/ordenes` 🔒

### 🏪 Flujo de Vendedor

1. **Registro/Login** → `POST /api/marcas/registro` o `/api/marcas/login`
2. **Crear producto** → `POST /api/productos` 🔒
   ```json
   {
     "brand": "EcoBrand",
     "name": "Producto Ecológico",
     "price": 29.99,
     "description": "Descripción del producto",
     "category": "electronics",
     "imageUrl": "https://example.com/image.jpg",
     "stock": 100,
     "originCountry": "España",
     "materials": ["reciclado", "orgánico"],
     "isActive": true
   }
   ```
3. **Ver mis productos** → `GET /api/productos/mios` 🔒
4. **Agregar certificación** → `POST /api/certificaciones` 🔒
   ```json
   {
     "product": "ID_DEL_PRODUCTO",
     "type": "organic",
     "iconUrl": "https://example.com/icon.svg"
   }
   ```
5. **Agregar métrica de impacto** → `POST /api/impacto` 🔒
   ```json
   {
     "product": "ID_DEL_PRODUCTO",
     "type": "carbon-footprint",
     "value": 2.5,
     "unit": "kg CO2"
   }
   ```
6. **Actualizar producto** → `PATCH /api/productos/{id}` 🔒
7. **Eliminar producto** → `DELETE /api/productos/{id}` 🔒

 🔒

---

## 🎯 Endpoints Públicos (No requieren autenticación)

Estos endpoints puedes probarlos sin hacer login:

- ✅ `GET /health` - Health check
- ✅ `GET /api/productos` - Listar productos activos
- ✅ `GET /api/productos/{id}` - Ver detalle de un producto
- ✅ `GET /api/certificaciones/{productId}` - Ver certificaciones de un producto
- ✅ `GET /api/impacto/{productId}` - Ver métricas de impacto de un producto
- ✅ `POST /api/cliente/registro` - Registro de cliente
- ✅ `POST /api/cliente/login` - Login de cliente
- ✅ `POST /api/marcas/registro` - Registro de vendedor
- ✅ `POST /api/marcas/login` - Login de vendedor

> **Nota:** El endpoint `/api/auth` existe pero es para propósitos internos. Usa `/api/cliente` o `/api/marcas` para registro/login.

---

## 🔒 Endpoints Protegidos (Requieren autenticación)

Estos endpoints requieren que estés autenticado. Verás un candado 🔒 junto a ellos:

### Cliente (role: "client")
- `POST /api/carrito/add` - Agregar al carrito
- `GET /api/carrito` - Ver mi carrito
- `POST /api/ordenes` - Crear orden
- `GET /api/ordenes` - Ver mis órdenes

### Vendedor (role: "seller")
- `POST /api/productos` - Crear producto
- `GET /api/productos/mios` - Ver mis productos
- `PATCH /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto
- `POST /api/certificaciones` - Crear certificación
- `PATCH /api/certificaciones/{certificationId}` - Actualizar certificación
- `DELETE /api/certificaciones/{certificationId}` - Eliminar certificación
- `POST /api/impacto` - Crear métrica de impacto
- `PATCH /api/impacto/{metricId}` - Actualizar métrica
- `DELETE /api/impacto/{metricId}` - Eliminar métrica

---

## 📌 Tips Importantes

### ✅ Cosas a tener en cuenta:

1. **Token sin "Bearer":** Cuando pegues el token en Swagger, NO agregues "Bearer " al inicio, solo pega el token directamente.

2. **IDs de Productos:** Para probar endpoints que requieren IDs (como agregar al carrito), primero:
   - Usa `GET /api/productos` para ver los productos disponibles
   - Copia el `id` de un producto
   - Úsalo en los otros endpoints

3. **Roles correctos:** Asegúrate de usar el token correcto para cada endpoint:
   - Token de **cliente** para carrito y órdenes
   - Token de **vendedor** para crear/editar productos

4. **Stock de productos:** Antes de crear una orden, verifica que los productos tengan stock suficiente.

5. **Persistencia de autorización:** Swagger guarda tu token, así que no necesitas autenticarte cada vez que recargues la página.

---

## 🐛 Solución de Problemas Comunes

### ❌ Error 401 (Unauthorized)
**Causa:** Token inválido o expirado.  
**Solución:** Haz login nuevamente y actualiza el token en Swagger.

### ❌ Error 403 (Forbidden)
**Causa:** Estás usando un token con el rol incorrecto.  
**Solución:** Usa un token del rol correcto (ej: token de vendedor para crear productos).

### ❌ Error 404 (Not Found)
**Causa:** El endpoint o el recurso no existe.  
**Solución:** Verifica la URL y que el ID del recurso sea correcto.

### ❌ Error 400 (Bad Request)
**Causa:** Datos de entrada inválidos.  
**Solución:** Revisa el schema del endpoint y asegúrate de enviar todos los campos requeridos con el formato correcto.

### ❌ No aparece el botón "Authorize"
**Causa:** Caché del navegador.  
**Solución:** Recarga la página con `Ctrl + F5` o borra la caché.

---

## 📞 Contacto

Si tienes problemas o dudas, contacta al equipo de backend.

---

**Última actualización:** Diciembre 2, 2025
