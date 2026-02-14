import type { ClienteTipo } from './cliente'
import type { DocumentoRequerido } from './documento'
import type { FactoresRiesgo, RiesgoNivel } from './riesgo'

export type TipoOperacion = 'COMPRA' | 'VENTA'
export type EstadoCumplimiento = 'COMPLETO' | 'PENDIENTE' | 'OBSERVADO'

export interface Operacion {
  id: string
  tipoOperacion: TipoOperacion
  empresaCompradora: string
  empresaVendedora: string
  paisContraparte: string
  actividadEconomica: string
  monto: number
  fechaTentativaCierre: string
  estadoCumplimiento: EstadoCumplimiento
  riesgo: RiesgoNivel
  clienteTipo: ClienteTipo
  documentos: DocumentoRequerido[]
  factoresRiesgo: FactoresRiesgo
  observacionesLegales?: string
}
