import mongoose from "mongoose";

const customerSupportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    supportType: {
      type: String,
      required: true,
      enum: ["Course Support", "Project Support", "Other Support"],
    },

    courseName: {
      type: String,
      trim: true,
      default: "",
    },

    projectType: {
      type: String,
      trim: true,
      default: "",
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
  },
  { timestamps: true }
);

const CustomerSupport = mongoose.model(
  "CustomerSupport",
  customerSupportSchema
);

export default CustomerSupport;