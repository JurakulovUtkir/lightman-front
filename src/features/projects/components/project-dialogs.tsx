import { useLang } from '@/hooks/useLang'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useProjectContext } from '../context'
import { useDeleteProject, useUpdateProject } from '../data/hooks'
import { ProjectMutateDrawer } from './project-mutate-drawer'

export function ProjectDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProjectContext()
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject()
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject()
  const { lang, general, tProject, interpolate, interpolateWithComponents } =
    useLang()
  const t_general = general[lang].layout
  const t = tProject[lang]

  const handleDelete = (id: string) => {
    deleteProject(id, {
      onSuccess: () => {
        setOpen(null)
        setCurrentRow(null)
      },
    })
  }

  const handleStatusChange = () => {
    if (!currentRow || !currentRow.pendingStatus) return

    updateProject(
      {
        id: currentRow.id,
        data: {
          ...currentRow,
          status: currentRow.pendingStatus,
        },
      },
      {
        onSuccess: () => {
          setOpen(null)
          setCurrentRow(null)
        },
      }
    )
  }

  return (
    <>
      <ProjectMutateDrawer
        key='project-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <ProjectMutateDrawer
            key={`project-update-${currentRow.id}`}
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
            key='project-delete'
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
            title={interpolate(t.delete_title, {
              name: currentRow.name,
            })}
            desc={
              <>
                {interpolateWithComponents(t.delete_confirm, {
                  name: <strong>{currentRow.name}</strong>,
                })}
                <br />
                {t_general.undone}
              </>
            }
            isLoading={isDeleting}
            confirmText={isDeleting ? t_general.deleting : t_general.delete}
          />

          <ConfirmDialog
            key='project-status-change'
            open={open === 'status'}
            onOpenChange={() => {
              setOpen('status')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handleStatusChange}
            className='max-w-md'
            title={t.status_change_title}
            desc={
              <>
                {interpolateWithComponents(t.status_change_confirm, {
                  name: <strong>{currentRow.name}</strong>,
                  status: (
                    <strong>
                      {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        t[currentRow.pendingStatus]
                      }
                    </strong>
                  ),
                })}
              </>
            }
            isLoading={isUpdating}
            confirmText={isUpdating ? t.updating : t.confirm}
          />
        </>
      )}
    </>
  )
}
