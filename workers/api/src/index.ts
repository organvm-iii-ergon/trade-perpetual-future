import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sentimentRoutes } from './routes/sentiment'
import { affiliateRoutes } from './routes/affiliate'

export interface Env {
  SENTIMENT_CACHE: KVNamespace
  AFFILIATE_KV: KVNamespace
  ANTHROPIC_API_KEY: string
  SOLANA_RPC_ENDPOINT: string
}

const app = new Hono<{ Bindings: Env }>()

// CORS
app.use('*', cors({
  origin: ['http://localhost:5173', 'https://*.pages.dev'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-Wallet-Address'],
}))

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }))

// Mount routes
app.route('/api/sentiment', sentimentRoutes)
app.route('/api/affiliate', affiliateRoutes)

// Global error handler
app.onError((err, c) => {
  console.error('Worker error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

app.notFound((c) => c.json({ error: 'Not found' }, 404))

export default app
