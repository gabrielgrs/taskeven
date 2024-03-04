import { checkoutSuccess } from '~/actions/checkout'
import CheckoutSuccessTemplate from '~/components/RechargeSuccess'

type Props = {
  searchParams: {
    checkoutSessionId: string
  }
}

async function CheckoutSuccess(props: Props) {
  const { checkoutSessionId } = props.searchParams
  await checkoutSuccess(checkoutSessionId)

  return <CheckoutSuccessTemplate />
}

export default CheckoutSuccess
