import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { NetworkSocialSchema } from '../data/schema'

export type NetworkSocialDialogType = 'create' | 'update' | 'delete' | 'import'

interface NetworkSocialContextType {
  open: NetworkSocialDialogType | null
  setOpen: (str: NetworkSocialDialogType | null) => void
  currentRow: NetworkSocialSchema | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<NetworkSocialSchema | null>
  >
}

const NetworkSocialContext =
  React.createContext<NetworkSocialContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function NetworkSocialProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<NetworkSocialDialogType>(null)
  const [currentRow, setCurrentRow] = useState<NetworkSocialSchema | null>(null)
  return (
    <NetworkSocialContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </NetworkSocialContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNetworkSocialContext = () => {
  const networkSocialContext = React.useContext(NetworkSocialContext)

  if (!networkSocialContext) {
    throw new Error(
      'useNetworkSocial has to be used within <NetworkSocialContext>'
    )
  }

  return networkSocialContext
}
