/**
 * Configuración del sistema de Eco-Score
 * Define los pesos de cada métrica y los umbrales para badges
 */

import { ImpactMetricType } from '../impact_metric/impact-metric.schema';

/**
 * Pesos (ponderación) de cada métrica para el cálculo del Eco-Score
 * La suma debe ser 100%
 */
export const METRIC_WEIGHTS: Record<ImpactMetricType, number> = {
  CO2: 0.50,      // 50% - Emisiones de carbono
  WATER: 0.30,    // 30% - Consumo de agua
  ENERGY: 0.15,   // 15% - Consumo energético
  RECYCLED: 0.05, // 5%  - Material reciclado
  TRANSPORT: 0.0, // 0%  - Por ahora no se pondera (puedes ajustarlo)
};

/**
 * Umbrales para asignación de badges basados en el Eco-Score (0-100)
 */
export interface EcoBadgeThreshold {
  minScore: number;
  maxScore: number;
  badge: string;
  description: string;
}

export const ECO_BADGE_THRESHOLDS: EcoBadgeThreshold[] = [
  {
    minScore: 80,
    maxScore: 100,
    badge: '🌳 Máximo Impacto Positivo',
    description: 'Producto excepcional con el menor impacto ambiental',
  },
  {
    minScore: 60,
    maxScore: 79,
    badge: '🌿 Bajo Impacto General',
    description: 'Producto sostenible con impacto reducido',
  },
  {
    minScore: 40,
    maxScore: 59,
    badge: '🌱 Impacto Medio',
    description: 'Producto con impacto ambiental moderado',
  },
  {
    minScore: 0,
    maxScore: 39,
    badge: '🟡 Impacto Estándar',
    description: 'Producto con impacto similar al estándar del mercado',
  },
];

/**
 * Configuración para métricas especiales que se calculan de forma diferente
 * (por ejemplo, RECYCLED donde mayor valor es mejor)
 */
export const INVERSE_METRICS: ImpactMetricType[] = ['RECYCLED'];
