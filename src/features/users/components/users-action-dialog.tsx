import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getUserRoleOptions, UZ_PHONE_REGEX } from '@/constants'
import { toNumber } from '@/lib/helpers'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { FormFieldWrapper } from '@/components/form-field-wrapper'
import { PasswordInput } from '@/components/password-input'
import { PhoneInput } from '@/components/phone-inputs'
import { SelectDropdown } from '@/components/select-dropdown'
import { useCreateUser, useUpdateUser } from '../data/hooks'
import { User } from '../data/schema'
import { UsersComboboxCompany } from './users-combobox-company'

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isUpdate = !!currentRow
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const { lang, general, tForm, tUser } = useLang()
  const t_general = general[lang].columns
  const userRoleOptions = getUserRoleOptions(t_general)
  const t = tForm[lang]

  const formSchema = useMemo(
    () =>
      z
        .object({
          full_name: z
            .string({
              error: t.form_validations.enter_name,
            })
            .min(3, {
              error: t.form_validations.required_field,
            }),
          phone_number: z
            .string()
            .min(1, t.form_validations.enter_phone_number)
            .regex(UZ_PHONE_REGEX, t.form_validations.invalid_phone_number),
          role: z.union(
            [
              z.literal('admin', {
                error: t.form_validations.required_field,
              }),
              z.literal('user'),
              z.literal('operator'),
              z.literal('employee'),
              z.literal('accountant'),
              z.literal('account_manager'),
            ],
            {
              error: t.form_validations.required_field,
            }
          ),
          password: z
            .string()
            .transform((pwd) => pwd.trim())
            .optional(),
          confirmPassword: z
            .string()
            .transform((pwd) => pwd.trim())
            .optional(),
          is_verified: z.boolean().optional(),
          is_our_employee: z.boolean().optional(),
          isUpdate: z.boolean().optional(),
          salary: z
            .number()
            .min(0, t.form_validations.invalid_value)
            .optional()
            .nullable(),
          employee_company_id: z
            .string()
            .min(1, t.form_validations.required_field),
        })
        .refine(
          ({ password, isUpdate }) => {
            // If updating and password is empty, skip validation
            if (isUpdate && !password) return true
            // If creating or password is provided, require it
            return password && password.length > 0
          },
          {
            message: t.form_validations.password,
            path: ['password'],
          }
        )
        .refine(
          ({ password, isUpdate }) => {
            if (isUpdate && !password) return true
            return password && password.length >= 6
          },
          {
            message: t.form_validations.password_length,
            path: ['password'],
          }
        )
        .refine(
          ({ password, isUpdate }) => {
            if (isUpdate && !password) return true
            return password && /[a-z]/.test(password)
          },
          {
            message: t.form_validations.password_lowercase,
            path: ['password'],
          }
        )
        .refine(
          ({ password, isUpdate }) => {
            if (isUpdate && !password) return true
            return password && /\d/.test(password)
          },
          {
            message: t.form_validations.password_number,
            path: ['password'],
          }
        )
        .refine(
          ({ password, confirmPassword, isUpdate }) => {
            if (isUpdate && !password) return true
            return password === confirmPassword
          },
          {
            message: t.form_validations.password_not_match,
            path: ['confirmPassword'],
          }
        ),
    [t]
  )

  type UserForm = z.infer<typeof formSchema>

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: currentRow?.full_name || '',
      phone_number: currentRow?.phone_number || '+998',
      password: '',
      confirmPassword: '',
      role: currentRow?.role || undefined,
      is_verified: currentRow?.is_verified ?? true,
      is_our_employee: currentRow?.is_our_employee ?? false,
      isUpdate,
      salary: toNumber(currentRow?.salary ?? 0),
      employee_company_id: currentRow?.employee_company.id || '',
    },
  })

  // Reset form when currentRow changes (when opening edit dialog)
  useEffect(() => {
    if (open && currentRow) {
      form.reset({
        full_name: currentRow.full_name || '',
        phone_number: currentRow.phone_number || '+998',
        password: '',
        confirmPassword: '',
        role: currentRow.role || undefined,
        is_verified: currentRow.is_verified ?? true,
        is_our_employee: currentRow.is_our_employee ?? false,
        isUpdate: true,
        salary: toNumber(currentRow.salary ?? 0),
        employee_company_id: currentRow.employee_company.id || '',
      })
    } else if (open && !currentRow) {
      form.reset({
        full_name: '',
        phone_number: '+998',
        password: '',
        confirmPassword: '',
        role: undefined,
        is_verified: true,
        is_our_employee: false,
        isUpdate: false,
        salary: 0,
        employee_company_id: '',
      })
    }
  }, [open, currentRow, form])

  // Watch is_our_employee field to conditionally show salary
  const isOurEmployee = form.watch('is_our_employee')

  const onSubmit = (data: UserForm) => {
    // Remove password fields if updating and password is empty
    const submitData = { ...data }
    if (isUpdate && !submitData.password) {
      delete submitData.password
      delete submitData.confirmPassword
    }
    delete submitData.isUpdate

    if (isUpdate) {
      updateUser.mutate(
        {
          id: currentRow.id,
          data: submitData,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createUser.mutate(submitData, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='max-h-[90vh] max-w-full overflow-y-auto sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>
            {isUpdate ? tUser[lang].update_user : tUser[lang].create_user}
          </DialogTitle>
          <DialogDescription>
            {isUpdate ? tUser[lang].update_desc : tUser[lang].create_desc}
            {tUser[lang].click_save}
          </DialogDescription>
        </DialogHeader>
        <div className='w-full py-1 pr-2 sm:pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <div className='grid sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='is_verified'
                  render={({ field }) => (
                    <FormItem className='flex items-center'>
                      <FormLabel>{t.form_labels.is_verified}</FormLabel>
                      <FormControl>
                        <Switch
                          defaultChecked
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='is_our_employee'
                  render={({ field }) => (
                    <FormItem className='flex items-center'>
                      <FormLabel>{t.form_labels.our_employee}</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            // Clear employee_company_id when toggling
                            form.setValue('employee_company_id', '')
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='full_name'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-2 sm:grid sm:grid-cols-6 sm:items-center sm:space-y-0 sm:gap-x-4 sm:gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-right'>
                      {t.form_labels.full_name}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t.form_placeholders.enter_name}
                        className='sm:col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone_number'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-2 sm:grid sm:grid-cols-6 sm:items-center sm:space-y-0 sm:gap-x-4 sm:gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-right'>
                      {t.form_labels.phone_number}
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        className='sm:col-span-4'
                        autoComplete='new-password'
                      />
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-2 sm:grid sm:grid-cols-6 sm:items-center sm:space-y-0 sm:gap-x-4 sm:gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-right'>
                      {t.form_labels.role}
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder={t.form_placeholders.select_role}
                      className='sm:col-span-4'
                      items={userRoleOptions}
                    />
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              <UsersComboboxCompany
                control={form.control}
                name='employee_company_id'
                label={t.form_labels.employee_company}
                detail={currentRow?.employee_company ?? undefined}
                filterOurCompany={isOurEmployee ? true : false}
              />
              {isOurEmployee && (
                <div className='flex flex-col items-center space-y-2 sm:grid sm:grid-cols-6 sm:space-y-0 sm:gap-x-4 sm:gap-y-1'>
                  <div className='sm:col-span-2 sm:pt-2 sm:text-right'>
                    <FormLabel>{t.form_labels.salary}</FormLabel>
                  </div>
                  <div className='sm:col-span-4'>
                    <FormFieldWrapper
                      control={form.control}
                      name='salary'
                      label=''
                      placeholder={t.form_placeholders.enter_salary}
                      type='number'
                      suffix={t.form_placeholders.uzs}
                      formatting={true}
                    />
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-2 sm:grid sm:grid-cols-6 sm:items-center sm:space-y-0 sm:gap-x-4 sm:gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-right'>
                      {t.form_labels.password}
                    </FormLabel>
                    <div className='space-y-1 sm:col-span-4'>
                      <FormControl>
                        <PasswordInput
                          placeholder={
                            isUpdate
                              ? t.form_placeholders.leave_blank
                              : 'e.g., S3cur3P@ssw0rd'
                          }
                          autoComplete='new-password'
                          {...field}
                        />
                      </FormControl>
                      {isUpdate && (
                        <p className='text-muted-foreground text-xs'>
                          {t.form_placeholders.leave_blank}
                        </p>
                      )}
                    </div>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='flex flex-col space-y-2 sm:grid sm:grid-cols-6 sm:items-center sm:space-y-0 sm:gap-x-4 sm:gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-right'>
                      {t.form_labels.confirm_password}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder={
                          isUpdate
                            ? t.form_placeholders.leave_blank
                            : 'e.g., S3cur3P@ssw0rd'
                        }
                        className='sm:col-span-4'
                        autoComplete='new-password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className='mt-4'>
          <Button
            disabled={isUpdate ? updateUser.isPending : createUser.isPending}
            form='user-form'
            type='submit'
            className='w-full sm:w-auto'
          >
            {(isUpdate ? updateUser.isPending : createUser.isPending)
              ? t.buttons.loading
              : t.buttons.save_changes}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
