import React, { useState } from 'react'
import {
  IconCreditCard,
  IconCalendar,
  IconCircleCheck,
  IconCircleX,
  IconEdit,
  IconCpu2,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CardsSchema } from '../data/schema'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('uz-UZ').format(amount)
}

const formatDate = (dateString: Date) => {
  const date = new Date(dateString)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${month}/${year}`
}

const cardGradients = [
  'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800',
  'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600',
  'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700',
  'bg-gradient-to-br from-orange-600 via-red-600 to-pink-700',
  'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900',
  'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
]

const CardBox = ({ card, index }: { card: CardsSchema; index: number }) => {
  const [showBalance, setShowBalance] = useState(true)
  const gradientClass = cardGradients[index % cardGradients.length]

  const isExpiringSoon = () => {
    const expirationDate = new Date(card.expiration_date)
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
    return expirationDate <= threeMonthsFromNow
  }

  const toggleBalance = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowBalance(!showBalance)
  }

  return (
    <div className='group relative max-w-[380px] min-w-[340px]'>
      {/* Bank Card */}
      <div
        className={`relative h-[220px] overflow-hidden rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ${gradientClass}`}
      >
        {/* Card Background Pattern */}
        <div className='pointer-events-none absolute inset-0 opacity-10'>
          <div className='absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white'></div>
          <div className='absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white'></div>
        </div>

        {/* Card Content */}
        <div className='relative flex h-full flex-col justify-between text-white'>
          {/* Header */}
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-2'>
              <IconCpu2
                className='h-10 w-10 text-yellow-300'
                strokeWidth={1.5}
              />
            </div>
            <div className='flex gap-1'>
              <Button
                size='icon'
                variant='ghost'
                className='h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/20'
              >
                <IconEdit className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Balance Display */}
          <div className='space-y-1'>
            <div className='flex items-center justify-between'>
              <p className='text-xs tracking-wide text-white/70 uppercase'>
                Available Balance
              </p>
              <Button
                size='icon'
                variant='ghost'
                className='h-6 w-6 text-white hover:bg-white/20'
                onClick={toggleBalance}
              >
                {showBalance ? (
                  <IconEye className='h-4 w-4' />
                ) : (
                  <IconEyeOff className='h-4 w-4' />
                )}
              </Button>
            </div>
            <div className='text-2xl font-bold tracking-wide'>
              {showBalance ? (
                <>
                  {formatCurrency(card.balance)}{' '}
                  <span className='text-base font-normal text-white/80'>
                    UZS
                  </span>
                </>
              ) : (
                <span className='tracking-wider'>••••••</span>
              )}
            </div>
          </div>

          {/* Bottom Info */}
          <div className='flex items-end justify-between'>
            <div className='space-y-1'>
              <p className='text-xs tracking-wide text-white/70 uppercase'>
                Card Holder
              </p>
              <p className='truncate text-base font-semibold tracking-wide uppercase'>
                {card.name}
              </p>
            </div>
            <div className='space-y-1 text-right'>
              <p className='text-xs tracking-wide text-white/70 uppercase'>
                Expires
              </p>
              <p className='font-mono text-base font-semibold'>
                {formatDate(card.expiration_date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Details Below */}
      <Card className='hover:border-primary/50 mt-4 border-2 transition-all'>
        <CardContent className='p-4'>
          <div className='space-y-3'>
            {/* Status Badge */}
            <div className='flex items-center justify-between'>
              <Badge
                variant={card.is_active ? 'success' : 'destructive'}
                className='gap-1'
              >
                {card.is_active ? (
                  <>
                    <IconCircleCheck className='h-3 w-3' />
                    Active
                  </>
                ) : (
                  <>
                    <IconCircleX className='h-3 w-3' />
                    Inactive
                  </>
                )}
              </Badge>
              {isExpiringSoon() && (
                <Badge
                  variant='outline'
                  className='border-orange-600 text-orange-600'
                >
                  Expiring Soon
                </Badge>
              )}
            </div>

            {/* Description */}
            {card.description && (
              <p className='text-muted-foreground text-xs'>
                {card.description}
              </p>
            )}

            {/* Last Updated */}
            <div className='text-muted-foreground flex items-center gap-1.5 border-t pt-3 text-xs'>
              <IconCalendar className='h-3.5 w-3.5' />
              <span>
                Updated:{' '}
                {new Date(card.updated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const CardBoxes = ({
  data,
}: {
  data: { data: CardsSchema[]; total: number } | undefined
}) => {
  if (!data?.data || data?.data?.length === 0) {
    return (
      <Card className='border-dashed'>
        <CardContent className='flex flex-col items-center justify-center py-12'>
          <IconCreditCard className='text-muted-foreground mb-4 h-12 w-12' />
          <h3 className='mb-2 text-xl font-semibold'>No cards found</h3>
          <p className='text-muted-foreground text-sm'>
            Create your first card to get started
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {data?.data.map((card, index) => (
        <CardBox key={card.id} card={card} index={index} />
      ))}
    </div>
  )
}
