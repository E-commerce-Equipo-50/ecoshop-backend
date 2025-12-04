/**
 * Utilidades para el cálculo del Eco-Score y asignación de badges
 */

import {
  ImpactMetric,
  ImpactMetricType,
} from '../../impact_metric/impact-metric.schema';
import {
  METRIC_WEIGHTS,
  ECO_BADGE_THRESHOLDS,
  INVERSE_METRICS,
} from '../../config/eco-score.config';

/**
 * Interface para el detalle de cada métrica en el cálculo
 */
export interface MetricScoreDetail {
  type: ImpactMetricType;
  value: number;
  comparisonValue: number;
  unit: string;
  score: number; // Puntuación normalizada (0-100)
  weight: number; // Peso de esta métrica
  contribution: number; // Contribución al Eco-Score final (score × weight)
}

/**
 * Interface para el resultado completo del Eco-Score
 */
export interface EcoScoreResult {
  ecoScore: number; // Puntuación final (0-100)
  badge: string; // Badge asignado (ej: "🌳 Máximo Impacto Positivo")
  description: string; // Descripción del badge
  metrics: MetricScoreDetail[]; // Detalle de cada métrica
}

/**
 * Calcula la puntuación normalizada de una métrica individual (0-100)
 *
 * Para métricas normales (CO2, WATER, ENERGY): menor es mejor
 * Fórmula: Score = 100 - (value / comparison_value × 100)
 *
 * Para métricas inversas (RECYCLED): mayor es mejor
 * Fórmula: Score = (value / comparison_value × 100)
 *
 * @param value - Valor de la métrica del producto eco
 * @param comparisonValue - Valor de referencia (producto estándar)
 * @param type - Tipo de métrica
 * @returns Puntuación de 0 a 100
 */
export function calculateMetricScore(
  value: number,
  comparisonValue: number,
  type: ImpactMetricType,
): number {
  // Validación: evitar división por cero
  if (comparisonValue === 0) {
    return 0;
  }

  // Para métricas inversas (RECYCLED), mayor valor = mejor puntuación
  if (INVERSE_METRICS.includes(type)) {
    const score = (value / comparisonValue) * 100;
    return Math.min(100, Math.max(0, score)); // Limitar entre 0-100
  }

  // Para métricas normales (CO2, WATER, ENERGY), menor valor = mejor puntuación
  const score = 100 - (value / comparisonValue) * 100;
  return Math.min(100, Math.max(0, score)); // Limitar entre 0-100
}

/**
 * Calcula el Eco-Score compuesto de un producto basado en todas sus métricas
 *
 * Algoritmo:
 * 1. Para cada métrica, calcula su puntuación normalizada (0-100)
 * 2. Aplica el peso correspondiente a cada puntuación
 * 3. Suma todas las contribuciones ponderadas
 * 4. Asigna el badge correspondiente según umbrales
 *
 * @param metrics - Array de métricas de impacto del producto
 * @returns Resultado completo del Eco-Score con badge y detalles
 */
export function calculateEcoScore(metrics: ImpactMetric[]): EcoScoreResult {
  // Si no hay métricas, retornar puntuación neutra
  if (!metrics || metrics.length === 0) {
    return {
      ecoScore: 50,
      badge: '🌱 Impacto Medio',
      description: 'Sin métricas de impacto disponibles',
      metrics: [],
    };
  }

  const metricDetails: MetricScoreDetail[] = [];
  let totalWeightedScore = 0;
  let totalWeightUsed = 0;

  // Procesar cada métrica
  for (const metric of metrics) {
    // Solo procesar métricas que tienen comparison_value
    if (
      metric.comparison_value === undefined ||
      metric.comparison_value === null
    ) {
      continue;
    }

    const type = metric.type;
    const weight = METRIC_WEIGHTS[type] || 0;

    // Si esta métrica no tiene peso configurado, saltarla
    if (weight === 0) {
      continue;
    }

    // Calcular puntuación normalizada
    const score = calculateMetricScore(
      metric.value,
      metric.comparison_value,
      type,
    );

    // Calcular contribución ponderada
    const contribution = score * weight;

    metricDetails.push({
      type,
      value: metric.value,
      comparisonValue: metric.comparison_value,
      unit: metric.unit,
      score: Math.round(score * 10) / 10, // Redondear a 1 decimal
      weight: weight * 100, // Convertir a porcentaje para mostrar
      contribution: Math.round(contribution * 10) / 10,
    });

    totalWeightedScore += contribution;
    totalWeightUsed += weight;
  }

  // Normalizar el score si no se usó el 100% del peso configurado
  // (por ejemplo, si un producto solo tiene métricas de CO2 y WATER)
  const finalScore =
    totalWeightUsed > 0 ? totalWeightedScore / totalWeightUsed : 50;

  // Redondear a 1 decimal
  const roundedScore = Math.round(finalScore * 10) / 10;

  // Asignar badge según umbrales
  const badgeInfo = getEcoBadge(roundedScore);

  return {
    ecoScore: roundedScore,
    badge: badgeInfo.badge,
    description: badgeInfo.description,
    metrics: metricDetails,
  };
}

/**
 * Asigna un badge basado en el Eco-Score
 *
 * @param ecoScore - Puntuación del Eco-Score (0-100)
 * @returns Información del badge (nombre y descripción)
 */
export function getEcoBadge(ecoScore: number): {
  badge: string;
  description: string;
} {
  // Buscar el umbral correspondiente
  for (const threshold of ECO_BADGE_THRESHOLDS) {
    if (ecoScore >= threshold.minScore && ecoScore <= threshold.maxScore) {
      return {
        badge: threshold.badge,
        description: threshold.description,
      };
    }
  }

  // Fallback (no debería ocurrir si los umbrales cubren 0-100)
  return {
    badge: '🌱 Impacto Medio',
    description: 'Puntuación no clasificada',
  };
}
