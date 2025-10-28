import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { NetworkTypeSchema } from '../data/schema'

type NetworkTypesDialogType = 'create' | 'update' | 'delete' | 'import'

interface NetworkTypesContextType {
  open: NetworkTypesDialogType | null
  setOpen: (str: NetworkTypesDialogType | null) => void
  currentRow: NetworkTypeSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<NetworkTypeSchema | null>>
}

const NetworkTypesContext = React.createContext<NetworkTypesContextType | null>(
  null
)

interface Props {
  children: React.ReactNode
}

export default function NetworkTypesProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<NetworkTypesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<NetworkTypeSchema | null>(null)
  return (
    <NetworkTypesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </NetworkTypesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNetworkTypeContext = () => {
  const networkTypesContext = React.useContext(NetworkTypesContext)

  if (!networkTypesContext) {
    throw new Error(
      'useNetworkTypes has to be used within <NetworkTypesContext>'
    )
  }

  return networkTypesContext
}
