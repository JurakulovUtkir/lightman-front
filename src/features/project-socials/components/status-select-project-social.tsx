import { getStatusColor, getStatusColorWithBg } from '@/lib/statusHelpers'
import { ProjectStatus } from '@/constants/enums'
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

// Define status flow for social projects
const projectSocialStatusFlow: Record<ProjectStatus, ProjectStatus[]> = {
  [ProjectStatus.REQUESTED]: [ProjectStatus.CANCELED, ProjectStatus.APPROVED],
  [ProjectStatus.REQUESTED_TO_DONE]: [
    ProjectStatus.CANCELED,
    ProjectStatus.DONE,
  ],
  [ProjectStatus.DRAFT]: [],
  [ProjectStatus.APPROVED]: [],
  [ProjectStatus.ACTIVE]: [],
  [ProjectStatus.ON_HOLD]: [],
  [ProjectStatus.DONE]: [],
  [ProjectStatus.CANCELED]: [],
}

const StatusSelectProjectSocial = ({ project }: { project: ProjectSchema }) => {
  const { lang, general } = useLang()
  const t = general[lang].columns
  const { setOpen, setProjectData } = useProjectSocialContext()

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

  // Get allowed next statuses based on current status
  const getAllowedStatuses = (
    currentStatus: ProjectStatus
  ): ProjectStatus[] => {
    return projectSocialStatusFlow[currentStatus] || []
  }

  const allowedStatuses = getAllowedStatuses(status)
  const availableOptions = statusOptions.filter((opt) =>
    allowedStatuses.includes(opt.value as ProjectStatus)
  )

  const handleStatusChange = (newStatus: string) => {
    const statusValue = newStatus as ProjectStatus

    // Set the pending status and open confirmation dialog
    setProjectData({
      ...project,
      pendingStatus: statusValue,
    })
    if (newStatus === 'approved') {
      setOpen('status-approve')
    } else {
      setOpen('status')
    }
  }

  const currentLabel =
    statusOptions.find((opt) => opt.value === status)?.label || status

  // If no allowed transitions, render Badge only
  if (allowedStatuses.length === 0) {
    return (
      <Badge className={`capitalize ${getStatusColorWithBg(status)}`}>
        {currentLabel}
      </Badge>
    )
  }

  // Render Select when there are allowed transitions
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
        {/* Show current status as disabled first option */}
        <SelectItem value={status} disabled>
          {currentLabel}
        </SelectItem>

        {/* Show available transition options */}
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

export default StatusSelectProjectSocial
