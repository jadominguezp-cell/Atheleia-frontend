import type { ClienteTipo } from '../types/cliente'
import type { DocumentoRequerido } from '../types/documento'

/** Servicio de creación de checklist SPLAF por tipo de cliente (Single Responsibility) */
export function crearChecklistBase(tipoCliente: ClienteTipo): DocumentoRequerido[] {
  const base: DocumentoRequerido[] = [
    {
      id: 'escritura',
      nombre: 'Escritura de constitución',
      descripcionLegal:
        'Permite identificar la constitución y estructura societaria de la empresa conforme a la normativa societaria aplicable.',
      obligatorio: true,
      estado: 'NO_CARGADO',
    },
    {
      id: 'poderes',
      nombre: 'Certificado de vigencia de poderes',
      descripcionLegal:
        'Acredita las facultades de los representantes legales que intervienen en la operación.',
      obligatorio: true,
      estado: 'NO_CARGADO',
    },
    {
      id: 'eeff',
      nombre: 'Estados financieros',
      descripcionLegal:
        'Permiten evaluar la situación económica y la capacidad financiera del cliente.',
      obligatorio: true,
      estado: 'NO_CARGADO',
    },
    {
      id: 'beneficiario-final',
      nombre: 'Declaración de beneficiario final',
      descripcionLegal:
        'Identifica a la persona natural que detenta el control efectivo o la propiedad real de la empresa, según normativa SPLAF.',
      obligatorio: true,
      estado: 'NO_CARGADO',
    },
    {
      id: 'origen-fondos',
      nombre: 'Certificación de origen lícito de fondos',
      descripcionLegal:
        'Documento mediante el cual el cliente declara y sustenta que los fondos involucrados provienen de actividades lícitas.',
      obligatorio: true,
      estado: 'NO_CARGADO',
    },
    {
      id: 'listas-restrictivas',
      nombre: 'Constancia de no estar en listas restrictivas',
      descripcionLegal:
        'Permite documentar que el cliente y sus beneficiarios finales no se encuentran en listas de sanciones o riesgo.',
      obligatorio: true,
      estado: 'NO_CARGADO',
    },
  ]

  if (tipoCliente === 'EXTRANJERO') {
    base.push(
      {
        id: 'certificado-incorporacion',
        nombre: 'Certificado de incorporación o good standing',
        descripcionLegal:
          'Acredita la existencia legal de la empresa extranjera y su vigencia en la jurisdicción de origen.',
        obligatorio: true,
        estado: 'NO_CARGADO',
      },
      {
        id: 'traducciones',
        nombre: 'Traducciones oficiales',
        descripcionLegal:
          'Traducciones oficiales al castellano de la documentación corporativa relevante para efectos de debida diligencia.',
        obligatorio: false,
        estado: 'NO_CARGADO',
      },
    )
  }

  return base
}
