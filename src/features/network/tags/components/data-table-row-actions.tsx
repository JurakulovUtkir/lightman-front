import { Row } from '@tanstack/react-table'
import { IconEdit } from '@tabler/icons-react'
import { useNetworkTagContext } from '../context'
import { NetworkTagSchema } from '../data/schema'

interface DataTableRowActionsProps {
  row: Row<NetworkTagSchema>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useNetworkTagContext()
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
