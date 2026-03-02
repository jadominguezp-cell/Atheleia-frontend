import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Box, Text, Flex, SimpleGrid, Button, Input, useToast, Spinner, VStack, Heading,
    InputGroup, InputLeftElement, ButtonGroup
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { api } from '../lib/api'

interface Operation {
    id: string
    board_id: string
    board_title: string
    company_type: string
    registration_code: string
    created_at: string
}

type FilterType = 'all' | 'peruana' | 'extranjera'

export function OperationsListPage() {
    const [operations, setOperations] = useState<Operation[]>([])
    const [loading, setLoading] = useState(true)

    // Filtering and Search
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<FilterType>('all')

    const navigate = useNavigate()
    const toast = useToast()

    useEffect(() => {
        api.operations.list()
            .then(setOperations)
            .catch((err) => {
                toast({ title: 'Error', description: err.message, status: 'error' })
            })
            .finally(() => setLoading(false))
    }, [toast])

    const filteredOps = operations.filter((op) => {
        const matchesSearch = op.board_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            op.registration_code?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesType = filterType === 'all' || op.company_type === filterType
        return matchesSearch && matchesType
    })

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
                        Mi registro de operaciones
                    </Heading>
                    <Text color="gray.400" fontSize="sm" mt={1}>
                        En este apartado se encuentra el registro de operaciones de cada tablero de la empresa creado en el apartado "TABLEROS".
                    </Text>
                </Box>
            </Flex>

            {/* Filters & Search */}
            <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
                <ButtonGroup size="sm" isAttached variant="outline">
                    <Button onClick={() => setFilterType('all')} bg={filterType === 'all' ? 'blue.600' : 'transparent'} color="white" borderColor="gray.600" _hover={{ bg: filterType === 'all' ? 'blue.500' : 'gray.700' }}>Todas</Button>
                    <Button onClick={() => setFilterType('peruana')} bg={filterType === 'peruana' ? 'blue.600' : 'transparent'} color="white" borderColor="gray.600" _hover={{ bg: filterType === 'peruana' ? 'blue.500' : 'gray.700' }}>Empresas Peruanas</Button>
                    <Button onClick={() => setFilterType('extranjera')} bg={filterType === 'extranjera' ? 'blue.600' : 'transparent'} color="white" borderColor="gray.600" _hover={{ bg: filterType === 'extranjera' ? 'blue.500' : 'gray.700' }}>Empresas Extranjeras</Button>
                </ButtonGroup>

                <InputGroup maxW="300px">
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.500" />
                    </InputLeftElement>
                    <Input
                        type="text"
                        placeholder="Buscar por código o nombre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        bg="gray.800"
                        border="1px solid"
                        borderColor="gray.700"
                        color="white"
                        _placeholder={{ color: 'gray.500' }}
                        _focus={{ borderColor: 'blue.400', boxShadow: 'none' }}
                        borderRadius="full"
                    />
                </InputGroup>
            </Flex>

            {filteredOps.length === 0 ? (
                <VStack spacing={4} py={32}>
                    <Box fontSize="4xl" opacity={0.3}>📊</Box>
                    <Text color="gray.500" fontSize="md">
                        {searchQuery ? 'No se encontraron operaciones con esa búsqueda.' : 'No tienes operaciones registradas.'}
                    </Text>
                </VStack>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {filteredOps.map((op) => (
                        <Box
                            key={op.id}
                            bg="gray.800"
                            borderRadius="xl"
                            p={5}
                            border="1px solid"
                            borderColor="gray.700"
                            _hover={{ borderColor: 'green.400', transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                        >
                            <Flex align="center" gap={3} mb={3}>
                                <Box w="40px" h="40px" borderRadius="lg"
                                    bg="linear-gradient(135deg, #10B981, #059669)"
                                    display="flex" alignItems="center" justifyContent="center">
                                    <Text color="white" fontWeight="700" fontSize="sm">
                                        OP
                                    </Text>
                                </Box>
                                <Box flex={1} overflow="hidden">
                                    <Text color="white" fontWeight="600" fontSize="sm" isTruncated>
                                        {op.board_title}
                                    </Text>
                                    <Text color="green.400" fontSize="xs" fontWeight="700">
                                        {op.registration_code}
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex align="center" justify="space-between" mt={4}>
                                <Text color="gray.500" fontSize="xs">
                                    {new Date(op.created_at).toLocaleDateString('es-PE')}
                                </Text>
                                <Button
                                    size="xs"
                                    colorScheme="green"
                                    variant="solid"
                                    onClick={() => navigate(`/operations/${op.id}`)}
                                    borderRadius="md"
                                >
                                    Visualizar operación
                                </Button>
                            </Flex>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    )
}
