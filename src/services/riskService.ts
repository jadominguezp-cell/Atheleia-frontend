import type { FactoresRiesgo, RiesgoNivel } from '../types/riesgo'

/** Cálculo de riesgo global a partir de factores (Single Responsibility) */
export function calcularRiesgoGlobal(factores: FactoresRiesgo): RiesgoNivel {
  const puntaje = Object.values(factores).reduce((acc, nivel) => {
    if (nivel === 'BAJO') return acc + 1
    if (nivel === 'MEDIO') return acc + 2
    return acc + 3
  }, 0)
  if (puntaje <= 6) return 'BAJO'
  if (puntaje <= 9) return 'MEDIO'
  return 'ALTO'
}

export function riesgoALabel(riesgo: RiesgoNivel): string {
  if (riesgo === 'BAJO') return 'Bajo'
  if (riesgo === 'MEDIO') return 'Medio'
  return 'Alto'
}
