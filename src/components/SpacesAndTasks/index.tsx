'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Filter, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createCheckout } from '~/actions/checkout'
import { getPrices } from '~/actions/services/stripe'
import Column from '~/components/shared/Column'
import Grid from '~/components/shared/Grid'
import { TaskSchema } from '~/libs/mongoose'
import { PlanName } from '~/utils/constants/types'
import { useQueryParams } from '~/utils/hooks/useQueryParams'
import useSpaces from '~/utils/hooks/useSpaces'
import { Badge, badgeVariants } from '../ui/badge'
import { Button, buttonVariants } from '../ui/button'
import Switcher from './Switcher'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'

type Props = {
  spaceId: string
  spaceName: string
  tasks: TaskSchema[]
  isOwner: boolean
  plan: PlanName
}

const filterTypes = ['All', 'Completed', 'Uncompleted'] as const

type FilterType = (typeof filterTypes)[number]

export default function SpacesAndTasksUI({ spaceId, spaceName, tasks, plan }: Props) {
  const [filterQuery, setFilterQuery] = useQueryParams<FilterType>('filter', 'All')
  const [redirecting, setRedirecting] = useState(false)
  const isFree = plan === 'FREE'

  const { onAddTask, onRemoveTask, onUpdateTask } = useSpaces()

  const onUpgradeSpace = async (spaceId: string) => {
    try {
      setRedirecting(true)
      const prices = await getPrices()
      // TODO
      const priceId = prices.find((x) => x.nickname?.toUpperCase() === ('PLUS' satisfies PlanName))?.id!
      const url = await createCheckout(priceId, spaceId)
      window.open(url)
      toast.success('Redirecting you to checkout page!')
    } catch {
      return toast.error('Something went wrong')
    } finally {
      setRedirecting(false)
    }
  }

  return (
    <AnimatePresence>
      <main>
        <Grid>
          <Column size={12} className="flex justify-between items-center">
            <Switcher>
              <Button variant="link">Switch space</Button>
            </Switcher>
            <Link href="/space/form" className={buttonVariants({ variant: 'link' })}>
              Create space
            </Link>
          </Column>
          <Column size={12} className="flex justify-between items-center">
            <h1>{spaceName}</h1>
            {isFree ? (
              <button
                disabled={redirecting}
                onClick={() => onUpgradeSpace(spaceId)}
                className={badgeVariants({ variant: 'secondary' })}
              >
                {redirecting ? <Loader2 size={20} className="animate-spin" /> : 'Upgrade'}
              </button>
            ) : (
              <Badge variant="secondary">{plan}</Badge>
            )}
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
