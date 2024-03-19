import { redirect } from 'next/navigation'
import { checkoutSuccess } from '~/actions/checkout'

type Props = {
  searchParams: {
    checkoutSessionId: string
    spaceId: string
    type: 'success' | 'failure'
  }
}

export default async function CheckoutPage(props: Props) {
  const { type, checkoutSessionId, spaceId } = props.searchParams

  if (type === 'success') {
    const updatedSpace = await checkoutSuccess(checkoutSessionId, spaceId)
    return redirect(`/space/${updatedSpace.slug}`)
  }

  return (
    <div>
      Failed to process checkout
      <div>Checkout ID: {props.searchParams.checkoutSessionId}</div>
    </div>
  )
}
