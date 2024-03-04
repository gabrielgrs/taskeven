import { getLevelByExperience } from './gamification'

export const costs = {
  CREATE_LIST: 5,
  INVITE_MEMBER: 10,
  CREATE_TASK: 15,
  GENERATE_ANNOTATION_WITH_AI: 3, // TODO: change when fix the AI
  SET_REMINDER_DATE: 7,
}

export const INITIAL_CREDITS = 500

export const getCreditsBonusToRecharge = (userExperience: number, credits: number) => {
  const level = getLevelByExperience(userExperience)
  const positiveCredits = Math.abs(credits)
  return Math.ceil(positiveCredits * (level / 100))
}
