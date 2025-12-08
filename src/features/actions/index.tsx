import { useLang } from '@/hooks/useLang'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { useActions } from './data/hooks'

const Actions = () => {
  const { lang, tUser, general } = useLang()
  const t = tUser[lang]

  const { data } = useActions({})

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
            <h2 className='text-2xl font-bold tracking-tight'>
              {t.user_actions}
            </h2>
            <p className='text-muted-foreground'>{t.list_actions}</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          {/* <div className='relative'>
            <Input
              type='search'
              placeholder='Search by contracts'
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div> */}
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 pt-4 pb-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.items?.length ? data.items : []}
            columns={columns(general[lang].columns)}
          />
        </div>
      </Main>
    </>
  )
}

export default Actions
