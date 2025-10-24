// /src/components/phone-input.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export type PhoneInputProps = React.InputHTMLAttributes<HTMLInputElement>

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value

      // Always ensure it starts with +998
      if (!inputValue.startsWith('+998')) {
        inputValue = '+998'
      }

      // Remove any non-digit characters except the leading +
      inputValue = '+998' + inputValue.slice(4).replace(/\D/g, '')

      // Limit to +998 + 9 digits (total 13 characters)
      if (inputValue.length > 13) {
        inputValue = inputValue.slice(0, 13)
      }

      // Create a new event with the formatted value
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: inputValue,
        },
      }

      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
    }

    return (
      <Input
        type='tel'
        value={value}
        onChange={handleChange}
        maxLength={13}
        placeholder='+998991853703'
        className={cn(className)}
        ref={ref}
        {...props}
      />
    )
  }
)
PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
