// import { useRef, useState } from 'react'
// import { Control, FieldPath, FieldValues } from 'react-hook-form'
// import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react'
// import { toast } from 'sonner'
// import { Button } from '@/components/ui/button'
// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { useDeleteFile, useUploadFile } from '../data/hooks'

// type FileType = 'document' | 'image'

// interface FileUploadFieldProps<TFieldValues extends FieldValues> {
//   control: Control<TFieldValues>
//   name: FieldPath<TFieldValues>
//   label: string
//   fileType: FileType
//   maxSize?: number // in MB
//   required?: boolean
// }

// export function FormFileUploadField<TFieldValues extends FieldValues>({
//   control,
//   name,
//   label,
//   fileType,
//   maxSize = 5,
//   required = false,
// }: FileUploadFieldProps<TFieldValues>) {
//   const [preview, setPreview] = useState<string | null>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const uploadFile = useUploadFile()
//   const deleteFile = useDeleteFile()

//   const acceptedTypes = {
//     document: {
//       'application/pdf': ['.pdf'],
//       'application/msword': ['.doc'],
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
//         ['.docx'],
//     },
//     image: {
//       'image/jpeg': ['.jpg', '.jpeg'],
//       'image/png': ['.png'],
//       'image/webp': ['.webp'],
//     },
//   }

//   const accept = acceptedTypes[fileType]

//   const handleFileSelect = async (
//     file: File | null,
//     onChange: (value: string) => void,
//     currentValue?: string
//   ) => {
//     if (!file) return

//     // Validate file size
//     if (file.size > maxSize * 1024 * 1024) {
//       toast.error(`File size must be less than ${maxSize}MB`)
//       // Reset file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''
//       }
//       return
//     }

//     try {
//       // Delete old file if exists
//       if (currentValue) {
//         await deleteFile.mutateAsync(currentValue)
//       }

//       // Create FormData and upload
//       const formData = new FormData()
//       formData.append('file', file, file.name)

//       const response = await uploadFile.mutateAsync(formData)

//       // Extract path from nested data structure
//       const filePath = response.data?.path

//       if (!filePath) {
//         throw new Error('No file path returned from server')
//       }

//       onChange(filePath)

//       // Set preview for images
//       if (fileType === 'image') {
//         const reader = new FileReader()
//         reader.onloadend = () => {
//           setPreview(reader.result as string)
//         }
//         reader.readAsDataURL(file)
//       }

//       toast.success('File uploaded successfully')
//     } catch (_error) {
//       toast.error('Failed to upload file')
//       //   console.error('Upload error:', error)
//       // Reset file input on error
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ''
//       }
//     }
//   }

//   const handleRemove = async (
//     onChange: (value: string) => void,
//     currentValue?: string
//   ) => {
//     if (currentValue) {
//       try {
//         await deleteFile.mutateAsync(currentValue)
//         onChange('')
//         setPreview(null)
//         toast.success('File removed successfully')
//       } catch (_error) {
//         toast.error('Failed to remove file')
//         // console.error('Delete error:', error)
//       }
//     }
//   }

//   const isLoading = uploadFile.isPending || deleteFile.isPending

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>
//             {label}
//             {required && <span className='text-destructive ml-1'>*</span>}
//           </FormLabel>
//           <FormControl>
//             <div className='space-y-2'>
//               {field.value ? (
//                 <div className='bg-muted/50 flex items-center gap-2 rounded-md border p-3'>
//                   {fileType === 'image' ? (
//                     preview ? (
//                       <img
//                         src={preview}
//                         alt='Preview'
//                         className='h-16 w-16 rounded object-cover'
//                       />
//                     ) : (
//                       <ImageIcon className='text-muted-foreground h-8 w-8' />
//                     )
//                   ) : (
//                     <FileText className='text-muted-foreground h-8 w-8' />
//                   )}
//                   <div className='min-w-0 flex-1'>
//                     <p className='truncate text-sm font-medium'>
//                       {field.value.split('/').pop()?.length >= 20
//                         ? field.value.split('/').pop().slice(0, 20) + '...'
//                         : field.value.split('/').pop()}
//                     </p>
//                     <p className='text-muted-foreground text-xs'>Uploaded</p>
//                   </div>
//                   <Button
//                     type='button'
//                     variant='ghost'
//                     size='sm'
//                     onClick={() => handleRemove(field.onChange, field.value)}
//                     disabled={isLoading}
//                   >
//                     <X className='h-4 w-4' />
//                   </Button>
//                 </div>
//               ) : (
//                 <div className='flex w-full items-center justify-center'>
//                   <label
//                     htmlFor={`file-upload-${name}`}
//                     className='hover:bg-muted/50 flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors'
//                   >
//                     {isLoading ? (
//                       <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
//                     ) : (
//                       <>
//                         <Upload className='text-muted-foreground mb-2 h-8 w-8' />
//                         <p className='text-muted-foreground text-sm'>
//                           Click to upload {fileType}
//                         </p>
//                         <p className='text-muted-foreground mt-1 text-xs'>
//                           Max size: {maxSize}MB
//                         </p>
//                       </>
//                     )}
//                     <input
//                       ref={fileInputRef}
//                       id={`file-upload-${name}`}
//                       type='file'
//                       className='hidden'
//                       accept={Object.values(accept).flat().join(',')}
//                       onChange={(e) =>
//                         handleFileSelect(
//                           e.target.files?.[0] || null,
//                           field.onChange,
//                           field.value
//                         )
//                       }
//                       disabled={isLoading}
//                     />
//                   </label>
//                 </div>
//               )}
//             </div>
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   )
// }
