import 'server-only'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export type RateLimitOptions = { limit: number; windowSeconds: number }
export type RateLimitResult = { ok: boolean; remaining: number; resetAt: number }

// Upstash (shared across serverless instances) when configured; otherwise a
// per-instance sliding window, which is fine for local development and still
// slows down a single abusive client in production.
let warned = false
const memory = new Map<string, number[]>()

function memoryLimit(key: string, { limit, windowSeconds }: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const hits = (memory.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    return { ok: false, remaining: 0, resetAt: hits[0] + windowMs }
  }
  hits.push(now)
  memory.set(key, hits)
  if (memory.size > 10_000) memory.clear()
  return { ok: true, remaining: limit - hits.length, resetAt: now + windowMs }
}

const limiters = new Map<string, Ratelimit>()

function upstashLimiter(options: RateLimitOptions): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  const id = `${options.limit}/${options.windowSeconds}`
  let limiter = limiters.get(id)
  if (!limiter) {
    limiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(options.limit, `${options.windowSeconds} s`),
      prefix: 'rl',
    })
    limiters.set(id, limiter)
  }
  return limiter
}

export async function rateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const limiter = upstashLimiter(options)
  if (!limiter) {
    if (process.env.NODE_ENV === 'production' && !warned) {
      warned = true
      console.warn('[rate-limit] UPSTASH_REDIS_REST_URL not set; using per-instance memory limiter')
    }
    return memoryLimit(key, options)
  }
  const res = await limiter.limit(key)
  return { ok: res.success, remaining: res.remaining, resetAt: res.reset }
}
