import { useRef, useState, useEffect } from 'react'
import { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Upload, X, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useLang } from '@/hooks/useLang'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useDeleteFile, useUploadFile } from '../data/hooks'

interface FileUploadFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  maxSize?: number
  required?: boolean
  isUpdateMode?: boolean
  onPendingDelete?: (filePath: string | null) => void
}

export function FormFileUploadField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  maxSize = 5,
  required = false,
  isUpdateMode = false,
  onPendingDelete,
}: FileUploadFieldProps<TFieldValues>) {
  const { lang, tForm, interpolate } = useLang()
  const t = tForm[lang]
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'document' | 'image' | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const uploadFile = useUploadFile()
  const deleteFile = useDeleteFile()

  const acceptedTypes = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      '.docx',
    ],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
  }

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/')
  }

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!isFocused || !containerRef.current) return

      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        // Handle image paste
        if (item.type.startsWith('image/')) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file && containerRef.current) {
            // Trigger the file input change event
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            if (fileInputRef.current) {
              fileInputRef.current.files = dataTransfer.files
              fileInputRef.current.dispatchEvent(
                new Event('change', { bubbles: true })
              )
            }
          }
          return
        }

        // Handle file paste (some apps support this)
        if (item.kind === 'file') {
          e.preventDefault()
          const file = item.getAsFile()
          if (file && containerRef.current) {
            // Trigger the file input change event
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            if (fileInputRef.current) {
              fileInputRef.current.files = dataTransfer.files
              fileInputRef.current.dispatchEvent(
                new Event('change', { bubbles: true })
              )
            }
          }
          return
        }
      }
    }

    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
      setPreview(null)
      setFileType(null)
    }
  }, [isFocused])

  const handleFileSelect = async (
    file: File | null,
    onChange: (value: string) => void,
    currentValue?: string
  ) => {
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(
        interpolate(t.toast.file_size_error, {
          size: maxSize,
        })
      )
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    try {
      // IMPORTANT: In update mode, mark current file for deletion BEFORE uploading new one
      if (isUpdateMode && currentValue) {
        // Notify parent to mark this file for deletion
        if (onPendingDelete) {
          onPendingDelete(currentValue)
        }
      }

      // In create mode: delete old file immediately
      if (!isUpdateMode && currentValue) {
        await deleteFile.mutateAsync(currentValue)
      }

      const isImage = isImageFile(file)
      setFileType(isImage ? 'image' : 'document')

      // Upload new file
      const formData = new FormData()
      formData.append('file', file, file.name)

      const response = await uploadFile.mutateAsync(formData)
      const filePath = response.data?.path

      if (!filePath) {
        throw new Error(t.toast.no_file_returned)
      }

      onChange(filePath)

      // Set preview for images
      if (isImage) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }

      toast.success(t.toast.file_uploaded)
    } catch (_error) {
      toast.error(t.toast.failed_to_upload)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async (
    onChange: (value: string) => void,
    currentValue?: string
  ) => {
    if (currentValue) {
      if (isUpdateMode) {
        // In update mode: mark for deletion via parent callback
        if (onPendingDelete) {
          onPendingDelete(currentValue)
        }
        onChange('')
        setPreview(null)
        setFileType(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        // In create mode: delete immediately
        try {
          await deleteFile.mutateAsync(currentValue)
          onChange('')
          setPreview(null)
          setFileType(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          toast.success(t.toast.file_removed)
        } catch (_error) {
          toast.error(t.toast.failed_to_remove)
        }
      }
    }
  }

  const isLoading = uploadFile.isPending || deleteFile.isPending

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className='text-destructive ml-1'>*</span>}
          </FormLabel>
          <FormControl>
            <div
              ref={containerRef}
              className='space-y-2'
              onMouseEnter={() => setIsFocused(true)}
              onMouseLeave={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              tabIndex={0}
            >
              {field.value ? (
                <div className='bg-muted/50 flex items-center gap-2 rounded-md border p-3'>
                  {fileType === 'image' ? (
                    preview ? (
                      <img
                        src={preview}
                        alt='Preview'
                        className='h-16 w-16 rounded object-cover'
                      />
                    ) : (
                      <FileText className='text-muted-foreground h-8 w-8' />
                    )
                  ) : (
                    <FileText className='text-muted-foreground h-8 w-8' />
                  )}
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>
                      {field.value.split('/').pop()?.length >= 20
                        ? field.value.split('/').pop().slice(0, 20) + '...'
                        : field.value.split('/').pop()}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {t.form_labels.uploaded}
                    </p>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => handleRemove(field.onChange, field.value)}
                    disabled={isLoading}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ) : (
                <div className='flex w-full items-center justify-center'>
                  <label
                    htmlFor={`file-upload-${name}`}
                    className={`hover:bg-muted/50 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                      isFocused ? 'border-primary bg-muted/30' : ''
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
                    ) : (
                      <>
                        <Upload className='text-muted-foreground mb-2 h-8 w-8' />
                        <p className='text-muted-foreground text-center text-sm'>
                          {t.form_labels.click_to_upload}
                        </p>
                        <p className='text-muted-foreground mt-1 text-xs'>
                          {interpolate(t.form_labels.file_size, {
                            size: maxSize,
                          })}
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      id={`file-upload-${name}`}
                      type='file'
                      className='hidden'
                      accept={Object.values(acceptedTypes).flat().join(',')}
                      onChange={(e) =>
                        handleFileSelect(
                          e.target.files?.[0] || null,
                          field.onChange,
                          field.value
                        )
                      }
                      disabled={isLoading}
                    />
                  </label>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
