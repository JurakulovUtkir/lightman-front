import { useMemo } from 'react'
import { Route } from '@/routes/_authenticated/projects/socials/$id'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import PriceCards from './components/price-cards'
import { ProjectSocialDialogs } from './components/project-social-dialogs'
import { ProjectSocialPrimaryButtons } from './components/project-social-primary-buttons'
import ProjectSocialProvider from './context'
import { useProjectSocials } from './data/hooks'

const ProjectSocials = () => {
  const { id } = Route.useLoaderData()
  const { data } = useProjectSocials(id)

  // Group data by social network type
  const groupedData = useMemo(() => {
    if (!data?.data?.length) return {}

    const groups: Record<string, { name: string; data: typeof data.data }> = {}

    data.data.forEach((item) => {
      const networkTypeId = item.social.social_network_type.id
      const networkTypeName = item.social.social_network_type.name

      if (!groups[networkTypeId]) {
        groups[networkTypeId] = {
          name: networkTypeName,
          data: [],
        }
      }

      groups[networkTypeId].data.push(item)
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
              Project Socials
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
              {networkTypes.map(([typeId, { data: tabData }]) => (
                <TabsContent key={typeId} value={typeId}>
                  <DataTable data={tabData} columns={columns} />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <DataTable data={[]} columns={columns} />
          )}
        </div>
      </Main>
      <ProjectSocialDialogs />
    </ProjectSocialProvider>
  )
}

export default ProjectSocials
