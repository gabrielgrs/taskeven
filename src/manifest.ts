import { MetadataRoute } from 'next'
import { APP_DESCRIPTION, APP_DOMAIN, APP_NAME } from './utils/constants'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: APP_NAME,
		short_name: APP_NAME,
		description: APP_DESCRIPTION,
		start_url: '/',
		display: 'standalone',
		theme_color: '#0055ff',
		background_color: '#2EC6FE',
		icons: [
			{
				src: `${APP_DOMAIN}/assets/icon-192.png`,
				sizes: '192x192',
				type: 'image/png',
				purpose: 'maskable',
			},
			{
				src: `${APP_DOMAIN}/assets/icon-512.png`,
				sizes: '512x512',
				type: 'image/png',
				purpose: 'maskable',
			},
		],
	}
}
