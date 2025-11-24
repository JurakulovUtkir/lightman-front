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
import { useProjectSocials, useProjectSocialStatistics } from './data/hooks'

// import { ProjectSocialSchema } from './data/schema'

const ProjectSocials = () => {
  const { id } = Route.useLoaderData()
  const { data } = useProjectSocials(id)
  const { data: project, isPending: isPendingProject } = useProject(id)
  const { data: statistics } = useProjectSocialStatistics(id)

  // Group data by social network type, then by social_id
  const groupedData = useMemo(() => {
    if (!data?.data?.length) return {}

    const groups: Record<
      string,
      {
        name: string
        groupedBySocial: GroupedRow[]
      }
    > = {}

    data.data.forEach((item) => {
      const networkTypeId = item.social.social_network_type.id
      const networkTypeName = item.social.social_network_type.name
      const socialId = item.social.id

      if (!groups[networkTypeId]) {
        groups[networkTypeId] = {
          name: networkTypeName,
          groupedBySocial: [],
        }
      }

      // Find existing group for this social_id
      const existingGroup = groups[networkTypeId].groupedBySocial.find(
        (g) => g.socialId === socialId
      )

      if (existingGroup) {
        existingGroup.items.push(item)
        existingGroup.count += 1
        existingGroup.totalBuyPrice += item.buy_price || 0
        existingGroup.totalSellPrice += item.sell_price || 0

        // Update payment status - if any unpaid, mark as Unpaid
        if (!item.is_paid) {
          existingGroup.paymentStatus = 'Unpaid'
        }
      } else {
        groups[networkTypeId].groupedBySocial.push({
          socialId: socialId,
          socialName: item.social.name,
          socialLink: item.social.link,
          subscriberCount: item.social.subscriber_count || 0,
          count: 1,
          totalBuyPrice: item.buy_price || 0,
          totalSellPrice: item.sell_price || 0,
          paymentStatus: item.is_paid ? 'Paid' : 'Unpaid',
          items: [item],
        })
      }
    })

    return groups
  }, [data])

  // Combine all grouped data for "All" tab
  const allGroupedData = useMemo(() => {
    return Object.values(groupedData).flatMap(
      ({ groupedBySocial }) => groupedBySocial
    )
  }, [groupedData])

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
        {data && data?.data?.length > 0 && (
          <PriceCards data={data} statistics={statistics?.data} />
        )}

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {networkTypes.length > 0 ? (
            <Tabs defaultValue='all' className='w-full'>
              <TabsList>
                <TabsTrigger value='all'>All</TabsTrigger>
                {networkTypes.map(([typeId, { name }]) => (
                  <TabsTrigger key={typeId} value={typeId}>
                    {name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value='all'>
                <DataTable
                  data={allGroupedData}
                  columns={groupedColumns}
                  enableExpanding={true}
                  onRowDoubleClick={false}
                  renderSubComponent={(row) => (
                    <div className='bg-gray-50 p-4 dark:bg-gray-900'>
                      <DataTable
                        data={row.items}
                        columns={columns}
                        enableExpanding={false}
                        onRowDoubleClick={true}
                      />
                    </div>
                  )}
                />
              </TabsContent>
              {networkTypes.map(([typeId, { groupedBySocial }]) => (
                <TabsContent key={typeId} value={typeId}>
                  <DataTable
                    data={groupedBySocial}
                    columns={groupedColumns}
                    enableExpanding={true}
                    onRowDoubleClick={false}
                    renderSubComponent={(row) => (
                      <div className='bg-gray-50 p-4 dark:bg-gray-900'>
                        <DataTable
                          data={row.items}
                          columns={columns}
                          enableExpanding={false}
                          onRowDoubleClick={true}
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
