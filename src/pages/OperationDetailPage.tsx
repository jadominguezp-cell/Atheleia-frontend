import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Box, Flex, Heading, Text, Button, Input, Select, SimpleGrid,
    FormControl, FormLabel, useToast, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel,
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, IconButton
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { api } from '../lib/api'

export function OperationDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const toast = useToast()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [op, setOp] = useState<any>(null)

    // Form states mapped directly from op.data
    const [identificacion, setIdentificacion] = useState<any>({})
    const [datosOperacion, setDatosOperacion] = useState<any>({})
    const [sujetos, setSujetos] = useState<any>({ ejecutante: {}, ordenante: {}, beneficiario: {} })
    const [activeTab, setActiveTab] = useState(0)

    useEffect(() => {
        if (!id) return
        api.operations.get(id)
            .then(data => {
                setOp(data)
                setIdentificacion(data.data?.identificacion || {})
                setDatosOperacion(data.data?.datosOperacion || {})
                setSujetos(data.data?.sujetos || { ejecutante: {}, ordenante: {}, beneficiario: {} })
            })
            .catch(err => {
                toast({ title: 'Error', description: err.message, status: 'error' })
            })
            .finally(() => setLoading(false))
    }, [id, toast])

    const handleSave = async () => {
        if (!id) return
        setSaving(true)
        try {
            const compiledData = {
                identificacion,
                datosOperacion,
                sujetos
            }
            await api.operations.update(id, compiledData)
            toast({ title: 'Guardado', description: 'Operación actualizada exitosamente.', status: 'success', duration: 3000 })
        } catch (err: any) {
            toast({ title: 'Error al guardar', description: err.message, status: 'error' })
        } finally {
            setSaving(false)
        }
    }

    const handleSujetoChange = (sujeto: 'ejecutante' | 'ordenante' | 'beneficiario', field: string, value: string) => {
        setSujetos((prev: any) => ({
            ...prev,
            [sujeto]: {
                ...prev[sujeto],
                [field]: value
            }
        }))
    }

    if (loading) return <Flex h="100%" align="center" justify="center"><Spinner size="xl" color="green.400" /></Flex>
    if (!op) return <Box p={8}><Text color="white">No se encontró el registro.</Text></Box>

    const sujetoLabels = ['ejecutante', 'ordenante', 'beneficiario'] as const;
    const descripcionesSujetos = [
        "Persona que solicita o físicamente realiza la operación.",
        "Persona en cuyo nombre se realiza la operación.",
        "Persona a favor de quien se realiza la operación."
    ]

    return (
        <Box h="100%" overflowY="auto" pb={20} bg="gray.850">
            {/* Header */}
            <Flex position="sticky" top={0} zIndex={10} bg="gray.900" borderBottom="1px solid" borderColor="gray.700" px={8} py={4} align="center" justify="space-between">
                <Flex align="center" gap={4}>
                    <IconButton aria-label="Volver" icon={<ArrowBackIcon />} variant="ghost" color="gray.400" onClick={() => navigate('/operations')} />
                    <Box>
                        <Breadcrumb fontSize="sm" color="gray.500" mb={1}>
                            <BreadcrumbItem><BreadcrumbLink onClick={() => navigate('/operations')}>Registro de Operaciones</BreadcrumbLink></BreadcrumbItem>
                            <BreadcrumbItem isCurrentPage><Text color="gray.300">{op.registration_code}</Text></BreadcrumbItem>
                        </Breadcrumb>
                        <Heading size="md" color="white" fontFamily="'Inter', sans-serif">
                            Operación: {op.board_title}
                        </Heading>
                    </Box>
                </Flex>
                <Button colorScheme="green" onClick={handleSave} isLoading={saving} boxShadow="0 4px 14px rgba(72,187,120,0.3)">
                    Guardar Cambios
                </Button>
            </Flex>

            <Box maxW="1000px" mx="auto" mt={8} px={6}>

                {/* 1. Datos de Identificación */}
                <Box bg="gray.800" p={6} borderRadius="xl" border="1px solid" borderColor="gray.700" mb={8}>
                    <Heading size="sm" color="white" mb={6} textTransform="uppercase" letterSpacing="0.05em">1. Datos de identificación del registro de la operación</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">1.1. Código de Oficina de la Empresa Informante</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={identificacion.codigoOficina || ''} onChange={(e) => setIdentificacion({ ...identificacion, codigoOficina: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">1.2. Número de registro de la operación</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" isReadOnly value={identificacion.numeroRegistro || ''} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">1.3. Número de registro interno (usado por empresa)</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={identificacion.numeroRegistroInterno || ''} onChange={(e) => setIdentificacion({ ...identificacion, numeroRegistroInterno: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">1.4. Modalidad de la operación</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={identificacion.modalidad || ''} onChange={(e) => setIdentificacion({ ...identificacion, modalidad: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">1.5. UBIGEO de la oficina</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={identificacion.ubigeo || ''} onChange={(e) => setIdentificacion({ ...identificacion, ubigeo: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">1.6. Fecha de la operación</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" type="date" value={identificacion.fecha || ''} onChange={(e) => setIdentificacion({ ...identificacion, fecha: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">1.7. Hora de la operación</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" type="time" value={identificacion.hora || ''} onChange={(e) => setIdentificacion({ ...identificacion, hora: e.target.value })} />
                        </FormControl>
                    </SimpleGrid>
                </Box>

                {/* 2. Datos de la Operación */}
                <Box bg="gray.800" p={6} borderRadius="xl" border="1px solid" borderColor="gray.700" mb={8}>
                    <Heading size="sm" color="white" mb={6} textTransform="uppercase" letterSpacing="0.05em">2. Datos de la Operación</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.1. Tipo de fondos</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={datosOperacion.tipoFondos || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, tipoFondos: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.2. Tipo de operación</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={datosOperacion.tipoOperacion || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, tipoOperacion: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.3. Descripción del Tipo de Operación</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={datosOperacion.descripcionOperacion || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, descripcionOperacion: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.4. Origen de los fondos</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={datosOperacion.origenFondos || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, origenFondos: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.5. Moneda</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={datosOperacion.moneda || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, moneda: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.6. Monto de la operación</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" type="number" value={datosOperacion.monto || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, monto: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.7. Tipo de cambio</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" type="number" step="0.001" value={datosOperacion.tipoCambio || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, tipoCambio: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.10. Alcance de la operación (Nacional/Internacional)</FormLabel>
                            <Select size="sm" bg="gray.700" border="none" color="white" value={datosOperacion.alcance || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, alcance: e.target.value })}>
                                <option value="" style={{ background: '#2D3748' }}>- Seleccione -</option>
                                <option value="Nacional" style={{ background: '#2D3748' }}>Nacional</option>
                                <option value="Internacional" style={{ background: '#2D3748' }}>Internacional</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.11. Código del país de origen</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={datosOperacion.paisOrigen || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, paisOrigen: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.12. Código del país de destino</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={datosOperacion.paisDestino || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, paisDestino: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.13. Intermediario de la operación</FormLabel>
                            <Input size="sm" bg="gray.700" border="none" color="white" value={datosOperacion.intermediario || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, intermediario: e.target.value })} />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="xs" color="gray.400">2.14. Forma (Presencial/No presencial)</FormLabel>
                            <Select size="sm" bg="gray.700" border="none" color="white" value={datosOperacion.forma || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, forma: e.target.value })}>
                                <option value="" style={{ background: '#2D3748' }}>- Seleccione -</option>
                                <option value="Presencial" style={{ background: '#2D3748' }}>Presencial</option>
                                <option value="No presencial" style={{ background: '#2D3748' }}>No presencial</option>
                            </Select>
                        </FormControl>
                    </SimpleGrid>

                    {/* Entidades Detail Blocks */}
                    <Box mt={6} p={4} bg="gray.750" borderRadius="md" borderLeft="4px solid" borderColor="blue.500">
                        <Text color="blue.200" fontSize="xs" fontWeight="700" mb={3}>2.8. ENTIDAD (ORDENANTE)</Text>
                        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                            <FormControl><FormLabel fontSize="10px" color="gray.400">2.8.1. Cód. Empresa Supervisada</FormLabel><Input size="xs" bg="gray.700" border="none" color="white" value={datosOperacion.entidadOrdenante?.codigoEmpresa || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, entidadOrdenante: { ...datosOperacion.entidadOrdenante, codigoEmpresa: e.target.value } })} /></FormControl>
                            <FormControl><FormLabel fontSize="10px" color="gray.400">2.8.2. Tipo cuenta</FormLabel><Input size="xs" bg="gray.700" border="none" color="white" value={datosOperacion.entidadOrdenante?.tipoCuenta || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, entidadOrdenante: { ...datosOperacion.entidadOrdenante, tipoCuenta: e.target.value } })} /></FormControl>
                            <FormControl><FormLabel fontSize="10px" color="gray.400">2.8.3. CCI / N° cheque</FormLabel><Input size="xs" bg="gray.700" border="none" color="white" value={datosOperacion.entidadOrdenante?.cci || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, entidadOrdenante: { ...datosOperacion.entidadOrdenante, cci: e.target.value } })} /></FormControl>
                            <FormControl><FormLabel fontSize="10px" color="gray.400">2.8.4. Entidad Exterior</FormLabel><Input size="xs" bg="gray.700" border="none" color="white" value={datosOperacion.entidadOrdenante?.entidadExterior || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, entidadOrdenante: { ...datosOperacion.entidadOrdenante, entidadExterior: e.target.value } })} /></FormControl>
                        </SimpleGrid>
                    </Box>

                    <Box mt={4} p={4} bg="gray.750" borderRadius="md" borderLeft="4px solid" borderColor="purple.500">
                        <Text color="purple.200" fontSize="xs" fontWeight="700" mb={3}>2.9. ENTIDAD (BENEFICIARIO)</Text>
                        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                            <FormControl><FormLabel fontSize="10px" color="gray.400">2.9.1. Cód. Empresa Supervisada</FormLabel><Input size="xs" bg="gray.700" border="none" color="white" value={datosOperacion.entidadBeneficiario?.codigoEmpresa || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, entidadBeneficiario: { ...datosOperacion.entidadBeneficiario, codigoEmpresa: e.target.value } })} /></FormControl>
                            <FormControl><FormLabel fontSize="10px" color="gray.400">2.9.2. Tipo cuenta</FormLabel><Input size="xs" bg="gray.700" border="none" color="white" value={datosOperacion.entidadBeneficiario?.tipoCuenta || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, entidadBeneficiario: { ...datosOperacion.entidadBeneficiario, tipoCuenta: e.target.value } })} /></FormControl>
                            <FormControl><FormLabel fontSize="10px" color="gray.400">2.9.3. CCI / N° cheque</FormLabel><Input size="xs" bg="gray.700" border="none" color="white" value={datosOperacion.entidadBeneficiario?.cci || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, entidadBeneficiario: { ...datosOperacion.entidadBeneficiario, cci: e.target.value } })} /></FormControl>
                            <FormControl><FormLabel fontSize="10px" color="gray.400">2.9.4. Entidad Exterior</FormLabel><Input size="xs" bg="gray.700" border="none" color="white" value={datosOperacion.entidadBeneficiario?.entidadExterior || ''} onChange={(e) => setDatosOperacion({ ...datosOperacion, entidadBeneficiario: { ...datosOperacion.entidadBeneficiario, entidadExterior: e.target.value } })} /></FormControl>
                        </SimpleGrid>
                    </Box>
                </Box>

                {/* 3. Sujetos (Tabs) */}
                <Box bg="gray.800" p={6} borderRadius="xl" border="1px solid" borderColor="gray.700" mb={8}>
                    <Heading size="sm" color="white" mb={4} textTransform="uppercase" letterSpacing="0.05em">Sujetos Involucrados</Heading>

                    <Tabs colorScheme="green" variant="soft-rounded" onChange={(index) => setActiveTab(index)}>
                        <TabList mb={4}>
                            <Tab color="gray.400" _selected={{ color: 'white', bg: 'green.600' }}>EJECUTANTE</Tab>
                            <Tab color="gray.400" _selected={{ color: 'white', bg: 'blue.600' }}>ORDENANTE</Tab>
                            <Tab color="gray.400" _selected={{ color: 'white', bg: 'purple.600' }}>BENEFICIARIO</Tab>
                        </TabList>

                        <Text fontSize="xs" color="gray.500" fontStyle="italic" mb={6} pl={2} borderLeft="2px solid" borderColor="gray.600">
                            {descripcionesSujetos[activeTab]}
                        </Text>

                        <TabPanels>
                            {sujetoLabels.map((sujeto, idx) => (
                                <TabPanel key={idx} p={0}>
                                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                                        <FormControl>
                                            <FormLabel fontSize="xs" color="gray.400">Relación con el Sujeto Obligado</FormLabel>
                                            <Input size="sm" bg="gray.700" border="none" color="white" value={sujetos[sujeto]?.relacion || ''} onChange={(e) => handleSujetoChange(sujeto, 'relacion', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel fontSize="xs" color="gray.400">Condición de residencia</FormLabel>
                                            <Input size="sm" bg="gray.700" border="none" color="white" value={sujetos[sujeto]?.residencia || ''} onChange={(e) => handleSujetoChange(sujeto, 'residencia', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel fontSize="xs" color="gray.400">Tipo de persona</FormLabel>
                                            <Select size="sm" bg="gray.700" border="none" color="white" value={sujetos[sujeto]?.tipoPersona || ''} onChange={(e) => handleSujetoChange(sujeto, 'tipoPersona', e.target.value)}>
                                                <option value="" style={{ background: '#2D3748' }}>- Seleccione -</option>
                                                <option value="Natural" style={{ background: '#2D3748' }}>Natural</option>
                                                <option value="Jurídica" style={{ background: '#2D3748' }}>Jurídica</option>
                                            </Select>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel fontSize="xs" color="gray.400">Documento de Identidad (DNI/RUC - N°)</FormLabel>
                                            <Flex gap={2}>
                                                <Select w="100px" size="sm" bg="gray.700" border="none" color="white" value={sujetos[sujeto]?.tipoDoc || ''} onChange={(e) => handleSujetoChange(sujeto, 'tipoDoc', e.target.value)}>
                                                    <option value="DNI" style={{ background: '#2D3748' }}>DNI</option>
                                                    <option value="RUC" style={{ background: '#2D3748' }}>RUC</option>
                                                    <option value="C.E." style={{ background: '#2D3748' }}>C.E.</option>
                                                    <option value="Pasaporte" style={{ background: '#2D3748' }}>Pasaporte</option>
                                                </Select>
                                                <Input flex={1} size="sm" bg="gray.700" border="none" color="white" placeholder="Número" value={sujetos[sujeto]?.numDoc || ''} onChange={(e) => handleSujetoChange(sujeto, 'numDoc', e.target.value)} />
                                            </Flex>
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel fontSize="xs" color="gray.400">Apellido paterno o Razón Social</FormLabel>
                                            <Input size="sm" bg="gray.700" border="none" color="white" value={sujetos[sujeto]?.paternoRs || ''} onChange={(e) => handleSujetoChange(sujeto, 'paternoRs', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel fontSize="xs" color="gray.400">Apellido materno</FormLabel>
                                            <Input size="sm" bg="gray.700" border="none" color="white" value={sujetos[sujeto]?.materno || ''} onChange={(e) => handleSujetoChange(sujeto, 'materno', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel fontSize="xs" color="gray.400">Nombres</FormLabel>
                                            <Input size="sm" bg="gray.700" border="none" color="white" value={sujetos[sujeto]?.nombres || ''} onChange={(e) => handleSujetoChange(sujeto, 'nombres', e.target.value)} />
                                        </FormControl>
                                        <FormControl>
                                            <FormLabel fontSize="xs" color="gray.400">Ocupación / Oficio (Cód. | País Nac. | PEP)</FormLabel>
                                            <Flex gap={2}>
                                                <Input w="70px" size="sm" bg="gray.700" border="none" color="white" placeholder="Cód." value={sujetos[sujeto]?.codOcupacion || ''} onChange={(e) => handleSujetoChange(sujeto, 'codOcupacion', e.target.value)} />
                                                <Input w="80px" size="sm" bg="gray.700" border="none" color="white" placeholder="Nac." value={sujetos[sujeto]?.paisNac || ''} onChange={(e) => handleSujetoChange(sujeto, 'paisNac', e.target.value)} />
                                                <Input flex={1} size="sm" bg="gray.700" border="none" color="white" placeholder="Cargo PEP" value={sujetos[sujeto]?.cargoPep || ''} onChange={(e) => handleSujetoChange(sujeto, 'cargoPep', e.target.value)} />
                                            </Flex>
                                        </FormControl>
                                    </SimpleGrid>

                                    <Box mt={6}>
                                        <FormLabel fontSize="xs" color="gray.400">Domicilio y teléfonos</FormLabel>
                                        <SimpleGrid columns={{ base: 1, md: 5 }} spacing={2}>
                                            <Input size="xs" bg="gray.700" border="none" color="white" placeholder="Nombre/N° de vía" value={sujetos[sujeto]?.via || ''} onChange={(e) => handleSujetoChange(sujeto, 'via', e.target.value)} />
                                            <Input size="xs" bg="gray.700" border="none" color="white" placeholder="Dpto" value={sujetos[sujeto]?.dpto || ''} onChange={(e) => handleSujetoChange(sujeto, 'dpto', e.target.value)} />
                                            <Input size="xs" bg="gray.700" border="none" color="white" placeholder="Provincia" value={sujetos[sujeto]?.provincia || ''} onChange={(e) => handleSujetoChange(sujeto, 'provincia', e.target.value)} />
                                            <Input size="xs" bg="gray.700" border="none" color="white" placeholder="Distrito" value={sujetos[sujeto]?.distrito || ''} onChange={(e) => handleSujetoChange(sujeto, 'distrito', e.target.value)} />
                                            <Input size="xs" bg="gray.700" border="none" color="white" placeholder="Teléfonos" value={sujetos[sujeto]?.telefonos || ''} onChange={(e) => handleSujetoChange(sujeto, 'telefonos', e.target.value)} />
                                        </SimpleGrid>
                                    </Box>
                                </TabPanel>
                            ))}
                        </TabPanels>
                    </Tabs>
                </Box>
            </Box>
        </Box>
    )
}
