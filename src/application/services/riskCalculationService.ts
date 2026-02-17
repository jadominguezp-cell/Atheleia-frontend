import type { Probabilidad, Impacto, NivelRiesgo } from '../../domain/risk/risk.types'

const P_SCORE: Record<Probabilidad, number> = { Baja: 1, Media: 2, Alta: 3 }
const I_SCORE: Record<Impacto, number> = { Bajo: 1, Medio: 2, Alto: 3 }

/** Riesgo = Probabilidad x Impacto. 1-2 Bajo, 3-4 Medio, 6-9 Alto. */
export function calcularNivelRiesgo(probabilidad: Probabilidad, impacto: Impacto): NivelRiesgo {
  const p = P_SCORE[probabilidad]
  const i = I_SCORE[impacto]
  const producto = p * i
  if (producto <= 2) return 'Bajo'
  if (producto <= 4) return 'Medio'
  return 'Alto'
}

/** Riesgo global a partir de la suma de puntajes (1=Bajo, 2=Medio, 3=Alto) por indicador, promediado y redondeado. */
export function calcularRiesgoGlobal(niveles: NivelRiesgo[]): NivelRiesgo {
  const score: Record<NivelRiesgo, number> = { Bajo: 1, Medio: 2, Alto: 3 }
  if (niveles.length === 0) return 'Bajo'
  const suma = niveles.reduce((acc, n) => acc + score[n], 0)
  const prom = suma / niveles.length
  if (prom <= 1.5) return 'Bajo'
  if (prom <= 2.5) return 'Medio'
  return 'Alto'
}
