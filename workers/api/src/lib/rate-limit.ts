export async function checkRateLimit(
  kv: KVNamespace,
  identifier: string,
  maxRequests: number = 10,
  windowSeconds: number = 60,
): Promise<{ allowed: boolean; remaining: number }> {
  const minute = Math.floor(Date.now() / (windowSeconds * 1000))
  const key = `ratelimit:${identifier}:${minute}`

  const current = parseInt(await kv.get(key) ?? '0', 10)

  if (current >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  await kv.put(key, String(current + 1), { expirationTtl: windowSeconds * 2 })
  return { allowed: true, remaining: maxRequests - current - 1 }
}
