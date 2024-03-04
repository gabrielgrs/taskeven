import { getProducts } from '~/actions/checkout'
import RechargeUI from '~/components/Recharge'

async function Recharge() {
  const products = await getProducts()

  return <RechargeUI products={products} />
}

export default Recharge
