import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getUserListsWithTasksAndMembers } from '~/actions/list'
import ListsProvider from '~/components/providers/List'
import Navbar from '~/components/shared/Navbar'
import { getTokenData } from '~/lib/jwt'

const isValidToken = async () => {
  try {
    const user = await getTokenData('')
    if (!user) throw Error('Unauthorized access')
    return
  } catch {
    return redirect('/auth')
  }
}

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  await isValidToken()
  const lists = await getUserListsWithTasksAndMembers()

  return (
    <ListsProvider initialLists={lists}>
      <Navbar isPublic={false} />
      <main className="w-full mx-auto min-h-[calc(100vh-300px)] my-12 max-w-xl flex flex-col px-6 gap-8">
        {children}
      </main>
    </ListsProvider>
  )
}
