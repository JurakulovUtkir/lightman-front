import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ContractSchema } from '../data/schema'

export type ContractDialogType = 'create' | 'update' | 'delete' | 'import'

interface ContractContextType {
  open: ContractDialogType | null
  setOpen: (str: ContractDialogType | null) => void
  currentRow: ContractSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ContractSchema | null>>
}

const ContractContext = React.createContext<ContractContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ContractProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ContractDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ContractSchema | null>(null)
  return (
    <ContractContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ContractContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useContractContext = () => {
  const contractContext = React.useContext(ContractContext)

  if (!contractContext) {
    throw new Error('useContract has to be used within <ContractContext>')
  }

  return contractContext
}
