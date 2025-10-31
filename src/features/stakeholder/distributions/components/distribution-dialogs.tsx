import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDistributionContext } from '../context'
import { useDeleteDistribution } from '../data/hooks'
import { DistributionMutateDrawer } from './distribution-mutate-drawer'

export function DistributionDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDistributionContext()
  const { mutate, isPending } = useDeleteDistribution()

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
      <DistributionMutateDrawer
        key='distribution-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <DistributionMutateDrawer
            key={`distribution-update-${currentRow.id}`}
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
            key='distribution-delete'
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
            title={`Delete this Distribution with the id: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a Distribution with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
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
