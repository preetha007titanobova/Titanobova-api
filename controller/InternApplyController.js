import Intern from "../model/InternapplyModel.js";
import nodemailer from "nodemailer";

export const applyIntern = async (req, res) => {
      console.log("Intern API Hit");
  try {
    const { name, email, contact, internType, internChoice } = req.body;
      console.log("reqxcvhjk",req.body)

    if (!name || !email || !contact || !internType || !internChoice) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const intern = await Intern.create({
      name,
      email,
      contact,
      internType,
      internChoice,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Titanobova Internship" <${process.env.EMAIL_USER}>`,
      to: process.env.CLIENT_EMAIL,
      replyTo: email,
      subject: `New ${internType} Application`,
      html: `
        <div style="font-family: Arial, sans-serif; padding:20px">
          <h2 style="color:#0f3076;">
            New Internship Application
          </h2>

          <table border="1" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <td><b>Name</b></td>
              <td>${name}</td>
            </tr>

            <tr>
              <td><b>Email</b></td>
              <td>${email}</td>
            </tr>

            <tr>
              <td><b>Contact</b></td>
              <td>${contact}</td>
            </tr>

            <tr>
              <td><b>Intern Type</b></td>
              <td>${internType}</td>
            </tr>

            <tr>
              <td><b>Course / Domain</b></td>
              <td>${internChoice}</td>
            </tr>
          </table>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: `${internType} application submitted successfully`,
      data: intern,
    });
  } catch (error) {
    console.error("Intern apply error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};