/** Documentos que Aletheia puede revelar (búsqueda automática vs manual) */
export interface DocumentoReveal {
  id: string
  nombre: string
  automatizable: boolean
}

export const DOCUMENTOS_REVEAL: DocumentoReveal[] = [
  { id: 'reniec', nombre: 'CONSULTA RENIEC', automatizable: true },
  { id: 'sunat', nombre: 'CONSULTA SUNAT', automatizable: true },
  { id: 'migraciones', nombre: 'CONSULTA EN LA PAGINA WEB DE MIGRACIONES', automatizable: false },
  { id: 'infogob', nombre: 'CONSULTA EN LA PAGINA WEB DE INFOGOB', automatizable: false },
  { id: 'essalud', nombre: 'CONSULTA EN LA PAGINA WEB DE ESSALUD', automatizable: false },
  { id: 'centrales-riesgos', nombre: 'CONSULTA EN CENTRALES DE RIESGOS', automatizable: false },
  { id: 'sunarp', nombre: 'CONSULTA EN SUNARP', automatizable: true },
  { id: 'ficha-ruc', nombre: 'SOLICITUD DE FICHA RUC', automatizable: true },
]
