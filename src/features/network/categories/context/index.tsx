import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { NetworkCategorySchema } from '../data/schema'

export type NetworkCategoryDialogType =
  | 'create'
  | 'update'
  | 'delete'
  | 'import'

interface NetworkCategoryContextType {
  open: NetworkCategoryDialogType | null
  setOpen: (str: NetworkCategoryDialogType | null) => void
  currentRow: NetworkCategorySchema | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<NetworkCategorySchema | null>
  >
}

const NetworkCategoryContext =
  React.createContext<NetworkCategoryContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function NetworkCategoryProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<NetworkCategoryDialogType>(null)
  const [currentRow, setCurrentRow] = useState<NetworkCategorySchema | null>(
    null
  )
  return (
    <NetworkCategoryContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </NetworkCategoryContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNetworkCategoryContext = () => {
  const networkCategoryContext = React.useContext(NetworkCategoryContext)

  if (!networkCategoryContext) {
    throw new Error(
      'useNetworkCategory has to be used within <NetworkCategoryProvider>'
    )
  }

  return networkCategoryContext
}
