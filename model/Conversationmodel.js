import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

export default Conversation;