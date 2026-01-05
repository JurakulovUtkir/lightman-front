import { Link, useNavigate } from '@tanstack/react-router'
import {
  IconUser,
  IconCalendar,
  IconCoin,
  IconWallet,
  IconClipboard,
  IconCircleCheck,
  IconTag,
  IconTrendingUp,
  IconFolderOpen,
} from '@tabler/icons-react'
import { formatToYearMonthDay } from '@/lib/dateFormatter'
import { getPaymentStatusColor } from '@/lib/statusHelpers'
import { formatPrice } from '@/utils/formatPrice'
import { Button } from '@/components/ui/button'
import { useProjectExpenceStatistics } from '@/features/project-socials/data/hooks'
import { ProjectSchema } from '@/features/projects/data/schema'
import { ProjectSchemaResponse } from '@/features/projects/data/types'

function ProjectCard({
  project,
  expenseStatistics,
  enableProfit,
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
  enableProfit?: boolean
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

  const expectedProfit = (() => {
    if (!expenseStatistics) {
      return 0
    }

    const {
      total_expensed_by_service,
      total_planned_sell_expense,
      total_planned_buy_expense,
    } = expenseStatistics

    const calculation =
      total_planned_sell_expense -
      total_planned_buy_expense -
      total_expensed_by_service

    return calculation
  })()

  const realProfit = (() => {
    if (!expenseStatistics) {
      return 0
    }

    const {
      total_expensed_by_service,
      total_planned_buy_expense,
      given_amount,
    } = expenseStatistics

    const calculation =
      +given_amount - total_planned_buy_expense - total_expensed_by_service

    return calculation
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
                <IconUser className='h-3 w-3' stroke={2} />
                {project.project_manager.full_name}
              </span>
            )}
            <span className='flex items-center gap-1'>
              <IconCalendar className='h-3 w-3' stroke={2} />
              {formatToYearMonthDay(project.created_at)}
            </span>
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
                <IconCoin className='h-3 w-3 text-blue-500' stroke={2} />
                <span className='text-muted-foreground'>
                  Income: {formatPrice(expenseStatistics.total_income)} UZS
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <IconWallet className='h-3 w-3 text-orange-500' stroke={2} />
                <span className='text-muted-foreground'>
                  Actual Expenses:{' '}
                  {formatPrice(expenseStatistics.total_expensed_by_service)} UZS
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <IconClipboard className='h-3 w-3 text-purple-500' stroke={2} />
                <span className='text-muted-foreground'>
                  Planned:{' '}
                  {formatPrice(expenseStatistics.total_planned_sell_expense)}{' '}
                  UZS
                </span>
              </div>
              {enableProfit && (
                <div className='flex items-center gap-1'>
                  <IconTrendingUp
                    className={`h-3 w-3 ${expectedProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}
                    stroke={2}
                  />
                  <div className='flex flex-col gap-1'>
                    <span
                      className={`font-medium ${expectedProfit >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}
                    >
                      Expected profit: {formatPrice(expectedProfit)} UZS
                    </span>
                    <span
                      className={`font-medium ${realProfit >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}
                    >
                      Profit: {formatPrice(realProfit)} UZS
                    </span>
                  </div>
                </div>
              )}
              {parseFloat(expenseStatistics.given_amount) > 0 && (
                <div className='flex items-center gap-1'>
                  <IconCircleCheck
                    className='h-3 w-3 text-blue-500'
                    stroke={2}
                  />
                  <span className='text-muted-foreground'>
                    Given:{' '}
                    {formatPrice(parseFloat(expenseStatistics.given_amount))}{' '}
                    UZS
                  </span>
                </div>
              )}
            </div>

            {/* Expense Progress Bar */}
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
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {project.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className='bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs'
              >
                <IconTag className='h-3 w-3' stroke={2} />
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

function ProjectWithStats({
  project,
  enableProfit,
}: {
  project: ProjectSchema
  enableProfit?: boolean
}) {
  const { data: expenseData } = useProjectExpenceStatistics(project.id)
  const expenseStatistics = expenseData?.data

  return (
    <ProjectCard
      project={project}
      expenseStatistics={expenseStatistics}
      enableProfit={enableProfit}
    />
  )
}

function EmptyState() {
  return (
    <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
      <div className='bg-muted mb-4 rounded-full p-3'>
        <IconFolderOpen
          className='text-muted-foreground h-8 w-8'
          stroke={1.5}
        />
      </div>
      <h3 className='mb-1 text-lg font-semibold'>No projects found</h3>
      <p className='text-muted-foreground mb-4 text-sm'>
        Get started by creating your first project
      </p>
    </div>
  )
}

export function RecentProjects({
  data,
  enableProfit = false,
}: {
  data: ProjectSchemaResponse | undefined
  enableProfit?: boolean
}) {
  const projects = data?.data?.items || []
  const displayProjects = projects.slice(0, 5)

  if (projects.length === 0) {
    return <EmptyState />
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        {displayProjects.map((project) => (
          <ProjectWithStats
            key={project.id}
            project={project}
            enableProfit={enableProfit}
          />
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
