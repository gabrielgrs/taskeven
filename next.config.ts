import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	env: {},
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [{ hostname: 'placehold.co', protocol: 'https' }],
	},
	experimental: {
		reactCompiler: true,
	},
}

export default nextConfig
