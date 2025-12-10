import { useSearch } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { CustomPagination } from '@/components/custom-pagination'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CardBoxes } from './components/card-boxes'
import { CardDialogs } from './components/card-dialogs'
import { CardPrimaryButtons } from './components/card-primary-buttons'
import CardsProvider from './context'
import { useCards } from './data/hooks'

const Cards = () => {
  const { lang, tCard } = useLang()
  const t = tCard[lang]

  const { offset, limit } = useSearch({
    from: '/_authenticated/companies/cards/',
  })
  // const [search, setSearch] = useState('')
  // const debouncedSearch = useDebounce(search, 500)

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useCards({
    offset: currentOffset,
    limit: currentLimit,
    // search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
  })

  return (
    <CardsProvider>
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
            <h2 className='text-2xl font-bold tracking-tight'>{t.cards}</h2>
            <p className='text-muted-foreground'>{t.list_cards}</p>
          </div>
          <CardPrimaryButtons text={t.create} />
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
          <CardBoxes data={data?.data} />
        </div>
        {data?.data.total ? (
          <CustomPagination
            offset={currentOffset}
            limit={currentLimit}
            total={data.data.total}
          />
        ) : null}
      </Main>
      <CardDialogs />
    </CardsProvider>
  )
}

export default Cards
