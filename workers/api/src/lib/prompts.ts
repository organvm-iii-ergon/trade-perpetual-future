export function sentimentPrompt(symbol: string): string {
  return `Analyze the current market sentiment for ${symbol} cryptocurrency. Return ONLY valid JSON with this exact structure:
{
  "score": <number -100 to 100>,
  "label": "<Bullish|Bearish|Neutral>",
  "confidence": <number 0 to 100>,
  "volume": <number 0 to 100, relative social volume>,
  "trend": "<up|down|stable>"
}
Base your analysis on general market knowledge for ${symbol}. Be concise.`
}

export function realitiesPrompt(symbol: string, currentPrice: number): string {
  return `Generate 4 alternative market scenarios for ${symbol} at current price $${currentPrice}. Return ONLY valid JSON array with exactly 4 objects:
[
  {
    "label": "<scenario name>",
    "description": "<1-2 sentence description>",
    "probability": <number, all 4 must sum to 100>,
    "sentiment": "<bullish|bearish|neutral|volatile>",
    "priceProjection": [<7 daily prices starting from ${currentPrice}>]
  }
]
Include: bull case, bear case, consolidation, and black swan scenarios.`
}

export function hashtagsPrompt(symbol: string): string {
  return `Generate 9 trending crypto hashtags related to ${symbol}. Return ONLY valid JSON array:
[
  {
    "hashtag": "<#tag>",
    "mentions": <number 100-10000>,
    "sentiment": <number -100 to 100>,
    "sentimentLabel": "<Positive|Negative|Neutral>",
    "trend": "<rising|falling|stable>",
    "changePercent": <number -50 to 50>
  }
]
Include the symbol-specific tags and general crypto tags.`
}
