import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "New Chat",
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    favorite: {
      type: Boolean,
      default: false,
    },

    archived: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 1000),
    },
  },
  { timestamps: true }
);

// Delete document when expiresAt is reached
chatSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.model("Chat", chatSchema);