import { HTMLAttributes, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
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
import { PasswordInput } from '@/components/password-input'
import { PhoneInput } from '@/components/phone-inputs'
import { useSignIn } from '../../data/hooks'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { mutate: signIn, isPending } = useSignIn()
  const { lang, general } = useLang()
  const t = general[lang].auth

  const formSchema = useMemo(
    () =>
      z.object({
        phone_number: z
          .string()
          .min(1, t.form_validation.phone_number)
          .regex(UZ_PHONE_REGEX, t.form_validation.invalid_phone_number),
        password: z
          .string()
          .min(1, t.form_validation.password)
          .min(6, t.form_validation.invalid_password),
        is_application: z.boolean().optional(),
      }),
    [t]
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // phone_number: '+998',
      phone_number: '+998991853703',
      password: '123456',
      is_application: true,
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    signIn(data, {
      onSuccess: () => {
        toast.success(t.form_toaster.signed_in)
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
            <FormItem className='relative'>
              <FormLabel>{t.form_labels.password}</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                disabled
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                {t.form_labels.forgot_password}
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isPending}>
          {isPending ? t.signing_in : t.sign_in}
        </Button>

        {/*  <div className='relative my-2'>
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
          <Button variant='outline' type='button' disabled={isPending}>
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isPending}>
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div> */}
      </form>
    </Form>
  )
}
