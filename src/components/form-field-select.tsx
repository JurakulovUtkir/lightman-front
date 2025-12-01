import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { useLang } from '@/hooks/useLang'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectOption {
  value: string
  label: string
}

interface FormFieldSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  placeholder?: string
  options: SelectOption[]
  disabled?: boolean
  emptyMessage?: string
}

export function FormFieldSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = '',
  options,
  disabled = false,
  emptyMessage = '',
}: FormFieldSelectProps<TFieldValues>) {
  const isEmpty = !options || options.length === 0
  const { lang, tForm } = useLang()
  const t = tForm[lang].form_labels
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-1'>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value} // Changed from defaultValue to value
            disabled={disabled || isEmpty}
          >
            <FormControl>
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={
                    isEmpty
                      ? emptyMessage
                        ? emptyMessage
                        : t.no_options
                      : placeholder
                        ? placeholder
                        : t.select_option
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isEmpty ? (
                <div className='text-muted-foreground py-6 text-center text-sm'>
                  {emptyMessage ? emptyMessage : t.no_options}
                </div>
              ) : (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
