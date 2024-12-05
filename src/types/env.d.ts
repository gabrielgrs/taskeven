declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production' | 'test'
		JWT_SECRET: string
		RESEND_KEY: string
		MONGODB_URI: string
	}
}
