import Anthropic from '@anthropic-ai/sdk';

export type ParsedCard = {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  confidence: number;
};

const EMPTY: ParsedCard = {
  firstName: '',
  lastName: '',
  title: '',
  company: '',
  phone: '',
  email: '',
  website: '',
  confidence: 0,
};

const SYSTEM_PROMPT =
  'You are a business-card parser. Given raw OCR text from a business card, ' +
  'return ONLY a JSON object with keys: firstName, lastName, title, company, ' +
  'phone, email, website, confidence (0-1). No prose, no markdown. If a field ' +
  'is absent, use an empty string. Normalize phone toward E.164 when the ' +
  'country is clear. Ignore non-contact marketing text, logos, and multi-line ' +
  'addresses.';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/** Strip code fences and JSON.parse defensively. */
function safeParse(raw: string): ParsedCard {
  let text = raw.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) text = text.slice(start, end + 1);
  try {
    const obj = JSON.parse(text);
    return {
      firstName: String(obj.firstName ?? ''),
      lastName: String(obj.lastName ?? ''),
      title: String(obj.title ?? ''),
      company: String(obj.company ?? ''),
      phone: String(obj.phone ?? ''),
      email: String(obj.email ?? ''),
      website: String(obj.website ?? ''),
      confidence: typeof obj.confidence === 'number' ? Math.max(0, Math.min(1, obj.confidence)) : 0.85,
    };
  } catch {
    return EMPTY;
  }
}

export async function parseCard(ocrText: string): Promise<ParsedCard> {
  const model = process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001';
  const message = await client.messages.create({
    model,
    max_tokens: 512,
    system: [
      // Cache the static instruction block; only the OCR text varies per call.
      { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: `Raw OCR text:\n\n${ocrText}` }],
  });

  const block = message.content.find((b) => b.type === 'text');
  return block && block.type === 'text' ? safeParse(block.text) : EMPTY;
}
