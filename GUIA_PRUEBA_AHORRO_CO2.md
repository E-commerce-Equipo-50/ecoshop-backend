# 🌱 Guía Paso a Paso: Prueba del Ahorro de CO₂ en Postman

Esta guía te llevará desde cero hasta ver el cálculo del ahorro de CO₂ en una orden.

---

## 📋 Requisitos Previos

1. **Servidor corriendo:**
   ```bash
   npm run start
   ```

2. **Postman instalado**

3. **URL base:** `http://localhost:3000/api`

---

## 🎯 Paso 1: Crear un Vendedor

### Endpoint
```
POST http://localhost:3000/api/marcas/registro
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "email": "vendedor@ecoshop.com",
  "password": "Password123!",
  "brandName": "EcoMarca"
}
```

### ✅ Respuesta Esperada
```json
{
  "access_token": "eyJhbGc...",
  "seller": {
    "_id": "675abc123...",
    "email": "vendedor@ecoshop.com",
    "brandName": "EcoMarca",
    "role": "seller"
  }
}
```

**🔑 Guarda el `access_token` del vendedor**

---

## 🎯 Paso 2: Crear Productos (como Vendedor)

### Endpoint
```
POST http://localhost:3000/api/product
```

### Headers
```
Content-Type: application/json
Authorization: Bearer <TOKEN_DEL_VENDEDOR>
```

### Body - Producto 1: BOXER
```json
{
  "name": "Boxer Ecológico",
  "description": "Fabricado con algodón reciclado",
  "price": 25.99,
  "stock": 100,
  "category": "Ropa Interior",
  "images": ["https://example.com/boxer.jpg"],
  "isActive": true
}
```

### ✅ Respuesta
```json
{
  "_id": "675product1...",
  "name": "Boxer Ecológico",
  "price": 25.99,
  ...
}
```

**💾 Guarda el `_id` del producto (lo llamaremos `BOXER_ID`)**

---

### Repite para más productos

**Body - Producto 2: JABÓN**
```json
{
  "name": "Jabón Natural",
  "description": "Jabón artesanal sin químicos",
  "price": 8.50,
  "stock": 200,
  "category": "Cuidado Personal",
  "images": ["https://example.com/jabon.jpg"],
  "isActive": true
}
```

**💾 Guarda el `_id` (JABON_ID)**

**Body - Producto 3: CREMA**
```json
{
  "name": "Crema Facial Orgánica",
  "description": "Crema hidratante vegana",
  "price": 45.00,
  "stock": 50,
  "category": "Cuidado Personal",
  "images": ["https://example.com/crema.jpg"],
  "isActive": true
}
```

**💾 Guarda el `_id` (CREMA_ID)**

---

## 🎯 Paso 3: Crear Métricas de Impacto (como Vendedor)

Aquí es donde defines el ahorro de CO₂.

### Endpoint
```
POST http://localhost:3000/api/impact-metric
```

### Headers
```
Content-Type: application/json
Authorization: Bearer <TOKEN_DEL_VENDEDOR>
```

---

### Body - Métrica para BOXER
```json
{
  "productId": "BOXER_ID",
  "type": "CO2",
  "value": 1.5,
  "comparison_value": 5.0,
  "unit": "kg CO2e"
}
```

**📊 Interpretación:**
- `value: 1.5` → Tu boxer eco genera 1.5 kg de CO₂
- `comparison_value: 5.0` → Un boxer estándar genera 5.0 kg de CO₂
- **Ahorro por unidad:** 5.0 - 1.5 = **3.5 kg CO₂e**

---

### Body - Métrica para JABÓN
```json
{
  "productId": "JABON_ID",
  "type": "CO2",
  "value": 0.3,
  "comparison_value": 0.8,
  "unit": "kg CO2e"
}
```

**📊 Ahorro por unidad:** 0.8 - 0.3 = **0.5 kg CO₂e**

---

### Body - Métrica para CREMA
```json
{
  "productId": "CREMA_ID",
  "type": "CO2",
  "value": 0.5,
  "comparison_value": 1.2,
  "unit": "kg CO2e"
}
```

**📊 Ahorro por unidad:** 1.2 - 0.5 = **0.7 kg CO₂e**

---

### 💡 Opcional: Agregar más métricas

Puedes agregar métricas de agua, energía, etc. para cada producto:

```json
{
  "productId": "BOXER_ID",
  "type": "WATER",
  "value": 50,
  "comparison_value": 200,
  "unit": "litros"
}
```

---

## 🎯 Paso 4: Crear un Cliente

### Endpoint
```
POST http://localhost:3000/api/cliente/registro
```

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "email": "cliente@test.com",
  "password": "Password123!",
  "name": "María González"
}
```

### ✅ Respuesta
```json
{
  "access_token": "eyJhbGc...",
  "customer": {
    "_id": "675customer1...",
    "email": "cliente@test.com",
    "name": "María González",
    "role": "client"
  }
}
```

**🔑 Guarda el `access_token` del cliente**

---

## 🎯 Paso 5: Agregar Productos al Carrito (como Cliente)

### Endpoint
```
POST http://localhost:3000/api/cart/items
```

### Headers
```
Content-Type: application/json
Authorization: Bearer <TOKEN_DEL_CLIENTE>
```

---

### Body - Agregar 1 BOXER
```json
{
  "productId": "BOXER_ID",
  "quantity": 1
}
```

---

### Body - Agregar 1 JABÓN
```json
{
  "productId": "JABON_ID",
  "quantity": 1
}
```

---

### Body - Agregar 2 CREMAS
```json
{
  "productId": "CREMA_ID",
  "quantity": 2
}
```

---

## 🎯 Paso 6: Crear la Orden (como Cliente)

### Endpoint
```
POST http://localhost:3000/api/order/from-cart
```

### Headers
```
Authorization: Bearer <TOKEN_DEL_CLIENTE>
```

### Body
```
(vacío - no necesitas enviar nada)
```

---

## 🎉 Paso 7: Ver el Resultado con Ahorro de CO₂

### ✅ Respuesta Esperada

```json
{
  "order": {
    "_id": "675order1...",
    "customer": "675customer1...",
    "status": "pending",
    "total": 125.99,
    "createdAt": "2025-12-03T...",
    "updatedAt": "2025-12-03T..."
  },
  "items": [
    {
      "product": {
        "name": "Boxer Ecológico",
        "price": 25.99
      },
      "quantity": 1,
      "subtotal": 25.99
    },
    {
      "product": {
        "name": "Jabón Natural",
        "price": 8.50
      },
      "quantity": 1,
      "subtotal": 8.50
    },
    {
      "product": {
        "name": "Crema Facial Orgánica",
        "price": 45.00
      },
      "quantity": 2,
      "subtotal": 90.00
    }
  ],
  "impactSummary": [
    {
      "type": "CO2",
      "unit": "kg CO2e",
      "totalValue": 2.3
    },
    {
      "type": "CO2",
      "unit": "kg CO2e ahorrados",
      "totalValue": 4.9
    }
  ]
}
```

---

## 📊 Desglose del Cálculo

### CO₂ Generado (totalValue: 2.3)
```
BOXER:  1.5 kg × 1 = 1.5 kg
JABÓN:  0.3 kg × 1 = 0.3 kg
CREMA:  0.5 kg × 2 = 1.0 kg
─────────────────────────
TOTAL GENERADO:     2.3 kg CO₂e
```

### CO₂ Ahorrado (totalValue: 4.9)
```
BOXER:  (5.0 - 1.5) × 1 = 3.5 kg
JABÓN:  (0.8 - 0.3) × 1 = 0.5 kg
CREMA:  (1.2 - 0.5) × 2 = 1.4 kg
─────────────────────────────
TOTAL AHORRADO:         4.9 kg CO₂e
```

---

## 🎯 Paso 8 (Opcional): Ver Todas las Órdenes del Cliente

### Endpoint
```
GET http://localhost:3000/api/order/customer
```

### Headers
```
Authorization: Bearer <TOKEN_DEL_CLIENTE>
```

### ✅ Respuesta
Verás un array con todas las órdenes, cada una con su `impactSummary` y ahorro de CO₂.

---

## 🌍 Mensaje Final para el Frontend

Usa el campo `impactSummary` con `unit: "kg CO2e ahorrados"` para mostrar:

```
🌱 ¡Tu compra evitó 4.9 kg de CO₂!
   Gracias por elegir productos sostenibles.
```

---

## 🔧 Troubleshooting

### ❌ "Product not found"
- Verifica que los IDs de productos sean correctos
- Asegúrate de usar el token del vendedor para crear productos

### ❌ "Cart is empty"
- Agrega productos al carrito antes de crear la orden
- Usa el token del cliente para agregar items

### ❌ No veo el ahorro de CO₂
- Verifica que creaste las métricas con `comparison_value`
- Asegúrate de que `type: "CO2"` esté en las métricas
- El ahorro solo aparece si `comparison_value > value`

### ❌ Error 401 Unauthorized
- Verifica que el token sea válido
- Asegúrate de usar `Bearer` antes del token
- Los tokens expiran, genera uno nuevo si es necesario

---

## 📝 Resumen de Endpoints Usados

1. `POST /api/marcas/registro` - Crear vendedor
2. `POST /api/product` - Crear productos (3 veces)
3. `POST /api/impact-metric` - Crear métricas (3 veces)
4. `POST /api/cliente/registro` - Crear cliente
5. `POST /api/cart/items` - Agregar al carrito (3 veces)
6. `POST /api/order/from-cart` - Crear orden
7. `GET /api/order/customer` - Ver órdenes

---

## 🎓 Conceptos Clave

- **value**: CO₂ que genera tu producto eco
- **comparison_value**: CO₂ que genera el producto estándar
- **Ahorro**: `comparison_value - value`
- **Total Ahorrado**: Suma de ahorros de todos los productos × cantidades

¡Listo! Ahora tienes un sistema completo de ahorro de CO₂. 🌱
