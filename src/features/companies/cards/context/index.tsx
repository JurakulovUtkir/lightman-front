import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { CardsSchema } from '../data/schema'

export type CardsDialogType = 'create' | 'update' | 'delete' | 'import'

interface CardsContextType {
  open: CardsDialogType | null
  setOpen: (str: CardsDialogType | null) => void
  currentRow: CardsSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<CardsSchema | null>>
}

const CardsContext = React.createContext<CardsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function CardsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<CardsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<CardsSchema | null>(null)
  return (
    <CardsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CardsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCardsContext = () => {
  const cardsContext = React.useContext(CardsContext)

  if (!cardsContext) {
    throw new Error('useCards has to be used within <CardsContext>')
  }

  return cardsContext
}
