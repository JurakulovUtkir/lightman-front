import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDepositContext } from '../context'
import { useDeleteDeposit } from '../data/hooks'
import { DepositMutateDrawer } from './deposit-mutate-drawer'

export function DepositDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDepositContext()
  const { mutate, isPending } = useDeleteDeposit()

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
      <DepositMutateDrawer
        key='deposit-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <DepositMutateDrawer
            key={`deposit-update-${currentRow.id}`}
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
            key='deposit-delete'
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
            title={`Delete this Deposit with the name: ${currentRow.name} ?`}
            desc={
              <>
                You are about to delete a Deposit with the name{' '}
                <strong>{currentRow.name}</strong>. <br />
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
