import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import { useLang } from '@/hooks/useLang'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteUser } from '../data/hooks'
import { User } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const { lang, general, tUser, interpolate, interpolateWithComponents } =
    useLang()
  const t_general = general[lang]
  const t = tUser[lang]

  const [value, setValue] = useState('')
  const { mutate, isPending } = useDeleteUser()
  const handleDelete = () => {
    if (value.trim() !== currentRow.full_name) return
    mutate(currentRow.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.full_name}
      title={
        <span className='text-destructive'>
          <IconAlertTriangle
            className='stroke-destructive mr-1 inline-block'
            size={18}
          />{' '}
          {t.delete_user}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            {interpolate(t.delete_title, { name: currentRow.full_name })}
            <br />

            {interpolateWithComponents(t.delete_confirm, {
              role: (
                <strong className='uppercase'>
                  {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    t_general.columns.userRoleOptions[
                      currentRow.role.toUpperCase()
                    ]
                  }
                </strong>
              ),
            })}
            {t_general.layout.undone}
          </p>

          <Label className='my-2'>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t.enter_username}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>{t.warning}!</AlertTitle>
            <AlertDescription>{t.be_carefull}</AlertDescription>
          </Alert>
        </div>
      }
      confirmText={
        isPending ? t_general.layout.deleting : t_general.layout.delete
      }
      destructive
      isLoading={isPending}
    />
  )
}
