import { useNavigate } from '@tanstack/react-router'
import { IconCoins, IconPlus } from '@tabler/icons-react'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'
import { useProjectSocialContext } from '../context'

export function ProjectSocialPrimaryButtons({ id }: { id: string }) {
  const navigate = useNavigate()
  const { setOpen } = useProjectSocialContext()
  const { lang, tProject } = useLang()
  const t = tProject[lang]

  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() =>
          navigate({
            to: '/projects/expence/$id',
            params: { id },
          })
        }
      >
        <span>{t.expences}</span>
        <IconCoins size={18} />
      </Button>
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>{t.create}</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}
