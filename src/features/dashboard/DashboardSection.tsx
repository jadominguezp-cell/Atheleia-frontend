import { Grid, Box } from '@chakra-ui/react'
import { useOperations } from '../../context/OperationsContext'
import { OperationsTable } from './OperationsTable'
import { NewOperationForm } from './NewOperationForm'

export function DashboardSection() {
  const {
    operaciones,
    operacionSeleccionadaId,
    setOperacionSeleccionadaId,
  } = useOperations()

  return (
    <Grid
      templateColumns={{ base: '1fr', lg: 'minmax(0, 3fr) minmax(300px, 1fr)' }}
      gap={6}
      mb={6}
      bg="white"
      p={6}
      borderRadius="md"
      borderWidth="1px"
      shadow="sm"
    >
      <Box minW={0} borderRight={{ base: 'none', lg: '1px' }} borderColor="gray.200" pr={{ lg: 6 }}>
        <OperationsTable
          operaciones={operaciones}
          operacionSeleccionadaId={operacionSeleccionadaId}
          onSelectOperacion={setOperacionSeleccionadaId}
        />
      </Box>
      <Box>
        <NewOperationForm />
      </Box>
    </Grid>
  )
}
