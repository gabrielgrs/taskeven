'use client'

import { ReactNode, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Drawer, DrawerContent, DrawerTrigger } from '~/components/ui/drawer'

export type ModalProps = {
  title: string
  description?: string | ReactNode
  children: ReactNode
  trigger: ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

function Content({ title, description, children }: Pick<ModalProps, 'title' | 'description' | 'children'>) {
  return (
    <>
      <div className="py-8 px-6 rounded-t-lg bg-muted-foreground/5">
        <h1 className="text-3xl font-normal">{title}</h1>
        {description && <p className="text-muted-foreground pt-2 underline-offset-4">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </>
  )
}

export function Modal({ children, trigger, isOpen, onOpenChange, title, description }: ModalProps) {
  const [showDrawer, setShowDrawer] = useState(false)

  useEffect(() => {
    const onResize = () => setShowDrawer(window.innerWidth < 600)
    onResize()

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return showDrawer ? (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="p-0 backdrop-blur-md min-h-[60vh]">
        <Content title={title} description={description}>
          {children}
        </Content>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-0 backdrop-blur-md">
        <Content title={title} description={description}>
          {children}
        </Content>
      </DialogContent>
    </Dialog>
  )
}
