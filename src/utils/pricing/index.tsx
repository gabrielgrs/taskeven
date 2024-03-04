import { TaskSchema } from '~/lib/mongoose'
import { costs } from '../configurations'

type FieldsToUpdate = Pick<TaskSchema, 'reminderDate'>

export function getTasksCosts(task: FieldsToUpdate) {
  const taskCosts: Record<keyof FieldsToUpdate, number> = {
    reminderDate: costs.SET_REMINDER_DATE,
  }

  return Object.entries(task)
    .filter(([, value]) => (typeof value === 'number' ? value > 0 : Boolean(value)))
    .reduce((acc, [key]) => {
      acc += taskCosts[key as keyof FieldsToUpdate] || 0
      return acc
    }, 0)
}
