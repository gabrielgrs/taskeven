'use server'

import schemas from '~/lib/mongoose'

export async function joinList(email: string) {
  const alreadyRegistered = await schemas.waitList.findOne({ email })
  if (!alreadyRegistered) await schemas.waitList.create({ email })

  return true
}

export async function getWaitlistSize() {
  const size = await schemas.waitList.estimatedDocumentCount()
  return size
}
