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

Aquí es donde defines el ahorro de CO₂ **y otras métricas ambientales**.

### 🆕 Nuevo: Sistema de Eco-Score con Múltiples Métricas

El sistema ahora soporta múltiples métricas para calcular un **Eco-Score compuesto** que te da un badge basado en el impacto general del producto:

- 🌳 **Máximo Impacto Positivo** (80-100 puntos)
- 🌿 **Bajo Impacto General** (60-79 puntos)
- 🌱 **Impacto Medio** (40-59 puntos)
- 🟡 **Impacto Estándar** (0-39 puntos)

**Pesos de métricas:**
- CO₂: 50%
- WATER: 30%
- ENERGY: 15%
- RECYCLED: 5%

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

### Body - Métricas Completas para BOXER (Recomendado)

**Métrica 1: CO₂**
```json
{
  "productId": "BOXER_ID",
  "type": "CO2",
  "value": 1.5,
  "comparison_value": 5.0,
  "unit": "kg CO2e"
}
```

**Métrica 2: Agua**
```json
{
  "productId": "BOXER_ID",
  "type": "WATER",
  "value": 50,
  "comparison_value": 200,
  "unit": "litros"
}
```

**Métrica 3: Energía**
```json
{
  "productId": "BOXER_ID",
  "type": "ENERGY",
  "value": 2.0,
  "comparison_value": 8.0,
  "unit": "kWh"
}
```

**Métrica 4: Material Reciclado**
```json
{
  "productId": "BOXER_ID",
  "type": "RECYCLED",
  "value": 80,
  "comparison_value": 100,
  "unit": "%"
}
```

**📊 Cálculo del Eco-Score para el BOXER:**
```
CO₂:      Score = 100 - (1.5/5.0 × 100) = 70    → 70 × 0.50 = 35.0
WATER:    Score = 100 - (50/200 × 100) = 75    → 75 × 0.30 = 22.5
ENERGY:   Score = 100 - (2.0/8.0 × 100) = 75   → 75 × 0.15 = 11.25
RECYCLED: Score = (80/100 × 100) = 80          → 80 × 0.05 = 4.0
                                                  ──────────
                                        Eco-Score = 72.75
                                        Badge: 🌿 Bajo Impacto General
```

---

### Body - Métrica Solo CO₂ para JABÓN (Mínimo)
```json
{
  "productId": "JABON_ID",
  "type": "CO2",
  "value": 0.3,
  "comparison_value": 0.8,
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

### 💡 Importante: Unidades Consistentes

⚠️ **REGLA**: `value` y `comparison_value` deben usar la **misma unidad**.

**✅ Correcto:**
```json
{ "value": 50, "comparison_value": 200, "unit": "litros" }
{ "value": 50, "comparison_value": 200, "unit": "ml" }
```

**❌ Incorrecto:**
```json
{ "value": 50, "comparison_value": 0.2, "unit": "ml" }  // ¡Uno en ml, otro en L!
```

La fórmula funciona porque usa **proporciones**, no valores absolutos:
$$\text{Score} = 100 - \left( \frac{50 \text{ ml}}{200 \text{ ml}} \times 100 \right) = 75$$

Es lo mismo que:
$$\text{Score} = 100 - \left( \frac{0.05 \text{ L}}{0.2 \text{ L}} \times 100 \right) = 75$$

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

## 🎉 Paso 7: Ver el Resultado con Ahorro de CO₂ y Eco-Score

### ✅ Respuesta Esperada (Nueva con Eco-Score)

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
    },
    {
      "type": "WATER",
      "unit": "litros",
      "totalValue": 50
    },
    {
      "type": "ENERGY",
      "unit": "kWh",
      "totalValue": 2.0
    }
  ],
  "ecoScore": {
    "orderEcoScore": 72.8,
    "orderBadge": "🌿 Bajo Impacto General",
    "productScores": [
      {
        "productId": "BOXER_ID",
        "productName": "Boxer Ecológico",
        "quantity": 1,
        "ecoScore": 72.75,
        "badge": "🌿 Bajo Impacto General"
      },
      {
        "productId": "JABON_ID",
        "productName": "Jabón Natural",
        "quantity": 1,
        "ecoScore": 62.5,
        "badge": "🌿 Bajo Impacto General"
      },
      {
        "productId": "CREMA_ID",
        "productName": "Crema Facial Orgánica",
        "quantity": 2,
        "ecoScore": 58.3,
        "badge": "🌱 Impacto Medio"
      }
    ]
  }
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

### 🆕 Eco-Score de la Orden (72.8)

El Eco-Score de la orden se calcula como un **promedio ponderado** de los Eco-Scores de cada producto, donde los productos con mayor cantidad tienen más peso:

```
Eco-Score Orden = (Score₁ × Qty₁ + Score₂ × Qty₂ + ...) / Total Qty

BOXER:  72.75 × 1 = 72.75
JABÓN:  62.50 × 1 = 62.50
CREMA:  58.30 × 2 = 116.60
──────────────────────────
TOTAL:          251.85 / (1+1+2) = 72.8
Badge: 🌿 Bajo Impacto General
```

---

## 🎯 Paso 8: Ver Producto Individual con Eco-Score

### Endpoint
```
GET http://localhost:3000/api/productos/BOXER_ID
```

### ✅ Respuesta con Eco-Score Detallado
```json
{
  "product": {
    "id": "BOXER_ID",
    "name": "Boxer Ecológico",
    "price": 25.99,
    "description": "Fabricado con algodón reciclado",
    "category": "Ropa Interior",
    ...
  },
  "ecoScore": {
    "score": 72.75,
    "badge": "🌿 Bajo Impacto General",
    "description": "Producto sostenible con impacto reducido",
    "metrics": [
      {
        "type": "CO2",
        "value": 1.5,
        "comparisonValue": 5.0,
        "unit": "kg CO2e",
        "score": 70.0,
        "weight": 50,
        "contribution": 35.0
      },
      {
        "type": "WATER",
        "value": 50,
        "comparisonValue": 200,
        "unit": "litros",
        "score": 75.0,
        "weight": 30,
        "contribution": 22.5
      },
      {
        "type": "ENERGY",
        "value": 2.0,
        "comparisonValue": 8.0,
        "unit": "kWh",
        "score": 75.0,
        "weight": 15,
        "contribution": 11.25
      },
      {
        "type": "RECYCLED",
        "value": 80,
        "comparisonValue": 100,
        "unit": "%",
        "score": 80.0,
        "weight": 5,
        "contribution": 4.0
      }
    ]
  }
}
```

---

## 🎯 Paso 9: Listar Todos los Productos con Eco-Scores

### Endpoint
```
GET http://localhost:3000/api/productos
```

### ✅ Respuesta
```json
{
  "products": [
    {
      "id": "BOXER_ID",
      "name": "Boxer Ecológico",
      "price": 25.99,
      ...
      "ecoScore": {
        "score": 72.75,
        "badge": "🌿 Bajo Impacto General",
        "description": "Producto sostenible con impacto reducido"
      }
    },
    {
      "id": "JABON_ID",
      "name": "Jabón Natural",
      "price": 8.50,
      ...
      "ecoScore": {
        "score": 62.5,
        "badge": "🌿 Bajo Impacto General",
        "description": "Producto sostenible con impacto reducido"
      }
    },
    ...
  ]
}
```

---

## 🎯 Paso 10 (Opcional): Ver Todas las Órdenes del Cliente

### Endpoint
```
GET http://localhost:3000/api/order/customer
```

### Headers
```
Authorization: Bearer <TOKEN_DEL_CLIENTE>
```

### ✅ Respuesta
Verás un array con todas las órdenes, cada una con su `impactSummary`, `ecoScore` y ahorro de CO₂.

---

## 🌍 Mensajes para el Frontend

### Mostrar Ahorro de CO₂
Usa el campo `impactSummary` con `unit: "kg CO2e ahorrados"`:

```
🌱 ¡Tu compra evitó 4.9 kg de CO₂!
   Gracias por elegir productos sostenibles.
```

### Mostrar Eco-Score de la Orden
Usa el campo `ecoScore.orderBadge` y `ecoScore.orderEcoScore`:

```
🌿 Tu orden tiene un Bajo Impacto General
   Eco-Score: 72.8/100
```

### Mostrar Badge de Producto
En el listado de productos, usa `ecoScore.badge`:

```
┌─────────────────────────────┐
│ Boxer Ecológico             │
│ $25.99                      │
│ 🌿 Bajo Impacto General     │
│ Score: 72.8/100             │
└─────────────────────────────┘
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

### ❌ No veo el Eco-Score
- Verifica que el producto tenga al menos una métrica con `comparison_value`
- El Eco-Score se calcula automáticamente al obtener el producto
- Si un producto no tiene métricas, `ecoScore` será `null`

### ❌ Eco-Score incorrecto
- Verifica que `value` y `comparison_value` usen la **misma unidad**
- Para métricas RECYCLED, mayor `value` es mejor
- Para otras métricas (CO2, WATER, ENERGY), menor `value` es mejor

### ❌ Error 401 Unauthorized
- Verifica que el token sea válido
- Asegúrate de usar `Bearer` antes del token
- Los tokens expiran, genera uno nuevo si es necesario

---

## 📝 Resumen de Endpoints

### Endpoints Existentes (Actualizados)
1. `POST /api/marcas/registro` - Crear vendedor
2. `POST /api/product` - Crear productos
3. `POST /api/impact-metric` - Crear métricas (ahora soporta CO2, WATER, ENERGY, RECYCLED)
4. `POST /api/cliente/registro` - Crear cliente
5. `POST /api/cart/items` - Agregar al carrito
6. `POST /api/order/from-cart` - Crear orden (ahora incluye `ecoScore`)
7. `GET /api/order/customer` - Ver órdenes (ahora incluye `ecoScore`)

### 🆕 Endpoints con Eco-Score Automático
8. `GET /api/productos` - Listar productos (incluye `ecoScore` resumido)
9. `GET /api/productos/:id` - Ver producto individual (incluye `ecoScore` detallado con métricas)

---

## 🎓 Conceptos Clave

### Sistema Original (CO₂)
- **value**: CO₂ que genera tu producto eco
- **comparison_value**: CO₂ que genera el producto estándar
- **Ahorro**: `comparison_value - value`
- **Total Ahorrado**: Suma de ahorros de todos los productos × cantidades

### 🆕 Nuevo Sistema (Eco-Score)
- **Eco-Score**: Puntuación compuesta (0-100) basada en múltiples métricas
- **Pesos**: CO₂ (50%), WATER (30%), ENERGY (15%), RECYCLED (5%)
- **Normalización**: Cada métrica se convierte a una escala de 0-100
- **Badge**: Clasificación visual basada en umbrales:
  - 🌳 Máximo Impacto Positivo (80-100)
  - 🌿 Bajo Impacto General (60-79)
  - 🌱 Impacto Medio (40-59)
  - 🟡 Impacto Estándar (0-39)
- **Orden Eco-Score**: Promedio ponderado por cantidad de productos

### Fórmulas Clave

**Score de Métrica Normal (CO₂, WATER, ENERGY):**
$$\text{Score} = 100 - \left( \frac{\text{value}}{\text{comparison\_value}} \times 100 \right)$$

**Score de Métrica Inversa (RECYCLED):**
$$\text{Score} = \frac{\text{value}}{\text{comparison\_value}} \times 100$$

**Eco-Score Compuesto:**
$$\text{Eco-Score} = \sum (\text{Score}_i \times \text{Peso}_i)$$

**Eco-Score de Orden:**
$$\text{Eco-Score Orden} = \frac{\sum (\text{Eco-Score}_i \times \text{Cantidad}_i)}{\sum \text{Cantidad}_i}$$

¡Listo! Ahora tienes un sistema completo de Eco-Score con badges y múltiples métricas ambientales. 🌱✨
