import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { FounderSchema } from '../data/schema'

export type FounderDialogType = 'create' | 'update' | 'delete' | 'import'

interface FounderContextType {
  open: FounderDialogType | null
  setOpen: (str: FounderDialogType | null) => void
  currentRow: FounderSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<FounderSchema | null>>
}

const FounderContext = React.createContext<FounderContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function FounderProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<FounderDialogType>(null)
  const [currentRow, setCurrentRow] = useState<FounderSchema | null>(null)
  return (
    <FounderContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </FounderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFounderContext = () => {
  const founderContext = React.useContext(FounderContext)

  if (!founderContext) {
    throw new Error('useFounder has to be used within <FounderProvider>')
  }

  return founderContext
}
