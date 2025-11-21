import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { IconSearch } from '@tabler/icons-react'
import { useDebounce } from '@/hooks/useDebounce'
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
  const navigate = useNavigate()
  const {
    offset,
    limit,
    category_id,
    status,
    our_company_id,
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
    distribution_id,
    price_type,
    max_price,
    min_price,
  })

  const handleCategoryFilterChange = (categoryId: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        category_id: categoryId || undefined,
        offset: 0,
      }),
    })
  }

  const handleStatusFilterChange = (status: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        status: status as
          | 'draft'
          | 'active'
          | 'on_hold'
          | 'approved'
          | 'requested'
          | 'done'
          | 'canceled'
          | undefined,
        offset: 0,
      }),
    })
  }
  const handleOurCompanyFilterChange = (ourCompanyId: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        our_company_id: ourCompanyId || undefined,
        offset: 0,
      }),
    })
  }

  const handleCustomerCompanyFilterChange = (
    customerCompanyId: string | null
  ) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        customer_company_id: customerCompanyId || undefined,
        offset: 0,
      }),
    })
  }

  const handleDistiburionFilterChange = (distributionId: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        distribution_id: distributionId || undefined,
        offset: 0,
      }),
    })
  }

  const handlePriceTypeFilterChange = (priceType: string | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        price_type: priceType as
          | 'standard'
          | 'vip'
          | 'no_watermark'
          | undefined,
        offset: 0,
      }),
    })
  }

  const handleMaxPriceFilterChange = (maxPrice: number | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        max_price: maxPrice || undefined,
        offset: 0,
      }),
    })
  }

  const handleMinPriceFilterChange = (minPrice: number | null) => {
    navigate({
      to: '/projects',
      search: (prev) => ({
        ...prev,
        min_price: minPrice || undefined,
        offset: 0,
      }),
    })
  }

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
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of projects!
            </p>
          </div>
          <ProjectPrimaryButtons />
        </div>
        <div className='flex flex-col gap-4 md:flex-row md:items-center'>
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
          <ProjectFilter
            selectedCategoryId={category_id}
            selectedStatus={status}
            selectedOurCompanyId={our_company_id}
            selectedCustomerCompanyId={customer_company_id}
            selectedDistributionId={distribution_id}
            selectedPriceType={price_type}
            selectedMaxPrice={max_price}
            selectedMinPrice={min_price}
            onCategoryFilterChange={handleCategoryFilterChange}
            onStatusFilterChange={handleStatusFilterChange}
            onOurCompanyFilterChange={handleOurCompanyFilterChange}
            onCustomerCompanyFilterChange={handleCustomerCompanyFilterChange}
            onDistiburionFilterChange={handleDistiburionFilterChange}
            onPriceTypeFilterChange={handlePriceTypeFilterChange}
            onMaxPriceFilterChange={handleMaxPriceFilterChange}
            onMinPriceFilterChange={handleMinPriceFilterChange}
          />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 pt-4 pb-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data.items?.length ? data.data.items : []}
            columns={columns}
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
