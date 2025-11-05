import { Row } from '@tanstack/react-table'
import { IconEdit } from '@tabler/icons-react'
import { useProjectSocialContext } from '../context'
import { ProjectSocialSchema } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<ProjectSocialSchema>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useProjectSocialContext()
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
