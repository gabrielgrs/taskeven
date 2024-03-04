'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Check, ChevronsUpDown } from 'lucide-react'
import ListForm from '~/components/Lists/ListForm'
import { useListsContext } from '~/components/providers/List'
import { Button } from '~/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from '~/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import useAuth from '~/utils/hooks/useAuth'

export default function ListSelector() {
  const [open, setOpen] = useState(false)
  const { lists } = useListsContext()
  const { slug } = useParams()
  const { user } = useAuth()

  const selectedList = useMemo(() => lists.find((x) => x.slug === slug), [lists, slug])

  const { myLists = [], sharedLists = [] } = useMemo(() => {
    const myLists = lists.filter((list) => String(list.createdBy) === user?._id)
    const ids = myLists.map((x) => x._id)
    const sharedLists = lists.filter((list) => !ids.includes(list._id))

    return {
      myLists,
      sharedLists,
    }
  }, [lists, user])

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a list"
            size="sm"
            className="max-w-[200px]"
          >
            <span className="w-full truncate">{selectedList?.name || 'Select list'}</span>
            <ChevronsUpDown size={14} className="min-w-[14px]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                <CommandItem onSelect={() => setOpen(false)}>
                  <ListForm>
                    <Button size="sm" variant="ghost" aria-label="Go to lists" className=" h-6 w-full text-center">
                      Show all lists
                    </Button>
                  </ListForm>
                </CommandItem>
              </CommandGroup>

              {myLists.length > 0 && (
                <CommandGroup heading={`My lists (${myLists.length})`}>
                  {myLists.map((list) => (
                    <Link href={`/app/${list.slug}`} key={list._id}>
                      <CommandItem onSelect={() => setOpen(false)}>
                        <div className="text-sm px-1 py-2 rounded flex justify-between items-center h-full w-full cursor-pointer hover:bg-foreground/20 duration-500">
                          {list.name}
                          {selectedList?._id === list._id && <Check size={14} />}
                        </div>
                      </CommandItem>
                    </Link>
                  ))}
                </CommandGroup>
              )}

              {sharedLists.length > 0 && (
                <CommandGroup heading={`Shared lists (${sharedLists.length})`}>
                  {sharedLists.map((list) => (
                    <Link href={`/app/${list.slug}`} key={list._id}>
                      <CommandItem onSelect={() => setOpen(false)}>
                        <div className="text-sm p-1 rounded flex justify-between items-center h-full w-full cursor-pointer hover:bg-foreground/20 duration-500">
                          {list.name}
                          {selectedList?._id === list._id && <Check size={14} />}
                        </div>
                      </CommandItem>
                    </Link>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <CommandItem onSelect={() => setOpen(false)}>
                  <ListForm>
                    <Button size="sm" variant="ghost" aria-label="Settings" className=" h-6 w-full text-center">
                      Create list
                    </Button>
                  </ListForm>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
