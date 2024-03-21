'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Command, CommandList } from '~/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import useSpaces from '~/utils/hooks/useSpaces'

type Props = {
  children: ReactNode
}

export default function Switcher({ children }: Props) {
  const [open, setOpen] = useState(false)
  const { slug } = useParams()

  const { spaces } = useSpaces()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <div className="flex flex-col p-2 text-sm">
              {spaces.map((space) => (
                <Link
                  data-active={space.slug === slug}
                  href={`/space/${space.slug}`}
                  key={space._id}
                  onClick={() => setOpen(false)}
                  className="flex justify-between hover:bg-muted-foreground/20 px-1 py-2 rounded-lg duration-200 data-[active=true]:text-primary"
                >
                  <span>{space.name}</span>
                  <span>
                    ({space.tasks.filter((x) => x.completed).length}/{space.tasks.length})
                  </span>
                </Link>
              ))}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
