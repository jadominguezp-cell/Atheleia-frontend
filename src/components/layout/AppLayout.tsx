import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react'

interface AppLayoutProps {
  headerBadges?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AppLayout({ headerBadges, children, footer }: AppLayoutProps) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="gray.50">
      <Box as="header" bg="brand.700" color="white" py={4} px={6} borderBottomWidth="1px" borderColor="gray.200">
        <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
          <Box>
            <Heading size="md" fontWeight="600" letterSpacing="wide">
              Aletheia Compliance
            </Heading>
            <Text fontSize="sm" color="gray.300" mt={1}>
              Módulo de debida diligencia SPLAF – Resolución SBS N.° 789-2018
            </Text>
          </Box>
          {headerBadges && <Flex gap={2} flexWrap="wrap">{headerBadges}</Flex>}
        </Flex>
      </Box>

      <Box as="main" flex={1} py={6} px={4}>
        <Container maxW="1400px" centerContent={false}>
          {children}
        </Container>
      </Box>

      {footer && (
        <Box as="footer" bg="gray.800" color="gray.200" py={4} px={6} fontSize="sm">
          {footer}
        </Box>
      )}
    </Box>
  )
}
