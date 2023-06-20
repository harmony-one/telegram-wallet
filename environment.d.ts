declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "production";
      TELEGRAM_HTTP_KEY: string;
    }
  }
}

export {};