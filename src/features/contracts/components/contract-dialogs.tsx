import { ConfirmDialog } from '@/components/confirm-dialog'
import { useContractContext } from '../context'
import { useDeleteContract } from '../data/hooks'
import { ContractMutateDrawer } from './contract-mutate-drawer'

export function ContractDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useContractContext()
  const { mutate, isPending } = useDeleteContract()

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
      <ContractMutateDrawer
        key='contract-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <ContractMutateDrawer
            key={`contract-update-${currentRow.id}`}
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
            key='contract-delete'
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
            title={`Delete this Contract with the name: ${currentRow.name} ?`}
            desc={
              <>
                You are about to delete a Contract with the name{' '}
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
