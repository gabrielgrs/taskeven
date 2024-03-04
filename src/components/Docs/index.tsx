'use client'

import { ReactNode, useState } from 'react'
import Costs from '~/components/Docs/Costs'
import Leveling from '~/components/Docs/Leveling'
import Column from '../shared/Column'
import Description from '../shared/Description'
import Grid from '../shared/Grid'
import { Button } from '../ui/button'

type Section = {
  title: string
  description: string
  content: () => ReactNode
}

const sections: Section[] = [
  {
    title: 'Costs',
    description: `In our project, we've implemented a dynamic cost system to streamline your workflow and enhance productivity. With this system, each action or task within the application carries a specific cost associated with it. This cost serves as a measure of resource allocation and helps users prioritize their activities effectively.`,
    content: () => <Costs />,
  },
  {
    title: 'Leveling',
    description: `In our leveling system, every action you take, from using credits to recharging, earns you valuable experience points (exp). As you accumulate exp, you'll advance through levels, unlocking new perks and abilities along the way. With each level attained, you'll gain a deeper understanding of the platform and wield greater control over your journey. So, dive in, rack up those exp points, and watch as your progress unlocks new horizons!`,
    content: () => <Leveling />,
  },
]

export default function DocsUI() {
  const [activeSection, setActiveSection] = useState(sections[0].title)

  const { content: Component, title, description } = sections.find((section) => section.title === activeSection)!

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px,auto] gap-8">
      <aside>
        <Grid>
          <Column size={12} className="flex flex-row md:flex-col gap-4">
            {sections.map((section) => (
              <Button
                key={section.title}
                variant={section.title === activeSection ? 'secondary' : 'outline'}
                onClick={() => setActiveSection(section.title)}
                className="w-max md:w-full"
              >
                {section.title}
              </Button>
            ))}
          </Column>
        </Grid>
      </aside>
      <main className="flex flex-col">
        <div className="pb-8">
          <h1>{title}</h1>
          <Description>{description}</Description>
        </div>
        {Component && <Component />}
      </main>
    </div>
  )
}
