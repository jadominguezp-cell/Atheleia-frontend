import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, Heading, useToast, Container, Flex
} from '@chakra-ui/react'
import { signIn } from '../lib/auth-client'

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await signIn.email({ email, password })
            if (error) {
                toast({
                    title: 'Error al iniciar sesión',
                    description: error.message || 'Credenciales inválidas',
                    status: 'error',
                    duration: 4000,
                })
                return
            }
            navigate('/')
        } catch (err: any) {
            toast({
                title: 'Error inesperado',
                description: err?.message || 'Error del servidor',
                status: 'error',
                duration: 4000,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.900">
            {/* Decorative gradient orbs */}
            <Box position="absolute" top="-10%" left="-5%" w="400px" h="400px" borderRadius="full"
                bg="radial-gradient(circle, rgba(66,153,225,0.15) 0%, transparent 70%)" filter="blur(40px)" />
            <Box position="absolute" bottom="-10%" right="-5%" w="500px" h="500px" borderRadius="full"
                bg="radial-gradient(circle, rgba(99,179,237,0.1) 0%, transparent 70%)" filter="blur(60px)" />

            <Container maxW="420px" position="relative" zIndex={1}>
                <Box bg="gray.800" borderRadius="2xl" p={10} boxShadow="0 25px 60px rgba(0,0,0,0.5)"
                    border="1px solid" borderColor="gray.700">
                    {/* Logo */}
                    <VStack spacing={2} mb={8}>
                        <Box w="56px" h="56px" borderRadius="xl" bg="linear-gradient(135deg, #4299E1, #63B3ED)"
                            display="flex" alignItems="center" justifyContent="center" boxShadow="0 8px 25px rgba(66,153,225,0.3)">
                            <Text fontSize="xl" fontWeight="800" color="white" fontFamily="'Inter', sans-serif">A</Text>
                        </Box>
                        <Heading size="lg" color="white" fontFamily="'Inter', sans-serif" letterSpacing="-0.02em">Aletheia</Heading>
                        <Text color="gray.400" fontSize="sm">Panel de Compliance SPLAFT</Text>
                    </VStack>

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={5}>
                            <FormControl isRequired>
                                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">Correo electrónico</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@empresa.com"
                                    bg="gray.700"
                                    border="1px solid"
                                    borderColor="gray.600"
                                    color="white"
                                    _placeholder={{ color: 'gray.500' }}
                                    _hover={{ borderColor: 'blue.400' }}
                                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #4299E1' }}
                                    borderRadius="lg"
                                    h="48px"
                                    fontSize="sm"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">Contraseña</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    bg="gray.700"
                                    border="1px solid"
                                    borderColor="gray.600"
                                    color="white"
                                    _placeholder={{ color: 'gray.500' }}
                                    _hover={{ borderColor: 'blue.400' }}
                                    _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #4299E1' }}
                                    borderRadius="lg"
                                    h="48px"
                                    fontSize="sm"
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                w="100%"
                                h="48px"
                                bg="linear-gradient(135deg, #4299E1, #3182CE)"
                                color="white"
                                _hover={{ bg: 'linear-gradient(135deg, #3182CE, #2B6CB0)', transform: 'translateY(-1px)', boxShadow: '0 8px 25px rgba(66,153,225,0.4)' }}
                                _active={{ transform: 'translateY(0)' }}
                                borderRadius="lg"
                                fontSize="sm"
                                fontWeight="600"
                                isLoading={loading}
                                transition="all 0.2s"
                            >
                                Iniciar Sesión
                            </Button>
                        </VStack>
                    </form>

                    <Text mt={6} textAlign="center" color="gray.500" fontSize="sm">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register">
                            <Text as="span" color="blue.400" fontWeight="500" _hover={{ textDecoration: 'underline' }} cursor="pointer">
                                Regístrate
                            </Text>
                        </Link>
                    </Text>
                </Box>
            </Container>
        </Flex>
    )
}
