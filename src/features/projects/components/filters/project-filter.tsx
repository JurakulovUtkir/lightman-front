import { useState } from 'react'
import { IconFilter, IconX } from '@tabler/icons-react'
import { priceTypeOptions, statusOptions } from '@/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { NetworkCategoryFilter } from '@/features/network/categories/components/network-category-filter'
import { CompanyFilter } from './company-filter'
import { DistributionFilter } from './distribution-filter'
import { EnumFilter } from './enum-filters'

interface ProjectFilterProps {
  selectedCategoryId?: string
  selectedStatus?: string
  selectedOurCompanyId?: string
  selectedCustomerCompanyId?: string
  selectedDistributionId?: string
  selectedMaxPrice?: number
  selectedMinPrice?: number
  selectedPriceType?: string
  onCategoryFilterChange: (categoryId: string | null) => void
  onStatusFilterChange: (status: string | null) => void
  onOurCompanyFilterChange: (ourCompanyId: string | null) => void
  onCustomerCompanyFilterChange: (customerCompanyId: string | null) => void
  onDistiburionFilterChange: (distributionId: string | null) => void
  onPriceTypeFilterChange: (priceType: string | null) => void
  onMaxPriceFilterChange: (max_price: number | null) => void
  onMinPriceFilterChange: (min_price: number | null) => void
}

const ProjectFilter = ({
  selectedCategoryId,
  selectedStatus,
  selectedOurCompanyId,
  selectedCustomerCompanyId,
  selectedDistributionId,
  selectedMaxPrice,
  selectedMinPrice,
  selectedPriceType,
  onCategoryFilterChange,
  onStatusFilterChange,
  onOurCompanyFilterChange,
  onCustomerCompanyFilterChange,
  onDistiburionFilterChange,
  onPriceTypeFilterChange,
  onMaxPriceFilterChange,
  onMinPriceFilterChange,
}: ProjectFilterProps) => {
  const [open, setOpen] = useState(false)
  const [minPrice, setMinPrice] = useState<string>(
    selectedMinPrice?.toString() || ''
  )
  const [maxPrice, setMaxPrice] = useState<string>(
    selectedMaxPrice?.toString() || ''
  )

  // Count active filters
  const activeFiltersCount = [
    selectedCategoryId,
    selectedStatus,
    selectedOurCompanyId,
    selectedCustomerCompanyId,
    selectedDistributionId,
    selectedPriceType,
    selectedMaxPrice,
    selectedMinPrice,
  ].filter(Boolean).length

  const handleClearAll = () => {
    onCategoryFilterChange(null)
    onStatusFilterChange(null)
    onOurCompanyFilterChange(null)
    onCustomerCompanyFilterChange(null)
    onDistiburionFilterChange(null)
    onPriceTypeFilterChange(null)
    onMaxPriceFilterChange(null)
    onMinPriceFilterChange(null)
    setMinPrice('')
    setMaxPrice('')
  }

  const handleApplyPriceFilter = () => {
    const min = minPrice ? parseFloat(minPrice) : null
    const max = maxPrice ? parseFloat(maxPrice) : null

    if (min !== null && !isNaN(min)) {
      onMinPriceFilterChange(min)
    } else {
      onMinPriceFilterChange(null)
    }

    if (max !== null && !isNaN(max)) {
      onMaxPriceFilterChange(max)
    } else {
      onMaxPriceFilterChange(null)
    }
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

          {/* Category Filter */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>Category</Label>
            <NetworkCategoryFilter
              placeholder='Search categories...'
              searchable={true}
              useSearchableCategories={true}
              selectedFilter={selectedCategoryId}
              onFilterChange={onCategoryFilterChange}
              fieldsWidth={365}
            />
          </div>

          {/* Status Filter */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>Status</Label>
            <EnumFilter
              placeholder='Select status...'
              filterOptions={statusOptions}
              selectedFilter={selectedStatus}
              onFilterChange={onStatusFilterChange}
              searchable={false}
            />
          </div>

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

          {/* Distribution Filter */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>Distribution</Label>

            <DistributionFilter
              placeholder='Search distributions...'
              searchable={true}
              selectedFilter={selectedDistributionId}
              onFilterChange={onDistiburionFilterChange}
            />
          </div>

          {/* Price Type Filter */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>Price Type</Label>
            <EnumFilter
              placeholder='Select price type...'
              filterOptions={priceTypeOptions}
              selectedFilter={selectedPriceType}
              onFilterChange={onPriceTypeFilterChange}
              searchable={false}
            />
          </div>

          {/* Price Range Filter */}
          <div className='space-y-2'>
            <Label className='text-xs font-medium'>Price Range</Label>
            <div className='flex items-center gap-2'>
              <div className='flex-1'>
                <Input
                  type='number'
                  placeholder='Min'
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className='h-9'
                />
              </div>
              <span className='text-muted-foreground'>-</span>
              <div className='flex-1'>
                <Input
                  type='number'
                  placeholder='Max'
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className='h-9'
                />
              </div>
              <Button
                size='sm'
                onClick={handleApplyPriceFilter}
                className='h-9'
              >
                Apply
              </Button>
            </div>
            {(selectedMinPrice || selectedMaxPrice) && (
              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                <span>
                  Active: {selectedMinPrice || '0'} - {selectedMaxPrice || '∞'}
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    onMinPriceFilterChange(null)
                    onMaxPriceFilterChange(null)
                    setMinPrice('')
                    setMaxPrice('')
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

export default ProjectFilter
