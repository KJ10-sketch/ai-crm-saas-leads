
import { ApiError } from '../utils/apiError.js';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const model = () =>
  process.env.OPENROUTER_MODEL || 'openrouter/free';

export const isAIConfigured = () =>
  Boolean(process.env.OPENROUTER_API_KEY);

async function json(prompt, schema) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new ApiError(503, 'OpenRouter AI is not configured');
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-OpenRouter-Title': 'AI CRM',
      },
      body: JSON.stringify({
        model: model(),
        messages: [
          {
            role: 'system',
            content:
              'You are an AI assistant for a CRM application. ' +
              'Return only a valid JSON object matching the requested schema. ' +
              'Do not include Markdown or additional text.',
          },
          {
            role: 'user',
            content:
              `${prompt}\n\n` +
              `Required JSON schema:\n${JSON.stringify(schema)}`,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(60000),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, data);
      throw new Error(`OpenRouter returned HTTP ${response.status}`);
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content || typeof content !== 'string') {
      throw new Error('OpenRouter returned an empty response');
    }

    const result = JSON.parse(content);

    if (
      !result ||
      typeof result !== 'object' ||
      Array.isArray(result)
    ) {
      throw new Error('AI response is not a JSON object');
    }

    return result;
  } catch (error) {
    console.error('OpenRouter request failed:', error.message);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      502,
      'AI service failed to return a valid response'
    );
  }
}

export const generateLeadSummary = (lead) =>
  json(
    `You are a B2B sales analyst. Analyze this lead and return concise actionable data. Lead: ${
      JSON.stringify({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        status: lead.status,
        value: lead.value,
        source: lead.source,
        priority: lead.priority,
        notes: lead.notes,
      })
    }`,
    {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        riskScore: { type: 'integer' },
        suggestedPriority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
        },
        nextBestAction: { type: 'string' },
      },
      required: [
        'summary',
        'riskScore',
        'suggestedPriority',
        'nextBestAction',
      ],
    }
  );

export const generateEmail = (lead, sender, purpose, tone) =>
  json(
    `Write a professional sales email under 180 words. ` +
      `Sender: ${sender.name} at ${sender.company || 'the company'}. ` +
      `Purpose: ${purpose}. Tone: ${tone}. ` +
      `Recipient/lead: ${JSON.stringify({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        status: lead.status,
        value: lead.value,
        notes: lead.notes,
      })}.`,
    {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        body: { type: 'string' },
      },
      required: ['subject', 'body'],
    }
  );

export const generateSalesInsights = (stats) =>
  json(
    `Act as a revenue operations adviser. Use only these pipeline ` +
      `statistics and produce data-driven observations and recommendations. ` +
      `${JSON.stringify(stats, null, 2)}`,
    {
      type: 'object',
      properties: {
        headline: { type: 'string' },
        insights: {
          type: 'array',
          items: { type: 'string' },
        },
        recommendations: {
          type: 'array',
          items: { type: 'string' },
        },
        healthScore: { type: 'integer' },
      },
      required: [
        'headline',
        'insights',
        'recommendations',
        'healthScore',
      ],
    }
  );
