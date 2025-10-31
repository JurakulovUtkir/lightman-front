import { Row } from '@tanstack/react-table'
import { IconEdit } from '@tabler/icons-react'
import { useDistributorContext } from '../context'
import { DistributorSchema } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<DistributorSchema>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useDistributorContext()
  return (
    <div className='flex justify-end px-4'>
      <IconEdit
        size={16}
        className='cursor-pointer'
        onClick={() => {
          setCurrentRow(row.original)
          setOpen('update')
        }}
      />
    </div>
  )
}
