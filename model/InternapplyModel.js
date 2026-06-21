import mongoose from "mongoose";

const internSchema = new mongoose.Schema(
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
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    internType: {
      type: String,
      enum: ["Paid Intern", "Unpaid Intern"],
      required: true,
    },
     internChoice: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const Intern = mongoose.model("Intern", internSchema);

export default Intern;