import { useLang } from '@/hooks/useLang'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useNetworkCategoryContext } from '../context'
import { useDeleteNetworkCategory } from '../data/hooks'
import { NetworkCategoryMutateDrawer } from './network-category-mutate-drawer'

export function NetworkCategoryDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useNetworkCategoryContext()
  const { mutate, isPending } = useDeleteNetworkCategory()
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
      <NetworkCategoryMutateDrawer
        key='network-category-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <NetworkCategoryMutateDrawer
            key={`network-category-update-${currentRow.id}`}
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
            key='network-category-delete'
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
            title={interpolate(t.delete_title_category, {
              name: currentRow.name,
            })}
            desc={
              <>
                {interpolateWithComponents(t.delete_confirm_category, {
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
