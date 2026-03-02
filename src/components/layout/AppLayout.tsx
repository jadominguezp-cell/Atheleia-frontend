import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <Box minH="100vh" bg="gray.900">
      <TopBar />
      <Flex>
        <Sidebar />
        <Box flex={1} overflowX="auto" h="calc(100vh - 60px)">
          <Outlet />
        </Box>
      </Flex>
    </Box>
  )
}
