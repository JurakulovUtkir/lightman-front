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
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { ContractDialogs } from './components/contract-dialogs'
import { ContractPrimaryButtons } from './components/contract-primary-buttons'
import { DataTable } from './components/data-table'
import ContractFilter from './components/filters/contract-filter'
import ContractProvider from './context'
import { useContracts } from './data/hooks'

const Contracts = () => {
  const { lang, tContract, general } = useLang()
  const t = tContract[lang]

  const {
    offset,
    limit,
    customer_company_id,
    our_company_id,
    payment_status,
    payment_type,
  } = useSearch({
    from: '/_authenticated/contracts/',
  })
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useContracts({
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    our_company_id,
    customer_company_id,
    payment_status,
    payment_type,
  })

  return (
    <ContractProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t.contracts}</h2>
            <p className='text-muted-foreground'>{t.list_contracts}</p>
          </div>
          <ContractPrimaryButtons text={t.create} />
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='search'
              placeholder={t.search_by_contract}
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          <ContractFilter />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 pt-4 pb-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data.items?.length ? data.data.items : []}
            columns={columns(general[lang].columns)}
          />
        </div>
      </Main>
      <ContractDialogs />
    </ContractProvider>
  )
}

export default Contracts
