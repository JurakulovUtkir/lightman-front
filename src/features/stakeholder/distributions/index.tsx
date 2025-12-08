import { useLang } from '@/hooks/useLang'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import DistributionCards from './components/distribution-cards'
import { DistributionDialogs } from './components/distribution-dialogs'
import { DistributionPrimaryButtons } from './components/distribution-primary-buttons'
import DistributionProvider from './context'
import { useDistributions } from './data/hooks'

const Distributions = () => {
  const { lang, tDistribution } = useLang()
  const t = tDistribution[lang]

  const { data } = useDistributions()

  return (
    <DistributionProvider>
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
              {t.distributions}
            </h2>
            <p className='text-muted-foreground'>{t.list_distributions}</p>
          </div>
          <DistributionPrimaryButtons text={t.create} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DistributionCards data={data?.data} />
        </div>
      </Main>
      <DistributionDialogs />
    </DistributionProvider>
  )
}

export default Distributions
