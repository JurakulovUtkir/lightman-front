import { HTMLAttributes, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UZ_PHONE_REGEX } from '@/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { PhoneInput } from '@/components/phone-inputs'
import { useSignUp } from '../../data/hooks'

type SignUpFormProps = HTMLAttributes<HTMLFormElement>

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const { mutate: signUp, isPending } = useSignUp()
  const { lang, general } = useLang()
  const t = general[lang].auth

  const formSchema = useMemo(
    () =>
      z
        .object({
          full_name: z.string().min(3, t.form_validation.full_name),
          phone_number: z
            .string()
            .min(1, t.form_validation.phone_number)
            .regex(UZ_PHONE_REGEX, t.form_validation.invalid_phone_number),
          password: z
            .string()
            .min(1, t.form_validation.password)
            .min(6, t.form_validation.invalid_password),
          confirmPassword: z
            .string()
            .min(1, t.form_validation.confirm_password),
          // !!! Need to add roles
          role: z.string().optional(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          error: t.form_validation.password_not_match,
          path: ['confirmPassword'],
        }),
    [t]
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      phone_number: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    signUp(data, {
      onSuccess: () => {
        toast.success(t.form_toaster.signed_up)
        form.reset()
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='full_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.form_labels.full_name}</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder={t.form_placeholders.enter_full_name}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone_number'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.form_labels.phone_number}</FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder={t.form_placeholders.enter_phone_number}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.form_labels.password}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.form_labels.confirm_password}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isPending}>
          {t.create_account}
        </Button>

        {/*    <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              {t.continue_with}
            </span>
          </div>
        </div>

      <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isPending}
          >
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isPending}
          >
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div> */}
      </form>
    </Form>
  )
}
