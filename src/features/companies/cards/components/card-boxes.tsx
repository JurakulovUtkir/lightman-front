import React, { useState } from 'react'
import {
  IconCreditCard,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconInfoCircle,
  IconAlertTriangle,
} from '@tabler/icons-react'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
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

const CardBox = ({
  card,
  index,
  t,
}: {
  card: CardsSchema
  index: number
  t: (typeof import('@/translations/general.json'))['en']['columns']
}) => {
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

  const expiringSoon = isExpiringSoon()

  return (
    <div className='group relative max-w-[380px] min-w-[340px]'>
      {/* Bank Card */}
      <div
        className={`relative h-[220px] overflow-hidden rounded-2xl p-6 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl ${gradientClass} ${
          expiringSoon ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
        }`}
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
              {/* Active/Inactive Status Indicator */}
              <div className='flex items-center gap-2'>
                <div className='relative flex items-center'>
                  <div
                    className={`h-3 w-3 rounded-full ${
                      card.is_active ? 'bg-green-400' : 'bg-red-400'
                    } animate-pulse`}
                  ></div>
                  <div
                    className={`absolute h-3 w-3 rounded-full ${
                      card.is_active ? 'bg-green-400' : 'bg-red-400'
                    } opacity-50 blur-sm`}
                  ></div>
                </div>
                <span className='text-xs font-medium tracking-wide uppercase'>
                  {card.is_active ? t.active : t.inactive}
                </span>
              </div>
            </div>
            <div className='flex gap-1'>
              {expiringSoon && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-8 w-8 text-yellow-300 hover:bg-white/20'
                      >
                        <IconAlertTriangle className='h-4 w-4 animate-pulse' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className='max-w-xs border-yellow-200 bg-yellow-50 text-yellow-900'>
                      <p className='text-sm font-medium'>{t.card_expired}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {card.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-8 w-8 text-white hover:bg-white/20'
                      >
                        <IconInfoCircle className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className='max-w-xs'>
                      <p className='text-sm'>{card.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
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
                {t.available_balance}
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
                    {t.uzs}
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
                {t.card_holder}
              </p>
              <p className='truncate text-base font-semibold tracking-wide uppercase'>
                {card.name}
              </p>
            </div>
            <div className='space-y-1 text-right'>
              <p className='text-xs tracking-wide text-white/70 uppercase'>
                {t.expires}
              </p>
              <p
                className={`font-mono text-base font-semibold ${expiringSoon ? 'text-yellow-300' : ''}`}
              >
                {formatDate(card.expiration_date)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const CardBoxes = ({
  data,
}: {
  data: { data: CardsSchema[]; total: number } | undefined
}) => {
  const { lang, general } = useLang()
  const t = general[lang].columns

  if (!data?.data || data?.data?.length === 0) {
    return (
      <Card className='border-dashed'>
        <CardContent className='flex flex-col items-center justify-center py-12'>
          <IconCreditCard className='text-muted-foreground mb-4 h-12 w-12' />
          <h3 className='mb-2 text-xl font-semibold'>{t.no_cards_found}</h3>
          <p className='text-muted-foreground text-sm'>{t.create_first_card}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {data?.data.map((card, index) => (
        <CardBox key={card.id} card={card} index={index} t={t} />
      ))}
    </div>
  )
}
