import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Text, Flex, SimpleGrid, Button, Input, useToast, Spinner, VStack, Heading,
    InputGroup, InputLeftElement, ButtonGroup, Select, FormControl, FormLabel,
    Modal, ModalOverlay, ModalContent, ModalBody, Progress, Icon, CloseButton,
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure
} from '@chakra-ui/react'
import { SearchIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { api } from '../lib/api'

interface Board {
    id: string
    title: string
    company_type: string
    country?: string
    registration_code?: string
    created_at: string
}

type FilterType = 'all' | 'peruana' | 'extranjera'

export function BoardsListPage() {
    const [boards, setBoards] = useState<Board[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [companyType, setCompanyType] = useState('peruana')
    const [country, setCountry] = useState('')
    const [ruc, setRuc] = useState('')

    // Loading Screen state
    const [showLoadingModal, setShowLoadingModal] = useState(false)
    const [loadingStage, setLoadingStage] = useState(0)
    const [loadingProgress, setLoadingProgress] = useState(0)

    // Filtering and Search
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<FilterType>('all')

    // Deletion Modal
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)
    const [boardToDelete, setBoardToDelete] = useState<string | null>(null)

    const navigate = useNavigate()
    const toast = useToast()

    useEffect(() => {
        api.boards.list()
            .then(setBoards)
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const handleCreate = async () => {
        if (!newTitle.trim()) return
        if (companyType === 'extranjera' && !country) return // Validation

        setShowLoadingModal(true)
        setLoadingStage(0)
        setLoadingProgress(0)

        // Loading animation sequence (10 seconds total)

        let progress = 0
        const progressInterval = setInterval(() => {
            progress += 1
            setLoadingProgress(progress)

            if (progress === 25) setLoadingStage(1)
            else if (progress === 60) setLoadingStage(2)
            else if (progress === 85) setLoadingStage(3)
        }, 100)

        try {
            const board = await api.boards.create(newTitle.trim(), companyType, country, ruc)

            setTimeout(() => {
                clearInterval(progressInterval)
                setNewTitle('')
                setCompanyType('peruana')
                setCountry('')
                setRuc('')
                setCreating(false)
                setShowLoadingModal(false)
                navigate(`/board/${board.id}`)
            }, 10000)
        } catch (err: any) {
            clearInterval(progressInterval)
            setShowLoadingModal(false)
            toast({ title: 'Error', description: err.message, status: 'error', duration: 3000 })
        }
    }

    // Apply active filters
    const filteredBoards = boards.filter((board) => {
        const matchesSearch = board.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = filterType === 'all' || board.company_type === filterType
        return matchesSearch && matchesType
    })

    const requestDelete = (e: React.MouseEvent, boardId: string) => {
        e.stopPropagation()
        setBoardToDelete(boardId)
        onAlertOpen()
    }

    const [isDeleting, setIsDeleting] = useState(false)

    const confirmDelete = async () => {
        if (!boardToDelete) return
        setIsDeleting(true)
        try {
            await api.boards.delete(boardToDelete)
            setBoards((prev) => prev.filter((b) => b.id !== boardToDelete))
            toast({ title: 'Tablero eliminado', status: 'success', duration: 2000 })
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, status: 'error', duration: 3000 })
        } finally {
            setIsDeleting(false)
            onAlertClose()
            setBoardToDelete(null)
        }
    }

    if (loading) {
        return (
            <Flex h="100%" align="center" justify="center">
                <Spinner size="xl" color="blue.400" thickness="3px" />
            </Flex>
        )
    }

    return (
        <Box p={8} maxW="1200px" mx="auto">
            <Flex align="center" justify="space-between" mb={8} wrap="wrap" gap={4}>
                <Box>
                    <Heading size="lg" color="white" fontFamily="'Inter', sans-serif" letterSpacing="-0.02em">
                        Mis Tableros
                    </Heading>
                    <Text color="gray.400" fontSize="sm" mt={1}>
                        Selecciona un tablero o crea uno nuevo para iniciar la revisión SPLAFT
                    </Text>
                </Box>
                <Button
                    size="md"
                    bg="linear-gradient(135deg, #4299E1, #3182CE)"
                    color="white"
                    _hover={{ transform: 'translateY(-1px)', boxShadow: '0 8px 25px rgba(66,153,225,0.4)' }}
                    _active={{ transform: 'translateY(0)' }}
                    borderRadius="lg"
                    onClick={() => setCreating(true)}
                    transition="all 0.2s"
                    px={6}
                >
                    + Nuevo Tablero
                </Button>
            </Flex>

            {/* Filters & Search */}
            <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
                <ButtonGroup size="sm" isAttached variant="outline">
                    <Button
                        bg={filterType === 'all' ? 'blue.600' : 'gray.800'}
                        color={filterType === 'all' ? 'white' : 'gray.400'}
                        borderColor="gray.600"
                        onClick={() => setFilterType('all')}
                        _hover={{ bg: filterType === 'all' ? 'blue.500' : 'gray.700' }}
                    >
                        Todos
                    </Button>
                    <Button
                        bg={filterType === 'peruana' ? 'blue.600' : 'gray.800'}
                        color={filterType === 'peruana' ? 'white' : 'gray.400'}
                        borderColor="gray.600"
                        onClick={() => setFilterType('peruana')}
                        _hover={{ bg: filterType === 'peruana' ? 'blue.500' : 'gray.700' }}
                    >
                        Empresas Peruanas
                    </Button>
                    <Button
                        bg={filterType === 'extranjera' ? 'blue.600' : 'gray.800'}
                        color={filterType === 'extranjera' ? 'white' : 'gray.400'}
                        borderColor="gray.600"
                        onClick={() => setFilterType('extranjera')}
                        _hover={{ bg: filterType === 'extranjera' ? 'blue.500' : 'gray.700' }}
                    >
                        Empresas Extranjeras
                    </Button>
                </ButtonGroup>

                <InputGroup maxW="300px" size="sm">
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                        placeholder="Buscar tablero..."
                        bg="gray.800"
                        borderColor="gray.700"
                        color="white"
                        borderRadius="xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        _focus={{ borderColor: 'blue.400', boxShadow: 'none' }}
                    />
                </InputGroup>
            </Flex>

            {creating && (
                <Box bg="gray.800" borderRadius="xl" p={5} mb={6} border="1px solid" borderColor="gray.700" maxW="500px">
                    <VStack align="stretch" spacing={4}>
                        <FormControl>
                            <FormLabel color="gray.300" fontSize="sm">Nombre de la Empresa</FormLabel>
                            <Input
                                placeholder="Ej: Minera Andes S.A.C."
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                _placeholder={{ color: 'gray.500' }}
                                _focus={{ borderColor: 'blue.400' }}
                                borderRadius="lg"
                                autoFocus
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel color="gray.300" fontSize="sm">RUC de la Empresa (Opcional)</FormLabel>
                            <Input
                                placeholder="Ej: 20123456789"
                                value={ruc}
                                onChange={(e) => setRuc(e.target.value)}
                                bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                _placeholder={{ color: 'gray.500' }}
                                _focus={{ borderColor: 'blue.400' }}
                                borderRadius="lg"
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel color="gray.300" fontSize="sm">Tipo de Empresa</FormLabel>
                            <Select
                                value={companyType}
                                onChange={(e) => setCompanyType(e.target.value)}
                                bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                _focus={{ borderColor: 'blue.400' }}
                            >
                                <option value="peruana" style={{ background: '#2D3748' }}>Empresa Peruana</option>
                                <option value="extranjera" style={{ background: '#2D3748' }}>Empresa Extranjera</option>
                            </Select>
                        </FormControl>
                        {companyType === 'extranjera' && (
                            <FormControl>
                                <FormLabel color="gray.300" fontSize="sm">País de Origen</FormLabel>
                                <Select
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder="Seleccione un país"
                                    bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                    _focus={{ borderColor: 'blue.400' }}
                                >
                                    <option value="Chile" style={{ background: '#2D3748' }}>Chile</option>
                                    <option value="Colombia" style={{ background: '#2D3748' }}>Colombia</option>
                                    <option value="Brasil" style={{ background: '#2D3748' }}>Brasil</option>
                                    <option value="México" style={{ background: '#2D3748' }}>México</option>
                                    <option value="Estados Unidos" style={{ background: '#2D3748' }}>Estados Unidos</option>
                                    <option value="España" style={{ background: '#2D3748' }}>España</option>
                                    <option value="China" style={{ background: '#2D3748' }}>China</option>
                                    <option value="Panamá" style={{ background: '#2D3748' }}>Panamá</option>
                                    <option value="Ecuador" style={{ background: '#2D3748' }}>Ecuador</option>
                                    <option value="Bolivia" style={{ background: '#2D3748' }}>Bolivia</option>
                                </Select>
                            </FormControl>
                        )}
                        <Flex gap={2} mt={2}>
                            <Button size="sm" colorScheme="blue" onClick={handleCreate} isDisabled={!newTitle || (companyType === 'extranjera' && !country)}>
                                Crear Tablero
                            </Button>
                            <Button size="sm" variant="ghost" color="gray.400" onClick={() => { setCreating(false); setNewTitle(''); setCountry('') }}>
                                Cancelar
                            </Button>
                        </Flex>
                    </VStack>
                </Box>
            )}

            {filteredBoards.length === 0 && !creating ? (
                <VStack spacing={4} py={32}>
                    <Box fontSize="4xl" opacity={0.3}>📋</Box>
                    <Text color="gray.500" fontSize="md">
                        {searchQuery ? 'No se encontraron tableros con esa búsqueda.' : 'No tienes tableros en esta categoría.'}
                    </Text>
                    {!searchQuery && boards.length === 0 && (
                        <Button size="sm" colorScheme="blue" variant="outline" onClick={() => setCreating(true)}>
                            Crear tu primer tablero
                        </Button>
                    )}
                </VStack>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4}>
                    {filteredBoards.map((board) => (
                        <Box
                            key={board.id}
                            bg="gray.800"
                            borderRadius="xl"
                            p={5}
                            cursor="pointer"
                            border="1px solid"
                            borderColor="gray.700"
                            _hover={{
                                borderColor: 'blue.400',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 30px rgba(66,153,225,0.15)',
                            }}
                            transition="all 0.2s"
                            onClick={() => navigate(`/board/${board.id}`)}
                            role="group"
                            position="relative"
                        >
                            <CloseButton
                                position="absolute"
                                top="2"
                                right="2"
                                size="sm"
                                color="gray.500"
                                _hover={{ color: 'red.400', bg: 'whiteAlpha.200' }}
                                onClick={(e) => requestDelete(e, board.id)}
                            />
                            <Flex align="center" gap={3} mb={3}>
                                <Box w="40px" h="40px" borderRadius="lg"
                                    bg={board.company_type === 'extranjera' ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #4299E1, #805AD5)'}
                                    display="flex" alignItems="center" justifyContent="center">
                                    <Text color="white" fontWeight="700" fontSize="sm">
                                        {board.title.slice(0, 2).toUpperCase()}
                                    </Text>
                                </Box>
                                <Box flex={1} overflow="hidden">
                                    <Text color="white" fontWeight="600" fontSize="sm" isTruncated>
                                        {board.title}
                                    </Text>
                                    <Text color="green.400" fontSize="xs" fontWeight="700" mt={0.5}>
                                        {board.registration_code}
                                    </Text>
                                    <Flex gap={2} mt={1} align="center">
                                        <Text color="gray.500" fontSize="xs" isTruncated>
                                            {board.company_type === 'extranjera' ? `Extranjera (${board.country})` : 'Nacional'}
                                        </Text>
                                        <Text color="gray.600" fontSize="xs">•</Text>
                                        <Text color="gray.500" fontSize="xs">
                                            {new Date(board.created_at).toLocaleDateString('es-PE')}
                                        </Text>
                                    </Flex>
                                </Box>
                            </Flex>
                            <Text color="gray.500" fontSize="xs" _groupHover={{ color: 'blue.400' }} transition="color 0.15s">
                                Click para abrir tablero →
                            </Text>
                        </Box>
                    ))}
                </SimpleGrid>
            )}

            {/* Loading Modal */}
            <Modal isOpen={showLoadingModal} onClose={() => { }} isCentered closeOnOverlayClick={false} size="xl">
                <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(8px)" />
                <ModalContent bg="gray.900" border="1px solid" borderColor="gray.700" borderRadius="2xl" overflow="hidden" py={10}>
                    <ModalBody>
                        <VStack spacing={8}>
                            <Box position="relative" w="80px" h="80px">
                                <Spinner size="xl" color="blue.400" thickness="4px" speed="1s" w="100%" h="100%" position="absolute" />
                                <Flex position="absolute" top="0" left="0" w="100%" h="100%" align="center" justify="center">
                                    <Icon as={SearchIcon} color="blue.300" boxSize={6} />
                                </Flex>
                            </Box>

                            <VStack spacing={3} w="100%">
                                <Heading size="md" color="white" textAlign="center" fontFamily="'Inter', sans-serif">
                                    Procesando información
                                </Heading>
                                <Text color="blue.300" fontSize="md" fontWeight="600" textAlign="center" minH="24px" transition="all 0.3s">
                                    {loadingStage === 0 && "Conectando con SUNARP y RENIEC..."}
                                    {loadingStage === 1 && "Consultando historial y vigencia en SUNAT..."}
                                    {loadingStage === 2 && "Verificando cruces en Listas SPLAFT..."}
                                    {loadingStage === 3 && "Generando Operativa y Tablero..."}
                                </Text>
                            </VStack>

                            <Box w="full" px={10}>
                                <Progress value={loadingProgress} size="sm" colorScheme="blue" borderRadius="full" hasStripe isAnimated bg="gray.700" />
                                <Flex justify="space-between" mt={4}>
                                    <Flex align="center" gap={2} opacity={loadingStage >= 1 ? 1 : 0.4} transition="all 0.3s">
                                        <Icon as={CheckCircleIcon} color="green.400" />
                                        <Text fontSize="xs" color="gray.400">Identidad</Text>
                                    </Flex>
                                    <Flex align="center" gap={2} opacity={loadingStage >= 2 ? 1 : 0.4} transition="all 0.3s">
                                        <Icon as={CheckCircleIcon} color="green.400" />
                                        <Text fontSize="xs" color="gray.400">Tributario</Text>
                                    </Flex>
                                    <Flex align="center" gap={2} opacity={loadingStage >= 3 ? 1 : 0.4} transition="all 0.3s">
                                        <Icon as={CheckCircleIcon} color="green.400" />
                                        <Text fontSize="xs" color="gray.400">Compliance</Text>
                                    </Flex>
                                </Flex>
                            </Box>
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Alert Dialog (Delete Confirmation) */}
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onAlertClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent bg="gray.800" color="white" borderColor="gray.700" border="1px solid">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Eliminar Tablero
                        </AlertDialogHeader>

                        <AlertDialogBody color="gray.300">
                            ¿Estás seguro de que deseas eliminar este tablero? Todos los datos asociados se perderán. Esta acción no se puede deshacer.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onAlertClose} variant="ghost" color="gray.400" _hover={{ bg: "gray.700" }} isDisabled={isDeleting}>
                                Cancelar
                            </Button>
                            <Button colorScheme="red" onClick={confirmDelete} ml={3} isLoading={isDeleting}>
                                Eliminar
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
}
