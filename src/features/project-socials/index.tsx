import { useMemo } from 'react'
import { Route } from '@/routes/_authenticated/projects/socials/$id'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useProject } from '../projects/data/hooks'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { groupedColumns, GroupedRow } from './components/grouped-columns'
import PriceCards from './components/price-cards'
import { ProjectSocialDialogs } from './components/project-social-dialogs'
import { ProjectSocialPrimaryButtons } from './components/project-social-primary-buttons'
import ProjectSocialProvider from './context'
import { useProjectSocials } from './data/hooks'
import { ProjectSocialSchema } from './data/schema'

const ProjectSocials = () => {
  const { id } = Route.useLoaderData()
  const { data } = useProjectSocials(id)
  const { data: project, isPending: isPendingProject } = useProject(id)

  // Group data by social network type, then by project_id
  const groupedData = useMemo(() => {
    if (!data?.data?.length) return {}

    const groups: Record<
      string,
      { name: string; data: typeof data.data; groupedByProject: GroupedRow[] }
    > = {}

    data.data.forEach((item) => {
      const networkTypeId = item.social.social_network_type.id
      const networkTypeName = item.social.social_network_type.name

      if (!groups[networkTypeId]) {
        groups[networkTypeId] = {
          name: networkTypeName,
          data: [],
          groupedByProject: [],
        }
      }

      groups[networkTypeId].data.push(item)
    })

    // Now group each network type's data by project_id
    Object.keys(groups).forEach((networkTypeId) => {
      const projectGroups: Record<string, ProjectSocialSchema[]> = {}

      groups[networkTypeId].data.forEach((item) => {
        const projectId = item.project_id
        if (!projectGroups[projectId]) {
          projectGroups[projectId] = []
        }
        projectGroups[projectId].push(item)
      })

      // Convert to GroupedRow format
      groups[networkTypeId].groupedByProject = Object.entries(
        projectGroups
      ).map(([projectId, items]) => {
        const totalBuyPrice = items.reduce(
          (sum, item) => sum + (item.buy_price ?? 0),
          0
        )
        const totalSellPrice = items.reduce(
          (sum, item) => sum + (item.sell_price ?? 0),
          0
        )
        const allPaid = items.every((item) => item.is_paid)
        const somePaid = items.some((item) => item.is_paid)

        return {
          projectId,
          projectName: project?.name || 'Unknown Project',
          count: items.length,
          totalBuyPrice,
          totalSellPrice,
          paymentStatus: allPaid
            ? ('Paid' as const)
            : somePaid
              ? ('Partial' as const)
              : ('Unpaid' as const),
          items,
        }
      })
    })

    return groups
  }, [data])

  const networkTypes = Object.entries(groupedData)

  return (
    <ProjectSocialProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {isPendingProject ? '' : project?.name ? project.name : '-'}
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of Project socials!
            </p>
          </div>
          <ProjectSocialPrimaryButtons />
        </div>
        {data && data?.data?.length > 0 && <PriceCards data={data} />}

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {networkTypes.length > 0 ? (
            <Tabs defaultValue={networkTypes[0][0]} className='w-full'>
              <TabsList>
                {networkTypes.map(([typeId, { name }]) => (
                  <TabsTrigger key={typeId} value={typeId}>
                    {name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {networkTypes.map(([typeId, { groupedByProject }]) => (
                <TabsContent key={typeId} value={typeId}>
                  <DataTable
                    data={groupedByProject}
                    columns={groupedColumns}
                    enableExpanding={true}
                    renderSubComponent={(row) => (
                      <div className='bg-gray-50 p-4 dark:bg-gray-900'>
                        <h4 className='mb-3 text-sm font-semibold'>
                          Project Details ({row.items.length} items)
                        </h4>
                        <DataTable
                          data={row.items}
                          columns={columns}
                          enableExpanding={false}
                        />
                      </div>
                    )}
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <DataTable data={[]} columns={groupedColumns} />
          )}
        </div>
      </Main>
      <ProjectSocialDialogs />
    </ProjectSocialProvider>
  )
}

export default ProjectSocials
