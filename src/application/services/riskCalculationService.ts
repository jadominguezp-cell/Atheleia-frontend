import type { ProbabilidadNivel, ImpactoNivel, NivelRiesgo } from '../../domain/risk/risk.types'

/** Riesgo = Probabilidad x Impacto. 1-2 Bajo, 3-4 Medio, 6-9 Alto. */
export function calcularNivelRiesgo(probabilidad: ProbabilidadNivel, impacto: ImpactoNivel): NivelRiesgo {
  const producto = probabilidad * impacto
  if (producto <= 2) return 'Bajo'
  if (producto <= 4) return 'Medio'
  return 'Alto'
}

/** Riesgo global a partir de la suma de puntajes promediada. */
export function calcularRiesgoGlobal(niveles: NivelRiesgo[]): NivelRiesgo {
  const score: Record<NivelRiesgo, number> = { Bajo: 1, Medio: 2, Alto: 3 }
  if (niveles.length === 0) return 'Bajo'
  const suma = niveles.reduce((acc, n) => acc + score[n], 0)
  const prom = suma / niveles.length
  if (prom <= 1.5) return 'Bajo'
  if (prom <= 2.5) return 'Medio'
  return 'Alto'
}
