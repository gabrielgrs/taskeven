import { useState } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Pencil, Trash, Undo } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Permission } from '~/types/shared'
import { cn } from '~/utils/shadcn'

type Props = {
  completed: boolean
  onCompleteTask: (completed: boolean) => void
  onRemoveTask: () => void
  annotations?: string
  title: string
  reminderDate?: Date
  permission: Permission
  onSelectToEdit: () => void
}

export default function TaskCard({
  completed,
  title,
  reminderDate,
  annotations = '',
  onRemoveTask,
  onCompleteTask,
  permission,
  onSelectToEdit,
}: Props) {
  const [isSelectedToRemove, setIsSelectedToRemove] = useState(false)

  const hasPermissionToEdit = permission === 'EDIT'

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
          {permission === 'EDIT' && (
            <Checkbox
              aria-label="Task checkbox"
              checked={completed}
              onCheckedChange={(status) => onCompleteTask(Boolean(status))}
              className="h-[18px] w-[18px]"
            />
          )}
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

        {hasPermissionToEdit && (
          <div className="flex gap-2 items-center">
            {isSelectedToRemove ? (
              <>
                <Button
                  aria-label="Cancel removal"
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary-foreground"
                  onClick={() => setIsSelectedToRemove(false)}
                >
                  <Undo size={16} className="opacity-60" />
                </Button>
                <Button aria-label="Confirm removal" variant="destructive" size="icon" onClick={() => onRemoveTask()}>
                  <Trash size={16} className="opacity-60" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  aria-label="Edit task"
                  variant="ghost"
                  size="icon"
                  onClick={() => onSelectToEdit()}
                  className="hover:text-primary-foreground"
                >
                  <Pencil size={16} className="opacity-60" />
                </Button>
                <Button
                  aria-label="Remove task"
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary-foreground"
                  onClick={() => setIsSelectedToRemove(true)}
                >
                  <Trash size={16} className="opacity-60" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {annotations && <div className="py-2 px-8 text-sm text-foreground/70">{annotations}</div>}
    </motion.div>
  )
}
