import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
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
import { DepositDialogs } from './components/deposit-dialogs'
import { DepositPrimaryButtons } from './components/deposit-primary-buttons'
// import { CompanyFilter } from './components/company-filter'
import DepositProvider, { useDepositContext } from './context'
import { useDeposits } from './data/hooks'
import { DepositSchema } from './data/schema'

const DepositContent = () => {
  const { setOpen, setCurrentRow } = useDepositContext()
  const { offset, limit } = useSearch({
    from: '/_authenticated/deposits/',
  })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useDeposits({
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
  })

  const handleDoubleClick = (payload: DepositSchema) => {
    setCurrentRow(payload)
    setOpen('update')
  }

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
            <h2 className='text-2xl font-bold tracking-tight'>Deposits</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of deposits!
            </p>
          </div>
          <DepositPrimaryButtons />
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='search'
              placeholder='Search by deposit'
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          {/* <CompanyFilter onFilterChange={setFilters} /> */}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data.data?.length ? data.data.data : []}
            columns={columns}
            offset={offset}
            limit={limit}
            total={data?.data.total ?? 0}
            onRowDoubleClick={handleDoubleClick}
          />
        </div>
      </Main>
      <DepositDialogs />
    </>
  )
}

const Deposits = () => {
  return (
    <DepositProvider>
      <DepositContent />
    </DepositProvider>
  )
}

export default Deposits
