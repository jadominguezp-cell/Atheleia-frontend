import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    Box, Button, FormControl, FormLabel, Input, VStack, Text, Heading, useToast, Container, Flex
} from '@chakra-ui/react'
import { signUp } from '../lib/auth-client'

export function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { error } = await signUp.email({ name, email, password })
            if (error) {
                toast({
                    title: 'Error al registrar',
                    description: error.message || 'Intenta de nuevo',
                    status: 'error',
                    duration: 4000,
                })
                return
            }
            toast({
                title: 'Cuenta creada',
                description: 'Redirigiendo al login...',
                status: 'success',
                duration: 2000,
            })
            setTimeout(() => navigate('/login'), 1500)
        } catch (err: any) {
            toast({
                title: 'Error inesperado',
                description: err?.message || 'Intenta de nuevo',
                status: 'error',
                duration: 4000,
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.900">
            <Box position="absolute" top="-10%" right="-5%" w="400px" h="400px" borderRadius="full"
                bg="radial-gradient(circle, rgba(72,187,120,0.12) 0%, transparent 70%)" filter="blur(40px)" />
            <Box position="absolute" bottom="-10%" left="-5%" w="500px" h="500px" borderRadius="full"
                bg="radial-gradient(circle, rgba(66,153,225,0.1) 0%, transparent 70%)" filter="blur(60px)" />

            <Container maxW="420px" position="relative" zIndex={1}>
                <Box bg="gray.800" borderRadius="2xl" p={10} boxShadow="0 25px 60px rgba(0,0,0,0.5)"
                    border="1px solid" borderColor="gray.700">
                    <VStack spacing={2} mb={8}>
                        <Box w="56px" h="56px" borderRadius="xl" bg="linear-gradient(135deg, #48BB78, #38A169)"
                            display="flex" alignItems="center" justifyContent="center" boxShadow="0 8px 25px rgba(72,187,120,0.3)">
                            <Text fontSize="xl" fontWeight="800" color="white" fontFamily="'Inter', sans-serif">A</Text>
                        </Box>
                        <Heading size="lg" color="white" fontFamily="'Inter', sans-serif" letterSpacing="-0.02em">Crear Cuenta</Heading>
                        <Text color="gray.400" fontSize="sm">Únete a Aletheia Compliance</Text>
                    </VStack>

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={5}>
                            <FormControl isRequired>
                                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">Nombre completo</FormLabel>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Steve Gomez"
                                    bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                    _placeholder={{ color: 'gray.500' }}
                                    _hover={{ borderColor: 'green.400' }}
                                    _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px #48BB78' }}
                                    borderRadius="lg" h="48px" fontSize="sm"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">Correo electrónico</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@empresa.com"
                                    bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                    _placeholder={{ color: 'gray.500' }}
                                    _hover={{ borderColor: 'green.400' }}
                                    _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px #48BB78' }}
                                    borderRadius="lg" h="48px" fontSize="sm"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel color="gray.300" fontSize="sm" fontWeight="500">Contraseña</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                    _placeholder={{ color: 'gray.500' }}
                                    _hover={{ borderColor: 'green.400' }}
                                    _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px #48BB78' }}
                                    borderRadius="lg" h="48px" fontSize="sm"
                                />
                            </FormControl>

                            <Button
                                type="submit" w="100%" h="48px"
                                bg="linear-gradient(135deg, #48BB78, #38A169)" color="white"
                                _hover={{ bg: 'linear-gradient(135deg, #38A169, #2F855A)', transform: 'translateY(-1px)', boxShadow: '0 8px 25px rgba(72,187,120,0.4)' }}
                                _active={{ transform: 'translateY(0)' }}
                                borderRadius="lg" fontSize="sm" fontWeight="600"
                                isLoading={loading} transition="all 0.2s"
                            >
                                Registrarse
                            </Button>
                        </VStack>
                    </form>

                    <Text mt={6} textAlign="center" color="gray.500" fontSize="sm">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login">
                            <Text as="span" color="green.400" fontWeight="500" _hover={{ textDecoration: 'underline' }} cursor="pointer">
                                Iniciar sesión
                            </Text>
                        </Link>
                    </Text>
                </Box>
            </Container>
        </Flex>
    )
}
