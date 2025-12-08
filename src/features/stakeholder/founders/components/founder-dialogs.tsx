import { useLang } from '@/hooks/useLang'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useFounderContext } from '../context'
import { useDeleteFounder } from '../data/hooks'
import { FounderMutateDrawer } from './founder-mutate-drawer'

export function FounderDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useFounderContext()
  const { mutate, isPending } = useDeleteFounder()
  const { lang, general, tFounder, interpolate, interpolateWithComponents } =
    useLang()
  const t_general = general[lang].layout
  const t = tFounder[lang]

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
