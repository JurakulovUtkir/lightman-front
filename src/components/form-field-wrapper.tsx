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
}

export function FormFieldWrapper<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  suffix,
}: FormFieldWrapperProps<TFieldValues>) {
  // Format number with spaces for display
  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) return ''
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  // Parse formatted string back to number
  const parseNumber = (value: string): number | undefined => {
    const cleaned = value.replace(/\s/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? undefined : parsed
  }

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
                    type === 'number'
                      ? formatNumber(field.value as number)
                      : field.value || ''
                  }
                  onChange={(e) => {
                    if (type === 'number') {
                      const parsedValue = parseNumber(e.target.value)
                      field.onChange(parsedValue)
                    } else {
                      field.onChange(e.target.value)
                    }
                  }}
                  onBlur={field.onBlur}
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
