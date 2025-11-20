import { ConfirmDialog } from '@/components/confirm-dialog'
import { useNetworkSocialContext } from '../context'
import { useDeleteNetworkSocial } from '../data/hooks'
import { NetworkSocialMutateDrawer } from './network-social-mutate-drawer'

export function NetworkSocialDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useNetworkSocialContext()
  const { mutate, isPending } = useDeleteNetworkSocial()

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
      <NetworkSocialMutateDrawer
        key='network-social-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <NetworkSocialMutateDrawer
            key={`network-social-update-${currentRow.id}`}
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
            key='network-social-delete'
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
            title={`Delete this Network social with the name: ${currentRow.name} ?`}
            desc={
              <>
                You are about to delete a Network social with the name{' '}
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
