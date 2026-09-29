import { z } from 'zod'

// Public variables are inlined into the client bundle by Next.js, so they must
// be referenced by their full static name.
const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
})

export const env = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
})

const secretSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  NOTIFY_EMAIL_TO: z.string().optional(),
  NOTIFY_EMAIL_FROM: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  WHATSAPP_CLOUD_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_OWNER_NUMBER: z.string().optional(),
})

// Lazily validated so that importing this module in a client bundle (for
// `env`) never touches secrets, and so the build does not require them.
let cachedSecrets: z.infer<typeof secretSchema> | undefined

export const secrets: z.infer<typeof secretSchema> = new Proxy({} as z.infer<typeof secretSchema>, {
  get(_target, key: string) {
    if (typeof window !== 'undefined') {
      throw new Error('Secrets are server-only')
    }
    cachedSecrets ??= secretSchema.parse(process.env)
    return cachedSecrets[key as keyof typeof cachedSecrets]
  },
})
