export type Plan = {
  price: number
  features: string[]
  canShare: boolean
  // textLength: number
  tasksInProject: number
}

export type PlanName = 'FREE' | 'PLUS'
