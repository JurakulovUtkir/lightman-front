import { createFileRoute } from '@tanstack/react-router'
import ProjectSocials from '@/features/project-socials'

export const Route = createFileRoute('/_authenticated/projects/socials/$id')({
  component: ProjectSocials,
  loader: async ({ params }) => {
    return {
      id: params.id,
    }
  },
})
