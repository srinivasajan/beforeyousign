/**
 * NVIDIA NIM API Client
 *
 * Centralised OpenAI-compatible client for all NVIDIA NIM AI calls.
 * Docs: https://docs.api.nvidia.com
 *
 * All AI calls in the app go through this module so the key and base URL
 * are configured in one place and are NEVER exposed to the browser.
 */

import OpenAI from 'openai';

// ---------------------------------------------------------------------------
// Model catalogue
// ---------------------------------------------------------------------------
export const NVIDIA_MODELS = {
  /** Primary model – ultimate reasoning and highest capability context support */
  primary: 'meta/llama-3.3-70b-instruct',
  /** Fallback – newest 70B model, extremely high quality and faster */
  fallback: 'meta/llama-3.1-70b-instruct',
  /** Lightweight – for quick tasks */
  fast: 'meta/llama-3.1-8b-instruct',
} as const;

const DEFAULT_NVIDIA_TIMEOUT_MS = Number.parseInt(
  process.env.NVIDIA_REQUEST_TIMEOUT_MS || '18000',
  10
);

// ---------------------------------------------------------------------------
// Client factory
// ---------------------------------------------------------------------------
export function createNvidiaClient(): OpenAI {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY environment variable is not set.');
  }
  return new OpenAI({
    apiKey,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate text from a single user prompt.
 * Returns the raw response string.
 */
export async function generateText(
  prompt: string,
  model: string = NVIDIA_MODELS.primary,
  temperature = 0.7,
  maxTokens = 4096,
  timeoutMs = DEFAULT_NVIDIA_TIMEOUT_MS,
): Promise<string> {
  const client = createNvidiaClient();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let completion;
  try {
    completion = await client.chat.completions.create(
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: maxTokens,
      },
      {
        signal: controller.signal,
      }
    );
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`NVIDIA request timed out after ${timeoutMs}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  return completion.choices[0]?.message?.content ?? '';
}

/**
 * Generate text with a system prompt.
 */
export async function generateWithSystem(
  systemPrompt: string,
  userPrompt: string,
  model: string = NVIDIA_MODELS.primary,
  temperature = 0.7,
  maxTokens = 4096,
): Promise<string> {
  const client = createNvidiaClient();

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  });

  return completion.choices[0]?.message?.content ?? '';
}

/**
 * Parse JSON from an AI response, stripping markdown code fences if present.
 */
export function parseJsonResponse<T>(text: string): T {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonText = jsonMatch ? jsonMatch[1] : text;
  return JSON.parse(jsonText.trim()) as T;
}
