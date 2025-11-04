import { useMemo } from 'react'
import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { FormFieldSelect } from '@/components/form-field-select'
import { useDistributions } from '@/features/stakeholder/distributions/data/hooks'

interface FormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  placeholder?: string
}

export function FormDistribution<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select a distribution',
}: FormFieldProps<TFieldValues>) {
  const { data: distributions } = useDistributions()

  const distributionOptions = useMemo(() => {
    return (
      distributions?.data?.map((distribution) => ({
        value: distribution.id,
        label: distribution.name,
      })) || []
    )
  }, [distributions])

  return (
    <FormFieldSelect
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      options={distributionOptions}
    />
  )
}
