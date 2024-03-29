import type { Plan, PlanName } from './types'

const isProductionBuild = process.env.NODE_ENV === 'production'

export const SUPPORT_EMAIL = 'grxgabriel@gmail.com'

export const APP_NAME = 'Taskeven'

export const APP_SLOGAN = 'Unleash Your Potential with Personal Task Management'

export const APP_DOMAIN = isProductionBuild ? 'https://taskeven.com' : `http://localhost:3000`

export const PLANS: Record<PlanName, Plan> = {
  PLUS: {
    price: 3_99,
    maxTasks: 20,
  },
  FREE: {
    price: 0,
    maxTasks: 5,
  },
} as const
