import { useNavigate } from '@tanstack/react-router'
import {
  IconSettingsFilled,
  IconArrowLeft,
  IconHome,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

// Under Construction Component (page in progress)
export function UnderConstruction() {
  const navigate = useNavigate()

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2 px-4'>
        <div className='flex max-w-md flex-col items-center justify-center gap-4 text-center'>
          <div className='rounded-full bg-blue-500/10 p-6'>
            <IconSettingsFilled
              className='h-20 w-20 text-blue-500'
              stroke={1.5}
            />
          </div>
          <h1 className='text-4xl font-bold'>Under Construction</h1>
          <p className='text-muted-foreground'>
            We're working hard to bring you this page. <br />
            Check back soon for updates!
          </p>
          <div className='mt-6 flex gap-3'>
            <Button variant='outline' onClick={() => window.history.back()}>
              <IconArrowLeft className='mr-2 h-4 w-4' />
              Go Back
            </Button>
            <Button onClick={() => navigate({ to: '/' })}>
              <IconHome className='mr-2 h-4 w-4' />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default export showing both examples
export default function EmptyPage() {
  return (
    <div className='min-h-screen'>
      {/* Toggle between components by uncommenting one */}
      <UnderConstruction />
    </div>
  )
}
