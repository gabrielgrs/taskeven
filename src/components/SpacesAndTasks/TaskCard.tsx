import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Trash } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { cn } from '~/utils/shadcn'

type Props = {
  completed: boolean
  onCompleteTask: (completed: boolean) => void
  onRemoveTask: () => void
  title: string
  reminderDate: Date
}

export default function TaskCard({ completed, title, reminderDate, onRemoveTask, onCompleteTask }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, translateX: '-100%' }}
      animate={{ opacity: 1, translateX: '0%' }}
      exit={{ opacity: 0, translateX: '100%' }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col py-3 duration-500', 'border-b-[1px] border-foreground/10')}
    >
      <div className="flex gap-3 justify-between items-center">
        <div className="flex gap-2 items-center">
          <Checkbox
            aria-label="Task checkbox"
            checked={completed}
            onCheckedChange={(status) => onCompleteTask(Boolean(status))}
            className="h-[18px] w-[18px]"
          />
          <label
            data-completed={completed}
            className="data-[completed=true]:line-through text-lg data-[completed=true]:opacity-60 duration-500"
          >
            {title}
          </label>
          {reminderDate && (
            <span className="text-sm text-foreground/50">{format(new Date(reminderDate), 'MM/dd/yyyy')}</span>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <Button aria-label="Confirm removal" variant="ghost" size="icon" onClick={() => onRemoveTask()}>
            <Trash size={16} className="opacity-60" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
