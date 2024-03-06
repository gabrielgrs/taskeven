'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import { useSpacesContext } from '~/components/providers/Space'
import Column from '~/components/shared/Column'
import Grid from '~/components/shared/Grid'
import { TaskSchema } from '~/lib/mongoose'
import { useQueryParams } from '~/utils/hooks/useQueryParams'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'

type Props = {
  spaceId: string
  spaceName: string
  tasks: TaskSchema[]
}

const filterTypes = ['All', 'Completed', 'Uncompleted'] as const

type FilterType = (typeof filterTypes)[number]

export default function Tasks({ spaceId, spaceName, tasks }: Props) {
  const [filterQuery, setFilterQuery] = useQueryParams<FilterType>('filter', 'All')

  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined)

  const { onAddTask, onRemoveTask, onUpdateTask } = useSpacesContext()

  return (
    <AnimatePresence>
      <main>
        <Grid>
          <Column size={12} className="flex justify-between items-center">
            <h1>{spaceName}</h1>
            {/* <Badge variant="secondary">Free</Badge> */}
            {/* <Button size="icon" variant="ghost">
              <Share2 size={20} />
            </Button> */}
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
                  .map((task) =>
                    selectedTaskId === task._id ? (
                      <TaskForm
                        key={`form_${task._id}`}
                        onSubmit={(values) =>
                          values._id ? onUpdateTask(spaceId, task._id, values) : onAddTask(spaceId, values)
                        }
                        initialValues={task}
                        onCancel={() => setSelectedTaskId(undefined)}
                      />
                    ) : (
                      <TaskCard
                        key={`card_${task._id}`}
                        title={task.title}
                        completed={task.completed}
                        date={task.date}
                        onRemoveTask={() => onRemoveTask(spaceId, task._id)}
                        onSelectToEdit={() => setSelectedTaskId(task._id)}
                        onCompleteTask={(completed) => onUpdateTask(spaceId, task._id, { completed })}
                      />
                    ),
                  )
              )}
            </div>
          </Column>
        </Grid>
      </main>
    </AnimatePresence>
  )
}
