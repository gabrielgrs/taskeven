declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: 'development' | 'production' | 'test'
		JWT_SECRET: string
		RESEND_KEY: string
		MONGODB_URI: string
		STRIPE_SECRET_KEY: string
		STRIPE_WEBHOOK_SECRET: string
		STRIPE_CUSTOMER_PORTAL: string
		OPENAI_KEY: string
	}
}
