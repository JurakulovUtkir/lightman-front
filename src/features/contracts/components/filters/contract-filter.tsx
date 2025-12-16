import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { IconFilter } from '@tabler/icons-react'
import { getPaymentTypeOptions, getPaymentStatusOptions } from '@/constants'
import { useLang } from '@/hooks/useLang'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { CompanyFilter } from '@/features/projects/components/filters/company-filter'
import { EnumFilter } from '@/features/projects/components/filters/enum-filters'
import { useContractFilters } from './useContractFilters'

const ContractFilter = () => {
  const { lang, general, tForm } = useLang()
  const t_general = general[lang].columns
  const t = tForm[lang]

  const paymentStatusOptions = getPaymentStatusOptions(t_general)
  const { customer_company_id, our_company_id, payment_status, payment_type } =
    useSearch({
      from: '/_authenticated/contracts/',
    })
  const {
    handleCustomerCompanyFilterChange,
    handleOurCompanyFilterChange,
    handlePaymentStatusFilterChange,
    handlePaymentTypeFilterChange,
    handleClear,
  } = useContractFilters()
  const [open, setOpen] = useState(false)

  // Count active filters
  const activeFiltersCount = [
    customer_company_id,
    our_company_id,
    payment_status,
    payment_type,
  ].filter(Boolean).length

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
      <PopoverContent className='w-[400px] p-4' align='start'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h4 className='text-sm font-medium'>{t.form_labels.filters}</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleClear}
                className='h-8 px-2 text-xs'
              >
                {t.form_labels.clear_all}
              </Button>
            )}
          </div>

          <Separator />

          {/* Our Company Filter */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>
              {t.form_labels.our_company}
            </Label>
            <CompanyFilter
              placeholder={t.form_placeholders.search_our_company}
              searchable={true}
              useSearchableCompanies={true}
              selectedFilter={our_company_id}
              onFilterChange={handleOurCompanyFilterChange}
              filterOurCompany={true}
            />
          </div>

          {/* Customer Company Filter */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>
              {t.form_labels.customer_company}
            </Label>
            <CompanyFilter
              placeholder={t.form_placeholders.search_customer_company}
              searchable={true}
              useSearchableCompanies={true}
              selectedFilter={customer_company_id}
              onFilterChange={handleCustomerCompanyFilterChange}
              filterOurCompany={false}
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>
              {t.form_labels.payment_status}
            </Label>
            <EnumFilter
              placeholder={t.form_placeholders.select_status}
              filterOptions={paymentStatusOptions}
              selectedFilter={payment_status}
              onFilterChange={handlePaymentStatusFilterChange}
              searchable={false}
            />
          </div>

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
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ContractFilter
