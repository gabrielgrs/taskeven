'use client'

import { useEffect, useMemo, useState } from 'react'
import { isSameDay } from 'date-fns'
import { ListSchema } from '~/lib/mongoose'
import { useListsContext } from '../providers/List'
import Column from '../shared/Column'
import Description from '../shared/Description'
import Grid from '../shared/Grid'
import Title from '../shared/Title'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { Label } from '../ui/label'

const timersInMinute = [10, 25, 45, 60]

const formatTimeToShow = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export default function FocusMode() {
  const [selectedTimer, setSelectedTimer] = useState(timersInMinute[0])
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timerInSeconds, setTimerInSeconds] = useState(-1)
  const { lists, onUpdateTask } = useListsContext()

  useEffect(() => {
    if (!isTimerRunning) {
      setTimerInSeconds(-1)
      return
    }

    const interval = setInterval(() => {
      setTimerInSeconds((time) => time - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning])

  const todayTasks = useMemo(() => {
    return lists.reduce((acc: ListSchema[], curr) => {
      const tasks = curr.tasks.filter(
        (x) => !x.completed && x.reminderDate && isSameDay(new Date(), new Date(x.reminderDate)),
      )

      if (tasks.length > 0) acc.push({ ...curr, tasks })
      return acc
    }, [])
  }, [lists])

  const hasTasksToday = todayTasks.length > 0

  const onTimerStartOrStop = (toStart: boolean) => {
    setIsTimerRunning(toStart)
    if (toStart) return setTimerInSeconds(selectedTimer * 60)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="w-max p-0">
          {isTimerRunning ? (
            formatTimeToShow(timerInSeconds)
          ) : (
            <div className="flex items-center gap-1">
              <span className="hidden sm:block">Focus mode</span>
              <span className="sm:hidden block">Focus</span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Grid>
          <Column size={12}>
            <Title variant="green">Focus mode</Title>
          </Column>
          {hasTasksToday && (
            <>
              {!isTimerRunning && (
                <Column size={12}>
                  <Label>How many minutes of focus?</Label>
                </Column>
              )}
              <Column
                data-running={isTimerRunning}
                size={12}
                className="flex data-[running=true]:justify-end data-[running=false]:justify-between gap-2 md:gap-4 items-center"
              >
                {isTimerRunning ? (
                  <span>{formatTimeToShow(timerInSeconds)}</span>
                ) : (
                  timersInMinute.map((timer) => (
                    <Button
                      key={timer}
                      onClick={() => setSelectedTimer(timer)}
                      variant={timer === selectedTimer ? 'secondary' : 'outline'}
                      size="sm"
                      className="p-0 px-1 w-full"
                    >
                      {timer}
                    </Button>
                  ))
                )}
                <Button size="sm" onClick={() => onTimerStartOrStop(!isTimerRunning)}>
                  {isTimerRunning ? 'Stop' : 'Start'}
                </Button>
              </Column>
            </>
          )}
          <Column size={12}>
            {hasTasksToday ? (
              <h2>Today tasks</h2>
            ) : (
              <>
                <h2 className="text-muted-foreground">You don{"'"}t have tasks today!</h2>
                <Description>Set reminders for today to use focus mode</Description>
              </>
            )}
          </Column>
          {todayTasks.map(({ _id, name, tasks }) => (
            <Column key={_id} size={12} className="pb-4">
              <p className="text-muted-foreground text-sm pb-1">{name}</p>
              <ul>
                {tasks.map((task) => (
                  <li key={task._id} className="flex gap-2 items-center">
                    <Checkbox onCheckedChange={() => onUpdateTask(_id, task._id, { completed: true })} />
                    {task.title}
                  </li>
                ))}
              </ul>
            </Column>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
