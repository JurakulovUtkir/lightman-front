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
// import { NetworkTagCards } from './components/network-tag-cards'
import { NetworkTagDialogs } from './components/network-tag-dialogs'
import { NetworkTagPrimaryButtons } from './components/network-tag-primary-buttons'
// import NetworkTagFilter from './components/network-tag-filter'
import NetworkTagProvider from './context'
import { useNetworkTags } from './data/hooks'

const NetworkTags = () => {
  const { offset, limit } = useSearch({
    from: '/_authenticated/network/tags',
  })
  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { data } = useNetworkTags({
    offset: currentOffset,
    limit: currentLimit,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
  })

  return (
    <NetworkTagProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Network Tags</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of network tags!
            </p>
          </div>
          <NetworkTagPrimaryButtons />
        </div>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center'>
          <div className='relative'>
            <Input
              type='search'
              placeholder='Search by tags'
              className='h-8 pl-8 sm:max-w-80'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          {/* <NetworkTagFilter
            selectedTypeId={social_network_type_id}
            onTypeFilterChange={handleTypeFilterChange}
            selectedCategoryId={category_id}
            onCategoryFilterChange={handleCategoryFilterChange}
          /> */}
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-2 sm:mt-0 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {/* <NetworkTagCards data={data?.data.items} /> */}
          <DataTable
            data={data?.data.items?.length ? data.data.items : []}
            columns={columns}
            offset={offset}
            limit={limit}
            total={data?.data.total ?? 0}
          />
        </div>
      </Main>
      <NetworkTagDialogs />
    </NetworkTagProvider>
  )
}

export default NetworkTags
