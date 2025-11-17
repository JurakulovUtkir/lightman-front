import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { NetworkTagSchema } from '../data/schema'

export type NetworkTagDialogType = 'create' | 'update' | 'delete' | 'import'

interface NetworkTagContextType {
  open: NetworkTagDialogType | null
  setOpen: (str: NetworkTagDialogType | null) => void
  currentRow: NetworkTagSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<NetworkTagSchema | null>>
}

const NetworkTagContext = React.createContext<NetworkTagContextType | null>(
  null
)

interface Props {
  children: React.ReactNode
}

export default function NetworkTagProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<NetworkTagDialogType>(null)
  const [currentRow, setCurrentRow] = useState<NetworkTagSchema | null>(null)
  return (
    <NetworkTagContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </NetworkTagContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNetworkTagContext = () => {
  const networkTagContext = React.useContext(NetworkTagContext)

  if (!networkTagContext) {
    throw new Error('useNetworkTag has to be used within <NetworkTagContext>')
  }

  return networkTagContext
}
