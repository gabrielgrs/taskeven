'use server'

import { ClientSession } from 'mongoose'
import { createToken, decodeToken, getTokenData } from '~/lib/jwt'
import schemas, { MemberSchema, connectDatabase } from '~/lib/mongoose'
import { sendEmail } from '~/lib/resend'
import { Permission } from '~/types/shared'
import { costs } from '~/utils/configurations'
import InviteEmail from '../../emails/invite'
import { findUserOrCreate, updateUserCredits } from './auth'
import { parseObject, isOwnerOrMemberWithEditPermission } from './helpers'
import { getDomain } from './helpers/server'

export async function sendMemberInvite(listId: string, email: string, permission: Permission) {
  let session: ClientSession | null = null
  try {
    const authenticatedUser = await getTokenData()
    if (!authenticatedUser) throw Error('Unauthorized access')
    if (!['VIEW', 'EDIT'].includes(permission)) throw Error('Permission not allowed')
    if (authenticatedUser.email === email) throw Error('You cannot invite yourself')

    const databaseConnection = await connectDatabase()
    session = await databaseConnection.startSession()
    await session.startTransaction()

    const createdUser = await findUserOrCreate(email)

    // TODO: validate
    const list = await schemas.list
      .findOneAndUpdate(
        {
          _id: listId,
          'members.user': { $ne: createdUser._id },
          ...isOwnerOrMemberWithEditPermission(authenticatedUser._id),
        },

        { $push: { members: { user: createdUser._id, permission, accepted: false } } },
        { new: true, session },
      )
      .populate('members.user')

    if (!list) throw Error('Not found')

    const createdMember = list.members.at(-1)!

    const token = createToken({ email, _id: createdUser._id, role: createdUser.role })

    await updateUserCredits(costs.INVITE_MEMBER, 'decrease', session)

    await sendEmail(
      email,
      'You received an invite to join a list',
      InviteEmail({
        baseUrl: getDomain(),
        listName: list.name,
        token,
        listId,
      }),
    )

    await session.commitTransaction()

    return parseObject(createdMember)
  } catch (error) {
    if (session) await session.abortTransaction()
    throw error
  } finally {
    if (session) await session?.endSession()
  }
}

export async function updateMember(listId: string, memberId: string, data: Partial<MemberSchema>) {
  const user = await getTokenData()
  if (!user) throw Error('Unauthorized access')

  const dataToSet = Object.entries(data).reduce((acc: Record<string, unknown>, [key, value]) => {
    acc[`members.$.${key}`] = value
    return acc
  }, {})

  const list = await schemas.list.findOneAndUpdate(
    { _id: listId, 'members.user': memberId, ...isOwnerOrMemberWithEditPermission(user._id) },
    { $set: dataToSet },
    { new: true },
  )

  if (!list) throw Error('Not found')

  const updatedMember = list.members.find((m) => String(m.user) === memberId)

  if (!updatedMember) throw Error('Not found')

  return parseObject(updatedMember)
}

export async function validateMemberInvite(listId: string, token: string) {
  const decodedToken = await decodeToken(token)

  if (!decodedToken) throw Error('Unauthorized access')

  const memberId = decodedToken._id

  const list = await schemas.list.findOneAndUpdate(
    { _id: listId, 'members.user': memberId },
    { $set: { 'members.$.accepted': true } },
    { new: true }, // return updatedValue
  )

  if (!list) throw Error('List not found')

  return parseObject(list)
}
