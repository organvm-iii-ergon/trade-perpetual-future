import type { Symbol, SentimentData, Reality, HashtagTrend, Alert } from './types'

export async function analyzeSentiment(symbol: string): Promise<SentimentData> {
  const prompt = `Analyze the current market sentiment for ${symbol}. 
Consider recent market conditions, social media buzz, and general trader sentiment.
Provide a sentiment score from -100 (extremely bearish) to +100 (extremely bullish),
a confidence level (0-100), and estimated discussion volume (1-100).
Return as JSON with properties: score (number), confidence (number), volume (number)`

  const result = await window.spark.llm(prompt, 'gpt-4o-mini', true)
  const data = JSON.parse(result)
  
  const score = Math.max(-100, Math.min(100, data.score || 0))
  let label: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral'
  if (score > 20) label = 'Bullish'
  else if (score < -20) label = 'Bearish'
  
  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (score > 40 || data.volume > 70) trend = 'up'
  else if (score < -40 || data.volume < 30) trend = 'down'
  
  return {
    score,
    label,
    confidence: data.confidence || 60,
    volume: data.volume || 50,
    trend,
    lastUpdated: Date.now()
  }
}

export async function generateRealities(
  symbol: string, 
  currentPrice: number,
  sentiment: SentimentData
): Promise<Reality[]> {
  const prompt = `Given the stock/crypto symbol ${symbol} 
with current price $${currentPrice} and sentiment score ${sentiment.score} (where -100 is extremely bearish and +100 is extremely bullish),
generate 4 distinct potential market realities over the next 7 days.

Each reality should have:
- A descriptive label (e.g., "Bull Rally", "Bear Correction", "Sideways Consolidation", "High Volatility")
- A probability percentage (all should sum to approximately 100%)
- A series of 7 price points showing the projected price path
- Overall sentiment (bullish, bearish, neutral, or volatile)

Return as JSON with this structure:
{
  "realities": [
    {
      "label": "string",
      "description": "brief description",
      "probability": number,
      "pricePoints": [
        {"day": 0, "price": number},
        {"day": 1, "price": number},
        ...
        {"day": 6, "price": number}
      ],
      "sentiment": "bullish" | "bearish" | "neutral" | "volatile"
    }
  ]
}`

  const result = await window.spark.llm(prompt, 'gpt-4o', true)
  const data = JSON.parse(result)
  
  const colors = [
    'oklch(0.65 0.18 145)',
    'oklch(0.55 0.22 25)', 
    'oklch(0.70 0.12 210)',
    'oklch(0.60 0.18 290)'
  ]
  
  return data.realities.map((r: any, i: number) => ({
    id: `reality-${i}`,
    label: r.label,
    description: r.description,
    probability: r.probability,
    pricePoints: r.pricePoints.map((p: any) => ({
      time: `Day ${p.day}`,
      price: p.price
    })),
    sentiment: r.sentiment,
    color: colors[i % colors.length]
  }))
}

export async function analyzeHashtags(symbol: string): Promise<HashtagTrend[]> {
  const prompt = `Generate 8-10 realistic trending hashtags 
related to ${symbol} with their current sentiment analysis. Include mix of ticker-specific, 
market-related, and sentiment hashtags.

Return as JSON:
{
  "hashtags": [
    {
      "hashtag": "string (with #)",
      "mentions": number (100-10000),
      "sentiment": number (-100 to 100),
      "changePercent": number (-50 to 50)
    }
  ]
}`

  const result = await window.spark.llm(prompt, 'gpt-4o-mini', true)
  const data = JSON.parse(result)
  
  return data.hashtags.map((h: any) => {
    const sentiment = Math.max(-100, Math.min(100, h.sentiment))
    let sentimentLabel: 'Positive' | 'Negative' | 'Neutral' = 'Neutral'
    if (sentiment > 20) sentimentLabel = 'Positive'
    else if (sentiment < -20) sentimentLabel = 'Negative'
    
    let trend: 'rising' | 'falling' | 'stable' = 'stable'
    if (h.changePercent > 10) trend = 'rising'
    else if (h.changePercent < -10) trend = 'falling'
    
    return {
      hashtag: h.hashtag,
      mentions: h.mentions,
      sentiment,
      sentimentLabel,
      trend,
      changePercent: h.changePercent
    }
  })
}

export function checkForAlerts(
  symbol: string, 
  sentiment: SentimentData,
  previousSentiment?: SentimentData
): Alert | null {
  if (sentiment.score < -40) {
    return {
      id: `alert-${Date.now()}`,
      symbol,
      type: 'downtrend',
      severity: sentiment.score < -60 ? 'high' : 'medium',
      message: `Strong bearish sentiment detected for ${symbol} (${sentiment.score})`,
      timestamp: Date.now(),
      dismissed: false
    }
  }
  
  if (previousSentiment && sentiment.score - previousSentiment.score < -30) {
    return {
      id: `alert-${Date.now()}`,
      symbol,
      type: 'sentiment-drop',
      severity: 'high',
      message: `Rapid sentiment drop for ${symbol}: ${previousSentiment.score} → ${sentiment.score}`,
      timestamp: Date.now(),
      dismissed: false
    }
  }
  
  if (sentiment.volume > 85 && Math.abs(sentiment.score) < 15) {
    return {
      id: `alert-${Date.now()}`,
      symbol,
      type: 'volatility',
      severity: 'low',
      message: `High volatility expected for ${symbol} (high volume, mixed sentiment)`,
      timestamp: Date.now(),
      dismissed: false
    }
  }
  
  return null
}

export function getSentimentColor(score: number): string {
  if (score > 20) return 'text-success'
  if (score < -20) return 'text-destructive'
  return 'text-muted-foreground'
}

export function getSentimentBgColor(score: number): string {
  if (score > 20) return 'bg-success/20'
  if (score < -20) return 'bg-destructive/20'
  return 'bg-muted/20'
}
