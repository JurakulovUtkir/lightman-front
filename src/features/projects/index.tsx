import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { IconSearch } from '@tabler/icons-react'
import { ProjectStatus } from '@/constants/enums'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { DataTable } from '@/components/table/data-table'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { columnsPassive } from './components/columns-passive'
import ProjectFilter from './components/filters/project-filter'
import { ProjectDialogs } from './components/project-dialogs'
import { ProjectPrimaryButtons } from './components/project-primary-buttons'
import ProjectProvider from './context'
import { useProjects } from './data/hooks'
import { ProjectSchema } from './data/schema'

const Projects = ({ passive = false }: { passive?: boolean }) => {
  const { lang, tProject, general } = useLang()
  const t = tProject[lang]

  const navigate = useNavigate()
  const {
    offset,
    limit,
    category_id,
    status,
    our_company_id,
    project_manager_id,
    customer_company_id,
    distribution_id,
    price_type,
    max_price,
    min_price,
    active_tab,
  } = useSearch({
    strict: false,
  })
  const [search, setSearch] = useState('')

  // Get statuses excluding draft
  const passiveStatuses = Object.values(ProjectStatus).filter(
    (s) => s !== ProjectStatus.DRAFT
  )

  // Use active_tab from URL if passive mode, otherwise empty string
  const currentTab = passive ? active_tab || passiveStatuses[0] : ''

  const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  // Use currentTab as status when passive is true
  const effectiveStatus = passive ? currentTab : status

  const { data } = useProjects({
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    category_id: category_id || undefined,
    status: effectiveStatus as ProjectStatus | undefined,
    our_company_id,
    customer_company_id,
    project_manager_id,
    distribution_id,
    price_type,
    max_price,
    min_price,
  })

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    navigate({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      search: (prev) => ({
        ...prev,
        active_tab: value,
        offset: 0, // Reset pagination when changing tabs
      }),
    })
  }

  const handleDobleClick = (payload: ProjectSchema) => {
    navigate({
      to: '/projects/socials/$id',
      params: { id: payload.id },
    })
  }

  // Format status label for display
  const formatStatusLabel = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <ProjectProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t.projects}</h2>
            <p className='text-muted-foreground'>{t.list_projects}</p>
          </div>
          {!passive && <ProjectPrimaryButtons text={t.create} />}
        </div>
        <div className='flex flex-col gap-4 md:flex-row md:items-center'>
          <div className='relative'>
            <Input
              type='search'
              placeholder={t.search_by_project}
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          <ProjectFilter passive={passive} />
        </div>

        {passive ? (
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className='mt-4'
          >
            <TabsList>
              {passiveStatuses.map((status) => (
                <TabsTrigger key={status} value={status}>
                  {formatStatusLabel(status)}
                </TabsTrigger>
              ))}
            </TabsList>
            {passiveStatuses.map((status) => (
              <TabsContent key={status} value={status}>
                <div className='-mx-4 flex-1 overflow-auto px-4 pt-4 pb-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
                  <DataTable
                    data={data?.data.items?.length ? data.data.items : []}
                    columns={columnsPassive(general[lang].columns)}
                    offset={offset}
                    limit={limit}
                    total={data?.data.total ?? 0}
                    onRowDoubleClick={handleDobleClick}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className='-mx-4 flex-1 overflow-auto px-4 pt-4 pb-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
            <DataTable
              data={data?.data.items?.length ? data.data.items : []}
              columns={columns(general[lang].columns)}
              offset={offset}
              limit={limit}
              total={data?.data.total ?? 0}
              onRowDoubleClick={handleDobleClick}
            />
          </div>
        )}
      </Main>
      <ProjectDialogs />
    </ProjectProvider>
  )
}

export default Projects
