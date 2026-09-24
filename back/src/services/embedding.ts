import ollama from "ollama";

export const generateEmbedding = async (text: string) => {
  const response = await ollama.embed({
    model: "nomic-embed-text",
    input: text,
  });

  return response.embeddings[0];
};