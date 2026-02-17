/** Documentos que Aletheia puede revelar (búsqueda automática vs manual) con descripción obligatoria */
export interface DocumentoReveal {
  id: string
  nombre: string
  automatizable: boolean
  descripcion: string
}

export const DOCUMENTOS_REVEAL: DocumentoReveal[] = [
  { id: 'reniec', nombre: 'CONSULTA RENIEC', automatizable: true, descripcion: 'Verificación de identidad, nombres completos y estado civil del titular del DNI.' },
  { id: 'sunat', nombre: 'CONSULTA SUNAT', automatizable: true, descripcion: 'Confirmación de situación tributaria, estado del RUC y actividad económica declarada.' },
  { id: 'migraciones', nombre: 'CONSULTA EN LA PÁGINA WEB DE MIGRACIONES', automatizable: false, descripcion: 'Validación de registros migratorios y permanencia en territorio nacional.' },
  { id: 'infogob', nombre: 'CONSULTA EN LA PÁGINA WEB DE INFOGOB', automatizable: false, descripcion: 'Identificación de vínculos políticos y antecedentes de participación pública.' },
  { id: 'essalud', nombre: 'CONSULTA EN LA PÁGINA WEB DE ESSALUD', automatizable: false, descripcion: 'Verificación de condición laboral registrada.' },
  { id: 'centrales-riesgos', nombre: 'CONSULTA EN CENTRALES DE RIESGOS', automatizable: false, descripcion: 'Revisión de historial crediticio y comportamiento financiero.' },
  { id: 'sunarp', nombre: 'CONSULTA EN SUNARP', automatizable: true, descripcion: 'Identificación de bienes, poderes inscritos y representación legal vigente.' },
  { id: 'ficha-ruc', nombre: 'SOLICITUD DE FICHA RUC', automatizable: true, descripcion: 'Obtención del detalle ampliado del contribuyente inscrito.' },
]
