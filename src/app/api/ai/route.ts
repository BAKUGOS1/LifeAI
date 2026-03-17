import Groq from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('GROQ_API_KEY is missing');
    }
    const groq = new Groq({ apiKey: apiKey || 'dummy-key-for-build' });
    
    const { problem, category } = await req.json();

    if (!problem || typeof problem !== 'string') {
      return NextResponse.json({ error: 'Problem description is required' }, { status: 400 });
    }

    const systemPrompt = `You are LifeAI, an intelligent daily life problem solver. The user is asking for help in the "${category || 'general'}" category.

Provide practical, actionable advice in a structured numbered list of 4-6 steps. Each step should be concise but specific. Include relevant statistics or science-backed facts where helpful.

IMPORTANT SAFETY RULES:
- If the question involves serious medical symptoms, say: "⚠️ This sounds like it may need professional medical attention. Please consult a doctor. In the meantime, here are some general wellness tips:"
- If the question involves legal matters, say: "⚠️ For legal advice, please consult a qualified attorney. Here are some general suggestions:"
- If the question involves serious financial decisions (investing large sums, debt crisis), say: "⚠️ For major financial decisions, consider consulting a certified financial advisor. Here are some general principles:"
- Never recommend specific medications, dosages, or treatments.

Format: Return ONLY a JSON object with this exact structure (no markdown, no code fences):
{"steps": ["Step 1 text", "Step 2 text", ...], "safety_note": "optional disclaimer or null"}`;

    const completion = await groq.chat.completions.create({
      model: process.env.LLM_MODEL || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: problem },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content || '';

    // Try to parse JSON from the response
    let parsed;
    try {
      // Try direct parse first
      parsed = JSON.parse(raw);
    } catch {
      // Try to extract JSON from markdown code fences
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by newlines and treat as steps
        const lines = raw.split('\n').filter(l => l.trim().length > 0);
        parsed = { steps: lines.slice(0, 6), safety_note: null };
      }
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error('AI Route Error:', error);
    const message = error instanceof Error ? error.message : 'AI service temporarily unavailable';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
