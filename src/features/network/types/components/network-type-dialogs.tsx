import { useLang } from '@/hooks/useLang'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useNetworkTypeContext } from '../context'
import { useDeleteNetworkType } from '../data/hooks'
import { NetworkTypeMutateDrawer } from './network-type-mutate-drawer'

export function NetworkTypesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useNetworkTypeContext()
  const { mutate, isPending } = useDeleteNetworkType()
  const { lang, general, tNetwork, interpolate, interpolateWithComponents } =
    useLang()
  const t_general = general[lang].layout
  const t = tNetwork[lang]

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
      <NetworkTypeMutateDrawer
        key='network-type-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <NetworkTypeMutateDrawer
            key={`network-type-update-${currentRow.id}`}
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
            key='network-type-delete'
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
