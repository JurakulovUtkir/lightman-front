import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ProjectSocialSchema } from '../data/schema'

export type ProjectSocialDialogType = 'create' | 'update' | 'delete' | 'import'

interface ProjectSocialContextType {
  open: ProjectSocialDialogType | null
  setOpen: (str: ProjectSocialDialogType | null) => void
  currentRow: ProjectSocialSchema | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<ProjectSocialSchema | null>
  >
}

const ProjectSocialContext =
  React.createContext<ProjectSocialContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProjectSocialProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ProjectSocialDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProjectSocialSchema | null>(null)
  return (
    <ProjectSocialContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </ProjectSocialContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProjectSocialContext = () => {
  const projectSocialContext = React.useContext(ProjectSocialContext)

  if (!projectSocialContext) {
    throw new Error(
      'useProjectSocial has to be used within <ProjectSocialProvider>'
    )
  }

  return projectSocialContext
}
