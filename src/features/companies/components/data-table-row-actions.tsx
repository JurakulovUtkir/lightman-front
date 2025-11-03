import { Row } from '@tanstack/react-table'
import { IconEdit } from '@tabler/icons-react'
import { useCompanyContext } from '../context'
import { CompanySchema } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<CompanySchema>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useCompanyContext()
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
