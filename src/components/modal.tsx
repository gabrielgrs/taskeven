import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { ReactNode } from 'react'

export function Modal({ trigger, children, title }: { trigger: ReactNode; children: ReactNode; title: string }) {
	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="bg-foreground/5 backdrop-blur-sm">
				<DialogTitle>{title}</DialogTitle>
				{children}
			</DialogContent>
		</Dialog>
	)
}
