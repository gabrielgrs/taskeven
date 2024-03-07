'use client'

import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { toast } from 'sonner'
import { createRandomSpace } from '~/actions/space'
import Column from '~/components/shared/Column'
import Grid from '~/components/shared/Grid'
import { TaskSchema } from '~/lib/mongoose'
import { useQueryParams } from '~/utils/hooks/useQueryParams'
import useSpaces from '~/utils/hooks/useSpaces'
import Share from './Share'
import Switcher from './Switcher'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'

type Props = {
  spaceId: string
  spaceName: string
  tasks: TaskSchema[]
  isOwner: boolean
}

const filterTypes = ['All', 'Completed', 'Uncompleted'] as const

type FilterType = (typeof filterTypes)[number]

export default function SpacesAndTasksUI({ spaceId, spaceName, tasks, isOwner }: Props) {
  const [filterQuery, setFilterQuery] = useQueryParams<FilterType>('filter', 'All')
  const { push } = useRouter()

  const { onAddTask, onRemoveTask, onUpdateTask } = useSpaces()

  const onCreateRandomSpace = async () => {
    try {
      const space = await createRandomSpace()
      push(`/space/${space.slug}`)
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <AnimatePresence>
      <main>
        <Grid>
          <Column size={12} className="flex justify-between items-center">
            <Switcher onCreateTeam={() => onCreateRandomSpace()}>
              <h1>{spaceName}</h1>
            </Switcher>

            {/* <Badge variant="secondary">Free</Badge> */}
            {isOwner && <Share spaceId={spaceId} />}
          </Column>
          <Column size={12}>
            <TaskForm onSubmit={(values) => onAddTask(spaceId, values)} />
          </Column>

          <Column size={12} className="flex gap-4 items-center">
            <Filter size={16} className="text-foreground/70" />

            {filterTypes.map((filterType) => {
              const isSelected = filterType === filterQuery

              return (
                <button
                  data-active={isSelected}
                  key={filterType}
                  className="cursor-pointer relative opacity-60 data-[active=true]:opacity-100 data-[active=true]:text-primary duration-500"
                  onClick={() => setFilterQuery(filterType)}
                >
                  <span>{filterType}</span>
                  {isSelected && (
                    <motion.div layoutId="filterLine" className="bg-primary absolute left-0 bottom-0 w-full h-[1px]" />
                  )}
                </button>
              )
            })}
          </Column>

          <Column size={12}>
            <div className="flex flex-col gap-4">
              {tasks.length === 0 ? (
                <span className="text-center w-full mt-8 text-lg opacity-60">No tasks found</span>
              ) : (
                tasks
                  .filter((task) => {
                    if (filterQuery === 'Completed') return task.completed
                    if (filterQuery === 'Uncompleted') return !task.completed
                    return task
                  })
                  .map((task) => (
                    <TaskCard
                      key={`card_${task._id}`}
                      title={task.title}
                      completed={task.completed}
                      date={task.date}
                      onRemoveTask={() => onRemoveTask(spaceId, task._id)}
                      onCompleteTask={(completed) => onUpdateTask(spaceId, task._id, { completed })}
                    />
                  ))
              )}
            </div>
          </Column>
        </Grid>
      </main>
    </AnimatePresence>
  )
}
