import {
  IconArchive,
  IconCircleDashedCheck,
  IconZoomCheck,
  IconZoomQuestion,
} from '@tabler/icons-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useGetProjects } from '../data/hooks'
import { Overview } from './overview'
import { RecentProjects } from './recent-projects'

const Projects = () => {
  const { data: projects_done } = useGetProjects('done')
  const { data: projects_approved } = useGetProjects('approved')
  const { data: projects_requested } = useGetProjects('requested')
  const { data: projects_draft } = useGetProjects('draft')

  // console.log('projects_done', projects_done)
  // console.log('projects_approved', projects_approved)
  // console.log('projects_requested', projects_requested)
  // console.log('projects_draft', projects_draft)

  // Calculate percentages for display
  const total = projects_done?.data?.total || 20
  const donePercentage = projects_done?.data?.count
    ? ((projects_done.data.count / total) * 100).toFixed(1)
    : '0'
  const approvedPercentage = projects_approved?.data?.count
    ? ((projects_approved.data.count / total) * 100).toFixed(1)
    : '0'
  const requestedPercentage = projects_requested?.data?.count
    ? ((projects_requested.data.count / total) * 100).toFixed(1)
    : '0'
  const draftPercentage = projects_draft?.data?.count
    ? ((projects_draft.data.count / total) * 100).toFixed(1)
    : '0'

  return (
    <>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Done Projects</CardTitle>
            <IconCircleDashedCheck className='text-muted-foreground h-5 w-5' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {projects_done?.data?.count || 0}
            </div>
            <p className='text-muted-foreground text-xs'>
              {donePercentage}% of {total} total projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Approved Projects
            </CardTitle>
            <IconZoomCheck className='text-muted-foreground h-5 w-5' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {projects_approved?.data?.count || 0}
            </div>
            <p className='text-muted-foreground text-xs'>
              {approvedPercentage}% of {total} total projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Requested Projects
            </CardTitle>
            <IconZoomQuestion className='text-muted-foreground h-5 w-5' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {projects_requested?.data?.count || 0}
            </div>
            <p className='text-muted-foreground text-xs'>
              {requestedPercentage}% of {total} total projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Draft Projects
            </CardTitle>
            <IconArchive className='text-muted-foreground h-5 w-5' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {projects_draft?.data?.count || 0}
            </div>
            <p className='text-muted-foreground text-xs'>
              {draftPercentage}% of {total} total projects
            </p>
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 h-[500px] lg:col-span-4'>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            <Overview />
          </CardContent>
        </Card>
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Here is the list of recent projects.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentProjects />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Projects
