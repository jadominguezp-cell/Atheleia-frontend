import { useMemo } from 'react'
import type { Operacion } from '../types'

/** Porcentaje de cumplimiento y documentos pendientes (Single Responsibility) */
export function useComplianceProgress(operacion: Operacion | null) {
  return useMemo(() => {
    if (!operacion) return { porcentaje: 0, documentosPendientes: 0 }
    const total = operacion.documentos.length
    const aprobadosOCargados = operacion.documentos.filter(
      (d) => d.estado === 'APROBADO' || d.estado === 'CARGADO',
    ).length
    const pendientes = operacion.documentos.filter(
      (d) => d.estado === 'NO_CARGADO' || d.estado === 'OBSERVADO',
    ).length
    return {
      porcentaje: total ? Math.round((aprobadosOCargados / total) * 100) : 0,
      documentosPendientes: pendientes,
    }
  }, [operacion])
}
