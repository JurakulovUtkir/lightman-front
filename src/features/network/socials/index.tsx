import { useSearch } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { DataTable } from '@/components/table/data-table'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { NetworkSocialDialogs } from './components/network-social-dialogs'
import { NetworkSocialPrimaryButtons } from './components/network-social-primary-buttons'
import NetworkSocialProvider from './context'
import { useNetworkSocials } from './data/hooks'

const NetworkSocials = () => {
  const { offset, limit } = useSearch({
    from: '/_authenticated/network/socials',
  })
  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useNetworkSocials({
    offset: currentOffset,
    limit: currentLimit,
  })

  return (
    <NetworkSocialProvider>
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
              Network Categories
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of network categories!
            </p>
          </div>
          <NetworkSocialPrimaryButtons />
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
      <NetworkSocialDialogs />
    </NetworkSocialProvider>
  )
}

export default NetworkSocials
