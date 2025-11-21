import { useState } from 'react'
import { IconFilter } from '@tabler/icons-react'
import { paymentStatusOptions, paymentTypeOptions } from '@/constants'
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

interface ContractFilterProps {
  selectedOurCompanyId?: string
  selectedCustomerCompanyId?: string
  selectedPaymentStatus?: string
  selectedPaymentType?: string
  onOurCompanyFilterChange: (ourCompanyId: string | null) => void
  onCustomerCompanyFilterChange: (customerCompanyId: string | null) => void
  onPaymentStatusFilterChange: (paymentStatus: string | null) => void
  onPaymentTypeFilterChange: (paymentType: string | null) => void
}

const ContractFilter = ({
  selectedOurCompanyId,
  selectedCustomerCompanyId,
  selectedPaymentStatus,
  selectedPaymentType,
  onOurCompanyFilterChange,
  onCustomerCompanyFilterChange,
  onPaymentStatusFilterChange,
  onPaymentTypeFilterChange,
}: ContractFilterProps) => {
  const [open, setOpen] = useState(false)

  // Count active filters
  const activeFiltersCount = [
    selectedOurCompanyId,
    selectedCustomerCompanyId,
    selectedPaymentStatus,
    selectedPaymentType,
  ].filter(Boolean).length

  const handleClearAll = () => {
    onOurCompanyFilterChange(null)
    onCustomerCompanyFilterChange(null)
    onPaymentStatusFilterChange(null)
    onPaymentTypeFilterChange(null)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='relative h-8'>
          <IconFilter className='mr-2 h-4 w-4' />
          Filters
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
            <h4 className='text-sm font-medium'>Filters</h4>
            {activeFiltersCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleClearAll}
                className='h-8 px-2 text-xs'
              >
                Clear all
              </Button>
            )}
          </div>

          <Separator />

          {/* Our Company Filter */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>Our Company</Label>
            <CompanyFilter
              placeholder='Search our companies...'
              searchable={true}
              useSearchableCompanies={true}
              selectedFilter={selectedOurCompanyId}
              onFilterChange={onOurCompanyFilterChange}
              filterOurCompany={true}
            />
          </div>

          {/* Customer Company Filter */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>Customer Company</Label>
            <CompanyFilter
              placeholder='Search customer companies...'
              searchable={true}
              useSearchableCompanies={true}
              selectedFilter={selectedCustomerCompanyId}
              onFilterChange={onCustomerCompanyFilterChange}
              filterOurCompany={false}
            />
          </div>
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>Payment Status</Label>
            <EnumFilter
              placeholder='Select status...'
              filterOptions={paymentStatusOptions}
              selectedFilter={selectedPaymentStatus}
              onFilterChange={onPaymentStatusFilterChange}
              searchable={false}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-xs font-medium'>Payment Type</Label>
            <EnumFilter
              placeholder='Select payment type...'
              filterOptions={paymentTypeOptions}
              selectedFilter={selectedPaymentType}
              onFilterChange={onPaymentTypeFilterChange}
              searchable={false}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ContractFilter
