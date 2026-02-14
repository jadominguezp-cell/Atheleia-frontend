import { Box, Spinner, Text, VStack } from '@chakra-ui/react'

export function LoadingReveal() {
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
      textAlign="center"
    >
      <VStack spacing={6}>
        <Spinner size="xl" colorScheme="blue" thickness="3px" />
        <Text fontSize="md" color="gray.700" fontWeight="500">
          Aletheia está revelando los documentos
        </Text>
      </VStack>
    </Box>
  )
}
