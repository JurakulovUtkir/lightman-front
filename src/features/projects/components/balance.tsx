import { formatPrice } from '@/utils/formatPrice'
import { useLang } from '@/hooks/useLang'
import { useProjectExpenceStatistics } from '@/features/project-socials/data/hooks'
import { ProjectSchema } from '../data/schema'

const Balance = ({ project }: { project: ProjectSchema }) => {
  const { lang, general } = useLang()
  const t = general[lang].columns

  const { data: expenceStatistics, isLoading } = useProjectExpenceStatistics(
    project.id
  )

  if (isLoading) {
    return <div className='text-muted-foreground'>Loading...</div>
  }

  if (!expenceStatistics?.data) {
    return <div className='text-muted-foreground'>-</div>
  }

  const {
    given_amount,
    total_planned_sell_expense,
    total_expensed_by_service,
  } = expenceStatistics.data

  // Convert given_amount to number (it comes as string)
  const givenAmount = parseFloat(given_amount) || 0
  const plannedSellExpense = total_planned_sell_expense || 0
  const expensedByService = total_expensed_by_service || 0

  // Calculate balance: Given_amount - (total_planned_sell_expense + total_expensed_by_service)
  const balance = givenAmount - (plannedSellExpense + expensedByService)

  // Determine color based on balance value
  const getBalanceColor = () => {
    if (balance > 0) return 'text-green-600 dark:text-green-500'
    if (balance < 0) return 'text-red-600 dark:text-red-500'
    return 'text-muted-foreground'
  }

  return (
    <div className={`font-medium ${getBalanceColor()}`}>
      {formatPrice(balance)} {t.uzs}
    </div>
  )
}

export default Balance
