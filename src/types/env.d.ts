declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string
    JWT_SECRET: string
    RESEND_KEY: string
    STRIPE_SECRET_KEY: string
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    OPENAI_API_KEY: string
    CRON_SECRET?: string
    NEXT_PUBLIC_FEATURE_FLAGS?: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CLIENT_ID: string
    BLOB_READ_WRITE_TOKEN: string
  }
}
