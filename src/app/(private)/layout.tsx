import { ReactNode } from 'react'

export default function PrivateLayot({ children }: { children: ReactNode }) {
	return <div className="mx-auto max-w-xl">{children}</div>
}
