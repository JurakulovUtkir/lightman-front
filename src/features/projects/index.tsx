import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { IconSearch } from '@tabler/icons-react'
import { useDebounce } from '@/hooks/useDebounce'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CustomPagination } from './components/custom-pagination'
import ProjectCards from './components/project-cards'
import { ProjectDialogs } from './components/project-dialogs'
// import { ProjectFilter } from './components/project-filter'
import { ProjectPrimaryButtons } from './components/project-primary-buttons'
import ProjectProvider from './context'
import { useProjects } from './data/hooks'

const Projects = () => {
  const { offset, limit } = useSearch({
    from: '/_authenticated/projects/',
  })
  const [search, setSearch] = useState('')
  //   const [filters, setFilters] = useState<{
  //     is_active?: boolean
  //   }>({})

  const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useProjects({
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    // is_active: filters.is_active,
  })

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
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of projects!
            </p>
          </div>
          <ProjectPrimaryButtons />
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='search'
              placeholder='Search by projects'
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          {/* <ProjectFilter onFilterChange={setFilters} /> */}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 pt-4 pb-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <ProjectCards data={data?.data} />
        </div>
        {data?.data.total ? (
          <CustomPagination
            offset={currentOffset}
            limit={currentLimit}
            total={data.data.total}
          />
        ) : null}
      </Main>
      <ProjectDialogs />
    </ProjectProvider>
  )
}

export default Projects
