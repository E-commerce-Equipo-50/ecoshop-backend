# 🌳 Sistema de Eco-Score - Documentación de Implementación

## 📋 Resumen

Se implementó un sistema completo de **Eco-Score Compuesto** que permite asignar badges a productos basándose en múltiples métricas ambientales (CO₂, WATER, ENERGY, RECYCLED).

---

## 🆕 Archivos Creados

### 1. `src/config/eco-score.config.ts`
**Propósito**: Configuración centralizada del sistema

**Contenido**:
- **METRIC_WEIGHTS**: Pesos de cada métrica
  - CO₂: 50%
  - WATER: 30%
  - ENERGY: 15%
  - RECYCLED: 5%
  - TRANSPORT: 0% (reservado para futuro)

- **ECO_BADGE_THRESHOLDS**: Umbrales de badges
  - 🌳 Máximo Impacto Positivo (80-100)
  - 🌿 Bajo Impacto General (60-79)
  - 🌱 Impacto Medio (40-59)
  - 🟡 Impacto Estándar (0-39)

- **INVERSE_METRICS**: Métricas donde mayor valor = mejor (RECYCLED)

### 2. `src/common/utils/eco-score.utils.ts`
**Propósito**: Lógica de cálculo del Eco-Score

**Funciones principales**:
- `calculateMetricScore()`: Normaliza una métrica individual a escala 0-100
- `calculateEcoScore()`: Calcula el Eco-Score compuesto de un producto
- `getEcoBadge()`: Asigna el badge correspondiente a un score

**Interfaces exportadas**:
- `MetricScoreDetail`: Detalle de cada métrica en el cálculo
- `EcoScoreResult`: Resultado completo del Eco-Score

---

## 🔧 Archivos Modificados

### 1. `src/product/product.module.ts`
**Cambio**: Agregado `ImpactMetric` al módulo para poder consultar métricas

### 2. `src/product/product.service.ts`
**Nuevos métodos**:
- `findByIdWithEcoScore()`: Obtiene producto con Eco-Score calculado
- `listActiveWithEcoScore()`: Lista productos activos con Eco-Scores

**Importaciones agregadas**:
- `ImpactMetric` (modelo)
- `calculateEcoScore`, `EcoScoreResult` (utilidades)

### 3. `src/product/product.controller.ts`
**Cambios**:
- `GET /productos`: Ahora retorna `ecoScore` (resumido) para cada producto
- `GET /productos/:id`: Ahora retorna `ecoScore` (detallado con métricas)

**Estructura de respuesta**:
```typescript
{
  product: { ... },
  ecoScore: {
    score: 72.75,
    badge: "🌿 Bajo Impacto General",
    description: "Producto sostenible con impacto reducido",
    metrics: [ ... ] // Solo en GET /:id
  }
}
```

### 4. `src/order/order.service.ts`
**Nuevo método privado**:
- `computeOrderEcoScore()`: Calcula Eco-Score promedio ponderado de la orden

**Método auxiliar movido**:
- `getProductId()`: Extraído como método de clase (era local en `computeImpactSummary`)

**Métodos actualizados**:
- `createFromCart()`: Ahora retorna campo `ecoScore`
- `listByCustomer()`: Ahora incluye `ecoScore` en cada orden

**Estructura de ecoScore en órdenes**:
```typescript
{
  orderEcoScore: 72.8,
  orderBadge: "🌿 Bajo Impacto General",
  productScores: [
    {
      productId: "...",
      productName: "Boxer Ecológico",
      quantity: 1,
      ecoScore: 72.75,
      badge: "🌿 Bajo Impacto General"
    },
    ...
  ]
}
```

### 5. `GUIA_PRUEBA_AHORRO_CO2.md`
**Secciones actualizadas**:
- Paso 3: Agregados ejemplos de métricas múltiples (CO₂, WATER, ENERGY, RECYCLED)
- Paso 7: Respuesta actualizada con campo `ecoScore` en órdenes
- Nuevos Pasos 8-9: Ejemplos de productos individuales y listados con Eco-Score
- Paso 10: Ver órdenes con Eco-Score
- Mensajes para el frontend actualizados
- Troubleshooting ampliado
- Conceptos clave del Eco-Score

---

## 🎯 Cómo Funciona el Sistema

### 1. Normalización de Métricas

Cada métrica se convierte a una escala de 0-100:

**Métricas normales** (CO₂, WATER, ENERGY) - menor es mejor:
```
Score = 100 - (value / comparison_value × 100)
```

**Métricas inversas** (RECYCLED) - mayor es mejor:
```
Score = value / comparison_value × 100
```

**Ejemplo**:
```
CO₂:    value=1.5, comparison=5.0  → Score = 100 - (1.5/5.0 × 100) = 70
WATER:  value=50,  comparison=200  → Score = 100 - (50/200 × 100) = 75
```

### 2. Ponderación

Cada score se multiplica por su peso:

```
CO₂:      70 × 0.50 = 35.0
WATER:    75 × 0.30 = 22.5
ENERGY:   75 × 0.15 = 11.25
RECYCLED: 80 × 0.05 = 4.0
                    ──────
           Eco-Score = 72.75
```

### 3. Asignación de Badge

Basado en umbrales configurados en `eco-score.config.ts`:

```
72.75 → cae en rango 60-79 → "🌿 Bajo Impacto General"
```

### 4. Eco-Score de Orden

Promedio ponderado por cantidad:

```
Producto A: Score=72.75, Qty=1  → 72.75
Producto B: Score=62.50, Qty=1  → 62.50
Producto C: Score=58.30, Qty=2  → 116.60
                                   ──────
Total: 251.85 / 4 productos = 62.96
```

---

## 🔌 API Endpoints Actualizados

### Productos

#### `GET /api/productos`
**Respuesta**:
```json
{
  "products": [
    {
      "id": "...",
      "name": "Boxer Ecológico",
      "price": 25.99,
      ...
      "ecoScore": {
        "score": 72.75,
        "badge": "🌿 Bajo Impacto General",
        "description": "Producto sostenible con impacto reducido"
      }
    }
  ]
}
```

#### `GET /api/productos/:id`
**Respuesta**:
```json
{
  "product": { ... },
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
      ...
    ]
  }
}
```

### Órdenes

#### `POST /api/order/from-cart`
**Respuesta**:
```json
{
  "order": { ... },
  "items": [ ... ],
  "impactSummary": [ ... ],
  "ecoScore": {
    "orderEcoScore": 72.8,
    "orderBadge": "🌿 Bajo Impacto General",
    "productScores": [
      {
        "productId": "...",
        "productName": "Boxer Ecológico",
        "quantity": 1,
        "ecoScore": 72.75,
        "badge": "🌿 Bajo Impacto General"
      }
    ]
  }
}
```

#### `GET /api/order/customer`
**Respuesta**: Array de órdenes, cada una con `ecoScore` (igual estructura que arriba)

---

## ⚙️ Configuración

### Ajustar Pesos de Métricas

Edita `src/config/eco-score.config.ts`:

```typescript
export const METRIC_WEIGHTS: Record<ImpactMetricType, number> = {
  CO2: 0.40,      // Cambiar a 40%
  WATER: 0.35,    // Cambiar a 35%
  ENERGY: 0.20,   // Cambiar a 20%
  RECYCLED: 0.05, // Mantener 5%
  TRANSPORT: 0.0,
};
```

**Importante**: La suma debe ser 1.0 (100%)

### Ajustar Umbrales de Badges

Edita `ECO_BADGE_THRESHOLDS` en el mismo archivo:

```typescript
{
  minScore: 90,  // Hacer más estricto
  maxScore: 100,
  badge: '🌳 Máximo Impacto Positivo',
  description: '...',
}
```

---

## 🧪 Cómo Probar

### 1. Crear Producto con Múltiples Métricas

```bash
# POST /api/impact-metric (4 veces para el mismo producto)
# Métrica 1: CO2
{ "productId": "...", "type": "CO2", "value": 1.5, "comparison_value": 5.0, "unit": "kg CO2e" }

# Métrica 2: WATER
{ "productId": "...", "type": "WATER", "value": 50, "comparison_value": 200, "unit": "litros" }

# Métrica 3: ENERGY
{ "productId": "...", "type": "ENERGY", "value": 2.0, "comparison_value": 8.0, "unit": "kWh" }

# Métrica 4: RECYCLED
{ "productId": "...", "type": "RECYCLED", "value": 80, "comparison_value": 100, "unit": "%" }
```

### 2. Ver Eco-Score del Producto

```bash
GET /api/productos/:id
```

Deberías ver `ecoScore` con score ~72.75 y badge "🌿 Bajo Impacto General"

### 3. Crear Orden y Ver Eco-Score

```bash
# Agregar productos al carrito
POST /api/cart/items

# Crear orden
POST /api/order/from-cart
```

Deberías ver `ecoScore` en la respuesta con el badge de la orden

---

## 📊 Casos de Uso Frontend

### Mostrar Badge en Tarjeta de Producto

```jsx
<ProductCard>
  <h3>{product.name}</h3>
  <p>${product.price}</p>
  {product.ecoScore && (
    <Badge>
      {product.ecoScore.badge}
    </Badge>
  )}
</ProductCard>
```

### Mostrar Detalle de Métricas

```jsx
{ecoScore?.metrics.map(metric => (
  <MetricDetail key={metric.type}>
    <span>{metric.type}</span>
    <ProgressBar value={metric.score} />
    <span>{metric.score}/100</span>
    <span>Peso: {metric.weight}%</span>
  </MetricDetail>
))}
```

### Mostrar Eco-Score de Orden

```jsx
<OrderSummary>
  <h2>Tu Orden</h2>
  <p>Total: ${order.total}</p>
  
  {ecoScore && (
    <EcoScoreBadge>
      <h3>{ecoScore.orderBadge}</h3>
      <p>Eco-Score: {ecoScore.orderEcoScore}/100</p>
      
      <ProductsList>
        {ecoScore.productScores.map(ps => (
          <li key={ps.productId}>
            {ps.productName} (×{ps.quantity}): {ps.badge}
          </li>
        ))}
      </ProductsList>
    </EcoScoreBadge>
  )}
</OrderSummary>
```

---

## 🔮 Futuras Mejoras

1. **Agregar métricas de TRANSPORT**:
   - Configurar peso en `METRIC_WEIGHTS`
   - Documentar en la guía

2. **Cache de Eco-Scores**:
   - Guardar Eco-Score en el modelo de Product
   - Recalcular solo cuando cambien las métricas

3. **Filtros y ordenamiento**:
   - Filtrar productos por badge
   - Ordenar por Eco-Score

4. **Historial de badges**:
   - Guardar evolución del Eco-Score del producto
   - Mostrar tendencia (mejorando/empeorando)

5. **Comparador de productos**:
   - Mostrar métricas lado a lado
   - Resaltar cuál es mejor en cada categoría

---

## ✅ Checklist de Implementación

- [x] Crear configuración de pesos y umbrales
- [x] Implementar utilidades de cálculo
- [x] Actualizar ProductService con Eco-Score
- [x] Actualizar ProductController para retornar Eco-Score
- [x] Actualizar OrderService con Eco-Score de orden
- [x] Actualizar guía de pruebas
- [x] Verificar compilación sin errores
- [x] Documentar implementación

---

## 🎉 Resultado Final

✅ Sistema completo de Eco-Score implementado
✅ Soporta CO₂, WATER, ENERGY, RECYCLED
✅ Cálculo automático en productos y órdenes
✅ Badges visuales basados en umbrales configurables
✅ Documentación completa para pruebas y frontend
✅ Sin errores de compilación
