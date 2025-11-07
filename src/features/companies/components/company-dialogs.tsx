import { ConfirmDialog } from '@/components/confirm-dialog'
import { useCompanyContext } from '../context'
import { useDeleteCompany } from '../data/hooks'
import { CompanyMutateDrawer } from './company-mutate-drawer'

export function CompanyDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCompanyContext()
  const { mutate, isPending } = useDeleteCompany()

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
      <CompanyMutateDrawer
        key='company-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <CompanyMutateDrawer
            key={`company-update-${currentRow.id}`}
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
            key='company-delete'
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
            title={`Delete this Company with the name: ${currentRow.name} ?`}
            desc={
              <>
                You are about to delete a Company with the name{' '}
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
