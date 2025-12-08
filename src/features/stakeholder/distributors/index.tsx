import { Route } from '@/routes/_authenticated/stakeholder/distributors/$id'
import { useLang } from '@/hooks/useLang'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useDistribution } from '../distributions/data/hooks'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { DistributorDialogs } from './components/distributor-dialogs'
import { DistributorPrimaryButtons } from './components/distributor-primary-buttons'
import DistributorProvider from './context'
import { useDistributors } from './data/hooks'

const Distributors = () => {
  const { lang, tDistributor, general } = useLang()
  const t = tDistributor[lang]

  const { id } = Route.useLoaderData()

  const { data } = useDistributors(id)
  const { data: distribution, isPending: isDistributionPending } =
    useDistribution(id)

  return (
    <DistributorProvider>
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
              {isDistributionPending
                ? ''
                : distribution?.name
                  ? distribution.name
                  : '-'}
            </h2>
            <p className='text-muted-foreground'>{t.list_distributors}</p>
          </div>
          <DistributorPrimaryButtons text={t.create} />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data?.length ? data.data : []}
            columns={columns(general[lang].columns)}
          />
        </div>
      </Main>
      <DistributorDialogs />
    </DistributorProvider>
  )
}

export default Distributors
