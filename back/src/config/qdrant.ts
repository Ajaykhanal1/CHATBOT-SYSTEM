const getQdrantClient = async () => {
  const { QdrantClient } = await import("@qdrant/js-client-rest");

  return new QdrantClient({
    url: process.env.QDRANT_URL!,
    apiKey: process.env.QDRANT_API_KEY!,
  });
};

export default getQdrantClient;