export const ENV = {
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || "",
};

export function validateEnv(): boolean {
  if (!ENV.OPENAI_API_KEY || ENV.OPENAI_API_KEY === "your-openai-api-key-here") {
    console.warn("OpenAI API key not configured. Add your key to .env file.");
    return false;
  }
  return true;
}
