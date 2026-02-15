export async function getCached<T>(
  kv: KVNamespace,
  key: string,
): Promise<T | null> {
  const raw = await kv.get(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function setCache(
  kv: KVNamespace,
  key: string,
  value: unknown,
  ttlSeconds: number = 900,
): Promise<void> {
  await kv.put(key, JSON.stringify(value), { expirationTtl: ttlSeconds })
}
