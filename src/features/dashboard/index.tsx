import { useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import Balance from './components/balance'
import Projects from './components/projects'

export default function Dashboard() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_authenticated/' })
  const activeTab = search.active || 'projects'

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
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
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
              <TabsTrigger value='projects'>Projects</TabsTrigger>
              <TabsTrigger value='balance'>Balance</TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='projects' className='space-y-4'>
            <Projects />
          </TabsContent>
          <TabsContent value='balance' className='space-y-4'>
            <Balance />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
