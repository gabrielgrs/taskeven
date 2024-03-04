'use client'

import Link from 'next/link'
import { ChevronLeft, Settings } from 'lucide-react'
import Title from '~/components/shared/Title'
import { Button, buttonVariants } from '~/components/ui/button'
import { ListSchema } from '~/lib/mongoose'
import { Permission } from '~/types/shared'
import { cn } from '~/utils/shadcn'
import ListForm from '../Lists/ListForm'
import Tasks from './Tasks'

type Props = {
  list: ListSchema
  permission: Permission
}

export default function TasksUI({ list, permission }: Props) {
  return (
    <>
      <div className={cn('grid grid-cols-[24px,auto,24px] items-center gap-4')}>
        <Link
          aria-label="Back to lists"
          href="/app"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'justify-self-start hover:text-primary-foreground',
          )}
        >
          <ChevronLeft size={24} className="opacity-60" />
        </Link>

        <Title className="text-center text-xl md:text-3xl">{list.name}</Title>

        {permission === 'EDIT' && (
          <ListForm
            initialValues={{
              _id: list._id,
              name: list.name,
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label="Settings"
              className="justify-self-end hover:text-primary-foreground"
            >
              <Settings size={20} className="opacity-60" />
            </Button>
          </ListForm>
        )}
      </div>

      <Tasks tasks={list.tasks} selectedList={list} permission={permission} />
    </>
  )
}
