import { useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import { IconFilter, IconX } from '@tabler/icons-react'
import { getPriceTypeOptions, getstatusOptions } from '@/constants'
import { useLang } from '@/hooks/useLang'
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
import { useProjectFilters } from './useProjectFilters'
import { UserFilter } from './user-filter'

const ProjectFilter = ({
  requested = false,
  passive = false,
}: {
  requested?: boolean
  passive?: boolean
}) => {
  const { lang, general, tForm } = useLang()
  const t_general = general[lang].columns
  const t = tForm[lang]

  const statusOptions = getstatusOptions(t_general)
  const {
    category_id,
    status,
    our_company_id,
    customer_company_id,
    project_manager_id,
    distribution_id,
    price_type,
    max_price,
    min_price,
  } = useSearch({
    from: requested
      ? '/_authenticated/projects/requested/'
      : passive
        ? '/_authenticated/passives/projects/'
        : '/_authenticated/projects/',
  })

  const {
    handleCategoryFilterChange,
    handleCustomerCompanyFilterChange,
    handleDistiburionFilterChange,
    handleMaxPriceFilterChange,
    handleMinPriceFilterChange,
    handleOurCompanyFilterChange,
    handleProjectManagerFilterChange,
    handlePriceTypeFilterChange,
    handleStatusFilterChange,
    handleClear,
  } = useProjectFilters({ requested, passive })
  const [open, setOpen] = useState(false)
  const [minPrice, setMinPrice] = useState<string>(min_price?.toString() || '')
  const [maxPrice, setMaxPrice] = useState<string>(max_price?.toString() || '')

  // Count active filters
  const activeFiltersCount = [
    category_id,
    status,
    our_company_id,
    project_manager_id,
    customer_company_id,
    distribution_id,
    price_type,
    max_price,
    min_price,
  ].filter(Boolean).length

  const handleClearAll = () => {
    handleClear()
    setMinPrice('')
    setMaxPrice('')
  }

  const handleApplyPriceFilter = () => {
    const min = minPrice ? parseFloat(minPrice) : null
    const max = maxPrice ? parseFloat(maxPrice) : null

    if (min !== null && !isNaN(min)) {
      handleMinPriceFilterChange(min)
    } else {
      handleMinPriceFilterChange(null)
    }

    if (max !== null && !isNaN(max)) {
      handleMaxPriceFilterChange(max)
    } else {
      handleMaxPriceFilterChange(null)
    }
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
      <PopoverContent
        className='w-[calc(100vw-2rem)] max-w-[400px] p-0'
        align='start'
        sideOffset={5}
      >
        {/* Fixed Header */}
        <div className='bg-popover sticky top-0 z-10 p-4 pb-3'>
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
          <Separator className='mt-3' />
        </div>

        {/* Scrollable Content */}
        <div className='max-h-[calc(100vh-12rem)] overflow-y-auto px-4 pb-4'>
          <div className='space-y-4'>
            {/* Category Filter */}
            <div className='space-y-2'>
              <Label className='text-xs font-medium'>
                {t.form_labels.category}
              </Label>
              <NetworkCategoryFilter
                placeholder={t.form_placeholders.search_categories}
                searchable={true}
                useSearchableCategories={true}
                selectedFilter={category_id}
                onFilterChange={handleCategoryFilterChange}
                fieldsWidth={365}
              />
            </div>

            {/* Status Filter */}
            <div className='space-y-2'>
              <Label className='text-xs font-medium'>
                {t.form_labels.status}
              </Label>
              <EnumFilter
                placeholder={t.form_placeholders.select_status}
                filterOptions={statusOptions}
                selectedFilter={status}
                onFilterChange={handleStatusFilterChange}
                searchable={false}
              />
            </div>

            <div className='space-y-2'>
              <Label className='text-xs font-medium'>
                {t.form_labels.select_project_manager}
              </Label>
              <UserFilter
                role='project_manager'
                placeholder={t.form_placeholders.select_project_manager}
                searchable={true}
                selectedFilter={project_manager_id}
                onFilterChange={handleProjectManagerFilterChange}
              />
            </div>

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

            {/* Distribution Filter */}
            <div className='space-y-2'>
              <Label className='text-xs font-medium'>
                {t.form_labels.distribution}
              </Label>
              <DistributionFilter
                placeholder={t.form_placeholders.search_distributions}
                searchable={true}
                selectedFilter={distribution_id}
                onFilterChange={handleDistiburionFilterChange}
              />
            </div>

            {/* Price Type Filter */}
            <div className='space-y-2'>
              <Label className='text-xs font-medium'>
                {t.form_labels.price_type}
              </Label>
              <EnumFilter
                placeholder={t.form_placeholders.select_price_type}
                filterOptions={getPriceTypeOptions(t_general)}
                selectedFilter={price_type}
                onFilterChange={handlePriceTypeFilterChange}
                searchable={false}
              />
            </div>

            {/* Price Range Filter */}
            <div className='space-y-2'>
              <Label className='text-xs font-medium'>
                {t.form_labels.price_range}
              </Label>
              <div className='flex items-center gap-2'>
                <div className='flex-1'>
                  <Input
                    type='number'
                    placeholder={t.form_placeholders.min}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className='h-9'
                  />
                </div>
                <span className='text-muted-foreground'>-</span>
                <div className='flex-1'>
                  <Input
                    type='number'
                    placeholder={t.form_placeholders.max}
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
                  {t.form_labels.apply}
                </Button>
              </div>
              {(min_price || max_price) && (
                <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                  <span>
                    {t.form_labels.active}: {min_price || '0'} -{' '}
                    {max_price || '∞'}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      handleMinPriceFilterChange(null)
                      handleMaxPriceFilterChange(null)
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
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ProjectFilter
