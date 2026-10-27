import qdrant from "../config/qdrant";
import { generateEmbedding } from "./embedding";

const searchQdrant = async (question: string) => {
  try {
    const questionEmbedding = await generateEmbedding(question);

    const client = await qdrant();

    const results = await client.query("chatbot_documents", {
      query: questionEmbedding,
      limit: 5,
      with_payload: true,
    });

    console.log(
      results.points.map((point: any) => ({
        score: point.score,
        fileName: point.payload?.fileName,
        chunkIndex: point.payload?.chunkIndex,
        text: point.payload?.text,
      }))
    );

    return results;
  } catch (error) {
    console.error("QDRANT SEARCH ERROR:", error);
    return { points: [] } as any;
  }
};

export default searchQdrant;
