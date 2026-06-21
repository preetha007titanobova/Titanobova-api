import mongoose from "mongoose";

const serviceEnquirySchema = new mongoose.Schema(
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
    },
    organisation: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: [
        "Website Development",
        "Software Development",
        "Mobile Application",
        "Web Application",
        "E-Commerce Website",
        "SaaS Product Development",
        "UI/UX Design",
        "Backend API Development",
        "Project Support",
        "Maintenance & Support",
        "Other",
      ],
    },
    otherService: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
const ServiceEnquiry = mongoose.model("ServiceEnquiry", serviceEnquirySchema);

export default ServiceEnquiry;
