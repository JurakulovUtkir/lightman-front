import { ConfirmDialog } from '@/components/confirm-dialog'
import { useNetworkCategoryContext } from '../context'
import { useDeleteNetworkCategory } from '../data/hooks'
import { NetworkCategoryMutateDrawer } from './network-category-mutate-drawer'

export function NetworkCategoryDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useNetworkCategoryContext()
  const { mutate, isPending } = useDeleteNetworkCategory()

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
      <NetworkCategoryMutateDrawer
        key='network-category-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <NetworkCategoryMutateDrawer
            key={`network-category-update-${currentRow.id}`}
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
            key='network-category-delete'
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
            title={`Delete this Network category with the id: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a Network category with the ID{' '}
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
