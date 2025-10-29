import { ConfirmDialog } from '@/components/confirm-dialog'
import { useNetworkTypeContext } from '../context'
import { useDeleteNetworkType } from '../data/hooks'
import { NetworkTypeMutateDrawer } from './network-type-mutate-drawer'

export function NetworkTypesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useNetworkTypeContext()
  const { mutate, isPending } = useDeleteNetworkType()

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
      <NetworkTypeMutateDrawer
        key='network-type-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <NetworkTypeMutateDrawer
            key={`network-type-update-${currentRow.id}`}
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
            key='network-type-delete'
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
            title={`Delete this Network type with the id: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a Network type with the ID{' '}
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
