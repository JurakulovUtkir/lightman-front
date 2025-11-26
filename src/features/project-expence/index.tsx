import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { IconSearch } from '@tabler/icons-react'
import { Route } from '@/routes/_authenticated/projects/expence/$id'
import { useDebounce } from '@/hooks/useDebounce'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { DataTable } from '@/components/table/data-table'
import { ThemeSwitch } from '@/components/theme-switch'
import ExpenceFilter from '@/features/expences/components/filters/expence-filter'
import { useExpences } from '../expences/data/hooks'
import { useProject } from '../projects/data/hooks'
import { columns } from './components/columns'

const ProjectExpence = () => {
  const { id } = Route.useLoaderData()

  const {
    offset,
    limit,
    type,
    expence_type,
    payment_type,
    distribution_id,
    company_id,
    user_id,
    date_from,
    date_to,
    max_amount,
    min_amount,
  } = useSearch({
    from: '/_authenticated/projects/expence/$id',
  })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useExpences({
    project_id: id,
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    type,
    expence_type,
    payment_type,
    distribution_id,
    company_id,
    user_id,
    date_from,
    date_to,
    max_amount,
    min_amount,
  })
  const { data: project } = useProject(id)

  return (
    <>
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
              {project?.name ?? ''}
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list expences of {project?.name ?? ''}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='search'
              placeholder='Search by expence'
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          <ExpenceFilter isProject />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data.items?.length ? data.data.items : []}
            columns={columns}
            offset={offset}
            limit={limit}
            total={data?.data.total ?? 0}
          />
        </div>
      </Main>
    </>
  )
}

export default ProjectExpence
