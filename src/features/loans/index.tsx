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
import { columnsMoney } from './components/columns-money'
import { LoanDialogs } from './components/loan-dialogs'
import { LoanPrimaryButtons } from './components/loan-primary-buttons'
import LoanProvider, { useLoanContext } from './context'
import { useLoans } from './data/hooks'
import { LoanSchema } from './data/schema'

const LoanContent = ({ direction }: { direction?: 'WE_GAVE' | 'WE_TOOK' }) => {
  const { lang, tLoan, general } = useLang()
  const t = tLoan[lang]
  const { setOpen, setCurrentRow } = useLoanContext()

  const { offset, limit } = useSearch({
    strict: false,
  })
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useLoans({
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
    direction: direction ?? undefined,
  })

  const handleDoubleClick = (payload: LoanSchema) => {
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
            <h2 className='text-2xl font-bold tracking-tight'>{t.loans}</h2>
            <p className='text-muted-foreground'>{t.list_loans}</p>
          </div>
          <LoanPrimaryButtons text={t.create} />
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='search'
              placeholder={t.search_by_loan}
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data.data?.length ? data.data.data : []}
            columns={
              !direction
                ? columns(general[lang].columns)
                : columnsMoney(general[lang].columns)
            }
            offset={offset}
            limit={limit}
            total={data?.data?.total ?? 0}
            onRowDoubleClick={handleDoubleClick}
          />
        </div>
      </Main>
      <LoanDialogs />
    </>
  )
}

const Loans = ({ direction }: { direction?: 'WE_GAVE' | 'WE_TOOK' }) => {
  return (
    <LoanProvider>
      <LoanContent direction={direction} />
    </LoanProvider>
  )
}

export default Loans
