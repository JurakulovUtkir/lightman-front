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
import { columnsMoney } from './components/columns-money'
import { CompanyDialogs } from './components/company-dialogs'
import { CompanyFilter } from './components/company-filter'
import { CompanyPrimaryButtons } from './components/company-primary-buttons'
import CompanyProvider from './context'
import { useCompanies } from './data/hooks'
import { CompanySchema } from './data/schema'

const Companies = ({ isMain = true }: { isMain?: boolean }) => {
  const { lang, tCompany, general } = useLang()
  const t = tCompany[lang]
  const navigate = useNavigate()

  const { offset, limit } = useSearch({
    strict: false,
  })
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<{
    is_active?: boolean
    is_vip?: boolean
  }>({})

  const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useCompanies({
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    is_active: filters.is_active,
    is_our_company: true,
    is_vip: filters.is_vip,
  })

  const handleDoubleClick = (payload: CompanySchema) => {
    navigate({
      to: '/companies/expence/$id',
      params: { id: payload.id },
    })
  }
  return (
    <CompanyProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t.companies}</h2>
            <p className='text-muted-foreground'>{t.list_companies}</p>
          </div>
          <CompanyPrimaryButtons text={t.create} />
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='search'
              placeholder={t.search_by_company}
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          <CompanyFilter onFilterChange={setFilters} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data.items?.length ? data.data.items : []}
            columns={
              isMain
                ? columns(general[lang].columns)
                : columnsMoney(general[lang].columns)
            }
            offset={offset}
            limit={limit}
            total={data?.data.total ?? 0}
            onRowDoubleClick={handleDoubleClick}
          />
        </div>
      </Main>
      <CompanyDialogs />
    </CompanyProvider>
  )
}

export default Companies
