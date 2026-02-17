import { Box, Heading, Text, Card, CardBody, CardFooter, Button, Grid } from '@chakra-ui/react'

interface SelectionScreenProps {
  onPeruvian: () => void
  onForeign: () => void
}

export function SelectionScreen({ onPeruvian, onForeign }: SelectionScreenProps) {
  return (
    <Box maxW="900px" mx="auto" py={{ base: 8, md: 12 }} px={4}>
      <Heading size="md" textAlign="center" color="gray.800" mb={8}>
        Seleccione el tipo de contraparte
      </Heading>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
        <Card
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
          overflow="hidden"
          _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
          transition="all 0.2s"
        >
          <CardBody>
            <Heading size="sm" mb={2} color="gray.800">
              Working with a Peruvian company?
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Validación mediante DNI o RUC conforme normativa SPLAF.
            </Text>
          </CardBody>
          <CardFooter pt={0}>
            <Button colorScheme="blue" size="md" w="full" onClick={onPeruvian}>
              Continuar
            </Button>
          </CardFooter>
        </Card>
        <Card
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
          overflow="hidden"
          _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
          transition="all 0.2s"
        >
          <CardBody>
            <Heading size="sm" mb={2} color="gray.800">
              Working with a foreign company?
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Orientación documental preliminar para operaciones internacionales.
            </Text>
          </CardBody>
          <CardFooter pt={0}>
            <Button variant="outline" colorScheme="blue" size="md" w="full" onClick={onForeign}>
              Consultar requisitos
            </Button>
          </CardFooter>
        </Card>
      </Grid>
    </Box>
  )
}
