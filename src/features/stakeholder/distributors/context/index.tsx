import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { DistributorSchema } from '../data/schema'

export type DistributorDialogType = 'create' | 'update' | 'delete' | 'import'

interface DistributorContextType {
  open: DistributorDialogType | null
  setOpen: (str: DistributorDialogType | null) => void
  currentRow: DistributorSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DistributorSchema | null>>
}

const DistributorContext = React.createContext<DistributorContextType | null>(
  null
)

interface Props {
  children: React.ReactNode
}

export default function DistributorProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<DistributorDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DistributorSchema | null>(null)
  return (
    <DistributorContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </DistributorContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDistributorContext = () => {
  const distributorContext = React.useContext(DistributorContext)

  if (!distributorContext) {
    throw new Error(
      'useDistributor has to be used within <DistributorProvider>'
    )
  }

  return distributorContext
}
