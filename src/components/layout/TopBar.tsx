import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
    Box, Flex, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider,
    useColorMode, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, VStack, FormControl, FormLabel, Switch, Select
} from '@chakra-ui/react'
import { useSession, signOut } from '../../lib/auth-client'

function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export function TopBar() {
    const { data: session } = useSession()
    const navigate = useNavigate()
    const { colorMode, toggleColorMode } = useColorMode()
    const userName = session?.user?.name || 'Usuario'
    const initials = getInitials(userName)

    const handleLogout = async () => {
        await signOut()
        navigate('/login')
    }

    const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure()
    const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure()

    // Mock settings state
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [language, setLanguage] = useState('es')

    return (
        <>
            <Flex
                as="header"
                h="60px"
                px={6}
                align="center"
                justify="space-between"
                bg="gray.800"
                borderBottom="1px solid"
                borderColor="gray.700"
                position="sticky"
                top={0}
                zIndex={10}
            >
                {/* Logo */}
                <Flex align="center" gap={3}>
                    <Box
                        w="34px" h="34px" borderRadius="lg"
                        bg="linear-gradient(135deg, #4299E1, #63B3ED)"
                        display="flex" alignItems="center" justifyContent="center"
                        boxShadow="0 4px 12px rgba(66,153,225,0.3)"
                    >
                        <Text fontSize="sm" fontWeight="800" color="white" lineHeight="1">A</Text>
                    </Box>
                    <Text fontSize="lg" fontWeight="700" color="white" fontFamily="'Inter', sans-serif" letterSpacing="-0.02em">
                        Aletheia
                    </Text>
                    <Box bg="blue.500" borderRadius="md" px={2} py={0.5}>
                        <Text fontSize="10px" fontWeight="700" color="white" textTransform="uppercase" letterSpacing="0.05em">
                            SPLAFT
                        </Text>
                    </Box>
                </Flex>

                {/* User profile */}
                <Menu>
                    <MenuButton>
                        <Flex align="center" gap={3} cursor="pointer" px={3} py={1.5} borderRadius="lg"
                            _hover={{ bg: 'gray.700' }} transition="all 0.15s">
                            <Text color="gray.300" fontSize="sm" fontWeight="500" display={{ base: 'none', md: 'block' }}>
                                {userName}
                            </Text>
                            <Avatar
                                name={userName}
                                size="sm"
                                bg="linear-gradient(135deg, #4299E1, #805AD5)"
                                color="white"
                                fontWeight="700"
                                fontSize="xs"
                                getInitials={() => initials}
                            />
                        </Flex>
                    </MenuButton>
                    <MenuList bg="gray.800" borderColor="gray.700" boxShadow="0 10px 40px rgba(0,0,0,0.5)" py={2}>
                        <Box px={4} py={2} mb={1}>
                            <Text fontWeight="600" color="white" fontSize="sm">{userName}</Text>
                            <Text color="gray.400" fontSize="xs">{session?.user?.email}</Text>
                        </Box>
                        <MenuDivider borderColor="gray.700" />
                        <MenuItem bg="transparent" color="gray.300" _hover={{ bg: 'gray.700', color: 'white' }} fontSize="sm" py={2.5} onClick={onProfileOpen}>
                            👤 Mi Perfil
                        </MenuItem>
                        <MenuItem bg="transparent" color="gray.300" _hover={{ bg: 'gray.700', color: 'white' }} fontSize="sm" py={2.5} onClick={onSettingsOpen}>
                            ⚙️ Ajustes
                        </MenuItem>
                        <MenuItem bg="transparent" color="gray.300" _hover={{ bg: 'gray.700', color: 'white' }} fontSize="sm" py={2.5}
                            onClick={toggleColorMode}>
                            {colorMode === 'dark' ? '☀️ Tema Claro' : '🌙 Tema Oscuro'}
                        </MenuItem>
                        <MenuDivider borderColor="gray.700" />
                        <MenuItem bg="transparent" color="red.400" _hover={{ bg: 'red.900', color: 'red.200' }} fontSize="sm" py={2.5}
                            onClick={handleLogout}>
                            Cerrar Sesión
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>

            {/* Profile Modal */}
            <Modal isOpen={isProfileOpen} onClose={onProfileClose} isCentered>
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
                <ModalContent bg="gray.800" borderColor="gray.700" border="1px solid" borderRadius="xl">
                    <ModalHeader color="white" borderBottom="1px solid" borderColor="gray.700">Mi Perfil</ModalHeader>
                    <ModalCloseButton color="gray.400" />
                    <ModalBody py={6}>
                        <Flex direction="column" align="center" gap={4}>
                            <Avatar
                                name={userName}
                                size="xl"
                                bg="linear-gradient(135deg, #4299E1, #805AD5)"
                                color="white"
                                getInitials={() => initials}
                                boxShadow="0 4px 14px rgba(66,153,225,0.4)"
                            />
                            <Box textAlign="center">
                                <Text color="white" fontSize="xl" fontWeight="700">{userName}</Text>
                                <Text color="gray.400" fontSize="md">{session?.user?.email}</Text>
                                <Text color="blue.400" fontSize="sm" mt={2} fontWeight="600" bg="blue.900" display="inline-block" px={3} py={1} borderRadius="full">
                                    Rol: Analista SPLAFT
                                </Text>
                            </Box>
                        </Flex>
                    </ModalBody>
                    <ModalFooter borderTop="1px solid" borderColor="gray.700">
                        <Button colorScheme="blue" onClick={onProfileClose} w="full">Cerrar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Settings Modal */}
            <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} isCentered>
                <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
                <ModalContent bg="gray.800" borderColor="gray.700" border="1px solid" borderRadius="xl">
                    <ModalHeader color="white" borderBottom="1px solid" borderColor="gray.700">Ajustes</ModalHeader>
                    <ModalCloseButton color="gray.400" />
                    <ModalBody py={6}>
                        <VStack spacing={5} align="stretch">
                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <FormLabel color="white" mb={0} fontSize="sm">Notificaciones Electrónicas</FormLabel>
                                    <Text color="gray.400" fontSize="xs">Recibir alertas de tableros actualizados</Text>
                                </Box>
                                <Switch colorScheme="blue" isChecked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
                            </FormControl>

                            <FormControl>
                                <FormLabel color="white" fontSize="sm">Idioma de la Interfaz</FormLabel>
                                <Select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    bg="gray.700" border="1px solid" borderColor="gray.600" color="white"
                                    _focus={{ borderColor: 'blue.400' }}
                                    size="sm"
                                    borderRadius="md"
                                >
                                    <option value="es" style={{ background: '#2D3748' }}>Español</option>
                                    <option value="en" style={{ background: '#2D3748' }}>English</option>
                                </Select>
                            </FormControl>

                            <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <FormLabel color="white" mb={0} fontSize="sm">Modo de Visualización</FormLabel>
                                    <Text color="gray.400" fontSize="xs">Alternar entre claro y oscuro para lectura</Text>
                                </Box>
                                <Switch colorScheme="blue" isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
                            </FormControl>
                        </VStack>
                    </ModalBody>
                    <ModalFooter borderTop="1px solid" borderColor="gray.700">
                        <Button variant="ghost" mr={3} onClick={onSettingsClose} color="gray.400">Cancelar</Button>
                        <Button colorScheme="blue" onClick={onSettingsClose}>Guardar Cambios</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
