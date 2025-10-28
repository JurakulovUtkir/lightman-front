import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import NetworkCards from './components/network-cards'
import { NetworkTypesDialogs } from './components/network-type-dialogs'
import { NetworkTypePrimaryButtons } from './components/network-type-primary-buttons'
import NetworkTypesProvider from './context'
import { useNetworkTypes } from './data/hooks'

const NetworkTypes = () => {
  const { data } = useNetworkTypes()

  return (
    <NetworkTypesProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>Network types</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of network types!
            </p>
          </div>
          <NetworkTypePrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <NetworkCards data={data?.data} />
        </div>
      </Main>
      <NetworkTypesDialogs />
    </NetworkTypesProvider>
  )
}

export default NetworkTypes
