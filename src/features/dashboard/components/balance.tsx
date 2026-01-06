import {
  IconWallet,
  IconBuilding,
  IconCoins,
  IconUsers,
  IconCreditCard,
  IconHome,
  IconArrowUpRight,
  IconArrowDownRight,
  IconTrendingUp,
  IconAlertCircle,
} from '@tabler/icons-react'
import { formatPrice } from '@/utils/formatPrice'
import { useLang } from '@/hooks/useLang'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useGetBalance } from '../data/hooks'

const Balance = () => {
  const { data: getBalance } = useGetBalance()
  const { lang, tDashboard } = useLang()
  const t = tDashboard[lang].balance

  if (!getBalance?.data) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-muted-foreground'>{t.loading}</p>
      </div>
    )
  }

  const { assets, liabilities } = getBalance.data
  const netWorth = assets.total_balance - liabilities.total_we_owe_to_customers

  const assetItems = [
    {
      title: t.cash_and_card,
      amount: assets.cash_card_balance,
      icon: IconCreditCard,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: t.company_balance,
      amount: assets.company_balance,
      icon: IconBuilding,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: t.social_deposits,
      amount: assets.socials_deposit_balance,
      icon: IconUsers,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: t.loans_remaining,
      amount: assets.loans_remaining_balance,
      icon: IconCoins,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: t.properties,
      amount: assets.properties_balance,
      icon: IconHome,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
  ]

  return (
    <div className='space-y-6'>
      {/* Overview Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <Card className='border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t.total_assets}
            </CardTitle>
            <IconTrendingUp className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatPrice(assets.total_balance)} {t.uzs}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>{t.all_asset}</p>
          </CardContent>
        </Card>

        <Card className='border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {t.total_liabilities}
            </CardTitle>
            <IconAlertCircle className='h-4 w-4 text-red-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatPrice(liabilities.total_we_owe_to_customers)} {t.uzs}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {t.amount_owed}
            </p>
          </CardContent>
        </Card>

        <Card className='border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t.net_worth}</CardTitle>
            <IconWallet className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatPrice(netWorth)} {t.uzs}
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>
              {t.assets_minus}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Assets Breakdown */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <IconArrowUpRight className='h-5 w-5 text-green-500' />
            <CardTitle>{t.assets_breakdown}</CardTitle>
          </div>
          <CardDescription>{t.detailed_view}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {assetItems.map((item, index) => (
              <div
                key={index}
                className='hover:bg-accent/50 flex items-start space-x-4 rounded-lg border p-4 transition-colors'
              >
                <div className={`${item.bgColor} rounded-lg p-2`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className='flex-1 space-y-1'>
                  <p className='text-sm leading-none font-medium'>
                    {item.title}
                  </p>
                  <p className='text-lg font-bold'>
                    {formatPrice(item.amount)} {t.uzs}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liabilities Section */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <IconArrowDownRight className='h-5 w-5 text-red-500' />
            <CardTitle>{t.liabilities}</CardTitle>
          </div>
          <CardDescription>{t.current_obligations}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center justify-between rounded-lg border p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-red-500/10 p-2'>
                  <IconCoins className='h-5 w-5 text-red-500' />
                </div>
                <div>
                  <p className='text-sm font-medium'>
                    {t.customer_obligations}
                  </p>
                  <p className='text-muted-foreground text-xs'>
                    {t.total_amount_owed}
                  </p>
                </div>
              </div>
              <p className='text-lg font-bold'>
                {formatPrice(liabilities.total_we_owe_to_customers)} {t.uzs}
              </p>
            </div>

            <div className='flex items-center justify-between rounded-lg border p-4'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-gray-500/10 p-2'>
                  <IconCreditCard className='h-5 w-5 text-gray-500' />
                </div>
                <div>
                  <p className='text-sm font-medium'>{t.loans_taken}</p>
                  <p className='text-muted-foreground text-xs'>
                    {t.external_debt}
                  </p>
                </div>
              </div>
              <p className='text-lg font-bold'>
                {formatPrice(liabilities.we_took_loans_balance)} {t.uzs}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Other financial metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex items-center justify-between border-b py-2'>
              <span className='text-muted-foreground text-sm'>
                Counterpart Amount (Should Give)
              </span>
              <span className='font-medium'>
                {formatPrice(assets.total_counterpart_amount_should_give)} uzs
              </span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span className='text-muted-foreground text-sm'>
                Asset-to-Liability Ratio
              </span>
              <span className='font-medium'>
                {liabilities.total_we_owe_to_customers > 0
                  ? (
                      assets.total_balance /
                      liabilities.total_we_owe_to_customers
                    ).toFixed(2)
                  : '∞'}
                :1
              </span>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}

export default Balance
