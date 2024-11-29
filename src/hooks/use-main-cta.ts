'use client'

import { useEffect, useState } from 'react'

export function useMainCTA() {
	const [showOnNavbar, setShowOnNavbar] = useState(false)

	useEffect(() => {
		const onScroll = () => {
			const scrolled = window.scrollY // Pixels scrolled from the top
			setShowOnNavbar(scrolled > 200)
		}

		onScroll()

		document.addEventListener('scroll', onScroll)

		return () => {
			document.removeEventListener('scroll', onScroll)
		}
	}, [])

	return { showOnNavbar }
}
