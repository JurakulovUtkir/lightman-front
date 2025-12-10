import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { LoanSchema } from '../data/schema'

export type LoanDialogType = 'create' | 'update' | 'delete' | 'import'

interface LoanContextType {
  open: LoanDialogType | null
  setOpen: (str: LoanDialogType | null) => void
  currentRow: LoanSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<LoanSchema | null>>
}

const LoanContext = React.createContext<LoanContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function LoanProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<LoanDialogType>(null)
  const [currentRow, setCurrentRow] = useState<LoanSchema | null>(null)
  return (
    <LoanContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </LoanContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLoanContext = () => {
  const loanContext = React.useContext(LoanContext)

  if (!loanContext) {
    throw new Error('useLoan has to be used within <LoanContext>')
  }

  return loanContext
}
