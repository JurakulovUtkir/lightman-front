import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { DepositSchema } from '../data/schema'

export type DepositDialogType = 'create' | 'update' | 'delete' | 'import'

interface DepositContextType {
  open: DepositDialogType | null
  setOpen: (str: DepositDialogType | null) => void
  currentRow: DepositSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<DepositSchema | null>>
}

const DepositContext = React.createContext<DepositContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function DepositProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<DepositDialogType>(null)
  const [currentRow, setCurrentRow] = useState<DepositSchema | null>(null)
  return (
    <DepositContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DepositContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDepositContext = () => {
  const depositContext = React.useContext(DepositContext)

  if (!depositContext) {
    throw new Error('useDeposit has to be used within <DepositContext>')
  }

  return depositContext
}
