import { Row } from '@tanstack/react-table'
import { IconEdit } from '@tabler/icons-react'
import { usePropertyContext } from '../context'
import { PropertySchema } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<PropertySchema>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = usePropertyContext()
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
