import { redirect } from 'next/navigation'

export default function Proxy({ params }: { params: { route: string } }) {
  return redirect(`/${params.route}`)
}
