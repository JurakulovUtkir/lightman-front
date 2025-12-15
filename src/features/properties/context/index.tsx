import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { PropertySchema } from '../data/schema'

export type PropertyDialogType = 'create' | 'update' | 'delete' | 'import'

interface PropertyContextType {
  open: PropertyDialogType | null
  setOpen: (str: PropertyDialogType | null) => void
  currentRow: PropertySchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<PropertySchema | null>>
}

const PropertyContext = React.createContext<PropertyContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function PropertyProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<PropertyDialogType>(null)
  const [currentRow, setCurrentRow] = useState<PropertySchema | null>(null)
  return (
    <PropertyContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </PropertyContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePropertyContext = () => {
  const propertyContext = React.useContext(PropertyContext)

  if (!propertyContext) {
    throw new Error('useProperty has to be used within <PropertyContext>')
  }

  return propertyContext
}
