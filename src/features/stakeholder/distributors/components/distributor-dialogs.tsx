import { useLang } from '@/hooks/useLang'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDistributorContext } from '../context'
import { useDeleteDistributor } from '../data/hooks'
import { DistributorMutateDrawer } from './distributor-mutate-drawer'

export function DistributorDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDistributorContext()
  const { mutate, isPending } = useDeleteDistributor()
  const { lang, general, tDistributor } = useLang()
  const t_general = general[lang].layout
  const t = tDistributor[lang]

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
      <DistributorMutateDrawer
        key='distributor-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <DistributorMutateDrawer
            key={`distributor-update-${currentRow.id}`}
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
            key='distributor-delete'
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
            title={t.delete_title}
            desc={t.delete_confirm}
            isLoading={isPending}
            confirmText={isPending ? t_general.deleting : t_general.delete}
          />
        </>
      )}
    </>
  )
}
