import { useState } from 'react'
import {
  Box,
  Heading,
  Text,
  Input,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react'
import { AnimatedButton } from '../../components/AnimatedButton'

interface SearchScreenProps {
  onSearch: (dniOrRuc: string) => void
}

export function SearchScreen({ onSearch }: SearchScreenProps) {
  const [value, setValue] = useState('')
  const toast = useToast()

  const handleBuscar = () => {
    const trimmed = value.trim()
    if (!trimmed) {
      toast({
        title: 'Ingrese DNI o RUC',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    if (!/^\d{8,11}$/.test(trimmed)) {
      toast({
        title: 'DNI debe tener 8 dígitos; RUC debe tener 11 dígitos',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return
    }
    onSearch(trimmed)
  }

  return (
    <Box
      maxW="480px"
      mx="auto"
      mt={{ base: 8, md: 16 }}
      p={8}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      shadow="md"
    >
      <Heading size="md" mb={2} color="gray.800">
        Búsqueda de documentos
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={6}>
        Ingrese DNI (8 dígitos) o RUC (11 dígitos) para generar el checklist de documentos disponibles.
      </Text>
      <VStack align="stretch" spacing={4}>
        <FormControl>
          <FormLabel>DNI o RUC</FormLabel>
          <Input
            placeholder="Ej: 12345678 o 20123456789"
            value={value}
            onChange={(e) => setValue(e.target.value.replace(/\D/g, '').slice(0, 11))}
            size="lg"
            maxLength={11}
          />
        </FormControl>
        <AnimatedButton
          colorScheme="blue"
          size="lg"
          w="full"
          onClick={handleBuscar}
        >
          BUSCAR
        </AnimatedButton>
      </VStack>
    </Box>
  )
}
