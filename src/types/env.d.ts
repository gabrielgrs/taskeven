declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string
    JWT_SECRET: string
    AUTHENTICATED_USER?: string
    STRIPE_SECRET_KEY: string
  }
}
