import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { IconSearch } from '@tabler/icons-react'
import { useDebounce } from '@/hooks/useDebounce'
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
  const navigate = useNavigate()
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
  const handleOurCompanyFilterChange = (ourCompanyId: string | null) => {
    navigate({
      to: '/contracts',
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
      to: '/contracts',
      search: (prev) => ({
        ...prev,
        customer_company_id: customerCompanyId || undefined,
        offset: 0,
      }),
    })
  }
  const handlePaymentStatusFilterChange = (paymentStatus: string | null) => {
    navigate({
      to: '/contracts',
      search: (prev) => ({
        ...prev,
        payment_status: paymentStatus as
          | 'pending'
          | 'paid'
          | 'cancelled'
          | 'unpaid'
          | undefined,
        offset: 0,
      }),
    })
  }
  const handlePaymentTypeFilterChange = (paymentType: string | null) => {
    navigate({
      to: '/contracts',
      search: (prev) => ({
        ...prev,
        payment_type: paymentType as
          | 'card'
          | 'bank_transfer'
          | 'cash'
          | 'deposit'
          | undefined,
        offset: 0,
      }),
    })
  }
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
            <h2 className='text-2xl font-bold tracking-tight'>Contracts</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of contracts!
            </p>
          </div>
          <ContractPrimaryButtons />
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='search'
              placeholder='Search by contracts'
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          <ContractFilter
            selectedOurCompanyId={our_company_id}
            selectedCustomerCompanyId={customer_company_id}
            selectedPaymentStatus={payment_status}
            selectedPaymentType={payment_type}
            onOurCompanyFilterChange={handleOurCompanyFilterChange}
            onCustomerCompanyFilterChange={handleCustomerCompanyFilterChange}
            onPaymentStatusFilterChange={handlePaymentStatusFilterChange}
            onPaymentTypeFilterChange={handlePaymentTypeFilterChange}
          />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 pt-4 pb-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data.items?.length ? data.data.items : []}
            columns={columns}
          />
        </div>
      </Main>
      <ContractDialogs />
    </ContractProvider>
  )
}

export default Contracts
