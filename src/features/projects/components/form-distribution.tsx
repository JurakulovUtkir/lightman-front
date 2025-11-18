import { useMemo } from 'react'
import { Control, FieldPath, FieldValues, useWatch } from 'react-hook-form'
import { FormFieldSelect } from '@/components/form-field-select'
import { useDistributions } from '@/features/stakeholder/distributions/data/hooks'

interface DistributionDetail {
  id: string
  name: string
}

interface FormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  placeholder?: string
  detail?: DistributionDetail
}

export function FormDistribution<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = 'Select a distribution',
  detail,
}: FormFieldProps<TFieldValues>) {
  const { data: distributions, isLoading } = useDistributions()

  // Watch the current field value
  const fieldValue = useWatch({ control, name })

  const distributionOptions = useMemo(() => {
    let options =
      distributions?.data?.map((distribution) => ({
        value: distribution.id,
        label: distribution.name,
      })) || []

    // If we have a detail and it's not in the options, add it as a fallback
    if (detail && detail.id && fieldValue) {
      const existsInOptions = options.some((opt) => opt.value === detail.id)
      if (!existsInOptions) {
        options = [{ value: detail.id, label: detail.name }, ...options]
      }
    }

    return options
  }, [distributions, detail, fieldValue])

  return (
    <FormFieldSelect
      control={control}
      name={name}
      label={label}
      placeholder={placeholder}
      options={distributionOptions}
      disabled={isLoading}
    />
  )
}
