'use client'

import { ReactNode, createContext, useContext } from 'react'
import { ListSchema, TaskSchema } from '~/lib/mongoose'
import { Permission } from '~/types/shared'
import useLists from './useLists'

type ListContext = {
  lists: ListSchema[]
  onAddList: (listName: string) => void
  onUpdateList: (listId: string, list: Partial<ListSchema>) => void
  onRemoveList: (listId: string) => void
  onAddTask: (listId: string, values: Partial<TaskSchema>) => void
  onRemoveTask: (listId: string, taskId: string) => void
  onUpdateTask: (listId: string, taskId: string, task: Partial<TaskSchema>) => void
  onAddMember: (listId: string, email: string, permission: Permission) => void
  onUpdateMember: (listId: string, userId: string, permission: Permission) => void
  onGenerateAnnotationSuggestion: (listName: string, text: string, taskNames: string[]) => Promise<string | undefined>
}

const ListContext = createContext<ListContext>({
  lists: [],
  onAddList: () => {},
  onUpdateList: () => {},
  onRemoveList: () => {},
  onAddTask: () => {},
  onRemoveTask: () => {},
  onUpdateTask: () => {},
  onAddMember: () => {},
  onUpdateMember: () => {},
  onGenerateAnnotationSuggestion: () => Promise.resolve(undefined),
})

type ListsProvider = {
  children: ReactNode
  initialLists: ListSchema[]
}

export default function ListsProvider({ children, initialLists }: ListsProvider) {
  const data = useLists(initialLists)

  return <ListContext.Provider value={data}>{children}</ListContext.Provider>
}

export const useListsContext = () => useContext(ListContext)
