import './App.css'
import { useMemo, useState } from 'react'
import type {
  ClienteTipo,
  DocumentoRequerido,
  EstadoDocumento,
  FactoresRiesgo,
  MensajeChat,
  Operacion,
  RiesgoNivel,
} from './types'

const fechaActualISO = () => new Date().toISOString()

const crearChecklistBase = (tipoCliente: ClienteTipo): DocumentoRequerido[] => {
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

const riesgoTexto = (riesgo: RiesgoNivel) => {
  if (riesgo === 'BAJO') return 'Bajo'
  if (riesgo === 'MEDIO') return 'Medio'
  return 'Alto'
}

const estadoDocumentoTexto = (estado: EstadoDocumento) => {
  switch (estado) {
    case 'NO_CARGADO':
      return 'No cargado'
    case 'CARGADO':
      return 'Cargado'
    case 'OBSERVADO':
      return 'Observado'
    case 'APROBADO':
      return 'Aprobado'
    default:
      return estado
  }
}

const calcularRiesgoGlobal = (factores: FactoresRiesgo): RiesgoNivel => {
  const puntaje = Object.values(factores).reduce((acc, nivel) => {
    if (nivel === 'BAJO') return acc + 1
    if (nivel === 'MEDIO') return acc + 2
    return acc + 3
  }, 0)

  if (puntaje <= 6) return 'BAJO'
  if (puntaje <= 9) return 'MEDIO'
  return 'ALTO'
}

const App = () => {
  const [operaciones, setOperaciones] = useState<Operacion[]>(() => {
    const factoresIniciales: FactoresRiesgo = {
      actividadEconomica: 'MEDIO',
      paisOrigen: 'MEDIO',
      tipoActivo: 'MEDIO',
      montoOperacion: 'MEDIO',
      estructuraSocietaria: 'BAJO',
    }

    const documentos = crearChecklistBase('EXTRANJERO')

    const operacionDemo: Operacion = {
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
      documentos,
      factoresRiesgo: factoresIniciales,
      observacionesLegales: 'Pendiente revisión integral de documentación de respaldo de origen de fondos.',
    }

    return [operacionDemo]
  })

  const [operacionSeleccionadaId, setOperacionSeleccionadaId] = useState<string>('OP-0001')
  const [observacionesTemporales, setObservacionesTemporales] = useState<string>('')
  const [mensajesChat, setMensajesChat] = useState<MensajeChat[]>([
    {
      id: 'intro',
      remitente: 'SISTEMA',
      texto:
        'Bienvenido al asistente legal interno para SPLAF. Puede hacer preguntas sobre requisitos de identificación, diferencias entre clientes nacionales y extranjeros, y motivos legales de cada documento.',
      timestamp: fechaActualISO(),
    },
  ])
  const [preguntaChat, setPreguntaChat] = useState<string>('')

  const operacionSeleccionada = useMemo(
    () => operaciones.find((op) => op.id === operacionSeleccionadaId) ?? operaciones[0],
    [operaciones, operacionSeleccionadaId],
  )

  const porcentajeCumplimiento = useMemo(() => {
    if (!operacionSeleccionada) return 0
    const total = operacionSeleccionada.documentos.length
    const aprobados = operacionSeleccionada.documentos.filter(
      (d) => d.estado === 'APROBADO' || d.estado === 'CARGADO',
    ).length
    return Math.round((aprobados / total) * 100)
  }, [operacionSeleccionada])

  const actualizarDocumento = (docId: string, cambios: Partial<DocumentoRequerido>) => {
    setOperaciones((prev) =>
      prev.map((op) => {
        if (op.id !== operacionSeleccionada?.id) return op
        return {
          ...op,
          documentos: op.documentos.map((doc) =>
            doc.id === docId
              ? {
                  ...doc,
                  ...cambios,
                }
              : doc,
          ),
        }
      }),
    )
  }

  const manejarCargaMockDocumento = (doc: DocumentoRequerido) => {
    const ahora = fechaActualISO()
    actualizarDocumento(doc.id, {
      estado: 'CARGADO',
      archivoNombre: `${doc.id}-${operacionSeleccionada?.id}.pdf`,
      ultimaActualizacion: ahora,
      usuario: 'usuario.demo@empresa.com',
    })
  }

  const manejarCambioEstadoDocumento = (doc: DocumentoRequerido, nuevoEstado: EstadoDocumento) => {
    const ahora = fechaActualISO()
    actualizarDocumento(doc.id, {
      estado: nuevoEstado,
      ultimaActualizacion: ahora,
      usuario: 'usuario.demo@empresa.com',
    })
  }

  const manejarGuardarObservacionesLegales = () => {
    if (!operacionSeleccionada) return
    setOperaciones((prev) =>
      prev.map((op) =>
        op.id === operacionSeleccionada.id ? { ...op, observacionesLegales: observacionesTemporales } : op,
      ),
    )
  }

  const manejarCambioFactorRiesgo = (factor: keyof FactoresRiesgo, valor: RiesgoNivel) => {
    if (!operacionSeleccionada) return
    setOperaciones((prev) =>
      prev.map((op) => {
        if (op.id !== operacionSeleccionada.id) return op
        const nuevosFactores = { ...op.factoresRiesgo, [factor]: valor }
        const nuevoRiesgo = calcularRiesgoGlobal(nuevosFactores)
        return {
          ...op,
          factoresRiesgo: nuevosFactores,
          riesgo: nuevoRiesgo,
        }
      }),
    )
  }

  const responderChat = (pregunta: string): string => {
    const p = pregunta.toLowerCase()

    if (p.includes('nacional') || p.includes('extranjero')) {
      return (
        'En el marco de la Resolución SBS N.° 789-2018, los clientes extranjeros suelen requerir un nivel ' +
        'de diligencia reforzada, incluyendo certificados de incorporación, good standing y, en su caso, ' +
        'traducciones oficiales. Los clientes nacionales se rigen por los documentos corporativos locales ' +
        'y registros públicos peruanos.'
      )
    }

    if (p.includes('beneficiario') || p.includes('final')) {
      return (
        'La declaración de beneficiario final es obligatoria para identificar a la persona natural que ' +
        'ejerce el control efectivo o la propiedad real de la empresa. Es un elemento central de las políticas ' +
        'de conocimiento del cliente (KYC) exigidas por la normativa SPLAF.'
      )
    }

    if (p.includes('origen') && p.includes('fond')) {
      return (
        'La certificación de origen lícito de fondos documenta que los recursos involucrados provienen de ' +
        'actividades legales. Permite mitigar el riesgo de que la operación sea utilizada para encubrir ' +
        'operaciones de lavado de activos o financiamiento del terrorismo.'
      )
    }

    if (p.includes('listas') || p.includes('restrictiv') || p.includes('sancion')) {
      return (
        'La constancia de no estar en listas restrictivas respalda que el cliente, sus representantes y ' +
        'beneficiarios finales no se encuentran incluidos en listas de sanciones nacionales o internacionales, ' +
        'lo cual reduce el riesgo legal y reputacional.'
      )
    }

    if (p.includes('requisito') || p.includes('document') || p.includes('checklist')) {
      return (
        'El checklist de documentos de identificación se construye en función del tipo de cliente, tipo de ' +
        'operación, monto y nivel de riesgo. Incluye, como mínimo, escritura de constitución, vigencia de ' +
        'poderes, estados financieros, beneficiario final, origen de fondos y verificación en listas restrictivas.'
      )
    }

    return (
      'Esta herramienta brinda información referencial sobre requisitos de identificación, verificación y ' +
      'gestión de riesgo bajo la normativa SPLAF. Para un análisis concreto de un caso específico, se recomienda ' +
      'contar siempre con asesoría legal personalizada.'
    )
  }

  const manejarEnviarPreguntaChat = () => {
    if (!preguntaChat.trim()) return
    const ahora = fechaActualISO()
    const texto = preguntaChat.trim()

    const mensajeUsuario: MensajeChat = {
      id: `u-${ahora}`,
      remitente: 'USUARIO',
      texto,
      timestamp: ahora,
    }
    const respuesta = responderChat(texto)
    const mensajeSistema: MensajeChat = {
      id: `s-${ahora}`,
      remitente: 'SISTEMA',
      texto: respuesta,
      timestamp: fechaActualISO(),
    }

    setMensajesChat((prev) => [...prev, mensajeUsuario, mensajeSistema])
    setPreguntaChat('')
  }

  const manejarMockExportPdf = () => {
    alert(
      'Exportación a PDF simulada.\n\nEn una versión completa, aquí se generaría un reporte formal de cumplimiento SPLAF en formato PDF.',
    )
  }

  const manejarMockExportZip = () => {
    alert(
      'Descarga de carpeta ZIP simulada.\n\nEn una versión completa, aquí se consolidarían todos los documentos de la operación en una carpeta comprimida.',
    )
  }

  return (
    <div className="layout">
      <header className="header">
        <div>
          <div className="logo-title">Aletheia Compliance</div>
          <div className="logo-subtitle">
            Módulo de debida diligencia SPLAF – Resolución SBS N.° 789-2018
          </div>
        </div>
        <div className="header-badges">
          <span className="badge badge-outline">Información simulada para demostración</span>
          <span className="badge badge-outline">No sustituye asesoría legal</span>
        </div>
      </header>

      <main className="main">
        <section className="panel panel-horizontal">
          <div className="panel-section panel-section-wide">
            <h2 className="section-title">Operaciones activas</h2>
            <p className="section-subtitle">
              Vista general de operaciones en curso y su estado de cumplimiento SPLAF.
            </p>

            <table className="table">
              <thead>
                <tr>
                  <th>Operación</th>
                  <th>Tipo</th>
                  <th>Comprador (Perú)</th>
                  <th>Vendedor (extranjero)</th>
                  <th>País contraparte</th>
                  <th>Monto estimado</th>
                  <th>Estado SPLAF</th>
                  <th>Riesgo</th>
                </tr>
              </thead>
              <tbody>
                {operaciones.map((op) => (
                  <tr
                    key={op.id}
                    className={
                      op.id === operacionSeleccionada?.id ? 'row-selectable row-selected' : 'row-selectable'
                    }
                    onClick={() => setOperacionSeleccionadaId(op.id)}
                  >
                    <td>{op.id}</td>
                    <td>{op.tipoOperacion === 'COMPRA' ? 'Compra de activos' : 'Venta de activos'}</td>
                    <td>{op.empresaCompradora}</td>
                    <td>{op.empresaVendedora}</td>
                    <td>{op.paisContraparte}</td>
                    <td>USD {op.monto.toLocaleString('en-US')}</td>
                    <td>
                      <span className={`status status-${op.estadoCumplimiento.toLowerCase()}`}>
                        {op.estadoCumplimiento === 'COMPLETO'
                          ? 'Completo'
                          : op.estadoCumplimiento === 'PENDIENTE'
                            ? 'Pendiente'
                            : 'Observado'}
                      </span>
                    </td>
                    <td>
                      <span className={`pill pill-risk-${op.riesgo.toLowerCase()}`}>
                        {riesgoTexto(op.riesgo)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel-section panel-section-narrow">
            <h3 className="section-title-sm">Nueva operación (mock)</h3>
            <p className="helper-text">
              Formulario de ejemplo para ilustrar la captura de datos clave antes de la identificación.
            </p>
            <form className="form">
              <label className="field">
                <span>Tipo de operación</span>
                <select disabled>
                  <option>Compra de activos</option>
                  <option>Venta de activos</option>
                </select>
              </label>
              <label className="field">
                <span>Empresa compradora (Perú)</span>
                <input defaultValue="Andes Energy S.A.C." disabled />
              </label>
              <label className="field">
                <span>Empresa vendedora (extranjera)</span>
                <input defaultValue="Global Assets Ltd." disabled />
              </label>
              <label className="field">
                <span>País de la contraparte</span>
                <input defaultValue="Canadá" disabled />
              </label>
              <label className="field">
                <span>Actividad económica</span>
                <input defaultValue="Comercialización de activos" disabled />
              </label>
              <label className="field">
                <span>Monto estimado de la operación</span>
                <input defaultValue="USD 5,000,000" disabled />
              </label>
              <label className="field">
                <span>Fecha tentativa de cierre</span>
                <input defaultValue="30/06/2026" disabled />
              </label>
              <div className="form-note">
                Esta sección es ilustrativa. En una versión completa permitiría configurar nuevas operaciones y
                checklists personalizados.
              </div>
            </form>
          </div>
        </section>

        {operacionSeleccionada && (
          <>
            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="section-title">
                    Etapa 1: Identificación del cliente (KYC)
                  </h2>
                  <p className="section-subtitle">
                    La operación no puede cerrarse sin contar con información previa y documentada del cliente,
                    conforme a las políticas de conocimiento del cliente exigidas por la normativa SPLAF.
                  </p>
                </div>
                <div className="progress-wrapper">
                  <span className="progress-label">Avance de cumplimiento</span>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${porcentajeCumplimiento}%` }}
                    />
                  </div>
                  <span className="progress-value">{porcentajeCumplimiento}%</span>
                </div>
              </div>

              <div className="two-columns">
                <div>
                  <h3 className="section-title-sm">
                    Checklist automático de documentos – Cliente {operacionSeleccionada.clienteTipo === 'EXTRANJERO'
                      ? 'extranjero'
                      : 'nacional'}
                  </h3>
                  <p className="helper-text">
                    El sistema genera un checklist en función del tipo de cliente y la naturaleza de la operación.
                    Cada documento tiene un estado de avance y un sustento legal asociado.
                  </p>

                  <table className="table table-compact">
                    <thead>
                      <tr>
                        <th>Documento</th>
                        <th>Estado</th>
                        <th>Archivo / trazabilidad</th>
                        <th>Acciones (mock)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {operacionSeleccionada.documentos.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                            <div className="doc-title">{doc.nombre}</div>
                            <div className="doc-subtitle">{doc.descripcionLegal}</div>
                            {doc.obligatorio && <span className="pill pill-required">Obligatorio</span>}
                          </td>
                          <td>
                            <span className={`status status-doc-${doc.estado.toLowerCase()}`}>
                              {estadoDocumentoTexto(doc.estado)}
                            </span>
                          </td>
                          <td>
                            {doc.archivoNombre ? (
                              <div className="doc-meta">
                                <div className="doc-file">{doc.archivoNombre}</div>
                                <div className="doc-meta-line">
                                  {doc.usuario} ·{' '}
                                  {doc.ultimaActualizacion
                                    ? new Date(doc.ultimaActualizacion).toLocaleString('es-PE')
                                    : ''}
                                </div>
                              </div>
                            ) : (
                              <span className="helper-text">Sin archivo cargado</span>
                            )}
                          </td>
                          <td>
                            <div className="button-group-vertical">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => manejarCargaMockDocumento(doc)}
                              >
                                Simular carga PDF
                              </button>
                              <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => manejarCambioEstadoDocumento(doc, 'OBSERVADO')}
                              >
                                Marcar como observado
                              </button>
                              <button
                                type="button"
                                className="btn btn-ghost"
                                onClick={() => manejarCambioEstadoDocumento(doc, 'APROBADO')}
                              >
                                Marcar como aprobado
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="section-title-sm">Observaciones legales</h3>
                  <p className="helper-text">
                    Espacio para consignar observaciones del área legal o de cumplimiento sobre la
                    documentación recibida, discrepancias detectadas o acciones de mitigación recomendadas.
                  </p>
                  <textarea
                    className="textarea"
                    rows={10}
                    placeholder="Ejemplo: Solicitar documentación adicional sobre origen de fondos vinculados a la operación..."
                    value={observacionesTemporales ?? operacionSeleccionada.observacionesLegales ?? ''}
                    onChange={(e) => setObservacionesTemporales(e.target.value)}
                  />
                  <div className="button-row">
                    <button type="button" className="btn btn-primary" onClick={manejarGuardarObservacionesLegales}>
                      Guardar observaciones
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <div>
                  <h2 className="section-title">Etapa 2: Verificación y matriz de riesgo</h2>
                  <p className="section-subtitle">
                    La verificación es un proceso compartido: la información recopilada debe ser contrastada y
                    analizada en función de factores de riesgo específicos.
                  </p>
                </div>
              </div>

              <div className="two-columns">
                <div>
                  <h3 className="section-title-sm">Matriz de riesgo (mock)</h3>
                  <p className="helper-text">
                    Ajuste los factores para simular distintos escenarios de riesgo. El sistema almacena los
                    parámetros y puede reutilizarlos para operaciones similares.
                  </p>

                  <div className="risk-grid">
                    {(
                      [
                        ['actividadEconomica', 'Tipo de actividad económica'],
                        ['paisOrigen', 'País de origen del cliente / contraparte'],
                        ['tipoActivo', 'Tipo de activo'],
                        ['montoOperacion', 'Monto de la operación'],
                        ['estructuraSocietaria', 'Complejidad de la estructura societaria'],
                      ] as [keyof FactoresRiesgo, string][]
                    ).map(([clave, etiqueta]) => (
                      <div key={clave} className="risk-row">
                        <div className="risk-label">{etiqueta}</div>
                        <div className="risk-options">
                          {(['BAJO', 'MEDIO', 'ALTO'] as RiesgoNivel[]).map((nivel) => (
                            <button
                              key={nivel}
                              type="button"
                              className={
                                operacionSeleccionada.factoresRiesgo[clave] === nivel
                                  ? `pill pill-risk-${nivel.toLowerCase()} pill-risk-selected`
                                  : `pill pill-risk-${nivel.toLowerCase()}`
                              }
                              onClick={() => manejarCambioFactorRiesgo(clave, nivel)}
                            >
                              {riesgoTexto(nivel)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="section-title-sm">Resumen de cumplimiento SPLAF</h3>
                  <div className="report-box">
                    <div className="report-row">
                      <span className="report-label">Porcentaje de cumplimiento de identificación:</span>
                      <span className="report-value">{porcentajeCumplimiento}%</span>
                    </div>
                    <div className="report-row">
                      <span className="report-label">Documentos faltantes u observados:</span>
                      <span className="report-value">
                        {operacionSeleccionada.documentos.filter(
                          (d) => d.estado === 'NO_CARGADO' || d.estado === 'OBSERVADO',
                        ).length}
                      </span>
                    </div>
                    <div className="report-row">
                      <span className="report-label">Resultado de la matriz de riesgo:</span>
                      <span
                        className={`report-value pill pill-risk-${operacionSeleccionada.riesgo.toLowerCase()}`}
                      >
                        {riesgoTexto(operacionSeleccionada.riesgo)}
                      </span>
                    </div>
                    <div className="report-row report-row-observaciones">
                      <span className="report-label">Observaciones legales consolidadas:</span>
                      <p className="report-text">
                        {operacionSeleccionada.observacionesLegales ??
                          'Sin observaciones registradas. Este espacio se utiliza para resumir hallazgos críticos, exigencias adicionales y recomendaciones de mitigación.'}
                      </p>
                    </div>
                    <div className="report-disclaimer">
                      Este reporte no sustituye una asesoría legal. Es una herramienta de apoyo para debida
                      diligencia y cumplimiento SPLAF.
                    </div>
                    <div className="button-row">
                      <button type="button" className="btn btn-primary" onClick={manejarMockExportPdf}>
                        Exportar reporte en PDF (mock)
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={manejarMockExportZip}>
                        Descargar carpeta ZIP (mock)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="panel panel-chat">
          <div className="panel-header">
            <div>
              <h2 className="section-title">Chatbot legal interno</h2>
              <p className="section-subtitle">
                Asistente interno para orientación general sobre requisitos SPLAF, diferencias entre clientes
                nacionales y extranjeros y justificación legal de los documentos solicitados.
              </p>
            </div>
            <div className="chat-disclaimer">
              La información proporcionada es referencial y no sustituye una asesoría legal personalizada.
            </div>
          </div>

          <div className="chat-layout">
            <div className="chat-messages">
              {mensajesChat.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.remitente === 'USUARIO' ? 'chat-message chat-message-user' : 'chat-message chat-message-system'
                  }
                >
                  <div className="chat-meta">
                    <span className="chat-author">
                      {m.remitente === 'USUARIO' ? 'Usted' : 'Asistente SPLAF'}
                    </span>
                    <span className="chat-time">
                      {new Date(m.timestamp).toLocaleTimeString('es-PE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="chat-bubble">{m.texto}</div>
                </div>
              ))}
            </div>

            <div className="chat-sidebar">
              <h3 className="section-title-sm">Preguntas sugeridas</h3>
              <ul className="chat-suggestions">
                <li>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() =>
                      setPreguntaChat(
                        '¿Cuáles son las principales diferencias de requisitos SPLAF entre clientes nacionales y extranjeros?',
                      )
                    }
                  >
                    Diferencias entre clientes nacionales y extranjeros
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() =>
                      setPreguntaChat(
                        '¿Por qué es obligatoria la declaración de beneficiario final en el marco de la Resolución SBS N.° 789-2018?',
                      )
                    }
                  >
                    Motivo legal de la declaración de beneficiario final
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() =>
                      setPreguntaChat(
                        '¿Cuál es el objetivo de la certificación de origen lícito de fondos en la debida diligencia?',
                      )
                    }
                  >
                    Objetivo de la certificación de origen lícito de fondos
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="chat-input">
            <textarea
              className="textarea"
              rows={3}
              placeholder="Formule aquí su consulta general sobre requisitos SPLAF o el motivo legal de un documento..."
              value={preguntaChat}
              onChange={(e) => setPreguntaChat(e.target.value)}
            />
            <div className="button-row">
              <button type="button" className="btn btn-primary" onClick={manejarEnviarPreguntaChat}>
                Enviar consulta
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-text">
          Este entorno está diseñado con fines demostrativos y utiliza información simulada. Cualquier referencia a
          operaciones, montos o entidades tiene carácter ilustrativo y no constituye asesoría legal, tributaria ni
          financiera.
        </div>
        <div className="footer-text footer-text-secondary">
          La confidencialidad de la información es esencial en los procesos de cumplimiento SPLAF. En un entorno
          productivo, se implementarían controles de acceso, registro de auditoría y medidas adicionales de seguridad
          de la información.
        </div>
      </footer>
    </div>
  )
}

export default App
