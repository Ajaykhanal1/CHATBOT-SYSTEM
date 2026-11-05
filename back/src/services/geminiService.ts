const MODEL = "gemini-3.5-flash-lite";

const createClient = async () => {
  const { GoogleGenAI } = await import("@google/genai");

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

export const generateAIResponse = async (
  message: string,
  abortSignal?: AbortSignal
): Promise<string> => {
  const ai = await createClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: message,
    config: abortSignal ? { abortSignal } : undefined,
  });

  return response.text ?? "";
};

export const generateAIResponseStream = async function* (
  message: string,
  abortSignal?: AbortSignal
): AsyncGenerator<string> {
  const ai = await createClient();

  const response = await ai.models.generateContentStream({
    model: MODEL,
    contents: message,
    config: abortSignal ? { abortSignal } : undefined,
  });

  for await (const chunk of response) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
};

const cleanTitle = (raw: string) => {
  return raw
    .replace(/^#+\s*/, "")
    .replace(/^title\s*:\s*/i, "")
    .replace(/["'`*_]/g, "")
    .split(/\r?\n/)[0]
    .replace(/\s+/g, " ")
    .replace(/[.,:;!?-]+$/g, "")
    .trim()
    .slice(0, 60);
};

// shortcut: asks the same model for a short title; fall back to the question if it fails
export const generateChatTitle = async (
  question: string,
  abortSignal?: AbortSignal
): Promise<string> => {
  const fallback = question.replace(/\s+/g, " ").trim().slice(0, 50);

  try {
    const ai = await createClient();

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Write a short, specific chat title (2-6 words) that names the topic of this question. Use the question's main subject and intent. No quotes, no punctuation at the end, no generic words like "Question" or "Chat".\n\nQuestion: ${question}\n\nTitle:`,
      config: {
        temperature: 0.2,
        maxOutputTokens: 24,
        ...(abortSignal ? { abortSignal } : {}),
      },
    });

    return cleanTitle(response.text ?? "") || fallback;
  } catch (error) {
    console.error("TITLE GENERATION ERROR:", error);
    return fallback;
  }
};
