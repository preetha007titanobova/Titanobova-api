import Conversation from "../model/Conversationmodel.js";
import nodemailer from "nodemailer";
  export const createConversation = async (req, res) => {
  try {
    console.log("Body:", req.body);
     const { name, email, phoneNumber, message } = req.body;
     const conversation = await Conversation.create({
      name,
      email,
      phoneNumber,
      message,
    });
    const transporter = nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
      }
    })
    await transporter.sendMail({
      from:`"Website Enquiry" <${process.env.EMAIL_USER}>`,
      to:process.env.CLIENT_EMAIL,
      replyTo: email,
      subject:"New Customer Enquiry from Website",
      html:`<h2>New Customer Enquiry </h2>
                <p><b>Name:</b>${name}</p>
                <p><b>Email:</b>${email}</p>
                <p><b>Phone Number:</b>${phoneNumber}</p>
                <p><b>Message:</b>${message}</p>
                `
    })
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("CLIENT_EMAIL:", process.env.CLIENT_EMAIL);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
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