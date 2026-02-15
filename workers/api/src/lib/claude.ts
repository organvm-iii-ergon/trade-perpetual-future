import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | null = null

function getClient(apiKey: string): Anthropic { // allow-secret
  if (!client) {
    client = new Anthropic({ apiKey })
  }
  return client
}

export async function callClaude(
  apiKey: string, // allow-secret
  prompt: string,
): Promise<string> {
  const anthropic = getClient(apiKey)

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const textBlock = response.content.find(b => b.type === 'text')
  return textBlock?.text ?? ''
}

export function parseJsonResponse<T>(raw: string): T | null {
  // Extract JSON from potential markdown code blocks
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/) ?? raw.match(/(\[[\s\S]*\])/) ?? raw.match(/(\{[\s\S]*\})/)
  const jsonStr = jsonMatch?.[1]?.trim() ?? raw.trim()

  try {
    return JSON.parse(jsonStr) as T
  } catch {
    return null
  }
}
