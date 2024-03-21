import schemas from '~/libs/mongoose'

export async function POST(request: Request) {
  const { ip, email } = await request.json()
  await schemas.space.updateMany({ createdBy: ip }, { createdBy: email })

  return new Response('OK', { status: 200 })
}
