import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { crearChecklistBase } from '../services/checklistService'
import { calcularRiesgoGlobal } from '../services/riskService'
import type { DocumentoRequerido, FactoresRiesgo, Operacion, RiesgoNivel } from '../types'

type SetOperaciones = React.Dispatch<React.SetStateAction<Operacion[]>>

interface OperationsContextValue {
  operaciones: Operacion[]
  setOperaciones: SetOperaciones
  operacionSeleccionadaId: string
  setOperacionSeleccionadaId: (id: string) => void
  operacionSeleccionada: Operacion | null
  actualizarDocumento: (operacionId: string, docId: string, cambios: Partial<DocumentoRequerido>) => void
  actualizarFactoresRiesgo: (operacionId: string, factor: keyof FactoresRiesgo, valor: RiesgoNivel) => void
  guardarObservacionesLegales: (operacionId: string, texto: string) => void
}

const OperationsContext = createContext<OperationsContextValue | null>(null)

const OPERACION_DEMO: Operacion = (() => {
  const factores: FactoresRiesgo = {
    actividadEconomica: 'MEDIO',
    paisOrigen: 'MEDIO',
    tipoActivo: 'MEDIO',
    montoOperacion: 'MEDIO',
    estructuraSocietaria: 'BAJO',
  }
  return {
    id: 'OP-0001',
    tipoOperacion: 'COMPRA',
    empresaCompradora: 'Andes Energy S.A.C.',
    empresaVendedora: 'Global Assets Ltd.',
    paisContraparte: 'Canadá',
    actividadEconomica: 'Comercialización de activos',
    monto: 5_000_000,
    fechaTentativaCierre: '2026-06-30',
    estadoCumplimiento: 'PENDIENTE',
    riesgo: 'MEDIO',
    clienteTipo: 'EXTRANJERO',
    documentos: crearChecklistBase('EXTRANJERO'),
    factoresRiesgo: factores,
    observacionesLegales:
      'Pendiente revisión integral de documentación de respaldo de origen de fondos.',
  }
})()

export function OperationsProvider({ children }: { children: ReactNode }) {
  const [operaciones, setOperaciones] = useState<Operacion[]>([OPERACION_DEMO])
  const [operacionSeleccionadaId, setOperacionSeleccionadaId] = useState<string>(OPERACION_DEMO.id)

  const operacionSeleccionada = useMemo(
    () => operaciones.find((op) => op.id === operacionSeleccionadaId) ?? operaciones[0] ?? null,
    [operaciones, operacionSeleccionadaId],
  )

  const actualizarDocumento = useCallback(
    (operacionId: string, docId: string, cambios: Partial<DocumentoRequerido>) => {
      setOperaciones((prev) =>
        prev.map((op) => {
          if (op.id !== operacionId) return op
          return {
            ...op,
            documentos: op.documentos.map((doc) =>
              doc.id === docId ? { ...doc, ...cambios } : doc,
            ),
          }
        }),
      )
    },
    [],
  )

  const actualizarFactoresRiesgo = useCallback(
    (operacionId: string, factor: keyof FactoresRiesgo, valor: RiesgoNivel) => {
      setOperaciones((prev) =>
        prev.map((op) => {
          if (op.id !== operacionId) return op
          const nuevosFactores = { ...op.factoresRiesgo, [factor]: valor }
          return {
            ...op,
            factoresRiesgo: nuevosFactores,
            riesgo: calcularRiesgoGlobal(nuevosFactores),
          }
        }),
      )
    },
    [],
  )

  const guardarObservacionesLegales = useCallback((operacionId: string, texto: string) => {
    setOperaciones((prev) =>
      prev.map((op) => (op.id === operacionId ? { ...op, observacionesLegales: texto } : op)),
    )
  }, [])

  const value = useMemo<OperationsContextValue>(
    () => ({
      operaciones,
      setOperaciones,
      operacionSeleccionadaId,
      setOperacionSeleccionadaId,
      operacionSeleccionada,
      actualizarDocumento,
      actualizarFactoresRiesgo,
      guardarObservacionesLegales,
    }),
    [
      operaciones,
      operacionSeleccionadaId,
      operacionSeleccionada,
      actualizarDocumento,
      actualizarFactoresRiesgo,
      guardarObservacionesLegales,
    ],
  )

  return (
    <OperationsContext.Provider value={value}>
      {children}
    </OperationsContext.Provider>
  )
}

export function useOperations(): OperationsContextValue {
  const ctx = useContext(OperationsContext)
  if (!ctx) throw new Error('useOperations must be used within OperationsProvider')
  return ctx
}
