import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String, required: true }, // Optional image URL
    content: { type: String },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ 
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
