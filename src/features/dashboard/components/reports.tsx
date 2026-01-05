import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  IconUser,
  IconPhone,
  IconBuilding,
  IconCurrencyDollar,
  IconCircleCheck,
  IconAlertCircle,
  IconChevronDown,
} from '@tabler/icons-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProjects } from '@/features/projects/data/hooks'
import { useGetUsers } from '@/features/users/data/hooks'
import { User } from '@/features/users/data/schema'
import { RecentProjects } from './recent-projects'

const Reports = () => {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_authenticated/' })
  const activeUserId = search.userId

  const [limit] = useState(10)
  const [offset, setOffset] = useState(0)
  const [allLoadedUsers, setAllLoadedUsers] = useState<User[]>([])

  const { data: users, isLoading } = useGetUsers({
    offset,
    limit,
    role: 'project_manager',
  })

  const { data: projects } = useProjects({
    offset: 0,
    limit: 10,
    project_manager_id: activeUserId,
  })

  // When new data arrives, append to existing users
  useEffect(() => {
    if (users?.data?.items) {
      setAllLoadedUsers((prev) => {
        const newUsers = users.data.items.filter(
          (newUser) =>
            !prev.some((existingUser) => existingUser.id === newUser.id)
        )
        return [...prev, ...newUsers]
      })
    }
  }, [users])

  const totalUsers = users?.data?.total || 0
  const hasMore = allLoadedUsers.length < totalUsers

  const handleUserClick = (userId: string) => {
    navigate({
      to: '/',
      search: (prev) => ({ ...prev, userId }),
      replace: true,
    })
  }

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className='flex h-[calc(100vh-12rem)]'>
      {/* Users Section */}
      <div className='border-border bg-muted/30 w-96 overflow-y-auto border-r'>
        <div className='border-border bg-background sticky top-0 z-10 border-b p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold'>Project Managers</h2>
              <p className='text-muted-foreground text-sm'>
                {totalUsers} total users
              </p>
            </div>
            <Avatar className='h-10 w-10'>
              <AvatarFallback className='bg-primary/10'>
                <IconUser className='text-primary h-5 w-5' />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className='space-y-3 p-4'>
          {allLoadedUsers.map((user) => (
            <Card
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className={`cursor-pointer transition-all ${
                activeUserId === user.id
                  ? 'border-primary bg-primary/5 ring-primary/30 scale-[1.02] shadow-lg ring-2'
                  : 'hover:border-primary/50 hover:shadow-md'
              }`}
            >
              <CardContent className='p-4'>
                <div className='flex items-start gap-3'>
                  <div className='relative'>
                    <Avatar className='h-12 w-12'>
                      <AvatarFallback
                        className={
                          activeUserId === user.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }
                      >
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    {activeUserId === user.id && (
                      <div className='bg-primary ring-background absolute -top-1 -right-1 h-4 w-4 rounded-full ring-2'>
                        <IconCircleCheck className='text-primary-foreground h-4 w-4' />
                      </div>
                    )}
                  </div>

                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <h3
                        className={`truncate font-semibold ${
                          activeUserId === user.id ? 'text-primary' : ''
                        }`}
                      >
                        {user.full_name}
                      </h3>
                    </div>

                    <div className='text-muted-foreground mt-1 flex items-center gap-1.5 text-sm'>
                      <IconPhone className='h-3.5 w-3.5' />
                      <span className='truncate'>{user.phone_number}</span>
                    </div>

                    <div className='mt-2 space-y-2'>
                      <div className='flex items-start gap-1.5 text-sm'>
                        <IconBuilding className='text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0' />
                        <span className='text-foreground flex-1 truncate font-medium'>
                          {user.employee_company?.name}
                        </span>
                      </div>

                      <div className='flex items-center gap-1.5 text-sm'>
                        <IconCurrencyDollar className='text-muted-foreground h-4 w-4' />
                        <span className='text-foreground font-medium'>
                          {user.salary?.toLocaleString()} UZS
                        </span>
                      </div>
                    </div>

                    <div className='mt-3 flex flex-wrap items-center gap-2'>
                      <Badge
                        variant={user.is_verified ? 'default' : 'secondary'}
                        className={
                          user.is_verified
                            ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400'
                            : 'bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 dark:text-yellow-400'
                        }
                      >
                        {user.is_verified ? (
                          <IconCircleCheck className='mr-1 h-3 w-3' />
                        ) : (
                          <IconAlertCircle className='mr-1 h-3 w-3' />
                        )}
                        {user.is_verified ? 'Verified' : 'Unverified'}
                      </Badge>

                      {user.is_our_employee && (
                        <Badge
                          variant='secondary'
                          className='bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 dark:text-purple-400'
                        >
                          Our Employee
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Loading Skeletons */}
          {isLoading && (
            <>
              {[...Array(3)].map((_, i) => (
                <Card key={`skeleton-${i}`}>
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-3'>
                      <Skeleton className='h-12 w-12 rounded-full' />
                      <div className='flex-1 space-y-2'>
                        <Skeleton className='h-5 w-32' />
                        <Skeleton className='h-4 w-40' />
                        <Skeleton className='h-4 w-full' />
                        <div className='flex gap-2'>
                          <Skeleton className='h-5 w-20' />
                          <Skeleton className='h-5 w-24' />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {/* Load More Button */}
          {hasMore && !isLoading && (
            <Button
              onClick={handleLoadMore}
              variant='outline'
              className='w-full'
              size='lg'
            >
              <IconChevronDown className='mr-2 h-4 w-4' />
              Load More ({allLoadedUsers.length} / {totalUsers})
            </Button>
          )}

          {/* All Loaded Message */}
          {!hasMore && allLoadedUsers.length > 0 && (
            <div className='text-muted-foreground py-4 text-center text-sm'>
              All users loaded
            </div>
          )}
        </div>
      </div>

      {/* Vertical Separator */}
      <div className='bg-border w-px' />

      {/* Projects Section */}
      <div className='flex-1 overflow-y-auto p-4'>
        <RecentProjects data={projects} enableProfit />
      </div>
    </div>
  )
}

export default Reports
