import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ProjectSchema } from '../data/schema'

export type ProjectDialogType = 'create' | 'update' | 'delete' | 'import'

interface ProjectContextType {
  open: ProjectDialogType | null
  setOpen: (str: ProjectDialogType | null) => void
  currentRow: ProjectSchema | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ProjectSchema | null>>
}

const ProjectContext = React.createContext<ProjectContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProjectProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ProjectDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProjectSchema | null>(null)
  return (
    <ProjectContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProjectContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProjectContext = () => {
  const projectContext = React.useContext(ProjectContext)

  if (!projectContext) {
    throw new Error('useProject has to be used within <ProjectContext>')
  }

  return projectContext
}
