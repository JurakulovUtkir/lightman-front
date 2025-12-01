import { useState, useMemo } from 'react'
import { IconLanguage, IconCheck } from '@tabler/icons-react'
import { AllowedLangs, languages } from '@/constants'
import { setLang } from '@/context/lang'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

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

const LanguageSelector = () => {
  const [open, setOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState(getInitialLang())

  const selectedLanguage = useMemo(
    () => languages.find((lang) => lang.value === selectedLang),
    [selectedLang]
  )

  const handleSwitchLang = (lang: string) => {
    setSelectedLang(lang)
    setLang(lang as AllowedLangs)
    localStorage.setItem('lang', JSON.stringify(lang))
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className='min-w-[400px]'>
        <Button variant='outline' className='h-8 justify-start'>
          <IconLanguage className='mr-2 h-4 w-4' />
          {selectedLanguage?.label || 'Select language'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search language...' />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  key={language.value}
                  value={language.label}
                  onSelect={() =>
                    !language.disabled && handleSwitchLang(language.value)
                  }
                  className={`${language.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  disabled={language.disabled}
                >
                  <IconCheck
                    className={`mr-2 h-4 w-4 ${
                      selectedLang === language.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                  />
                  {language.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default LanguageSelector
