import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Column from '~/components/shared/Column'
import Description from '~/components/shared/Description'
import Grid from '~/components/shared/Grid'
import Title from '~/components/shared/Title'
import { buttonVariants } from '~/components/ui/button'
import { INITIAL_CREDITS } from '~/utils/configurations'
import ProductCard from './ProductCard'

const colors = ['bg-indigo-400', 'bg-pink-300', 'bg-orange-300', 'bg-amber-300', 'bg-lime-300']

export default function Pricing() {
  return (
    <Grid>
      <Column size={12}>
        <Title variant="pink">Score budget-friendly plans and dive into endless possibilities!</Title>
      </Column>

      <Column size={12}>
        <Description>
          🌟 Unlock features, access premium content – it{"'"}s all powered by our credits system! 🚀 Dive in and make
          things happen! 💥
        </Description>
      </Column>

      <Column size={12}>
        <ProductCard name="On demand" className={colors[0]} />
      </Column>

      <Column size={12}>
        <Description className="text-center">
          Kickstart your journey with a whopping{' '}
          <strong className="text-pink-600 underline uppercase">{INITIAL_CREDITS} free credits</strong>!
        </Description>
      </Column>

      <Column size={12} className="mt-8 flex justify-end w-full ">
        <Link href="/docs" className={buttonVariants({ variant: 'link' })}>
          Check our docs page to undertand how to get started.
          <ArrowRight size={20} />
        </Link>
      </Column>
    </Grid>
  )
}
