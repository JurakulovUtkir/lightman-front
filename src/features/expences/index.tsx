import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
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
import { ExpenceDialogs } from './components/expence-dialogs'
import { ExpencePrimaryButtons } from './components/expence-primary-buttons'
import ExpenceFilter from './components/filters/expence-filter'
import ExpenceProvider from './context'
import { useExpences } from './data/hooks'

const ExpencesContent = () => {
  const { lang, tExpence, general } = useLang()
  const t = tExpence[lang]

  const {
    offset,
    limit,
    type,
    expence_type,
    payment_type,
    distribution_id,
    company_id,
    project_id,
    user_id,
    date_from,
    date_to,
    max_amount,
    min_amount,
    loan_id,
    card_id,
  } = useSearch({
    from: '/_authenticated/expences/',
  })
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useExpences({
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    type,
    expence_type,
    payment_type,
    distribution_id,
    company_id,
    project_id,
    user_id,
    date_from,
    date_to,
    max_amount,
    min_amount,
    loan_id,
    card_id,
  })

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
            <h2 className='text-2xl font-bold tracking-tight'>{t.expences}</h2>
            <p className='text-muted-foreground'>{t.list_expences}</p>
          </div>
          <ExpencePrimaryButtons text={t.create} />
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='search'
              placeholder={t.search_by_expence}
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          <ExpenceFilter />
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
      <ExpenceDialogs />
    </>
  )
}

const Expences = () => {
  return (
    <ExpenceProvider>
      <ExpencesContent />
    </ExpenceProvider>
  )
}

export default Expences
