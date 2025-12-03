import { useSearch } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { CustomPagination } from '@/components/custom-pagination'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import NetworkCards from './components/network-cards'
import { NetworkCategoryDialogs } from './components/network-category-dialogs'
import { NetworkCategoryPrimaryButtons } from './components/network-category-primary-buttons'
import NetworkCategoryProvider from './context'
import { useNetworkCategories } from './data/hooks'

const NetworkCategories = () => {
  const { lang, tNetwork } = useLang()
  const t = tNetwork[lang]

  const { offset, limit } = useSearch({
    from: '/_authenticated/network/categories',
  })
  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useNetworkCategories({
    offset: currentOffset,
    limit: currentLimit,
  })

  return (
    <NetworkCategoryProvider>
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
              {t.network_categories}
            </h2>
            <p className='text-muted-foreground'>{t.list_network_categories}</p>
          </div>
          <NetworkCategoryPrimaryButtons text={t.create} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <NetworkCards data={data?.data} />
        </div>
        {data?.data.total ? (
          <CustomPagination
            offset={currentOffset}
            limit={currentLimit}
            total={data.data.total}
          />
        ) : null}
      </Main>
      <NetworkCategoryDialogs />
    </NetworkCategoryProvider>
  )
}

export default NetworkCategories
