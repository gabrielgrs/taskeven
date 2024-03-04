'use client'

import Image from 'next/image'
import Column from '~/components/shared/Column'
import Grid from '~/components/shared/Grid'
import Title from '~/components/shared/Title'

type Service = {
  name: string
  description: string
}

const services: Service[] = [
  {
    name: 'Amazing lists 🚀',
    description:
      'Embark on a journey of organizational excellence with a dynamic tool that propels you towards unparalleled productivity. Craft intricate lists adorned with members and tasks, and experience the exhilarating buzz of accomplishment as you conquer each endeavor.',
  },
  {
    name: 'Productivy tasks 📋',
    description:
      'Dive into the realm of efficiency a powerhouse companion designed to whisk you through your to-dos with effortless grace. Seamlessly manage tasks, notes, and deadlines, ensuring that no goal goes unmet and no deadline overlooked.',
  },
  {
    name: 'Collab work 🤝',
    description:
      'Experience the magic of collaboration with an enchanting platform that fosters teamwork and camaraderie. Effortlessly share your lists with peers through seamless email invitations, spreading the love of productivity far and wide.',
  },
  {
    name: 'Genius Notepad ✨',
    description:
      'Unlock the secrets of inspiration with a beacon of creativity infused with the brilliance of Artificial Intelligence. Watch in awe as clever suggestions illuminate your notes, igniting the flames of innovation and propelling your ideas to unprecedented heights.',
  },
]

export default function About() {
  return (
    <Grid>
      <Column size={12} className="p-8 hover:scale-110 duration-500">
        <Image
          src="/assets/thumbnail.png"
          height={630}
          width={1200}
          alt="Taskeven Thumbnail"
          className="border-4 border-accent rounded-xl"
        />
      </Column>

      <Column size={12}>
        <Title variant="indigo">Unlocking the magic: How It Works!</Title>
      </Column>

      <Column size={12}>
        <ul>
          {services.map((service) => (
            <li
              key={service.name}
              className="flex flex-col-reverse md:grid md:grid-cols-2 pt-20 pb-4 gap-10 border-b-[1px] border-foreground/30 py-2 opacity-70 hover:opacity-100 text-foreground-90 duration-500"
            >
              <span className="text-2xl">{service.name}</span>
              <p className="text-base text-right">{service.description}</p>
            </li>
          ))}
        </ul>
      </Column>
    </Grid>
  )
}
