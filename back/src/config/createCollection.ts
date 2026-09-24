import getQdrantClient from "../config/qdrant";

const createCollection = async () => {
  const qdrant = await getQdrantClient();

  await qdrant.createCollection("chatbot_documents", {
    vectors: {
      size: 768,
      distance: "Cosine",
    },
  });

  console.log("Collection created successfully");
};

createCollection();