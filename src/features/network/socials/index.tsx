import { useState } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { IconSearch } from '@tabler/icons-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useLang } from '@/hooks/useLang'
import { Input } from '@/components/ui/input'
import { BackButton } from '@/components/back-button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { DataTable } from '@/components/table/data-table'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { columnsMoney } from './components/columns-money'
import { NetworkSocialDialogs } from './components/network-social-dialogs'
import NetworkSocialFilter from './components/network-social-filter'
import { NetworkSocialPrimaryButtons } from './components/network-social-primary-buttons'
import NetworkSocialProvider, { useNetworkSocialContext } from './context'
import { useNetworkSocials } from './data/hooks'
import { NetworkSocialSchema } from './data/schema'

const NetworkSocialsContent = ({ isMain }: { isMain: boolean }) => {
  const { lang, tNetwork, general } = useLang()
  const t = tNetwork[lang]

  const { setOpen, setCurrentRow } = useNetworkSocialContext()
  const navigate = useNavigate()
  const { offset, limit, category_id, social_network_type_id } = useSearch({
    strict: false,
  })
  const currentOffset = offset ?? 0
  const currentLimit = limit ?? 20
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { data } = useNetworkSocials({
    offset: currentOffset,
    limit: currentLimit,
    category_id,
    social_network_type_id,
    search: debouncedSearch.length >= 2 ? debouncedSearch : undefined,
  })

  const handleCategoryFilterChange = (categoryId: string | null) => {
    navigate({
      to: '/network/socials',
      search: (prev) => ({
        ...prev,
        category_id: categoryId || undefined,
        offset: 0,
      }),
    })
  }

  const handleTypeFilterChange = (typeId: string | null) => {
    navigate({
      to: '/network/socials',
      search: (prev) => ({
        ...prev,
        social_network_type_id: typeId || undefined,
        offset: 0,
      }),
    })
  }

  const handleDoubleClick = (payload: NetworkSocialSchema) => {
    setCurrentRow(payload)
    setOpen('update')
  }

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
            <BackButton
              fallbackPath='/network/types'
              className='mb-2 gap-3 px-4'
              iconClassName='h-5 w-5'
            />
            <h2 className='text-2xl font-bold tracking-tight'>
              {t.network_socials}
            </h2>
            <p className='text-muted-foreground'>{t.list_network_socials}</p>
          </div>
          <NetworkSocialPrimaryButtons text={t.create} />
        </div>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-center'>
          <div className='relative'>
            <Input
              type='search'
              placeholder={t.search_network_social}
              className='h-8 pl-8 sm:max-w-80'
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className='absolute top-1/2 left-2 -translate-y-1/2'>
              <IconSearch className='text-muted-foreground' size={16} />
            </span>
          </div>
          <NetworkSocialFilter
            selectedTypeId={social_network_type_id}
            onTypeFilterChange={handleTypeFilterChange}
            selectedCategoryId={category_id}
            onCategoryFilterChange={handleCategoryFilterChange}
          />
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-2 sm:mt-0 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data.items?.length ? data.data.items : []}
            columns={
              isMain
                ? columns(general[lang].columns)
                : columnsMoney(general[lang].columns)
            }
            offset={offset}
            limit={limit}
            total={data?.data.total ?? 0}
            onRowDoubleClick={handleDoubleClick}
          />
        </div>
      </Main>
      <NetworkSocialDialogs />
    </>
  )
}
const NetworkSocials = ({ isMain = true }: { isMain?: boolean }) => {
  return (
    <NetworkSocialProvider>
      <NetworkSocialsContent isMain={isMain} />
    </NetworkSocialProvider>
  )
}

export default NetworkSocials
