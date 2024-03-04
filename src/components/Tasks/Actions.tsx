import { Dispatch, SetStateAction } from 'react'
import { MoreHorizontal, Share2, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'

type Props = {
  setIsListOptionsOpen: Dispatch<SetStateAction<boolean>>
  isOpen: boolean
}

export default function Actions({ isOpen, setIsListOptionsOpen }: Props) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsListOptionsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Actions"
          variant="ghost"
          className="justify-self-end opacity-60"
          onClick={() => setIsListOptionsOpen((p) => !p)}
        >
          <MoreHorizontal size={24} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-[1px] border-neutral-100 border-opacity-20 p-2">
        <DropdownMenuItem>
          <button className="flex gap-2 items-center w-full hover:bg-accent duration-500 rounded-lg px-1 py-2">
            <Share2 size={16} />
            Share
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button className="flex gap-2 items-center w-full hover:bg-accent duration-500 rounded-lg px-1 py-2">
            <Trash2 size={16} />
            Delete
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
