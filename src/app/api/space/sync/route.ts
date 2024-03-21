import schemas from '~/libs/mongoose'

export async function POST(request: Request) {
  const { email } = await request.json()

  const ip = await fetch('https://api.ipify.org?format=json')
    .then((res) => res.json())
    .then((res) => res.ip)

  await schemas.space.updateMany({ createdBy: ip }, { createdBy: email })

  return new Response('OK', { status: 200 })
}
