import { useNavigate } from '@tanstack/react-router'
import {
  IconEdit,
  IconShare3,
  IconCircleCheck,
  IconCircleX,
  IconFileDescription,
} from '@tabler/icons-react'
import { useLang } from '@/hooks/useLang'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useDistributionContext } from '../context'
import { DistributionSchema } from '../data/schema'

const DistributionCards = ({
  data,
}: {
  data: DistributionSchema[] | undefined
}) => {
  const { lang, general } = useLang()
  const t = general[lang].columns
  const navigate = useNavigate()
  const { setOpen, setCurrentRow } = useDistributionContext()

  const handleEdit = (e: React.MouseEvent, payload: DistributionSchema) => {
    e.stopPropagation()
    setCurrentRow(payload)
    setOpen('update')
  }

  const handleCardClick = (id: string) => {
    navigate({
      to: '/stakeholder/distributors/$id',
      params: { id },
    })
  }

  return data?.length ? (
    <TooltipProvider>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
        {data.map((item) => (
          <Card
            key={item.id}
            className='group hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg'
            onClick={() => handleCardClick(item.id)}
          >
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <IconShare3 className='text-primary h-5 w-5' />
                  <Badge
                    variant={item.is_active ? 'success' : 'destructive'}
                    className='gap-1'
                  >
                    {item.is_active ? (
                      <>
                        <IconCircleCheck className='h-3 w-3' />
                        {t.active}
                      </>
                    ) : (
                      <>
                        <IconCircleX className='h-3 w-3' />
                        {t.inactive}
                      </>
                    )}
                  </Badge>
                </div>
                <Button
                  onClick={(e) => handleEdit(e, item)}
                  size='icon'
                  variant='ghost'
                  className='h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100'
                >
                  <IconEdit className='h-4 w-4' />
                </Button>
              </div>

              <CardTitle className='line-clamp-2 pt-2 text-base leading-tight'>
                {item.name}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {item.description ? (
                item.description.length > 80 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <CardDescription className='line-clamp-3 cursor-help text-sm'>
                        <span className='flex items-start gap-1.5'>
                          <IconFileDescription className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
                          <span>{item.description}</span>
                        </span>
                      </CardDescription>
                    </TooltipTrigger>
                    <TooltipContent
                      side='bottom'
                      className='max-h-[200px] max-w-[350px] overflow-auto md:max-w-[500px]'
                    >
                      <p className='whitespace-pre-wrap'>{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <CardDescription className='text-sm'>
                    <span className='flex items-start gap-1.5'>
                      <IconFileDescription className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
                      <span>{item.description}</span>
                    </span>
                  </CardDescription>
                )
              ) : (
                <CardDescription className='text-muted-foreground/60 text-sm italic'>
                  <span className='flex items-start gap-1.5'>
                    <IconFileDescription className='mt-0.5 h-4 w-4 shrink-0' />
                    <span>{t.no_description}</span>
                  </span>
                </CardDescription>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  ) : (
    <Card className='border-dashed'>
      <CardContent className='flex flex-col items-center justify-center py-12'>
        <IconShare3 className='text-muted-foreground mb-4 h-12 w-12' />
        <CardTitle className='mb-2 text-xl'>{t.no_distribution}</CardTitle>
        <p className='text-muted-foreground text-sm'>{t.create_distribution}</p>
      </CardContent>
    </Card>
  )
}

export default DistributionCards
