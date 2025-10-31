import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { DistributionSchema } from '../data/schema'

export type DistributionDialogType = 'create' | 'update' | 'delete' | 'import'

interface DistributionContextType {
  open: DistributionDialogType | null
  setOpen: (str: DistributionDialogType | null) => void
  currentRow: DistributionSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DistributionSchema | null>>
}

const DistributionContext = React.createContext<DistributionContextType | null>(
  null
)

interface Props {
  children: React.ReactNode
}

export default function DistributionProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<DistributionDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DistributionSchema | null>(null)
  return (
    <DistributionContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </DistributionContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDistributionContext = () => {
  const distributionContext = React.useContext(DistributionContext)

  if (!distributionContext) {
    throw new Error(
      'useDistribution has to be used within <DistributionProvider>'
    )
  }

  return distributionContext
}
