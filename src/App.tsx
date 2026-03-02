import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'

import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { BoardsListPage } from './pages/BoardsListPage'
import { BoardDetailPage } from './pages/BoardDetailPage'
import { OperationsListPage } from './pages/OperationsListPage'
import { OperationDetailPage } from './pages/OperationDetailPage'
import { AppLayout } from './components/layout/AppLayout'
import { AuthGuard } from './components/AuthGuard'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Area */}
          <Route
            path="/"
            element={
              <AuthGuard>
                <AppLayout />
              </AuthGuard>
            }
          >
            <Route index element={<BoardsListPage />} />
            <Route path="board/:id" element={<BoardDetailPage />} />
            <Route path="operations" element={<OperationsListPage />} />
            <Route path="operations/:id" element={<OperationDetailPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
