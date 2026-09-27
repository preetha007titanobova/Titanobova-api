import Intern from "../model/InternapplyModel.js";
import nodemailer from "nodemailer";

export const applyIntern = async (req, res) => {
  try {
    const { name, email, contact, internType, internChoice } = req.body;

    // Validate fields
    if (!name || !email || !contact || !internType || !internChoice) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const applicantEmail = email.toLowerCase().trim();

    // October 21, 2026 - 12:00 AM IST
    const expiryDate = new Date("2026-10-21T00:00:00+05:30");

    // Check duplicate application
    const existingIntern = await Intern.findOne({
      email: applicantEmail,
    }).sort({ createdAt: -1 });

    if (existingIntern && new Date() < expiryDate) {
      return res.status(409).json({
        success: false,
        message:
          "You have already submitted an internship application. You can apply again after October 21, 2026.",
      });
    }

    // Save application
    const intern = await Intern.create({
      name,
      email: applicantEmail,
      contact,
      internType,
      internChoice,
    });

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ==========================================
    // 1. SEND THANK-YOU EMAIL TO APPLICANT
    // ==========================================

    try {
      const applicantMail = await transporter.sendMail({
        from: `"Titanobova Private Limited" <${process.env.EMAIL_USER}>`,
        to: applicantEmail,
        replyTo: process.env.CLIENT_EMAIL,
        subject: "Internship Application Received - Titanobova",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            background-color: #f5f8fc;
            padding: 30px;
          ">

            <div style="
              max-width: 600px;
              margin: auto;
              background: #ffffff;
              padding: 30px;
              border-radius: 10px;
            ">

              <h2 style="
                color: #0f3076;
                margin-top: 0;
              ">
                Thank You for Contacting Titanobova!
              </h2>

              <p style="
                font-size: 16px;
                color: #333;
              ">
                Dear <strong>${name}</strong>,
              </p>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #444;
              ">
                Thank you for your interest in joining
                <strong>Titanobova Private Limited</strong>.
                We have successfully received your internship application.
              </p>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #444;
              ">
                Our team will review your application and get back to you
                with further details regarding the next steps.
              </p>

              <div style="
                background: #f0f5ff;
                padding: 15px;
                border-left: 4px solid #0f3076;
                margin: 20px 0;
              ">

                <p style="margin: 5px 0;">
                  <strong>Intern Type:</strong> ${internType}
                </p>

                <p style="margin: 5px 0;">
                  <strong>Course / Domain:</strong> ${internChoice}
                </p>

              </div>

              <p style="
                font-size: 15px;
                line-height: 1.6;
                color: #444;
              ">
                We appreciate your interest in Titanobova and look forward
                to connecting with you.
              </p>

              <p style="
                font-size: 15px;
                color: #333;
              ">
                Regards,<br>
                <strong>Titanobova Private Limited</strong><br>
                HR Team
              </p>

            </div>

          </div>
        `,
      });

    

    } catch (emailError) {
      console.error("Applicant email failed:", emailError);
    }

    try {
      const adminMail = await transporter.sendMail({
        from: `"Titanobova Internship" <${process.env.EMAIL_USER}>`,
        to: process.env.CLIENT_EMAIL,
        replyTo: applicantEmail,
        subject: `New ${internType} Application`,
          
        html: `
          <div style="
            font-family: Arial, sans-serif;
            padding: 20px;
          ">

            <h2 style="color:#0f3076;">
              New Internship Application
            </h2>

            <table
              border="1"
              cellpadding="10"
              cellspacing="0"
              style="border-collapse:collapse;"
            >

              <tr>
                <td><b>Name</b></td>
                <td>${name}</td>
              </tr>

              <tr>
                <td><b>Email</b></td>
                <td>${applicantEmail}</td>
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


    } catch (emailError) {
      console.error("Admin email failed:", emailError);
    }

    return res.status(201).json({
      success: true,
      message: `${internType} application submitted successfully`,
      data: intern,
    });

  } catch (error) {
    console.error("Intern apply error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};