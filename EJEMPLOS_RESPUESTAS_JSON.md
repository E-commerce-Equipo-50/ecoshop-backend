# 📝 Ejemplos de Respuestas JSON - Sistema Eco-Score

Este archivo contiene ejemplos completos de las respuestas JSON que recibirás del backend con el nuevo sistema de Eco-Score.

---

## 1️⃣ GET /api/productos (Listar Productos)

### Request
```http
GET http://localhost:3000/api/productos
```

### Response
```json
{
  "products": [
    {
      "id": "675abc123def456",
      "brand": "EcoMarca",
      "name": "Boxer Ecológico",
      "price": 25.99,
      "description": "Fabricado con algodón reciclado",
      "category": "Ropa Interior",
      "imageUrl": ["https://example.com/boxer.jpg"],
      "stock": 100,
      "originCountry": "Colombia",
      "materials": ["Algodón reciclado", "Elastano orgánico"],
      "isActive": true,
      "seller": "675seller123",
      "ecoScore": {
        "score": 72.75,
        "badge": "🌿 Bajo Impacto General",
        "description": "Producto sostenible con impacto reducido"
      }
    },
    {
      "id": "675abc789ghi012",
      "brand": "EcoMarca",
      "name": "Jabón Natural",
      "price": 8.50,
      "description": "Jabón artesanal sin químicos",
      "category": "Cuidado Personal",
      "imageUrl": ["https://example.com/jabon.jpg"],
      "stock": 200,
      "originCountry": "Colombia",
      "materials": ["Aceite de coco", "Aceite de oliva"],
      "isActive": true,
      "seller": "675seller123",
      "ecoScore": {
        "score": 62.5,
        "badge": "🌿 Bajo Impacto General",
        "description": "Producto sostenible con impacto reducido"
      }
    },
    {
      "id": "675abc345jkl678",
      "brand": "EcoMarca",
      "name": "Crema Facial Orgánica",
      "price": 45.00,
      "description": "Crema hidratante vegana",
      "category": "Cuidado Personal",
      "imageUrl": ["https://example.com/crema.jpg"],
      "stock": 50,
      "originCountry": "Colombia",
      "materials": ["Aloe vera", "Aceite de argán"],
      "isActive": true,
      "seller": "675seller123",
      "ecoScore": {
        "score": 58.3,
        "badge": "🌱 Impacto Medio",
        "description": "Producto con impacto ambiental moderado"
      }
    }
  ]
}
```

**💡 Uso en Frontend:**
- Mostrar el badge `ecoScore.badge` en cada tarjeta de producto
- Usar `ecoScore.score` para ordenar productos por sostenibilidad
- Mostrar tooltip con `ecoScore.description` al hacer hover

---

## 2️⃣ GET /api/productos/:id (Producto Individual con Métricas Detalladas)

### Request
```http
GET http://localhost:3000/api/productos/675abc123def456
```

### Response
```json
{
  "product": {
    "id": "675abc123def456",
    "brand": "EcoMarca",
    "name": "Boxer Ecológico",
    "price": 25.99,
    "description": "Fabricado con algodón reciclado",
    "category": "Ropa Interior",
    "imageUrl": ["https://example.com/boxer.jpg"],
    "stock": 100,
    "originCountry": "Colombia",
    "materials": ["Algodón reciclado", "Elastano orgánico"],
    "isActive": true,
    "seller": "675seller123"
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

**💡 Uso en Frontend:**
- Mostrar el badge principal `ecoScore.badge`
- Crear gráfico de barras con `metrics[].score` para cada tipo
- Mostrar comparación: "Este producto genera **1.5 kg CO2e** vs **5.0 kg CO2e** de un producto estándar"
- Tooltip de contribución: "CO₂ aporta 35.0 puntos (50% del total)"

---

## 3️⃣ POST /api/order/from-cart (Crear Orden con Eco-Score)

### Request
```http
POST http://localhost:3000/api/order/from-cart
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response
```json
{
  "order": {
    "_id": "675order1234567",
    "customer": "675customer123",
    "status": "pending",
    "total": 125.99,
    "createdAt": "2025-12-04T10:30:00.000Z",
    "updatedAt": "2025-12-04T10:30:00.000Z"
  },
  "items": [
    {
      "_id": "675item001",
      "order": "675order1234567",
      "product": {
        "_id": "675abc123def456",
        "name": "Boxer Ecológico",
        "price": 25.99,
        "imageUrl": ["https://example.com/boxer.jpg"]
      },
      "quantity": 1,
      "unitPrice": 25.99,
      "subtotal": 25.99
    },
    {
      "_id": "675item002",
      "order": "675order1234567",
      "product": {
        "_id": "675abc789ghi012",
        "name": "Jabón Natural",
        "price": 8.50,
        "imageUrl": ["https://example.com/jabon.jpg"]
      },
      "quantity": 1,
      "unitPrice": 8.50,
      "subtotal": 8.50
    },
    {
      "_id": "675item003",
      "order": "675order1234567",
      "product": {
        "_id": "675abc345jkl678",
        "name": "Crema Facial Orgánica",
        "price": 45.00,
        "imageUrl": ["https://example.com/crema.jpg"]
      },
      "quantity": 2,
      "unitPrice": 45.00,
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
    },
    {
      "type": "RECYCLED",
      "unit": "%",
      "totalValue": 80
    }
  ],
  "ecoScore": {
    "orderEcoScore": 67.4,
    "orderBadge": "🌿 Bajo Impacto General",
    "productScores": [
      {
        "productId": "675abc123def456",
        "productName": "Boxer Ecológico",
        "quantity": 1,
        "ecoScore": 72.75,
        "badge": "🌿 Bajo Impacto General"
      },
      {
        "productId": "675abc789ghi012",
        "productName": "Jabón Natural",
        "quantity": 1,
        "ecoScore": 62.5,
        "badge": "🌿 Bajo Impacto General"
      },
      {
        "productId": "675abc345jkl678",
        "productName": "Crema Facial Orgánica",
        "quantity": 2,
        "ecoScore": 58.3,
        "badge": "🌱 Impacto Medio"
      }
    ]
  }
}
```

**💡 Uso en Frontend:**

### Mostrar Resumen de Impacto
```jsx
<ImpactSummary>
  <h3>🌱 Tu impacto ambiental</h3>
  
  {/* CO₂ Generado */}
  <Metric>
    <Icon>🏭</Icon>
    <Label>CO₂ Generado</Label>
    <Value>2.3 kg CO₂e</Value>
  </Metric>
  
  {/* CO₂ Ahorrado */}
  <Metric highlight>
    <Icon>✅</Icon>
    <Label>CO₂ Ahorrado</Label>
    <Value>4.9 kg CO₂e</Value>
    <Message>¡Evitaste 4.9 kg de CO₂!</Message>
  </Metric>
  
  {/* Agua */}
  <Metric>
    <Icon>💧</Icon>
    <Label>Agua Usada</Label>
    <Value>50 litros</Value>
  </Metric>
  
  {/* Energía */}
  <Metric>
    <Icon>⚡</Icon>
    <Label>Energía Usada</Label>
    <Value>2.0 kWh</Value>
  </Metric>
</ImpactSummary>
```

### Mostrar Eco-Score de Orden
```jsx
<OrderEcoScore>
  <Badge large>{ecoScore.orderBadge}</Badge>
  <Score>
    <CircularProgress value={ecoScore.orderEcoScore} max={100} />
    <Text>{ecoScore.orderEcoScore}/100</Text>
  </Score>
  
  <ProductBreakdown>
    <h4>Desglose por producto:</h4>
    {ecoScore.productScores.map(ps => (
      <ProductScore key={ps.productId}>
        <Name>{ps.productName}</Name>
        <Quantity>×{ps.quantity}</Quantity>
        <Badge>{ps.badge}</Badge>
        <Score>{ps.ecoScore}/100</Score>
      </ProductScore>
    ))}
  </ProductBreakdown>
</OrderEcoScore>
```

---

## 4️⃣ GET /api/order/customer (Ver Órdenes del Cliente)

### Request
```http
GET http://localhost:3000/api/order/customer
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response
```json
[
  {
    "order": {
      "_id": "675order1234567",
      "customer": "675customer123",
      "status": "pending",
      "total": 125.99,
      "createdAt": "2025-12-04T10:30:00.000Z",
      "updatedAt": "2025-12-04T10:30:00.000Z"
    },
    "items": [
      {
        "_id": "675item001",
        "product": {
          "_id": "675abc123def456",
          "name": "Boxer Ecológico",
          "price": 25.99
        },
        "quantity": 1,
        "subtotal": 25.99
      }
    ],
    "impactSummary": [
      {
        "type": "CO2",
        "unit": "kg CO2e ahorrados",
        "totalValue": 4.9
      }
    ],
    "ecoScore": {
      "orderEcoScore": 67.4,
      "orderBadge": "🌿 Bajo Impacto General",
      "productScores": [
        {
          "productId": "675abc123def456",
          "productName": "Boxer Ecológico",
          "quantity": 1,
          "ecoScore": 72.75,
          "badge": "🌿 Bajo Impacto General"
        }
      ]
    }
  },
  {
    "order": {
      "_id": "675order7890123",
      "customer": "675customer123",
      "status": "delivered",
      "total": 89.50,
      "createdAt": "2025-12-01T15:20:00.000Z",
      "updatedAt": "2025-12-03T09:45:00.000Z"
    },
    "items": [...],
    "impactSummary": [...],
    "ecoScore": {
      "orderEcoScore": 81.2,
      "orderBadge": "🌳 Máximo Impacto Positivo",
      "productScores": [...]
    }
  }
]
```

**💡 Uso en Frontend:**
```jsx
<OrderHistory>
  {orders.map(({ order, impactSummary, ecoScore }) => (
    <OrderCard key={order._id}>
      <Header>
        <OrderNumber>#{order._id.slice(-6)}</OrderNumber>
        <Date>{formatDate(order.createdAt)}</Date>
        <Status status={order.status}>{order.status}</Status>
      </Header>
      
      <Total>${order.total}</Total>
      
      <EcoBadge>{ecoScore.orderBadge}</EcoBadge>
      
      <ImpactHighlight>
        💚 Ahorraste {impactSummary.find(i => i.unit.includes('ahorrados'))?.totalValue} kg CO₂
      </ImpactHighlight>
    </OrderCard>
  ))}
</OrderHistory>
```

---

## 🎨 Ejemplos de Componentes React/Vue

### React: Componente de Badge
```jsx
function EcoBadge({ badge, score }) {
  const getBadgeColor = (badge) => {
    if (badge.includes('🌳')) return 'green-900';
    if (badge.includes('🌿')) return 'green-700';
    if (badge.includes('🌱')) return 'yellow-600';
    return 'gray-500';
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full bg-${getBadgeColor(badge)}-100`}>
      <span className="text-lg mr-2">{badge.split(' ')[0]}</span>
      <span className={`text-sm font-medium text-${getBadgeColor(badge)}`}>
        {badge.split(' ').slice(1).join(' ')}
      </span>
      {score && (
        <span className="ml-2 text-xs opacity-75">
          {score}/100
        </span>
      )}
    </div>
  );
}
```

### React: Gráfico de Métricas
```jsx
function MetricsChart({ metrics }) {
  return (
    <div className="space-y-3">
      {metrics.map(metric => (
        <div key={metric.type} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{metric.type}</span>
            <span className="font-medium">{metric.score}/100</span>
          </div>
          
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all"
              style={{ width: `${metric.score}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>{metric.value} {metric.unit}</span>
            <span>vs {metric.comparisonValue} {metric.unit}</span>
            <span className="font-medium">Peso: {metric.weight}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Leyenda de Badges

| Badge | Rango | Significado | Color Sugerido |
|-------|-------|-------------|----------------|
| 🌳 Máximo Impacto Positivo | 80-100 | Producto excepcional | Verde oscuro (#065f46) |
| 🌿 Bajo Impacto General | 60-79 | Producto sostenible | Verde (#059669) |
| 🌱 Impacto Medio | 40-59 | Impacto moderado | Amarillo (#ca8a04) |
| 🟡 Impacto Estándar | 0-39 | Similar al mercado | Gris (#6b7280) |

---

## 🔍 Notas Importantes

1. **Campo `ecoScore` puede ser `null`**: Si un producto no tiene métricas, `ecoScore` será `null`. Siempre verifica antes de renderizar.

2. **Unidades consistentes**: Las métricas siempre tienen `unit` que indica la unidad de medida. Úsala para mostrar correctamente.

3. **Ahorro de CO₂**: Se identifica por `unit: "kg CO2e ahorrados"` en el `impactSummary`.

4. **Peso en porcentaje**: El campo `weight` viene en escala 0-100 (ej: 50 = 50%), ya convertido para mostrar.

5. **Score redondeado**: Todos los scores vienen redondeados a 1 decimal para facilitar visualización.
