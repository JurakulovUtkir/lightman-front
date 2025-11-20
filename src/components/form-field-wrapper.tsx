import { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface FormFieldWrapperProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  placeholder?: string
  type?: 'text' | 'number' | 'textarea'
  suffix?: string
  formatting?: boolean
}

export function FormFieldWrapper<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  suffix,
  formatting = true,
}: FormFieldWrapperProps<TFieldValues>) {
  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) return ''
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const parseNumber = (value: string): number | undefined => {
    const cleaned = value.replace(/\s/g, '')
    if (cleaned === '') return undefined
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? undefined : parsed
  }

  const shouldFormat = type === 'number' && formatting

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-1'>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === 'textarea' ? (
              <Textarea
                placeholder={placeholder}
                className='min-h-40 resize-none'
                {...field}
                value={field.value || ''}
              />
            ) : (
              <div className='relative'>
                <Input
                  placeholder={placeholder}
                  type={type === 'number' ? 'text' : type}
                  className={
                    type === 'number'
                      ? 'appearance-none pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                      : ''
                  }
                  value={
                    shouldFormat
                      ? formatNumber(field.value as number)
                      : (field.value ?? '')
                  }
                  onChange={(e) => {
                    const raw = e.target.value

                    if (type === 'number') {
                      if (raw.trim() === '') {
                        // Use empty string instead of undefined to prevent reset
                        field.onChange('')
                        return
                      }

                      const parsedValue = shouldFormat
                        ? parseNumber(raw)
                        : parseFloat(raw)

                      // Only update if we have a valid number
                      if (parsedValue !== undefined && !isNaN(parsedValue)) {
                        field.onChange(parsedValue)
                      }
                    } else {
                      field.onChange(raw)
                    }
                  }}
                  onBlur={(e) => {
                    // On blur, if empty, set to undefined for validation
                    if (type === 'number' && e.target.value.trim() === '') {
                      field.onChange(undefined)
                    }
                    field.onBlur()
                  }}
                  name={field.name}
                  ref={field.ref}
                />
                {suffix && (
                  <span className='text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px]'>
                    {suffix}
                  </span>
                )}
              </div>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
