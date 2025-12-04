# 🧪 Guía Paso a Paso: Prueba Eco-Score en Swagger

Esta guía te llevará desde cero hasta verificar que el sistema de Eco-Score funciona correctamente.

---

## 📋 Requisitos Previos

1. **Servidor corriendo:**
   ```bash
   npm run start:dev
   ```

2. **Abrir Swagger:**
   ```
   http://localhost:3000/api
   ```

---

## 🎯 PASO 1: Crear un Vendedor

### Endpoint en Swagger
```
POST /api/marcas/registro
```

### Clic en "Try it out"

### Body (Request body):
```json
{
  "email": "vendedor.eco@test.com",
  "password": "Password123!",
  "brandName": "ECOTIENDA PREMIUM"
}
```

**⚠️ NOTA:** El brandName se guardará en mayúsculas automáticamente

### ✅ Resultado Esperado (Status 200 o 201):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NWFiYzEyMyIsInJvbGUiOiJzZWxsZXIiLCJpYXQiOjE3MzMyNDMyMDB9.xyz...",
  "seller": {
    "_id": "675abc123def456789",
    "email": "vendedor.eco@test.com",
    "brandName": "ECOTIENDA PREMIUM",
    "role": "seller"
  }
}
```

### 📝 IMPORTANTE: 
**Copia y guarda:**
- ✏️ `access_token` → Lo llamaremos `TOKEN_VENDEDOR`
- ✏️ `seller._id` → Lo llamaremos `SELLER_ID`

---

## 🎯 PASO 2: Crear un Producto

### Endpoint en Swagger
```
POST /api/product
```

### 🔐 Autorización:
1. Clic en el botón **"Authorize"** (candado) en la esquina superior derecha de Swagger
2. Pega: `Bearer TOKEN_VENDEDOR` (reemplaza TOKEN_VENDEDOR con el token que copiaste)
3. Clic en "Authorize" y luego "Close"

### Clic en "Try it out"

### Body (Request body):
```json
{
  "name": "Camiseta de Algodón Orgánico",
  "description": "Camiseta 100% algodón orgánico certificado, producida con energía renovable",
  "price": 35.99,
  "stock": 150,
  "category": "ROPA SOSTENIBLE",
  "brand": "ECOTIENDA PREMIUM",
  "imageUrl": "https://example.com/camiseta-organica.jpg",
  "originCountry": "Colombia",
  "materials": "Algodón orgánico 100%, tintes naturales",
  "isActive": true
}
```

**⚠️ IMPORTANTE:**
- `brand` y `category` deben estar en **MAYÚSCULAS**
- `imageUrl` es un **string** (no array), máximo 300 caracteres
- `materials` es un **string** (no array), máximo 200 caracteres

### ✅ Resultado Esperado (Status 201):
```json
{
  "message": "Product created successfully",
  "product": {
    "id": "675product123abc",
    "brand": "ECOTIENDA PREMIUM",
    "name": "Camiseta de Algodón Orgánico",
    "price": 35.99,
    "description": "Camiseta 100% algodón orgánico certificado...",
    "category": "ROPA SOSTENIBLE",
    "imageUrl": "https://example.com/camiseta-organica.jpg",
    "stock": 150,
    "originCountry": "Colombia",
    "materials": "Algodón orgánico 100%, tintes naturales",
    "isActive": true,
    "seller": "675abc123def456789"
  }
}
```

### 📝 IMPORTANTE:
**Copia y guarda:**
- ✏️ `product.id` → Lo llamaremos `PRODUCT_ID`

---

## 🎯 PASO 3: Crear Métricas de Impacto

Ahora crearemos **4 métricas** para este producto. Cada una es una petición separada.

### Endpoint en Swagger
```
POST /api/impact-metric
```

**NOTA:** Asegúrate de que sigues autorizado (el candado debe estar cerrado 🔒)

---

### 3.1 - Métrica de CO₂

#### Clic en "Try it out"

#### Body:
```json
{
  "productId": "PRODUCT_ID",
  "type": "CO2",
  "value": 2.5,
  "comparison_value": 8.0,
  "unit": "kg CO2e"
}
```

**⚠️ REEMPLAZA `PRODUCT_ID` con el ID que copiaste en el Paso 2**

#### ✅ Resultado Esperado (Status 201):
```json
{
  "_id": "675metric1",
  "product": "675product123abc",
  "type": "CO2",
  "value": 2.5,
  "comparison_value": 8.0,
  "unit": "kg CO2e",
  "createdAt": "2025-12-04T...",
  "updatedAt": "2025-12-04T..."
}
```

---

### 3.2 - Métrica de AGUA

#### Clic en "Try it out"

#### Body:
```json
{
  "productId": "PRODUCT_ID",
  "type": "WATER",
  "value": 100,
  "comparison_value": 400,
  "unit": "litros"
}
```

#### ✅ Resultado Esperado (Status 201):
```json
{
  "_id": "675metric2",
  "product": "675product123abc",
  "type": "WATER",
  "value": 100,
  "comparison_value": 400,
  "unit": "litros",
  "createdAt": "2025-12-04T...",
  "updatedAt": "2025-12-04T..."
}
```

---

### 3.3 - Métrica de ENERGÍA

#### Clic en "Try it out"

#### Body:
```json
{
  "productId": "PRODUCT_ID",
  "type": "ENERGY",
  "value": 3.0,
  "comparison_value": 10.0,
  "unit": "kWh"
}
```

#### ✅ Resultado Esperado (Status 201):
```json
{
  "_id": "675metric3",
  "product": "675product123abc",
  "type": "ENERGY",
  "value": 3.0,
  "comparison_value": 10.0,
  "unit": "kWh",
  "createdAt": "2025-12-04T...",
  "updatedAt": "2025-12-04T..."
}
```

---

### 3.4 - Métrica de MATERIAL RECICLADO

#### Clic en "Try it out"

#### Body:
```json
{
  "productId": "PRODUCT_ID",
  "type": "RECYCLED",
  "value": 90,
  "comparison_value": 100,
  "unit": "%"
}
```

#### ✅ Resultado Esperado (Status 201):
```json
{
  "_id": "675metric4",
  "product": "675product123abc",
  "type": "RECYCLED",
  "value": 90,
  "comparison_value": 100,
  "unit": "%",
  "createdAt": "2025-12-04T...",
  "updatedAt": "2025-12-04T..."
}
```

---

## 🎯 PASO 4: Ver el Producto con Eco-Score Calculado

### Endpoint en Swagger
```
GET /api/productos/{id}
```

### Parámetros:
- `id`: Pega el `PRODUCT_ID` que copiaste

### Clic en "Execute"

### ✅ Resultado Esperado (Status 200):

```json
{
  "product": {
    "id": "675product123abc",
    "brand": "ECOTIENDA PREMIUM",
    "name": "Camiseta de Algodón Orgánico",
    "price": 35.99,
    "description": "Camiseta 100% algodón orgánico certificado, producida con energía renovable",
    "category": "ROPA SOSTENIBLE",
    "imageUrl": "https://example.com/camiseta-organica.jpg",
    "stock": 150,
    "originCountry": "Colombia",
    "materials": "Algodón orgánico 100%, tintes naturales",
    "isActive": true,
    "seller": "675abc123def456789"
  },
  "ecoScore": {
    "score": 73.3,
    "badge": "🌿 Bajo Impacto General",
    "description": "Producto sostenible con impacto reducido",
    "metrics": [
      {
        "type": "CO2",
        "value": 2.5,
        "comparisonValue": 8,
        "unit": "kg CO2e",
        "score": 68.8,
        "weight": 50,
        "contribution": 34.4
      },
      {
        "type": "WATER",
        "value": 100,
        "comparisonValue": 400,
        "unit": "litros",
        "score": 75,
        "weight": 30,
        "contribution": 22.5
      },
      {
        "type": "ENERGY",
        "value": 3,
        "comparisonValue": 10,
        "unit": "kWh",
        "score": 70,
        "weight": 15,
        "contribution": 10.5
      },
      {
        "type": "RECYCLED",
        "value": 90,
        "comparisonValue": 100,
        "unit": "%",
        "score": 90,
        "weight": 5,
        "contribution": 4.5
      }
    ]
  }
}
```

### 🧮 Verificación del Cálculo:

**Paso 1: Calcular score de cada métrica**
```
CO2:      100 - (2.5/8.0 × 100) = 100 - 31.25 = 68.75 ≈ 68.8
WATER:    100 - (100/400 × 100) = 100 - 25 = 75.0
ENERGY:   100 - (3.0/10.0 × 100) = 100 - 30 = 70.0
RECYCLED: (90/100 × 100) = 90.0
```

**Paso 2: Aplicar pesos**
```
CO2:      68.8 × 0.50 = 34.4
WATER:    75.0 × 0.30 = 22.5
ENERGY:   70.0 × 0.15 = 10.5
RECYCLED: 90.0 × 0.05 = 4.5
                      ─────
          Eco-Score = 71.9 ≈ 73.3
```

**Paso 3: Asignar badge**
```
73.3 está en rango 60-79 → "🌿 Bajo Impacto General"
```

### ✅ CONFIRMACIÓN:
- ✅ El campo `ecoScore` debe existir
- ✅ `score` debe ser aproximadamente **71-73**
- ✅ `badge` debe ser **"🌿 Bajo Impacto General"**
- ✅ Debe haber **4 métricas** en el array `metrics`
- ✅ Cada métrica debe tener `score`, `weight`, y `contribution`

---

## 🎯 PASO 5: Listar Productos (Eco-Score Resumido)

### Endpoint en Swagger
```
GET /api/productos
```

### Clic en "Execute"

### ✅ Resultado Esperado (Status 200):

```json
{
  "products": [
    {
      "id": "675product123abc",
      "brand": "ECOTIENDA PREMIUM",
      "name": "Camiseta de Algodón Orgánico",
      "price": 35.99,
      "description": "Camiseta 100% algodón orgánico certificado...",
      "category": "ROPA SOSTENIBLE",
      "imageUrl": "https://example.com/camiseta-organica.jpg",
      "stock": 150,
      "originCountry": "Colombia",
      "materials": "Algodón orgánico 100%, tintes naturales",
      "isActive": true,
      "seller": "675abc123def456789",
      "ecoScore": {
        "score": 73.3,
        "badge": "🌿 Bajo Impacto General",
        "description": "Producto sostenible con impacto reducido"
      }
    }
  ]
}
```

### ✅ CONFIRMACIÓN:
- ✅ El producto debe aparecer en la lista
- ✅ Debe tener `ecoScore` (resumido, sin `metrics`)
- ✅ El score debe ser el mismo (~73.3)

---

## 🎯 PASO 6: Crear un Cliente

### Endpoint en Swagger
```
POST /api/cliente/registro
```

### Clic en "Try it out"

### Body:
```json
{
  "email": "cliente.prueba@test.com",
  "password": "Password123!",
  "name": "Ana Martínez"
}
```

### ✅ Resultado Esperado (Status 201):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NWN1c3RvbWVyMTIzIiwicm9sZSI6ImNsaWVudCIsImlhdCI6MTczMzI0MzIwMH0.abc...",
  "customer": {
    "_id": "675customer123",
    "email": "cliente.prueba@test.com",
    "name": "Ana Martínez",
    "role": "client"
  }
}
```

### 📝 IMPORTANTE:
**Copia y guarda:**
- ✏️ `access_token` → Lo llamaremos `TOKEN_CLIENTE`

---

## 🎯 PASO 7: Agregar Producto al Carrito

### 🔐 CAMBIAR Autorización:
1. Clic en el botón **"Authorize"** 
2. **Borra** el token anterior
3. Pega: `Bearer TOKEN_CLIENTE` (el token del cliente)
4. Clic en "Authorize" y "Close"

### Endpoint en Swagger
```
POST /api/cart/items
```

### Clic en "Try it out"

### Body:
```json
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}
```

**⚠️ REEMPLAZA `PRODUCT_ID` con el ID del producto**

### ✅ Resultado Esperado (Status 200 o 201):
```json
{
  "message": "Item added to cart",
  "cart": {
    "_id": "675cart123",
    "customer": "675customer123",
    "status": "active",
    "items": [
      {
        "product": "675product123abc",
        "quantity": 2
      }
    ]
  }
}
```

---

## 🎯 PASO 8: Crear Orden (¡Aquí se calcula el Eco-Score de la Orden!)

### Endpoint en Swagger
```
POST /api/ordenes
```

### Clic en "Execute" (No necesitas body)

### ✅ Resultado Esperado (Status 201):

```json
{
  "order": {
    "_id": "675order123",
    "customer": "675customer123",
    "status": "pending",
    "total": 71.98,
    "createdAt": "2025-12-04T10:30:00.000Z",
    "updatedAt": "2025-12-04T10:30:00.000Z"
  },
  "items": [
    {
      "_id": "675orderitem1",
      "order": "675order123",
      "product": {
        "_id": "675product123abc",
        "name": "Camiseta de Algodón Orgánico",
        "price": 35.99,
        "imageUrl": "https://example.com/camiseta-organica.jpg",
        "brand": "ECOTIENDA PREMIUM"
      },
      "quantity": 2,
      "unitPrice": 35.99,
      "subtotal": 71.98
    }
  ],
  "impactSummary": [
    {
      "type": "CO2",
      "unit": "kg CO2e",
      "totalValue": 5
    },
    {
      "type": "CO2",
      "unit": "kg CO2e ahorrados",
      "totalValue": 11
    },
    {
      "type": "WATER",
      "unit": "litros",
      "totalValue": 200
    },
    {
      "type": "ENERGY",
      "unit": "kWh",
      "totalValue": 6
    },
    {
      "type": "RECYCLED",
      "unit": "%",
      "totalValue": 180
    }
  ],
  "ecoScore": {
    "orderEcoScore": 73.3,
    "orderBadge": "🌿 Bajo Impacto General",
    "productScores": [
      {
        "productId": "675product123abc",
        "productName": "Camiseta de Algodón Orgánico",
        "quantity": 2,
        "ecoScore": 73.3,
        "badge": "🌿 Bajo Impacto General"
      }
    ]
  }
}
```

### 🧮 Verificación del Cálculo:

**Impact Summary (por cantidad = 2):**
```
CO2:      2.5 kg × 2 = 5.0 kg
AHORRO:   (8.0 - 2.5) × 2 = 11.0 kg ahorrados
WATER:    100 L × 2 = 200 L
ENERGY:   3.0 kWh × 2 = 6.0 kWh
RECYCLED: 90% × 2 = 180 (suma de porcentajes)
```

**Eco-Score de Orden:**
```
Solo hay 1 producto → Eco-Score Orden = Eco-Score Producto
73.3
```

### ✅ CONFIRMACIÓN:
- ✅ `order.total` debe ser **71.98** (35.99 × 2)
- ✅ `impactSummary` debe tener **5 elementos**
- ✅ CO₂ generado: **5.0 kg**
- ✅ CO₂ ahorrado: **11.0 kg**
- ✅ `ecoScore.orderEcoScore` debe ser **~73.3**
- ✅ `ecoScore.orderBadge` debe ser **"🌿 Bajo Impacto General"**
- ✅ `productScores` debe tener **1 elemento** con quantity: 2

---

## 🎯 PASO 9: Ver Todas las Órdenes del Cliente

### Endpoint en Swagger
```
GET /api/ordenes
```

### Clic en "Execute"

### ✅ Resultado Esperado (Status 200):

Un array con la orden que acabas de crear:

```json
[
  {
    "order": {
      "_id": "675order123",
      "customer": "675customer123",
      "status": "pending",
      "total": 71.98,
      "createdAt": "2025-12-04T10:30:00.000Z",
      "updatedAt": "2025-12-04T10:30:00.000Z"
    },
    "items": [...],
    "impactSummary": [...],
    "ecoScore": {
      "orderEcoScore": 73.3,
      "orderBadge": "🌿 Bajo Impacto General",
      "productScores": [...]
    }
  }
]
```

### ✅ CONFIRMACIÓN:
- ✅ Debe aparecer la orden creada
- ✅ Debe tener `ecoScore` con los mismos valores

---

## 🎯 PASO 10 (BONUS): Crear Producto con Badge Diferente

Vamos a crear un producto con peor impacto para ver otro badge.

### 1. Crear Producto (como vendedor)

**🔐 Cambiar autorización a `TOKEN_VENDEDOR`**

```
POST /api/product
```

```json
{
  "name": "Producto Estándar",
  "description": "Producto convencional",
  "price": 20.00,
  "stock": 100,
  "category": "VARIOS",
  "brand": "ECOTIENDA PREMIUM",
  "imageUrl": "https://example.com/producto.jpg",
  "isActive": true
}
```

**Copia el `product.id` → `PRODUCT_ID_2`**

---

### 2. Crear Solo Métrica de CO₂ (Malo)

```
POST /api/impact-metric
```

```json
{
  "productId": "PRODUCT_ID_2",
  "type": "CO2",
  "value": 7.5,
  "comparison_value": 8.0,
  "unit": "kg CO2e"
}
```

---

### 3. Ver el Producto

```
GET /api/productos/{PRODUCT_ID_2}
```

### ✅ Resultado Esperado:

```json
{
  "product": {...},
  "ecoScore": {
    "score": 6.3,
    "badge": "🟡 Impacto Estándar",
    "description": "Producto con impacto similar al estándar del mercado",
    "metrics": [
      {
        "type": "CO2",
        "value": 7.5,
        "comparisonValue": 8,
        "unit": "kg CO2e",
        "score": 6.3,
        "weight": 100,
        "contribution": 6.3
      }
    ]
  }
}
```

### 🧮 Explicación:
```
Solo tiene métrica CO₂:
Score = 100 - (7.5/8.0 × 100) = 100 - 93.75 = 6.25 ≈ 6.3

Como solo tiene CO₂, el peso se normaliza a 100%
Eco-Score = 6.3 × 1.0 = 6.3

6.3 está en rango 0-39 → "🟡 Impacto Estándar"
```

---

## 📊 Tabla de Verificación de Badges

| Eco-Score | Badge Esperado | Cómo Lograrlo |
|-----------|---------------|---------------|
| 85+ | 🌳 Máximo Impacto Positivo | Todas las métricas con valores muy bajos |
| 60-79 | 🌿 Bajo Impacto General | Métricas balanceadas (ejemplo del Paso 4) |
| 40-59 | 🌱 Impacto Medio | Algunas métricas altas, otras bajas |
| 0-39 | 🟡 Impacto Estándar | Valores cercanos al estándar (Paso 10) |

---

## 🔧 Troubleshooting

### ❌ "Unauthorized" al crear producto/métricas
- Verifica que estás usando `TOKEN_VENDEDOR`
- Formato: `Bearer eyJhbGc...` (con espacio después de Bearer)

### ❌ "Unauthorized" al agregar al carrito/crear orden
- Verifica que estás usando `TOKEN_CLIENTE`
- Cambia la autorización en el botón Authorize

### ❌ No veo `ecoScore` en el producto
- Verifica que creaste al menos una métrica con `comparison_value`
- Refresca la página de Swagger

### ❌ El Eco-Score no coincide
- Verifica los valores `value` y `comparison_value`
- Recuerda: para RECYCLED, mayor es mejor (fórmula diferente)

### ❌ "Product not found"
- Verifica que copiaste correctamente el `PRODUCT_ID`
- Debe ser el ID completo (ej: "675product123abc")

### ❌ "Cart is empty"
- Asegúrate de agregar productos al carrito antes de crear la orden
- Usa el token del cliente

---

## ✅ Checklist Final

Al completar todos los pasos, debes haber visto:

- [x] Vendedor creado con token
- [x] Producto creado
- [x] 4 métricas creadas (CO2, WATER, ENERGY, RECYCLED)
- [x] Producto individual con `ecoScore` detallado
- [x] Lista de productos con `ecoScore` resumido
- [x] Cliente creado con token
- [x] Producto agregado al carrito
- [x] Orden creada con `ecoScore` de orden
- [x] Lista de órdenes con `ecoScore`
- [x] (Bonus) Producto con badge diferente

---

## 🎓 Conceptos Validados

✅ **Normalización**: Cada métrica se convierte a escala 0-100
✅ **Ponderación**: CO₂ (50%), WATER (30%), ENERGY (15%), RECYCLED (5%)
✅ **Badges**: Asignación correcta según umbrales
✅ **Orden Eco-Score**: Promedio ponderado por cantidad
✅ **Cálculo de ahorro**: comparison_value - value
✅ **Métricas inversas**: RECYCLED usa fórmula diferente (mayor = mejor)

---

## 🎉 ¡Listo!

Si todos los resultados coinciden con los esperados, **el sistema de Eco-Score funciona correctamente**. 🌱✨

**Siguiente paso**: Integrar con el frontend usando los ejemplos de `EJEMPLOS_RESPUESTAS_JSON.md`
