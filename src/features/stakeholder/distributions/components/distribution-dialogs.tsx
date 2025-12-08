import { useLang } from '@/hooks/useLang'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDistributionContext } from '../context'
import { useDeleteDistribution } from '../data/hooks'
import { DistributionMutateDrawer } from './distribution-mutate-drawer'

export function DistributionDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDistributionContext()
  const { mutate, isPending } = useDeleteDistribution()
  const {
    lang,
    general,
    tDistribution,
    interpolate,
    interpolateWithComponents,
  } = useLang()
  const t_general = general[lang].layout
  const t = tDistribution[lang]

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
      <DistributionMutateDrawer
        key='distribution-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <DistributionMutateDrawer
            key={`distribution-update-${currentRow.id}`}
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
            key='distribution-delete'
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
            isLoading={isPending}
            confirmText={isPending ? t_general.deleting : t_general.delete}
          />
        </>
      )}
    </>
  )
}
