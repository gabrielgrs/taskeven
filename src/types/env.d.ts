declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string
    JWT_SECRET: string
    STRIPE_SECRET_KEY: string
  }
}
