import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDistributorContext } from '../context'
import { useDeleteDistributor } from '../data/hooks'
import { DistributorMutateDrawer } from './distributor-mutate-drawer'

export function DistributorDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDistributorContext()
  const { mutate, isPending } = useDeleteDistributor()

  const handleDelete = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        setOpen(null)
        setCurrentRow(null)
      },
    })
  }
  return (
    <>
      <DistributorMutateDrawer
        key='distributor-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <DistributorMutateDrawer
            key={`distributor-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
            setCurrentRow={setCurrentRow}
            setOpen={setOpen}
          />

          <ConfirmDialog
            key='distributor-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => handleDelete(currentRow.id)}
            className='max-w-md'
            title={`Delete this Distributor?`}
            desc={
              <>
                You are about to delete a Distributor. This action cannot be
                undone.
              </>
            }
            isLoading={isPending}
            confirmText={isPending ? 'Deleting...' : 'Delete'}
          />
        </>
      )}
    </>
  )
}
