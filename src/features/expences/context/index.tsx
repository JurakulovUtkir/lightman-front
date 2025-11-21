import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ExpenceSchema } from '../data/schema'

export type ExpenceDialogType = 'create' | 'update' | 'delete' | 'import'

interface ExpenceContextType {
  open: ExpenceDialogType | null
  setOpen: (str: ExpenceDialogType | null) => void
  currentRow: ExpenceSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ExpenceSchema | null>>
}

const ExpenceContext = React.createContext<ExpenceContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ExpenceProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ExpenceDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ExpenceSchema | null>(null)
  return (
    <ExpenceContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ExpenceContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useExpenceContext = () => {
  const expenceContext = React.useContext(ExpenceContext)

  if (!expenceContext) {
    throw new Error('useExpence has to be used within <ExpenceContext>')
  }

  return expenceContext
}
