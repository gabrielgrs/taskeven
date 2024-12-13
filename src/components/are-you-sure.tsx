'use client'

import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ReactNode } from 'react'
import { Button } from './ui/button'

type Props = {
	children: ReactNode
	onConfirm: () => void
	title?: string
	message?: string
	loading: boolean
}
export function AreYouSure({
	children,
	onConfirm,
	title = 'Are you sure?',
	message = 'You really want to do this?',
	loading,
}: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="bg-foreground/5 backdrop-blur-sm">
				<DialogTitle className="pb-4">{title}</DialogTitle>
				<div>{message}</div>
				<div className="flex items-center justify-end gap-2">
					<DialogClose asChild>
						<Button type="button" variant="outline" disabled={loading}>
							Cancel
						</Button>
					</DialogClose>
					<Button type="button" onClick={onConfirm} loading={loading}>
						Confirm
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
