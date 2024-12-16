import type { Metadata } from 'next'
import { APP_DOMAIN, APP_NAME, DESCRIPTION } from './constants'

const meta = {
	title: APP_NAME,
	description: DESCRIPTION,
} as const

const image = `${APP_DOMAIN}/{${APP_NAME.toLowerCase()}/assets/thumb.png`

export function generateMetadata(): Metadata {
	return {
		...meta,
		title: {
			default: APP_NAME,
			template: `%s - ${APP_NAME}`,
		},
		metadataBase: new URL(APP_DOMAIN),
		// manifest: '/manifest.json',
		openGraph: {
			...meta,
			images: [{ url: image }],
		},
		icons: [
			{
				rel: 'apple-touch-icon',
				sizes: '32x32',
				url: '/apple-touch-icon.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				url: '/favicon-32x32.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				url: '/favicon-16x16.png',
			},
		],
	}
}
