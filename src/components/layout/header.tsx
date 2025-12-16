import React, { useMemo, useState } from 'react'
import { AllowedLangs, languages } from '@/constants'
import { cn } from '@/lib/utils'
import { setLang } from '@/context/lang'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '../ui/button'

const getInitialLang = (): string => {
  try {
    const storedLang = localStorage.getItem('lang')
    if (storedLang) {
      const parsed = JSON.parse(storedLang)
      return parsed || 'en'
    }
  } catch (_error) {
    // eslint-disable-next-line no-console
    console.log('Failed to load lang from storage!')
  }
  return 'en'
}

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true })

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  const [selectedLang, setSelectedLang] = useState(getInitialLang())

  const selectedLanguage = useMemo(
    () => languages.find((lang) => lang.value === selectedLang),
    [selectedLang]
  )

  const handleSwitchLang = (lang: string) => {
    setSelectedLang(lang)
    setLang(lang as AllowedLangs)
    localStorage.setItem('lang', JSON.stringify(lang))
  }

  return (
    <header
      className={cn(
        'bg-background flex h-16 items-center gap-3 p-4 sm:gap-4',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className
      )}
      {...props}
    >
      <SidebarTrigger variant='outline' className='scale-125 sm:scale-100' />
      <Separator orientation='vertical' className='h-6' />
      {['en', 'ru', 'uz'].map((item) => (
        <Button
          onClick={() => handleSwitchLang(item)}
          key={item}
          size='sm'
          variant={selectedLanguage?.value === item ? 'default' : 'outline'}
          className='capitalize'
        >
          {item}
        </Button>
      ))}
      {children}
    </header>
  )
}

Header.displayName = 'Header'
