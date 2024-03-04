import { MAX_ANNOTATION_LENGTH } from './general'

export const getAnnotationsPrompt = (listTitle: string, taskTitle: string, tasks: string[]) =>
  `I want a suggestion with a max of ${MAX_ANNOTATION_LENGTH} characters for a task called ${taskTitle} inside a list called ${listTitle} and have other tasks called ${tasks.join(', ')}.`

export const getListCreationPrompt = (name: string, description: string) =>
  `Create a todo list based on name ${name} and description ${description} and return as javascript array of string, without numbers`
