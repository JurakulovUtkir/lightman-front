import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { IconSearch } from '@tabler/icons-react'
import { Route } from '@/routes/_authenticated/companies/expence/$id'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { BackButton } from '@/components/back-button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { DataTable } from '@/components/table/data-table'
import { ThemeSwitch } from '@/components/theme-switch'
import ExpenceFilter from '@/features/expences/components/filters/expence-filter'
import { useExpences } from '@/features/expences/data/hooks'
import { useCompany } from '../data/hooks'
import { columns } from './components/columns'

const CompanyExpence = () => {
  const { id } = Route.useLoaderData()
  const { lang, tCompany, general, interpolate } = useLang()
  const t = tCompany[lang]

  const {
    offset,
    limit,
    type,
    expence_type,
    payment_type,
    distribution_id,
    project_id,
    user_id,
    date_from,
    date_to,
    card_id,
    loan_id,
    max_amount,
    min_amount,
  } = useSearch({
    from: '/_authenticated/companies/expence/$id',
  })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useExpences({
    project_id,
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    type,
    expence_type,
    payment_type,
    distribution_id,
    company_id: id,
    user_id,
    date_from,
    date_to,
    card_id,
    loan_id,
    max_amount,
    min_amount,
  })
  const { data: company } = useCompany(id)

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
            <BackButton
              fallbackPath='/companies'
              className='mb-2 gap-3 px-4'
              iconClassName='h-5 w-5'
            />
            <h2 className='text-2xl font-bold tracking-tight'>
              {company?.name ?? ''}
            </h2>
            <p className='text-muted-foreground'>
              {interpolate(t.list_company_expense, {
                company_name: company?.name ?? '',
              })}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='search'
              placeholder={t.search_by_expense}
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          <ExpenceFilter isCompany />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data.items?.length ? data.data.items : []}
            columns={columns(general[lang].columns)}
            offset={offset}
            limit={limit}
            total={data?.data.total ?? 0}
          />
        </div>
      </Main>
    </>
  )
}

export default CompanyExpence
