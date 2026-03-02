import { Box, Flex, Text } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'

export function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Box
            w="280px"
            minW="280px"
            h="calc(100vh - 60px)"
            bg="gray.850"
            borderRight="1px solid"
            borderColor="gray.700"
            overflowY="auto"
        >
            <Box px={4} pt={8}>
                <Flex align="center" justify="space-between" mb={2} cursor="pointer" onClick={() => navigate('/')} _hover={{ opacity: 0.8 }}>
                    <Text color={location.pathname === '/' ? 'blue.400' : 'gray.400'} fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em">
                        Tableros
                    </Text>
                </Flex>
            </Box>

            <Box px={4} mt={6}>
                <Flex align="center" justify="space-between" mb={2} cursor="pointer" onClick={() => navigate('/operations')} _hover={{ opacity: 0.8 }}>
                    <Text color={location.pathname === '/operations' ? 'blue.400' : 'gray.400'} fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em">
                        Registro de Operaciones
                    </Text>
                </Flex>
            </Box>
        </Box>
    )
}
