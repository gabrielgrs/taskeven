'use client'

import { type ReactNode, useEffect, useState } from 'react'

export function OnlyClient({ children }: { children: ReactNode }) {
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	return isClient ? children : null
}
