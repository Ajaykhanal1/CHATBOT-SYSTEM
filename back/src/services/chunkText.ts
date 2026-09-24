export const chunkText = (
  text: string,
  chunkSize = 1000,
  chunkOverlap = 200
): string[] => {
  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += chunkSize - chunkOverlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
};