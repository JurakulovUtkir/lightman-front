import { Control, FieldPath, FieldValues } from 'react-hook-form'
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
  placeholder = 'Select an option',
  options,
  disabled = false,
  emptyMessage = 'No options available',
}: FormFieldSelectProps<TFieldValues>) {
  const isEmpty = !options || options.length === 0

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-1'>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled || isEmpty}
          >
            <FormControl>
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={isEmpty ? emptyMessage : placeholder}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isEmpty ? (
                <div className='text-muted-foreground py-6 text-center text-sm'>
                  {emptyMessage}
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
