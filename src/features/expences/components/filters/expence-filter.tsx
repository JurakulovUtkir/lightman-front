import { useState } from 'react'
import { format } from 'date-fns'
import { useSearch } from '@tanstack/react-router'
import { IconCalendar, IconFilter, IconX } from '@tabler/icons-react'
import {
  getExpenceTypeOptions,
  getExpenceOriginTypeOptions,
  getPaymentTypeOptions,
} from '@/constants'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { CompanyFilter } from '@/features/projects/components/filters/company-filter'
import { DistributionFilter } from '@/features/projects/components/filters/distribution-filter'
import { EnumFilter } from '@/features/projects/components/filters/enum-filters'
import { CardFilter } from './card-filter'
import { LoanFilter } from './loan-filter'
import { ProjectSearchFilter } from './project-search-filter'
import { useExpenceFilters } from './useExpenceFilters'
import { UserFilter } from './user-filter'

const ExpenceFilter = ({
  isFounder = false,
  isProject = false,
}: {
  isFounder?: boolean
  isProject?: boolean
}) => {
  const { lang, general, tForm } = useLang()
  const t_general = general[lang].columns
  const t = tForm[lang]
  const expenceOriginTypeOptions = getExpenceOriginTypeOptions(t_general)
  const expenceTypeOptions = getExpenceTypeOptions(t_general)

  const {
    type,
    expence_type,
    payment_type,
    distribution_id,
    company_id,
    project_id,
    user_id,
    date_from,
    date_to,
    max_amount,
    min_amount,
    loan_id,
    card_id,
  } = useSearch({
    from: isFounder
      ? '/_authenticated/stakeholder/founders/expence/$id'
      : isProject
        ? '/_authenticated/projects/expence/$id'
        : '/_authenticated/expences/',
  })

  const {
    handleTypeFilterChange,
    handleExpenceTypeFilterChange,
    handlePaymentTypeFilterChange,
    handleDistiburionFilterChange,
    handleCompanyFilterChange,
    handleProjectFilterChange,
    handleUserFilterChange,
    handleDateFromFilterChange,
    handleDateToFilterChange,
    handleMaxAmountFilterChange,
    handleMinAmountFilterChange,
    handleLoanFilterChange,
    handleCardFilterChange,
    handleClear,
  } = useExpenceFilters({ isFounder, isProject })

  const [open, setOpen] = useState(false)
  const [minAmount, setMinAmount] = useState<string>(
    min_amount?.toString() || ''
  )
  const [maxAmount, setMaxAmount] = useState<string>(
    max_amount?.toString() || ''
  )
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    date_from ? new Date(date_from) : undefined
  )
  const [dateTo, setDateTo] = useState<Date | undefined>(
    date_to ? new Date(date_to) : undefined
  )

  // Count active filters
  const activeFiltersCount = [
    type,
    expence_type,
    payment_type,
    distribution_id,
    company_id,
    project_id,
    user_id,
    date_from,
    date_to,
    min_amount,
    max_amount,
    loan_id,
    card_id,
  ].filter(Boolean).length

  const handleApplyAmountFilter = () => {
    const min = minAmount ? parseFloat(minAmount) : null
    const max = maxAmount ? parseFloat(maxAmount) : null

    if (min !== null && !isNaN(min)) {
      handleMinAmountFilterChange(min)
    } else {
      handleMinAmountFilterChange(null)
    }

    if (max !== null && !isNaN(max)) {
      handleMaxAmountFilterChange(max)
    } else {
      handleMaxAmountFilterChange(null)
    }
  }

  const onDateFromChange = (date: Date | undefined) => {
    setDateFrom(date)
    handleDateFromFilterChange(date ? format(date, 'yyyy-MM-dd') : null)
  }

  const onDateToChange = (date: Date | undefined) => {
    setDateTo(date)
    handleDateToFilterChange(date ? format(date, 'yyyy-MM-dd') : null)
  }

  const handleClearDateRange = () => {
    setDateFrom(undefined)
    setDateTo(undefined)
    handleDateFromFilterChange(null)
    handleDateToFilterChange(null)
  }

  const handleClearAll = () => {
    handleClear()
    setMinAmount('')
    setMaxAmount('')
    setDateFrom(undefined)
    setDateTo(undefined)
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='relative h-8'>
          <IconFilter className='mr-2 h-4 w-4' />
          {t.form_labels.filters}
          {activeFiltersCount > 0 && (
            <Badge
              variant='default'
              className='ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs'
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[600px] p-4' align='start'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-medium'>{t.form_labels.filters}</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleClearAll}
                className='h-8 px-2 text-xs'
              >
                {t.form_labels.clear_all}
              </Button>
            )}
          </div>

          <Separator />

          {/* 2-column grid layout */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label className='text-xs font-medium'>
                {t.form_labels.type}
              </Label>
              <EnumFilter
                placeholder={t.form_placeholders.select_type}
                filterOptions={expenceOriginTypeOptions}
                selectedFilter={type}
                onFilterChange={handleTypeFilterChange}
                searchable={false}
                fieldsWidth={275}
              />
            </div>

            <div className='space-y-2'>
              <Label className='text-xs font-medium'>
                {t.form_labels.expence_type}
              </Label>
              <EnumFilter
                placeholder={t.form_placeholders.select_type}
                filterOptions={expenceTypeOptions}
                selectedFilter={expence_type}
                onFilterChange={handleExpenceTypeFilterChange}
                searchable={false}
                fieldsWidth={275}
              />
            </div>

            {!isFounder && (
              <>
                <div className='space-y-2'>
                  <Label className='text-xs font-medium'>
                    {t.form_labels.distribution}
                  </Label>
                  <DistributionFilter
                    placeholder={t.form_placeholders.search_distributions}
                    searchable={true}
                    selectedFilter={distribution_id}
                    onFilterChange={handleDistiburionFilterChange}
                    fieldsWidth={275}
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='text-xs font-medium'>
                    {t.form_labels.company}
                  </Label>
                  <CompanyFilter
                    placeholder={t.form_placeholders.search_company}
                    searchable={true}
                    useSearchableCompanies={true}
                    selectedFilter={company_id}
                    onFilterChange={handleCompanyFilterChange}
                    filterOurCompany={true}
                    fieldsWidth={275}
                  />
                </div>

                {!isProject && (
                  <div className='space-y-2'>
                    <Label className='text-xs font-medium'>
                      {t.form_labels.project}
                    </Label>
                    <ProjectSearchFilter
                      placeholder={t.form_placeholders.search_projects}
                      searchable={true}
                      useSearchableProjects={true}
                      selectedFilter={project_id}
                      onFilterChange={handleProjectFilterChange}
                      fieldsWidth={275}
                    />
                  </div>
                )}

                <div className='space-y-2'>
                  <Label className='text-xs font-medium'>
                    {t.form_labels.users}
                  </Label>
                  <UserFilter
                    placeholder={t.form_placeholders.search_users}
                    searchable={true}
                    useSearchableUsers={true}
                    selectedFilter={user_id}
                    onFilterChange={handleUserFilterChange}
                    fieldsWidth={275}
                  />
                </div>

                <div className='space-y-2'>
                  <Label className='text-xs font-medium'>
                    {t.form_labels.loan}
                  </Label>
                  <LoanFilter
                    placeholder={t.form_placeholders.search_loan}
                    searchable={true}
                    selectedFilter={loan_id}
                    onFilterChange={handleLoanFilterChange}
                    fieldsWidth={275}
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-xs font-medium'>
                    {t.form_labels.card}
                  </Label>
                  <CardFilter
                    placeholder={t.form_placeholders.search_card}
                    searchable={true}
                    selectedFilter={card_id}
                    onFilterChange={handleCardFilterChange}
                    fieldsWidth={275}
                  />
                </div>
              </>
            )}

            <div className='space-y-2'>
              <Label className='text-xs font-medium'>
                {t.form_labels.payment_type}
              </Label>
              <EnumFilter
                placeholder={t.form_placeholders.select_payment_type}
                filterOptions={getPaymentTypeOptions(t_general)}
                selectedFilter={payment_type}
                onFilterChange={handlePaymentTypeFilterChange}
                searchable={false}
                fieldsWidth={275}
              />
            </div>
          </div>

          <Separator />

          {/* Date Range - Full Width */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>
              {t.form_labels.date_range}
            </Label>
            <div className='grid grid-cols-2 gap-4'>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateFrom && 'text-muted-foreground'
                    )}
                  >
                    <IconCalendar className='mr-2 h-4 w-4' />
                    {dateFrom
                      ? format(dateFrom, 'PPP')
                      : t.form_labels.from_date}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={dateFrom}
                    onSelect={onDateFromChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateTo && 'text-muted-foreground'
                    )}
                  >
                    <IconCalendar className='mr-2 h-4 w-4' />
                    {dateTo ? format(dateTo, 'PPP') : t.form_labels.to_date}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={dateTo}
                    onSelect={onDateToChange}
                    disabled={(date) => (dateFrom ? date < dateFrom : false)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {(date_from || date_to) && (
              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                <span>
                  {t.form_labels.active}:{' '}
                  {date_from
                    ? format(new Date(date_from), 'PP')
                    : t.form_labels.any}{' '}
                  -{' '}
                  {date_to
                    ? format(new Date(date_to), 'PP')
                    : t.form_labels.any}
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleClearDateRange}
                  className='h-5 w-5 p-0'
                >
                  <IconX className='h-3 w-3' />
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Amount Range - Full Width */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>
              {t.form_labels.amount_range}
            </Label>
            <div className='flex items-center gap-2'>
              <div className='flex-1'>
                <Input
                  type='number'
                  placeholder={t.form_placeholders.min}
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className='h-9'
                />
              </div>
              <span className='text-muted-foreground'>-</span>
              <div className='flex-1'>
                <Input
                  type='number'
                  placeholder={t.form_placeholders.max}
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className='h-9'
                />
              </div>
              <Button
                size='sm'
                onClick={handleApplyAmountFilter}
                className='h-9'
              >
                {t.form_labels.apply}
              </Button>
            </div>
            {(min_amount || max_amount) && (
              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                <span>
                  {t.form_labels.active}: {min_amount || '0'} -{' '}
                  {max_amount || '∞'}
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    handleMinAmountFilterChange(null)
                    handleMaxAmountFilterChange(null)
                    setMinAmount('')
                    setMaxAmount('')
                  }}
                  className='h-5 w-5 p-0'
                >
                  <IconX className='h-3 w-3' />
                </Button>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ExpenceFilter
