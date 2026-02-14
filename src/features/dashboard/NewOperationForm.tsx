import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'

export function NewOperationForm() {
  return (
    <Box minW="280px" maxW="100%" overflow="hidden">
      <Heading size="sm" mb={1}>Nueva operación (mock)</Heading>
      <Text fontSize="xs" color="gray.600" mb={3} wordBreak="break-word">
        Formulario de ejemplo para ilustrar la captura de datos clave antes de la identificación.
      </Text>
      <VStack align="stretch" spacing={2} as="form">
        <FormControl>
          <FormLabel fontSize="sm">Tipo de operación</FormLabel>
          <Select size="sm" isDisabled>
            <option>Compra de activos</option>
            <option>Venta de activos</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">Empresa compradora (Perú)</FormLabel>
          <Input size="sm" defaultValue="Andes Energy S.A.C." isReadOnly />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">Empresa vendedora (extranjera)</FormLabel>
          <Input size="sm" defaultValue="Global Assets Ltd." isReadOnly />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">País de la contraparte</FormLabel>
          <Input size="sm" defaultValue="Canadá" isReadOnly />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">Actividad económica</FormLabel>
          <Input size="sm" defaultValue="Comercialización de activos" isReadOnly />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">Monto estimado de la operación</FormLabel>
          <Input size="sm" defaultValue="USD 5,000,000" isReadOnly />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm">Fecha tentativa de cierre</FormLabel>
          <Input size="sm" defaultValue="30/06/2026" isReadOnly />
        </FormControl>
        <Text fontSize="xs" color="gray.500" mt={2} wordBreak="break-word">
          Esta sección es ilustrativa. En una versión completa permitiría configurar nuevas operaciones y checklists personalizados.
        </Text>
      </VStack>
    </Box>
  )
}
