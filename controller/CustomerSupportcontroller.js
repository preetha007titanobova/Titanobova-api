import CustomerSupport from "../model/CustomerSupportmodel.js";
import nodemailer from "nodemailer";

export const createCustomerSupport = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      supportType,
      courseName,
      projectType,
      message,
    } = req.body;
    console.log("req.body", req.body);
    if (!name || !email || !phone || !supportType) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }
const customerSupport = await CustomerSupport.create({
  name,
  email,
  phone,
  supportType,
  courseName,
  projectType,
  message,
});
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CLIENT_EMAIL,
      subject: `New Customer Request - ${supportType}`,
      html: `
        <h2>New Customer Support Request</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Support Type:</strong> ${supportType}</p>

        ${
          supportType === "Course Support"
            ? `<p><strong>Course Name:</strong> ${courseName || "Not selected"}</p>`
            : ""
        }

        ${
          supportType === "Project Support"
            ? `<p><strong>Project Type:</strong> ${projectType || "Not selected"}</p>`
            : ""
        }

        <p><strong>Message:</strong></p>
        <p>${message || "No message provided"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: "Customer request sent successfully",
      data: customerSupport,
    });
  } catch (error) {
    console.log("Email error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send customer request",
    });
  }
};
