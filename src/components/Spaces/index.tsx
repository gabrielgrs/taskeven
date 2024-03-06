import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createRandomSpace } from '~/actions/space'
import { SpaceSchema } from '~/lib/mongoose'
import { Button } from '../ui/button'

export default function Spaces({ spaces }: { spaces: SpaceSchema[] }) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { push } = useRouter()
  const { slug } = useParams()

  const onCreateRandomSpace = async () => {
    try {
      setIsRedirecting(true)
      const space = await createRandomSpace()
      push(`/space/${space.slug}`)
    } catch {
      setIsRedirecting(false)
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="flex gap-4">
      <div className="px-2 pb-4 flex overflow-y-auto w-max gap-4">
        {spaces.map((space) => (
          <button
            data-active={slug === space.slug}
            key={space._id}
            onClick={() => push(`/space/${space.slug}`)}
            className="relative whitespace-nowrap first-letter:rounded p-2 opacity-70 hover:opacity-100 data-[active=true]:opacity-100"
          >
            <div className="relative z-10 text-sm flex gap-1 items-center">
              <span>{space.name}</span>
              <span>
                ({space.tasks.filter((x) => x.completed).length}/{space.tasks.length})
              </span>
            </div>
            {slug === space.slug && (
              <motion.div
                className="absolute h-full w-full left-0 top-0 bg-muted-foreground/20 rounded-lg"
                layoutId="spaceHover"
              />
            )}
          </button>
        ))}
      </div>
      <Button disabled={isRedirecting} onClick={() => onCreateRandomSpace()} variant="link">
        {isRedirecting ? (
          <span className="py-4">
            <Loader2 className="animate-spin" size={16} />
          </span>
        ) : (
          <span>Create space</span>
        )}
      </Button>
    </div>
  )
}
