import { Link, useNavigate } from '@tanstack/react-router'
import { formatDateToCustomString } from '@/lib/dateFormatter'
import { getPaymentStatusColor, getStatusColor } from '@/lib/statusHelpers'
import { formatPrice } from '@/utils/formatPrice'
import { Button } from '@/components/ui/button'
import { useProjects } from '@/features/projects/data/hooks'

export function RecentProjects() {
  const navigate = useNavigate()
  const { data } = useProjects({
    offset: 0,
    limit: 10,
  })

  const projects = data?.data?.items || []
  const displayProjects = projects.slice(0, 5)

  const handleNavigate = (id: string) => {
    navigate({
      to: '/projects/socials/$id',
      params: { id },
    })
  }
  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {displayProjects.map((project) => (
          <div
            onClick={() => handleNavigate(project.id)}
            key={project.id}
            className='hover:bg-accent flex cursor-pointer items-start gap-4 rounded-lg p-3 transition-colors'
          >
            <div className='min-w-0 flex-1 space-y-2'>
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`${project.is_active ? 'bg-green-500' : 'bg-destructive'} h-2 w-2 shrink-0 animate-pulse rounded-full`}
                    />
                    <p className='truncate text-sm leading-tight font-semibold'>
                      {project.name}
                    </p>
                  </div>
                  <p className='text-muted-foreground mt-1 truncate text-xs'>
                    {project.customer_company.name}
                  </p>
                </div>
                <div className='flex shrink-0 gap-1.5'>
                  <div
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${getStatusColor(project.status)}`}
                  >
                    {project.status}
                  </div>
                  <div
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${getPaymentStatusColor(project.payment_status)}`}
                  >
                    {project.payment_status}
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between gap-2 text-xs'>
                <div className='text-muted-foreground flex flex-wrap items-center gap-3'>
                  {project.project_manager && (
                    <span className='flex items-center gap-1'>
                      <svg
                        className='h-3 w-3'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                        />
                      </svg>
                      {project.project_manager.full_name}
                    </span>
                  )}
                  <span className='flex items-center gap-1'>
                    <svg
                      className='h-3 w-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                    {formatDateToCustomString(project.created_at)}
                  </span>
                  {project.category && (
                    <span className='bg-secondary inline-flex items-center rounded-md px-2 py-0.5 text-xs'>
                      {project.category.name}
                    </span>
                  )}
                  {project.is_qqs && (
                    <span className='flex items-center gap-1'>
                      <div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
                      <span className='text-xs'>QQS</span>
                    </span>
                  )}
                </div>
                <span className='text-foreground shrink-0 font-semibold'>
                  {formatPrice(project.price)} UZS
                </span>
              </div>

              {project.tags && project.tags.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className='bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs'
                    >
                      <svg
                        className='h-3 w-3'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
                        />
                      </svg>
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className='bg-secondary text-secondary-foreground inline-flex items-center rounded px-2 py-0.5 text-xs'>
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects.length > 8 && (
        <Link to='/projects'>
          <Button variant='outline' className='w-full'>
            View All Projects...
          </Button>
        </Link>
      )}
    </div>
  )
}
