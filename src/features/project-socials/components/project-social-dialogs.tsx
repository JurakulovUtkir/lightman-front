import { ConfirmDialog } from '@/components/confirm-dialog'
import { useProjectSocialContext } from '../context'
import { useDeleteProjectSocial } from '../data/hooks'
import { ProjectSocialMutateDrawer } from './project-social-mutate-drawer'

export function ProjectSocialDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProjectSocialContext()
  const { mutate, isPending } = useDeleteProjectSocial()

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
      <ProjectSocialMutateDrawer
        key='project-social-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <ProjectSocialMutateDrawer
            key={`project-social-update-${currentRow.id}`}
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
            key='project-social-delete'
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
            title={`Delete this Project social with the id: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a Project social with the ID{' '}
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
