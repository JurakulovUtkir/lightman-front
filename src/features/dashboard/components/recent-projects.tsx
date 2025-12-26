import { Link, useNavigate } from '@tanstack/react-router'
import { formatDateToCustomString } from '@/lib/dateFormatter'
import { getPaymentStatusColor, getStatusColor } from '@/lib/statusHelpers'
import { formatPrice } from '@/utils/formatPrice'
import { Button } from '@/components/ui/button'
import { useProjectExpenceStatistics } from '@/features/project-socials/data/hooks'
import { useProjects } from '@/features/projects/data/hooks'
import { ProjectSchema } from '@/features/projects/data/schema'

function ProjectCard({
  project,
  expenseStatistics,
}: {
  project: ProjectSchema
  expenseStatistics:
    | {
        given_amount: string
        project_id: string
        project_name: string
        total_expensed_by_service: number
        total_income: number
        total_planned_buy_expense: number
        total_planned_sell_expense: number
      }
    | undefined
}) {
  const navigate = useNavigate()

  const handleNavigate = (id: string) => {
    navigate({
      to: '/projects/socials/$id',
      params: { id },
    })
  }

  // Calculate expense progress similar to PriceCards logic
  const expenseProgress = (() => {
    if (!expenseStatistics) {
      return { percentage: 0, numerator: 0, denominator: 0 }
    }

    const {
      total_expensed_by_service,
      total_planned_sell_expense,
      total_income,
    } = expenseStatistics

    if (total_income === 0) {
      return { percentage: 0, numerator: 0, denominator: 0 }
    }

    const totalExpense = total_expensed_by_service + total_planned_sell_expense
    const numerator = project.is_qqs ? 1.12 * totalExpense : totalExpense
    const percentage = Math.min((numerator / total_income) * 100, 100)

    return {
      percentage,
      numerator,
      denominator: total_income,
    }
  })()

  return (
    <div
      onClick={() => handleNavigate(project.id)}
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

        {/* Enhanced Expense Statistics Section */}
        {expenseStatistics && (
          <div className='space-y-2'>
            <div className='flex flex-wrap items-center gap-4 text-xs'>
              <div className='flex items-center gap-1'>
                <svg
                  className='h-3 w-3 text-blue-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span className='text-muted-foreground'>
                  Income: {formatPrice(expenseStatistics.total_income)} UZS
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <svg
                  className='h-3 w-3 text-orange-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
                <span className='text-muted-foreground'>
                  Actual Expenses:{' '}
                  {formatPrice(expenseStatistics.total_expensed_by_service)} UZS
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <svg
                  className='h-3 w-3 text-purple-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                  />
                </svg>
                <span className='text-muted-foreground'>
                  Planned:{' '}
                  {formatPrice(expenseStatistics.total_planned_sell_expense)}{' '}
                  UZS
                </span>
              </div>
              {parseFloat(expenseStatistics.given_amount) > 0 && (
                <div className='flex items-center gap-1'>
                  <svg
                    className='h-3 w-3 text-green-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <span className='font-medium text-green-600'>
                    Given:{' '}
                    {formatPrice(parseFloat(expenseStatistics.given_amount))}{' '}
                    UZS
                  </span>
                </div>
              )}
            </div>

            {/* Expense Progress Bar */}
            {/* {expenseProgress.denominator > 0 && ( */}
            <div className='flex items-center gap-2'>
              <div className='flex-1'>
                <div className='mb-1 flex items-center justify-between'>
                  <span className='text-muted-foreground text-xs'>
                    Expense Progress {project.is_qqs && '(+12%)'}
                  </span>
                  <span className='text-xs font-medium'>
                    {expenseProgress.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className='h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700'>
                  <div
                    className='h-full rounded-full bg-orange-600 transition-all duration-300'
                    style={{ width: `${expenseProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
            {/* )} */}
          </div>
        )}

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
  )
}

function ProjectWithStats({ project }: { project: ProjectSchema }) {
  const { data: expenseData } = useProjectExpenceStatistics(project.id)
  const expenseStatistics = expenseData?.data

  return <ProjectCard project={project} expenseStatistics={expenseStatistics} />
}

export function RecentProjects() {
  const { data } = useProjects({
    offset: 0,
    limit: 10,
  })

  const projects = data?.data?.items || []
  const displayProjects = projects.slice(0, 5)

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {displayProjects.map((project) => (
          <ProjectWithStats key={project.id} project={project} />
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
