import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { ProjectSchema } from '@/features/projects/data/schema'
import { ProjectSocialSchema } from '../data/schema'

export type ProjectSocialDialogType =
  | 'create'
  | 'update'
  | 'delete'
  | 'import'
  | 'paid'
  | 'status'

interface ProjectSocialContextType {
  open: ProjectSocialDialogType | null
  setOpen: (str: ProjectSocialDialogType | null) => void
  currentRow: ProjectSocialSchema | null
  setCurrentRow: React.Dispatch<
    React.SetStateAction<ProjectSocialSchema | null>
  >
  projectData: ProjectSchema | null
  setProjectData: React.Dispatch<React.SetStateAction<ProjectSchema | null>>
}

const ProjectSocialContext =
  React.createContext<ProjectSocialContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function ProjectSocialProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<ProjectSocialDialogType>(null)
  const [currentRow, setCurrentRow] = useState<ProjectSocialSchema | null>(null)
  const [projectData, setProjectData] = useState<ProjectSchema | null>(null)
  return (
    <ProjectSocialContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        projectData,
        setProjectData,
      }}
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
