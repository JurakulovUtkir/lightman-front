import { useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetUsers } from '@/features/users/data/hooks'
import Balance from './components/balance'
import Projects from './components/projects'
import Reports from './components/reports'

export default function Dashboard() {
  const { lang, tDashboard } = useLang()
  const t = tDashboard[lang]
  const navigate = useNavigate()
  const search = useSearch({ from: '/_authenticated/' })
  const activeTab = search.active || 'projects'
  const userId = search.userId

  // Fetch users only when reports tab is active
  const { data: users } = useGetUsers(
    {
      offset: 0,
      limit: 20,
      role: 'project_manager',
    },
    {
      enabled: activeTab === 'reports',
    }
  )

  // Set first user as active when reports tab is selected and no userId is set
  useEffect(() => {
    if (
      users &&
      activeTab === 'reports' &&
      users?.data?.items?.length > 0 &&
      !userId
    ) {
      navigate({
        to: '/',
        search: (prev) => ({ ...prev, userId: users.data.items[0].id }),
        replace: true,
      })
    }
  }, [activeTab, users, userId, navigate])

  const handleTabChange = (value: string) => {
    navigate({
      to: '/',
      search: { active: value },
      replace: true,
    })
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>{t.dashboard}</h1>
          <div className='flex items-center space-x-2'>
            <Button>{t.download}</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          value={activeTab}
          onValueChange={handleTabChange}
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='projects'>{t.projects.title}</TabsTrigger>
              <TabsTrigger value='balance'>{t.balance.title}</TabsTrigger>
              <TabsTrigger value='reports'>{t.reports.title}</TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                {t.notifications.title}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='projects' className='space-y-4'>
            <Projects />
          </TabsContent>
          <TabsContent value='balance' className='space-y-4'>
            <Balance />
          </TabsContent>
          <TabsContent value='reports' className='space-y-4'>
            <Reports />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
