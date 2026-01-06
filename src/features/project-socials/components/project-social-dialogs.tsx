import { useLang } from '@/hooks/useLang'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useUpdateProjectStatus } from '@/features/projects/data/hooks'
import { useProjectSocialContext } from '../context'
import { useDeleteProjectSocial } from '../data/hooks'
import { ApproveDialog } from './approve-dialog'
import { ProjectSocialExpenceMutateDrawer } from './project-social-expence-mutate-drawer'
import { ProjectSocialMutateDrawer } from './project-social-mutate-drawer'

export function ProjectSocialDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    projectData,
    setProjectData,
  } = useProjectSocialContext()
  const { mutate, isPending } = useDeleteProjectSocial()
  const { lang, general, tProject, interpolateWithComponents } = useLang()
  const t_general = general[lang].layout
  const t = tProject[lang]

  const { mutate: updateProject, isPending: isUpdating } =
    useUpdateProjectStatus()

  const handleDelete = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        setOpen(null)
        setCurrentRow(null)
      },
    })
  }

  const handleStatusChange = () => {
    if (!projectData || !projectData.pendingStatus) return

    updateProject(
      {
        id: projectData.id,
        data: {
          ...projectData,
          status: projectData.pendingStatus,
        },
      },
      {
        onSuccess: () => {
          setOpen(null)
          setProjectData(null)
        },
      }
    )
  }
  const handleStatusChangeApprove = (payload: {
    distribution_id: string
    price: number
  }) => {
    if (!projectData || !projectData.pendingStatus) return

    updateProject(
      {
        id: projectData.id,
        data: {
          ...projectData,
          status: projectData.pendingStatus,
          distribution_id: payload.distribution_id,
          price: payload.price,
        },
      },
      {
        onSuccess: () => {
          setOpen(null)
          setProjectData(null)
        },
      }
    )
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
            title={t.delete_project_social}
            desc={t.delete_confirm_project_social}
            isLoading={isPending}
            confirmText={isPending ? t_general.deleting : t_general.delete}
          />
        </>
      )}

      {currentRow?.id && (
        <ProjectSocialExpenceMutateDrawer
          key={`project-social-expence-update-${currentRow.id}`}
          open={open === 'paid'}
          onOpenChange={() => {
            setOpen('paid')
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          currentRow={currentRow}
        />
      )}
      {projectData?.id && (
        <>
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
                  name: <strong>{projectData.name}</strong>,
                  status: (
                    <strong>
                      {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        t[projectData.pendingStatus]
                      }
                    </strong>
                  ),
                })}
              </>
            }
            isLoading={isUpdating}
            confirmText={isUpdating ? t.updating : t.confirm}
          />
          <ApproveDialog
            key='project-status-change-approve'
            open={open === 'status-approve'}
            onOpenChange={() => {
              setOpen('status-approve')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleApproveConfirm={handleStatusChangeApprove}
            className='max-w-md'
            title={t.status_change_title}
            desc={
              <>
                {interpolateWithComponents(t.status_change_confirm, {
                  name: <strong>{projectData.name}</strong>,
                  status: (
                    <strong>
                      {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        t[projectData.pendingStatus]
                      }
                    </strong>
                  ),
                })}
              </>
            }
            isLoading={isUpdating}
            confirmText={isUpdating ? t.updating : t.confirm}
            projectId={projectData.id}
          />
        </>
      )}
    </>
  )
}
