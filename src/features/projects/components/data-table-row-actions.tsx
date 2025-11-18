import { Row } from '@tanstack/react-table'
import { IconEdit } from '@tabler/icons-react'
import { useProjectContext } from '../context'
import { ProjectSchema } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<ProjectSchema>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useProjectContext()
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
