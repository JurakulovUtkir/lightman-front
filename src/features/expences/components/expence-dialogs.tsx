import { useLang } from '@/hooks/useLang'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useExpenceContext } from '../context'
import { useDeleteExpence } from '../data/hooks'
import { ExpenceMutateDrawer } from './expence-mutate-drawer'

export function ExpenceDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useExpenceContext()
  const { mutate, isPending } = useDeleteExpence()
  const { lang, general, tExpence, interpolate, interpolateWithComponents } =
    useLang()
  const t_general = general[lang].layout
  const t = tExpence[lang]

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
      <ExpenceMutateDrawer
        key='expence-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <ExpenceMutateDrawer
            key={`expence-update-${currentRow.id}`}
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
            key='expence-delete'
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
              amount: currentRow.amount,
            })}
            desc={
              <>
                {interpolateWithComponents(t.delete_confirm, {
                  amount: <strong>{currentRow.amount}</strong>,
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
