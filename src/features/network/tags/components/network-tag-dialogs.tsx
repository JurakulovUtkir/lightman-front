import { ConfirmDialog } from '@/components/confirm-dialog'
import { useNetworkTagContext } from '../context'
import { useDeleteNetworkTag } from '../data/hooks'
import { NetworkTagMutateDrawer } from './network-tag-mutate-drawer'

export function NetworkTagDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useNetworkTagContext()
  const { mutate, isPending } = useDeleteNetworkTag()

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
      <NetworkTagMutateDrawer
        key='network-tag-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <NetworkTagMutateDrawer
            key={`network-tag-update-${currentRow.id}`}
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
            key='network-tag-delete'
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
            title={`Delete this Network tag with the name: ${currentRow.name} ?`}
            desc={
              <>
                You are about to delete a Network tag with the name{' '}
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
