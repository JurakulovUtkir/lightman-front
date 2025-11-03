import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UZ_PHONE_REGEX } from '@/constants'
import { toast } from 'sonner'
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
import { PasswordInput } from '@/components/password-input'
import { PhoneInput } from '@/components/phone-inputs'
import { SelectDropdown } from '@/components/select-dropdown'
import { userTypes } from '../data/data'
import { useCreateUser, useUpdateUser } from '../data/hooks'
import { User } from '../data/schema'

const formSchema = z
  .object({
    full_name: z.string().min(3, 'Please enter full name'),
    phone_number: z
      .string()
      .min(1, 'Please enter your phone number')
      .regex(UZ_PHONE_REGEX, 'Please enter valid phone number'),
    role: z
      .union([
        z.literal('user'),
        z.literal('superadmin'),
        z.literal('admin'),
        z.literal('manager'),
      ])
      .optional(),

    password: z
      .string()
      .transform((pwd) => pwd.trim())
      .optional(),
    confirmPassword: z
      .string()
      .transform((pwd) => pwd.trim())
      .optional(),
    is_verified: z.boolean().optional(),
    isUpdate: z.boolean().optional(),
  })
  .refine(
    ({ password, isUpdate }) => {
      // If updating and password is empty, skip validation
      if (isUpdate && !password) return true
      // If creating or password is provided, require it
      return password && password.length > 0
    },
    {
      error: 'Password is required.',
      path: ['password'],
    }
  )
  .refine(
    ({ password, isUpdate }) => {
      if (isUpdate && !password) return true
      return password && password.length >= 6
    },
    {
      error: 'Password must be at least 6 characters long.',
      path: ['password'],
    }
  )
  .refine(
    ({ password, isUpdate }) => {
      if (isUpdate && !password) return true
      return password && /[a-z]/.test(password)
    },
    {
      error: 'Password must contain at least one lowercase letter.',
      path: ['password'],
    }
  )
  .refine(
    ({ password, isUpdate }) => {
      if (isUpdate && !password) return true
      return password && /\d/.test(password)
    },
    {
      error: 'Password must contain at least one number.',
      path: ['password'],
    }
  )
  .refine(
    ({ password, confirmPassword, isUpdate }) => {
      if (isUpdate && !password) return true
      return password === confirmPassword
    },
    {
      error: "Passwords don't match.",
      path: ['confirmPassword'],
    }
  )

type UserForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isUpdate = !!currentRow
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: currentRow?.full_name || '',
      phone_number: currentRow?.phone_number || '+998',
      password: '',
      confirmPassword: '',
      role: currentRow?.role || 'user',
      is_verified: currentRow?.is_verified,
      isUpdate,
    },
  })

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
            toast.success('User updated successfully')
            onOpenChange(false)
            form.reset()
          },
        }
      )
    } else {
      createUser.mutate(submitData, {
        onSuccess: () => {
          toast.success('Account created successfully')
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
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isUpdate ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isUpdate ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='is_verified'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Is verified
                    </FormLabel>
                    <FormControl>
                      <Switch
                        defaultChecked
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='full_name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter full name'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone_number'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        {...field}
                        className='col-span-4'
                        autoComplete='new-password'
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Role
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a role'
                      className='col-span-4'
                      items={userTypes.map(({ label, value, disabled }) => ({
                        label,
                        value,
                        disabled,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Password
                    </FormLabel>
                    <div className='col-span-4 space-y-1'>
                      <FormControl>
                        <PasswordInput
                          placeholder={
                            isUpdate
                              ? 'Leave blank to keep current'
                              : 'e.g., S3cur3P@ssw0rd'
                          }
                          autoComplete='new-password'
                          {...field}
                        />
                      </FormControl>
                      {isUpdate && (
                        <p className='text-muted-foreground text-xs'>
                          Leave blank to keep current password
                        </p>
                      )}
                    </div>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder={
                          isUpdate
                            ? 'Leave blank to keep current'
                            : 'e.g., S3cur3P@ssw0rd'
                        }
                        className='col-span-4'
                        autoComplete='new-password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
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
          >
            {(isUpdate ? updateUser.isPending : createUser.isPending)
              ? 'Loading...'
              : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
