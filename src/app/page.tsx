import { faker } from '@faker-js/faker'
import { getAuthenticatedUser } from '~/actions/auth'
import { insertSpace } from '~/actions/space'
import { getSpaceById } from '~/actions/task'
import TasksUI from '~/components/Tasks'

async function getSpace() {
  const userData = await getAuthenticatedUser()

  if (userData.spaces.length === 0) {
    const randomName = `${faker.color.human()} ${faker.animal.type()}`
    return insertSpace(randomName)
  }

  return getSpaceById(userData.spaces[0])
}

export default async function Spaces() {
  const space = await getSpace()

  return <TasksUI spaceId={space._id} spaceName={space.name} tasks={space.tasks} />
}
