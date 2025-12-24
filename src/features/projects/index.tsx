import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { IconSearch } from '@tabler/icons-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { DataTable } from '@/components/table/data-table'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import ProjectFilter from './components/filters/project-filter'
import { ProjectDialogs } from './components/project-dialogs'
import { ProjectPrimaryButtons } from './components/project-primary-buttons'
import ProjectProvider from './context'
import { useProjects } from './data/hooks'
import { ProjectSchema } from './data/schema'

const Projects = () => {
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
  } = useSearch({
    from: '/_authenticated/projects/',
  })
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useProjects({
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    category_id: category_id || undefined,
    status,
    our_company_id,
    customer_company_id,
    project_manager_id,
    distribution_id,
    price_type,
    max_price,
    min_price,
  })

  const handleDobleClick = (payload: ProjectSchema) => {
    navigate({
      to: '/projects/socials/$id',
      params: { id: payload.id },
    })
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
          <ProjectPrimaryButtons text={t.create} />
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
          <ProjectFilter />
        </div>
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
      </Main>
      <ProjectDialogs />
    </ProjectProvider>
  )
}

export default Projects
