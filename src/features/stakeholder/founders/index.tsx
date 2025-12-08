import { useLang } from '@/hooks/useLang'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import FounderCards from './components/founder-cards'
import { FounderDialogs } from './components/founder-dialogs'
import { FounderPrimaryButtons } from './components/founder-primary-buttons'
import FounderProvider from './context'
import { useFounders } from './data/hooks'

const Founders = () => {
  const { lang, tFounder } = useLang()
  const t = tFounder[lang]

  const { data } = useFounders()

  return (
    <FounderProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t.founders}</h2>
            <p className='text-muted-foreground'>{t.list_founders}</p>
          </div>
          <FounderPrimaryButtons text={t.create} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <FounderCards data={data?.data} />
        </div>
      </Main>
      <FounderDialogs />
    </FounderProvider>
  )
}

export default Founders
