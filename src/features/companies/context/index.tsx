import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { CompanySchema } from '../data/schema'

export type CompanyDialogType = 'create' | 'update' | 'delete' | 'import'

interface CompanyContextType {
  open: CompanyDialogType | null
  setOpen: (str: CompanyDialogType | null) => void
  currentRow: CompanySchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<CompanySchema | null>>
}

const CompanyContext = React.createContext<CompanyContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function CompanyProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CompanyDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CompanySchema | null>(null)
  return (
    <CompanyContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CompanyContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCompanyContext = () => {
  const companyContext = React.useContext(CompanyContext)

  if (!companyContext) {
    throw new Error('useCompany has to be used within <CompanyContext>')
  }

  return companyContext
}
