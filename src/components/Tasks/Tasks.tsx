'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowDownWideNarrow, Filter } from 'lucide-react'
import { useListsContext } from '~/components/providers/List'
import Column from '~/components/shared/Column'
import Grid from '~/components/shared/Grid'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { ListSchema, TaskSchema } from '~/lib/mongoose'
import { Permission } from '~/types/shared'
import { useQueryParams } from '~/utils/hooks/useQueryParams'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'

type Props = {
  tasks: TaskSchema[]
  selectedList: ListSchema
  permission: Permission
}

const filterTypes = ['All', 'Completed', 'Uncompleted'] as const

type FilterType = (typeof filterTypes)[number]

const sortTypes = ['createdAt', 'title', 'completed', 'reminderDate'] as const

type SortType = (typeof sortTypes)[number]

const sortLabels: Record<SortType, string> = {
  title: 'Title',
  completed: 'Status',
  createdAt: 'Creation date',
  reminderDate: 'Reminder',
}

export default function Tasks({ selectedList, permission }: Props) {
  const [filterQuery, setFilterQuery] = useQueryParams<FilterType>('filter', 'All')
  const [sortQuery, setSortQuery] = useQueryParams<SortType>('sort', 'createdAt')

  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>(undefined)

  const { onAddTask, onRemoveTask, onUpdateTask, onGenerateAnnotationSuggestion } = useListsContext()

  return (
    <AnimatePresence>
      <main>
        <Grid>
          {permission === 'EDIT' && (
            <Column size={12}>
              <TaskForm
                onSubmit={(values) => onAddTask(selectedList._id, values)}
                onGenerateAnnotationSuggestion={() =>
                  onGenerateAnnotationSuggestion(
                    selectedList.name,
                    '',
                    selectedList.tasks.map((item) => item.title),
                  )
                }
              />
            </Column>
          )}

          <Column size={12} className="flex gap-1 items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center mt-2">
                  <Filter size={16} className="text-foreground/70" />
                  <span className="font-medium py-1 px-2 text-foreground/70">
                    {filterTypes.find((x) => x === filterQuery)}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-0">
                {filterTypes.map((filterType) => {
                  return (
                    <DropdownMenuItem key={filterType} asChild>
                      <Button
                        className="w-full cursor-pointer"
                        variant="ghost"
                        onClick={() => setFilterQuery(filterType)}
                        size="sm"
                      >
                        {filterType}
                      </Button>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center mt-2">
                  <span className="font-medium px-2 text-foreground/70">
                    {sortLabels[sortTypes.find((x) => x === sortQuery)!]}
                  </span>
                  <ArrowDownWideNarrow size={16} className="text-foreground/70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-0">
                {sortTypes.map((sortType) => {
                  return (
                    <DropdownMenuItem key={sortType} asChild>
                      <Button
                        className="w-full cursor-pointer"
                        variant="ghost"
                        onClick={() => setSortQuery(sortType)}
                        size="sm"
                      >
                        <span>{sortLabels[sortTypes.find((x) => x === sortType)!]}</span>
                      </Button>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </Column>

          <Column size={12}>
            <div className="flex flex-col gap-4">
              {selectedList.tasks.length === 0 ? (
                <span className="text-center w-full mt-8 text-lg opacity-60">No tasks found</span>
              ) : (
                selectedList.tasks
                  .filter((task) => {
                    if (filterQuery === 'Completed') return task.completed
                    if (filterQuery === 'Uncompleted') return !task.completed
                    return task
                  })
                  .sort((a, b) => {
                    if (sortQuery === 'createdAt')
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    if (sortQuery === 'title') return a.title.localeCompare(b.title)
                    if (sortQuery === 'completed') return Number(b.completed) - Number(a.completed)
                    if (sortQuery === 'reminderDate') {
                      if (a.reminderDate && !b.reminderDate) return -1
                      if (!a.reminderDate && b.reminderDate) return 1
                      if (a.reminderDate && b.reminderDate)
                        return new Date(b.reminderDate).getTime() - new Date(a.reminderDate).getTime()
                    }

                    return 0
                  })
                  .map((task) =>
                    selectedTaskId === task._id ? (
                      <TaskForm
                        key={`form_${task._id}`}
                        onSubmit={(values) =>
                          values._id
                            ? onUpdateTask(selectedList._id, task._id, values)
                            : onAddTask(selectedList._id, values)
                        }
                        initialValues={task}
                        onCancel={() => setSelectedTaskId(undefined)}
                        onGenerateAnnotationSuggestion={() =>
                          onGenerateAnnotationSuggestion(
                            selectedList.name,
                            task.title,
                            selectedList.tasks.map((item) => item.title),
                          )
                        }
                      />
                    ) : (
                      <TaskCard
                        key={`card_${task._id}`}
                        title={task.title}
                        completed={task.completed}
                        reminderDate={task.reminderDate}
                        annotations={task.annotations}
                        permission={permission}
                        onRemoveTask={() => onRemoveTask(selectedList._id, task._id)}
                        onSelectToEdit={() => setSelectedTaskId(task._id)}
                        onCompleteTask={(completed) => onUpdateTask(selectedList._id, task._id, { completed })}
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
