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
  showZero?: boolean // New prop to control zero display
}

export function FormFieldWrapper<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  suffix,
  formatting = true,
  showZero = false, // Default is false (don't show zero)
}: FormFieldWrapperProps<TFieldValues>) {
  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return showZero ? '0' : ''
    }
    if (value === 0 && !showZero) return ''
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const parseNumber = (value: string): number | undefined => {
    const cleaned = value.replace(/\s/g, '')
    if (cleaned === '') return showZero ? 0 : undefined
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
                      : (field.value ??
                        (showZero && type === 'number' ? '0' : ''))
                  }
                  onChange={(e) => {
                    const raw = e.target.value

                    if (type === 'number') {
                      if (raw.trim() === '') {
                        // If showZero is true, set to 0, otherwise empty string
                        field.onChange(showZero ? 0 : '')
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
                    // On blur, handle empty values based on showZero
                    if (type === 'number' && e.target.value.trim() === '') {
                      field.onChange(showZero ? 0 : undefined)
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
