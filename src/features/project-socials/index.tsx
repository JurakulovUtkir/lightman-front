import { Route } from '@/routes/_authenticated/projects/socials/$id'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import PriceCards from './components/price-cards'
import { ProjectSocialDialogs } from './components/project-social-dialogs'
import { ProjectSocialPrimaryButtons } from './components/project-social-primary-buttons'
import ProjectSocialProvider from './context'
import { useProjectSocials } from './data/hooks'

const ProjectSocials = () => {
  const { id } = Route.useLoaderData()
  const { data } = useProjectSocials(id)

  return (
    <ProjectSocialProvider>
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
              Project Socials
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of Project socials!
            </p>
          </div>
          <ProjectSocialPrimaryButtons />
        </div>
        {data && data?.data?.length > 0 && <PriceCards data={data} />}

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            data={data?.data?.length ? data.data : []}
            columns={columns}
          />
        </div>
      </Main>
      <ProjectSocialDialogs />
    </ProjectSocialProvider>
  )
}

export default ProjectSocials
