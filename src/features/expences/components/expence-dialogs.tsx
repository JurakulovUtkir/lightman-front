import { ConfirmDialog } from '@/components/confirm-dialog'
import { useExpenceContext } from '../context'
import { useDeleteExpence } from '../data/hooks'
import { ExpenceMutateDrawer } from './expence-mutate-drawer'

export function ExpenceDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useExpenceContext()
  const { mutate, isPending } = useDeleteExpence()

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
      <ExpenceMutateDrawer
        key='expence-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <ExpenceMutateDrawer
            key={`expence-update-${currentRow.id}`}
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
            key='expence-delete'
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
            title={`Delete this Expence with the amount: ${currentRow.amount} ?`}
            desc={
              <>
                You are about to delete a Expence with the amount{' '}
                <strong>{currentRow.amount}</strong>. <br />
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
