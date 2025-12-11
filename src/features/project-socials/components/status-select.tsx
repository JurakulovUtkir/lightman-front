import { ProjectStatus } from '@/constants'
import { getStatusColor, getStatusColorWithBg } from '@/lib/statusHelpers'
import { useLang } from '@/hooks/useLang'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ProjectSchema } from '@/features/projects/data/schema'
import { useProjectSocialContext } from '../context'

const StatusSelect = ({ project }: { project: ProjectSchema }) => {
  const { lang, general } = useLang()
  const t = general[lang].columns
  const { setOpen, setProjectData } = useProjectSocialContext()

  // Remove local state - use project.status directly
  const status = project.status as ProjectStatus

  const statusOptions = [
    { value: ProjectStatus.DRAFT, label: t.statusOptions.draft },
    { value: ProjectStatus.ACTIVE, label: t.statusOptions.active },
    { value: ProjectStatus.ON_HOLD, label: t.statusOptions.on_hold },
    { value: ProjectStatus.APPROVED, label: t.statusOptions.approved },
    { value: ProjectStatus.REQUESTED, label: t.statusOptions.requested },
    { value: ProjectStatus.DONE, label: t.statusOptions.done },
    { value: ProjectStatus.CANCELED, label: t.statusOptions.canceled },
    {
      value: ProjectStatus.REQUESTED_TO_DONE,
      label: t.statusOptions.requested_to_done,
    },
  ]

  // Filter options based on current status
  const availableOptions = statusOptions.filter(
    (opt) =>
      opt.value === ProjectStatus.REQUESTED ||
      opt.value === ProjectStatus.REQUESTED_TO_DONE
  )

  const handleStatusChange = (newStatus: string) => {
    const statusValue = newStatus as ProjectStatus

    // Set the pending status and open confirmation dialog
    setProjectData({
      ...project,
      pendingStatus: statusValue,
    })
    setOpen('status')
  }

  const currentLabel =
    statusOptions.find((opt) => opt.value === status)?.label || status

  // Render Badge if status is not draft
  if (status !== ProjectStatus.DRAFT) {
    return (
      <Badge className={`capitalize ${getStatusColorWithBg(status)}`}>
        {currentLabel}
      </Badge>
    )
  }

  // Render Select only when status is draft
  return (
    <Select value={status} onValueChange={handleStatusChange}>
      <SelectTrigger
        className={`w-auto border shadow-none focus:ring-0 ${getStatusColor(status)}`}
      >
        <SelectValue>
          <div className='inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium capitalize'>
            {currentLabel}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div
              className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusColor(option.value)}`}
            >
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default StatusSelect
