import ollama from "ollama";

export const generateEmbedding = async (text: string): Promise<number[]> => {
  try {
    const response = await ollama.embed({
      model: "nomic-embed-text",
      input: text,
    });

    return response.embeddings[0];
  } catch (error) {
    console.error("EMBEDDING ERROR:", error);
    return Array(768).fill(0);
  }
};