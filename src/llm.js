import { buildPrompt } from './prompt.js';

const OPENAI_API_URL = process.env.OPENAI_API_URL;
const MODEL = process.env.MODEL || 'llama3-8b-8192';

export async function summarizeText(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is not set. Add your API key to the .env file.'
    );
  }

  if (!OPENAI_API_URL) {
    throw new Error(
      'OPENAI_API_URL is not set. Add it to the .env file.'
    );
  }

  const prompt = buildPrompt(text);

  let response;
  try {
    response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch (err) {
    throw new Error(`Network error while calling LLM API: ${err.message}`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`LLM API returned ${response.status}: ${body}`);
  }

  const data = await response.json();
  const rawContent = data?.choices?.[0]?.message?.content ?? '';

  return parseStructuredOutput(rawContent);
}

function parseStructuredOutput(raw) {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `Model returned content that is not valid JSON.\n\nRaw response:\n${raw}`
    );
  }

  if (typeof parsed.summary !== 'string' || !parsed.summary.trim()) {
    throw new Error('Invalid response: "summary" field is missing or empty.');
  }
  if (!Array.isArray(parsed.keyPoints) || parsed.keyPoints.length !== 3) {
    throw new Error('Invalid response: "keyPoints" must be an array of exactly 3 items.');
  }
  const VALID_SENTIMENTS = ['positive', 'neutral', 'negative'];
  if (!VALID_SENTIMENTS.includes(parsed.sentiment)) {
    throw new Error(
      `Invalid response: "sentiment" must be one of ${VALID_SENTIMENTS.join(', ')}.`
    );
  }

  return {
    summary: parsed.summary.trim(),
    keyPoints: parsed.keyPoints.map((p) => String(p).trim()),
    sentiment: parsed.sentiment,
  };
}
