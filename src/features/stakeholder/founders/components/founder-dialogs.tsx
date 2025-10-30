import { ConfirmDialog } from '@/components/confirm-dialog'
import { useFounderContext } from '../context'
import { useDeleteFounder } from '../data/hooks'
import { FounderMutateDrawer } from './founder-mutate-drawer'

export function FounderDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useFounderContext()
  const { mutate, isPending } = useDeleteFounder()

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
      <FounderMutateDrawer
        key='founder-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <FounderMutateDrawer
            key={`founder-update-${currentRow.id}`}
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
            key='founder-delete'
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
            title={`Delete this Founder with the id: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a Founder with the ID{' '}
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
