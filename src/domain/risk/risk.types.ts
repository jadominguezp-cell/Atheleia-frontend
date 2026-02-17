export type Probabilidad = 'Baja' | 'Media' | 'Alta'
export type Impacto = 'Bajo' | 'Medio' | 'Alto'
export type NivelRiesgo = 'Bajo' | 'Medio' | 'Alto'
export type TipoIndicador = 'Referencia' | 'Personalizado'

export interface IndicadorRiesgo {
  id: string
  nombre: string
  tipo: TipoIndicador
  probabilidad: Probabilidad
  impacto: Impacto
  nivelRiesgo: NivelRiesgo
  observaciones: string
}

export interface MatrizRiesgoState {
  indicadores: IndicadorRiesgo[]
  riesgoGlobal: NivelRiesgo
}
