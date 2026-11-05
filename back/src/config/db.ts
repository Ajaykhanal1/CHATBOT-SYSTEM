import mongoose from "mongoose";
import Student from "../models/Student";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    // Migrate the old required user index to a sparse one so admin-created
    // students can exist without a User account.
    const indexes = await Student.collection.indexes();
    const oldUserIndex = indexes.find(
      (index) => index.key?.user === 1 && !index.sparse
    );

    if (oldUserIndex) {
      await Student.collection.dropIndex(oldUserIndex.name as string);
    }

    await Student.syncIndexes();

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};