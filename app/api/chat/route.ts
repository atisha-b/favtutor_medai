import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: "", // Use an environment variable for security
});

const SYSTEM_MESSAGE = {
  role: "system",
  content: `You are a medical assistant bot, designed to provide information and answer questions about health and medical topics. You should:
    - Only respond to health and medical-related queries
    - Provide evidence-based medical information
    - Always remind users to consult healthcare professionals for specific medical advice
    - Decline to answer non-medical questions politely
    - Use clear, simple language to explain medical concepts
    - Avoid making definitive diagnoses
    - Include relevant health disclaimers when appropriate`,
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const fullMessages = [SYSTEM_MESSAGE, ...messages];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fullMessages,
      temperature: 0.1,
      max_tokens: 1000,
    });

    return NextResponse.json({ response: completion.choices[0].message });
  } catch (error: any) {
    console.error("Error:", error.message || error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}