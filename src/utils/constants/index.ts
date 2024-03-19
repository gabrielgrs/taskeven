import type { Plan, PlanName } from './types'

const isProductionBuild = process.env.NODE_ENV === 'production'

export const SUPPORT_EMAIL = 'grxgabriel@gmail.com'

export const APP_NAME = 'Taskeven'

export const APP_SLOGAN = 'Unleash Your Potential with Personal Task Management'

export const APP_DOMAIN = isProductionBuild ? 'https://taskeven.com' : `http://localhost:3000`

const TEXTS = {
  NO_CREDIT_CARD: 'No credit card required',
  // PRIORITY_SUPPORT: 'Priority support',
  // TASKS_IN_PROJECT: (quantity: number) => `${quantity} tasks in the project`,
  // ANNOTATIONS_MAX_LENGTH: (characters: number) => `Up to ${characters} characters annotations`,
  REMINDER: 'Reminder',
  SHAREABLE: 'Shareable',
}

export const PLANS: Record<PlanName, Plan> = {
  FREE: {
    features: [TEXTS.NO_CREDIT_CARD],
    price: 0,
    canShare: false,
    // textLength: 100,
    tasksInProject: 5,
  },
  PLUS: {
    features: [TEXTS.REMINDER, TEXTS.SHAREABLE],
    // textLength: 2_000,
    canShare: true,
    tasksInProject: 20,
    price: 3_99,
  },
} as const
