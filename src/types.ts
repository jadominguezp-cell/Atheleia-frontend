export type ClienteTipo = 'NACIONAL' | 'EXTRANJERO'

export type EstadoDocumento = 'NO_CARGADO' | 'CARGADO' | 'OBSERVADO' | 'APROBADO'

export type RiesgoNivel = 'BAJO' | 'MEDIO' | 'ALTO'

export interface DocumentoRequerido {
  id: string
  nombre: string
  descripcionLegal: string
  obligatorio: boolean
  estado: EstadoDocumento
  archivoNombre?: string
  ultimaActualizacion?: string
  usuario?: string
  observaciones?: string
}

export interface FactoresRiesgo {
  actividadEconomica: RiesgoNivel
  paisOrigen: RiesgoNivel
  tipoActivo: RiesgoNivel
  montoOperacion: RiesgoNivel
  estructuraSocietaria: RiesgoNivel
}

export interface Operacion {
  id: string
  tipoOperacion: 'COMPRA' | 'VENTA'
  empresaCompradora: string
  empresaVendedora: string
  paisContraparte: string
  actividadEconomica: string
  monto: number
  fechaTentativaCierre: string
  estadoCumplimiento: 'COMPLETO' | 'PENDIENTE' | 'OBSERVADO'
  riesgo: RiesgoNivel
  clienteTipo: ClienteTipo
  documentos: DocumentoRequerido[]
  factoresRiesgo: FactoresRiesgo
  observacionesLegales?: string
}

export interface MensajeChat {
  id: string
  remitente: 'USUARIO' | 'SISTEMA'
  texto: string
  timestamp: string
}

