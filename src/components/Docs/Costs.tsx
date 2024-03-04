import { costs } from '~/utils/configurations'
import { cn } from '~/utils/shadcn'
import Column from '../shared/Column'
import Grid from '../shared/Grid'

const variants = [
  'group-hover:text-pink-500',
  'group-hover:text-orange-500',
  'group-hover:text-amber-500',
  'group-hover:text-lime-500',
  'group-hover:text-indigo-500',
] as const

export default function Costs() {
  return (
    <Grid>
      <Column size={12} className="flex items-center gap-8 flex-wrap">
        {Object.entries(costs)
          .reduce((acc: { service: string; cost: number }[], [key, value]) => {
            const service = key.toLowerCase().charAt(0).toUpperCase() + key.toLowerCase().slice(1).replaceAll('_', ' ')
            acc.push({ service, cost: value })
            return acc
          }, [])
          .map(({ service, cost }, index) => (
            <p key={service} className="text-foreground/50 group flex flex-col">
              <span className={cn(`text-2xl duration-500`, variants[index])}>{service}</span>{' '}
              <span>costs {cost} credits</span>
            </p>
          ))}
      </Column>
    </Grid>
  )
}
