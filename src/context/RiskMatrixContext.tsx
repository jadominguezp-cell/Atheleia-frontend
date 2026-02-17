import { createContext, useContext, type ReactNode } from 'react'
import { useRiskMatrix } from '../hooks/useRiskMatrix'

const RiskMatrixContext = createContext<ReturnType<typeof useRiskMatrix> | null>(null)

export function RiskMatrixProvider({ children }: { children: ReactNode }) {
  const value = useRiskMatrix()
  return (
    <RiskMatrixContext.Provider value={value}>
      {children}
    </RiskMatrixContext.Provider>
  )
}

export function useRiskMatrixContext() {
  const ctx = useContext(RiskMatrixContext)
  if (!ctx) throw new Error('useRiskMatrixContext must be used within RiskMatrixProvider')
  return ctx
}
