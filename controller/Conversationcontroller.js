import Conversation from "../model/Conversationmodel.js";
import nodemailer from "nodemailer";

export const createConversation = async (req, res) => {
  try {
    const { name, email, phoneNumber, message } = req.body;

    if (!name || !email || !phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Save to DB
    const conversation = await Conversation.create({
      name,
      email,
      phoneNumber,
      message,
    });

    // Mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send mail
    await transporter.sendMail({
      from: `"Website Enquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.CLIENT_EMAIL,
      replyTo: email,
      subject: "New Customer Enquiry from Website",
      html: `
        <h2>New Customer Enquiry</h2>

        <table border="1" cellpadding="8" cellspacing="0">
          <tr>
            <td><b>Name</b></td>
            <td>${name}</td>
          </tr>
          <tr>
            <td><b>Email</b></td>
            <td>${email}</td>
          </tr>
          <tr>
            <td><b>Phone Number</b></td>
            <td>${phoneNumber}</td>
          </tr>
          <tr>
            <td><b>Message</b></td>
            <td>${message}</td>
          </tr>
        </table>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Form submitted successfully. Email sent to client.",
      data: conversation,
    });
  } catch (error) {
    console.error("Backend error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};