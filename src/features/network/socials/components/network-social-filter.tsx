import { NetworkCategoryFilter } from '../../categories/components/network-category-filter'
import { NetworkTypeFilter } from '../../types/components/network-type-filter'

const NetworkSocialFilter = ({
  onTypeFilterChange,
  selectedTypeId,
  selectedCategoryId,
  onCategoryFilterChange,
}: {
  selectedCategoryId: string | undefined
  onCategoryFilterChange: (categoryId: string | null) => void
  onTypeFilterChange: (typeId: string | null) => void
  selectedTypeId: string | undefined
}) => {
  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-center'>
      <NetworkTypeFilter
        placeholder='Search network types...'
        searchable={true}
        useSearchableTypes={true}
        selectedFilter={selectedTypeId}
        onFilterChange={onTypeFilterChange}
      />
      <NetworkCategoryFilter
        placeholder='Search categories...'
        searchable={true}
        useSearchableCategories={true}
        selectedFilter={selectedCategoryId}
        onFilterChange={onCategoryFilterChange}
      />
    </div>
  )
}

export default NetworkSocialFilter
