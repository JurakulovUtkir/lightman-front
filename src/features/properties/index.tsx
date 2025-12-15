import { useLang } from '@/hooks/useLang'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { PropertyDialogs } from './components/property-dialogs'
import { PropertyPrimaryButtons } from './components/property-primary-buttons'
import PropertyProvider from './context'
import { useProperties } from './data/hooks'

const Properties = () => {
  const { lang, tProperty, general } = useLang()
  const t = tProperty[lang]

  const { data } = useProperties()
  return (
    <PropertyProvider>
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
              {t.properties}
            </h2>
            <p className='text-muted-foreground'>{t.list_properties}</p>
          </div>
          <PropertyPrimaryButtons text={t.create} />
        </div>
        {/* <div className='flex items-center gap-4'>
          <div className='relative'>
            <Input
              type='search'
              placeholder={t.search_by_company}
              className='h-8 max-w-80 pl-8'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
        </div> */}
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data?.length ? data.data : []}
            columns={columns(general[lang].columns)}
          />
        </div>
      </Main>
      <PropertyDialogs />
    </PropertyProvider>
  )
}

export default Properties
