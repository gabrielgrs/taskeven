import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Edit2, Users } from 'lucide-react'
import { useListsContext } from '~/components/providers/List'
import { Button, buttonVariants } from '~/components/ui/button'
import { Progress, ProgressIndicator } from '~/components/ui/progress'
import { MemberSchema } from '~/lib/mongoose'
import { Permission } from '~/types/shared'
import { cn } from '~/utils/shadcn'
import ListForm from './ListForm'
import MemberForm from './MemberForm'

type ListCardProps = {
  listId: string
  name: string
  slug: string
  tasksQuantity: number
  percentage: number
  permission: Permission
  members: MemberSchema[]
}

export default function ListCard({
  listId,
  name,
  slug,
  tasksQuantity,
  percentage,
  permission,
  members,
}: ListCardProps) {
  const { onAddMember, onUpdateMember } = useListsContext()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.3 }}
      className="relative flex flex-col justify-between gap-2 rounded-lg border-[1px] dark:border-accent/10 dark:hover:border-accent/30 border-accent/50 hover:border-accent/100 duration-500 px-2 pb-1 pt-4 bg-card/50"
    >
      <div className="w-full pb-4 flex justify-between items-center gap-2">
        <Link
          href={`/app/${slug}`}
          className="flex cursor-pointer text-left hover:opacity-70 duration-500 items-center list-x-3 text-lg text-foreground font-regular"
        >
          {name}
        </Link>
        {permission === 'EDIT' && (
          <ListForm
            initialValues={{
              _id: listId,
              name,
            }}
          >
            <Button size="icon" variant="ghost" aria-label="Settings">
              <Edit2 size={16} className="opacity-60" />
            </Button>
          </ListForm>
        )}
      </div>

      <div className="flex flex-col">
        <span className="self-end opacity-70 text-xs">{percentage}%</span>
        <Progress aria-label="Tasks progress" className="bg-neutral-300 h-2">
          <ProgressIndicator value={percentage} />
        </Progress>
      </div>

      <div
        data-editor={permission === 'EDIT'}
        className="border-opacity-30 pt-1 w-full flex justify-between data-[editor=false]:justify-end data-[editor=true]:grid data-[editor=true]:grid-cols-[max-content,auto] gap-2 items-center"
      >
        {permission === 'EDIT' && (
          <div className="flex gap-2 items-center">
            <MemberForm
              members={members}
              onAddMember={(email, permission) => onAddMember(listId, email, permission)}
              onChangeMemberPermission={(memberId, permission) => onUpdateMember(listId, memberId, permission)}
            >
              <Button variant="ghost" size="icon" type="button" className="hover:text-primary-foreground">
                <Users size={16} className="opacity-60" />
              </Button>
            </MemberForm>
          </div>
        )}

        <Link
          href={`/app/${slug}`}
          className={cn(
            buttonVariants({ size: 'sm', variant: 'link' }),
            'w-max group duration-500 rounded-full text-right h-6 px-0 gap-1',
          )}
        >
          show {tasksQuantity} tasks <ChevronRight className="group-hover:translate-x-1 duration-500" size={16} />
        </Link>
      </div>
    </motion.div>
  )
}
