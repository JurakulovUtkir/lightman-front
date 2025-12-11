import { useNavigate } from '@tanstack/react-router'
import { IconCoins, IconPlus } from '@tabler/icons-react'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'
import { ProjectSchema } from '@/features/projects/data/schema'
import { useProjectSocialContext } from '../context'
import StatusSelect from './status-select'

export function ProjectSocialPrimaryButtons({
  project,
}: {
  project: ProjectSchema | undefined
}) {
  const navigate = useNavigate()
  const { setOpen } = useProjectSocialContext()
  const { lang, tProject } = useLang()
  const t = tProject[lang]

  return (
    <div className='flex gap-2'>
      {project && <StatusSelect project={project} />}

      {project?.id && (
        <Button
          variant='outline'
          className='space-x-1'
          onClick={() =>
            navigate({
              to: '/projects/expence/$id',
              params: { id: project.id },
            })
          }
        >
          <span>{t.expences}</span>
          <IconCoins size={18} />
        </Button>
      )}
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t.create}</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
