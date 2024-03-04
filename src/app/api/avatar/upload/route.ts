import { NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'
import { getAuthenticatedUser } from '~/actions/auth'
import schemas from '~/lib/mongoose'

async function updateCurrentImage(userId: string, userAvatar: string, avatarToUpdate: string) {
  await del(userAvatar).catch(() => null)
  return schemas.user.findOneAndUpdate({ _id: userId, avatar: avatarToUpdate })
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) throw Error('Unauthorized access')

    const formData = await request.formData()
    const file = formData.get('file') as File

    const response = await put(file.name, file, { access: 'public', token: process.env.BLOB_READ_WRITE_TOKEN })

    await updateCurrentImage(user._id, user.avatar, response.url)

    return NextResponse.json({ message: 'Success', url: response.url })
  } catch (error) {
    return NextResponse.json(error)
  }
}
