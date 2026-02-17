import { useState, useCallback, useMemo } from 'react'
import type { IndicadorRiesgo, Probabilidad, Impacto, NivelRiesgo } from '../domain/risk/risk.types'
import { calcularNivelRiesgo, calcularRiesgoGlobal } from '../application/services/riskCalculationService'

const INDICADORES_REFERENCIA: Omit<IndicadorRiesgo, 'id'>[] = [
  { nombre: 'Coincidencia en listas restrictivas internacionales', tipo: 'Referencia', probabilidad: 'Media', impacto: 'Alto', nivelRiesgo: 'Medio', observaciones: '' },
  { nombre: 'Identificación como Persona Expuesta Políticamente (PEP)', tipo: 'Referencia', probabilidad: 'Baja', impacto: 'Alto', nivelRiesgo: 'Medio', observaciones: '' },
  { nombre: 'Inconsistencias patrimoniales', tipo: 'Referencia', probabilidad: 'Media', impacto: 'Medio', nivelRiesgo: 'Medio', observaciones: '' },
  { nombre: 'Operaciones con jurisdicciones de alto riesgo', tipo: 'Referencia', probabilidad: 'Media', impacto: 'Alto', nivelRiesgo: 'Medio', observaciones: '' },
  { nombre: 'Estructura societaria compleja o poco transparente', tipo: 'Referencia', probabilidad: 'Baja', impacto: 'Medio', nivelRiesgo: 'Bajo', observaciones: '' },
  { nombre: 'Historial crediticio adverso significativo', tipo: 'Referencia', probabilidad: 'Media', impacto: 'Medio', nivelRiesgo: 'Medio', observaciones: '' },
  { nombre: 'Actividad económica no consistente con volumen de operación', tipo: 'Referencia', probabilidad: 'Baja', impacto: 'Alto', nivelRiesgo: 'Medio', observaciones: '' },
]

function buildIndicador(overrides: Partial<IndicadorRiesgo> & { nombre: string; tipo: IndicadorRiesgo['tipo']; probabilidad: Probabilidad; impacto: Impacto }, id: string): IndicadorRiesgo {
  const nivelRiesgo = calcularNivelRiesgo(overrides.probabilidad, overrides.impacto)
  return {
    id,
    nombre: overrides.nombre,
    tipo: overrides.tipo,
    probabilidad: overrides.probabilidad,
    impacto: overrides.impacto,
    nivelRiesgo,
    observaciones: overrides.observaciones ?? '',
  }
}

export function useRiskMatrix() {
  const [indicadores, setIndicadores] = useState<IndicadorRiesgo[]>(() =>
    INDICADORES_REFERENCIA.map((ind, i) =>
      buildIndicador({ ...ind }, `ref-${i}`),
    ),
  )

  const riesgoGlobal = useMemo<NivelRiesgo>(() => {
    return calcularRiesgoGlobal(indicadores.map((i) => i.nivelRiesgo))
  }, [indicadores])

  const updateIndicador = useCallback((id: string, updates: Partial<Pick<IndicadorRiesgo, 'probabilidad' | 'impacto' | 'observaciones'>>) => {
    setIndicadores((prev) =>
      prev.map((ind) => {
        if (ind.id !== id) return ind
        const prob = updates.probabilidad ?? ind.probabilidad
        const imp = updates.impacto ?? ind.impacto
        const nivel = calcularNivelRiesgo(prob, imp)
        return { ...ind, ...updates, nivelRiesgo: nivel }
      }),
    )
  }, [])

  const addPersonalizado = useCallback((nombre: string, descripcion: string, probabilidad: Probabilidad, impacto: Impacto) => {
    const id = `custom-${Date.now()}`
    const nuevo = buildIndicador({ nombre, tipo: 'Personalizado', probabilidad, impacto, observaciones: descripcion }, id)
    setIndicadores((prev) => [...prev, nuevo])
  }, [])

  return { indicadores, riesgoGlobal, updateIndicador, addPersonalizado }
}
