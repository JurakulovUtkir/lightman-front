import { useLang } from '@/hooks/useLang'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useLoanContext } from '../context'
import { useDeleteLoan } from '../data/hooks'
import { LoanMutateDrawer } from './loan-mutate-drawer'

export function LoanDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLoanContext()
  const { mutate, isPending } = useDeleteLoan()
  const { lang, general, tLoan, interpolate, interpolateWithComponents } =
    useLang()
  const t_general = general[lang].layout
  const t = tLoan[lang]

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
      <LoanMutateDrawer
        key='loan-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <LoanMutateDrawer
            key={`loan-update-${currentRow.id}`}
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
            key='loan-delete'
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
              amount: currentRow.given_amount,
            })}
            desc={
              <>
                {interpolateWithComponents(t.delete_confirm, {
                  amount: <strong>{currentRow.given_amount}</strong>,
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
