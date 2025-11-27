import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-context'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          // Success styling - green in both modes
          success:
            'group-[.toaster]:!bg-green-50 group-[.toaster]:!text-green-900 group-[.toaster]:!border-green-200 dark:group-[.toaster]:!bg-green-950 dark:group-[.toaster]:!text-green-100 dark:group-[.toaster]:!border-green-800',
          // Error styling - red in both modes
          error:
            'group-[.toaster]:!bg-red-50 group-[.toaster]:!text-red-900 group-[.toaster]:!border-red-200 dark:group-[.toaster]:!bg-red-950 dark:group-[.toaster]:!text-red-100 dark:group-[.toaster]:!border-red-800',
          // Optional: Warning styling - yellow/amber
          warning:
            'group-[.toaster]:!bg-amber-50 group-[.toaster]:!text-amber-900 group-[.toaster]:!border-amber-200 dark:group-[.toaster]:!bg-amber-950 dark:group-[.toaster]:!text-amber-100 dark:group-[.toaster]:!border-amber-800',
          // Optional: Info styling - blue
          info: 'group-[.toaster]:!bg-blue-50 group-[.toaster]:!text-blue-900 group-[.toaster]:!border-blue-200 dark:group-[.toaster]:!bg-blue-950 dark:group-[.toaster]:!text-blue-100 dark:group-[.toaster]:!border-blue-800',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
