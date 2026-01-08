import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

type PaymentType = 'all' | 'card' | 'cash'

const Cards = ({ type = 'all' }: { type?: PaymentType }) => {
  const { lang, tCard } = useLang()
  const t = tCard[lang]

  const { offset, limit } = useSearch({
    strict: false,
  })

  const [activeTab, setActiveTab] = useState<PaymentType>(type ?? 'all')

  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20

  const { data } = useCards({
    offset: currentOffset,
    limit: currentLimit,
  })

  const filteredData = data?.data?.data
    ? {
        ...data.data,
        data:
          activeTab === 'all'
            ? data.data.data
            : data.data.data.filter((card) => card.card_type === activeTab),
        total:
          activeTab === 'all'
            ? data.data.total
            : data.data.data.filter((card) => card.card_type === activeTab)
                .length,
      }
    : undefined

  const handleTabChange = (value: string) => {
    if (value === 'all' || value === 'card' || value === 'cash') {
      setActiveTab(value)
    }
  }

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

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className='w-full'
        >
          {type === 'all' && (
            <TabsList className='mb-4'>
              <TabsTrigger value='all'>
                {t.all} ({data?.data?.data?.length || 0})
              </TabsTrigger>
              <TabsTrigger value='card'>
                {t.cards} (
                {data?.data?.data?.filter((c) => c.card_type === 'card')
                  .length || 0}
                )
              </TabsTrigger>
              <TabsTrigger value='cash'>
                {t.cash} (
                {data?.data?.data?.filter((c) => c.card_type === 'cash')
                  .length || 0}
                )
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value='all' className='mt-0'>
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
              <CardBoxes data={filteredData} />
            </div>
          </TabsContent>

          <TabsContent value='card' className='mt-0'>
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
              <CardBoxes data={filteredData} />
            </div>
          </TabsContent>

          <TabsContent value='cash' className='mt-0'>
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
              <CardBoxes data={filteredData} />
            </div>
          </TabsContent>
        </Tabs>

        {filteredData?.total ? (
          <CustomPagination
            offset={currentOffset}
            limit={currentLimit}
            total={filteredData.total}
          />
        ) : null}
      </Main>
      <CardDialogs />
    </CardsProvider>
  )
}

export default Cards
