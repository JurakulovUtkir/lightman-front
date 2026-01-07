import { useRouter } from '@tanstack/react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'

interface BackButtonProps {
  className?: string
  label?: string
  fallbackPath?: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showIcon?: boolean
  iconClassName?: string
}

export const BackButton = ({
  className,
  label = '',
  fallbackPath = '/',
  variant = 'ghost',
  size = 'sm',
  showIcon = true,
  iconClassName,
}: BackButtonProps) => {
  const router = useRouter()
  const { lang, general } = useLang()
  const t = general[lang]
  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.history.back()
    } else if (fallbackPath) {
      // If no history, navigate to fallback path
      router.navigate({ to: fallbackPath })
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={cn('gap-2', className)}
    >
      {showIcon && <IconArrowLeft className={cn('h-4 w-4', iconClassName)} />}
      {label ? label : t.layout.go_back}
    </Button>
  )
}

// Pre-styled variants for common use cases
export const BackButtonMinimal = (
  props: Omit<BackButtonProps, 'variant' | 'size'>
) => <BackButton variant='ghost' size='sm' {...props} />

export const BackButtonOutline = (props: Omit<BackButtonProps, 'variant'>) => (
  <BackButton variant='outline' {...props} />
)

export const BackButtonPrimary = (props: Omit<BackButtonProps, 'variant'>) => (
  <BackButton variant='default' {...props} />
)

export const BackButtonIconOnly = (
  props: Omit<BackButtonProps, 'label' | 'size'>
) => <BackButton label='' size='icon' {...props} />
