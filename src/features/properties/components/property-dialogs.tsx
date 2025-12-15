import { useLang } from '@/hooks/useLang'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { usePropertyContext } from '../context'
import { useDeleteProperty } from '../data/hooks'
import { PropertyMutateDrawer } from './property-mutate-drawer'

export function PropertyDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePropertyContext()
  const { mutate, isPending } = useDeleteProperty()
  const { lang, general, tProperty, interpolate, interpolateWithComponents } =
    useLang()
  const t_general = general[lang].layout
  const t = tProperty[lang]

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
      <PropertyMutateDrawer
        key='property-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <PropertyMutateDrawer
            key={`property-update-${currentRow.id}`}
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
            key='property-delete'
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
