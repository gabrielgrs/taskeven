'use client'

import { ReactNode, createContext, useContext } from 'react'
import { SpaceSchema, TaskSchema } from '~/lib/mongoose'
import useSpaces from './useSpaces'

type SpaceContext = {
  spaces: SpaceSchema[]
  onAddSpace: (listName: string) => void
  onUpdateSpace: (spaceId: string, list: Partial<SpaceSchema>) => void
  onRemoveSpace: (spaceId: string) => void
  onAddTask: (spaceId: string, values: Partial<TaskSchema>) => void
  onRemoveTask: (spaceId: string, taskId: string) => void
  onUpdateTask: (spaceId: string, taskId: string, task: Partial<TaskSchema>) => void
}

const SpaceContext = createContext<SpaceContext>({
  spaces: [],
  onAddSpace: () => {},
  onUpdateSpace: () => {},
  onRemoveSpace: () => {},
  onAddTask: () => {},
  onRemoveTask: () => {},
  onUpdateTask: () => {},
})

type SpacesProvider = {
  children: ReactNode
  initialSpaces: SpaceSchema[]
}

export default function SpacesProvider({ children, initialSpaces }: SpacesProvider) {
  const data = useSpaces(initialSpaces)

  return <SpaceContext.Provider value={data}>{children}</SpaceContext.Provider>
}

export const useSpacesContext = () => useContext(SpaceContext)
