import ServiceEnquiry from "../model/ServiceEnquiryModel.js";
import nodemailer from "nodemailer";

export const createServiceEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      organisation,
      contact,
      serviceType,
      otherService,
      description,
    } = req.body;

    if (!name || !email || !contact || !serviceType || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    if (serviceType === "Other" && !otherService) {
      return res.status(400).json({
        success: false,
        message: "Please enter your service requirement",
      });
    }

    const enquiry = await ServiceEnquiry.create({
      name,
      email,
      organisation,
      contact,
      serviceType,
      otherService,
      description,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Titanobova Services" <${process.env.EMAIL_USER}>`,
      to: process.env.CLIENT_EMAIL,
      replyTo: email,
      subject: `New Service Enquiry - ${serviceType}`,
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>New Service Enquiry</h2>

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
              <td><b>Organisation</b></td>
              <td>${organisation || "Not Provided"}</td>
            </tr>

            <tr>
              <td><b>Contact</b></td>
              <td>${contact}</td>
            </tr>

            <tr>
              <td><b>Service Type</b></td>
              <td>${serviceType}</td>
            </tr>

            ${
              serviceType === "Other"
                ? `
                <tr>
                  <td><b>Custom Service</b></td>
                  <td>${otherService}</td>
                </tr>
              `
                : ""
            }

            <tr>
              <td><b>Description</b></td>
              <td>${description}</td>
            </tr>
          </table>
        </div>
      `,
    });

    // Optional confirmation email to customer
    await transporter.sendMail({
      from: `"Titanobova Technologies" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Service Enquiry Received",
      html: `
        <h2>Thank You for Contacting Titanobova</h2>

        <p>Hello ${name},</p>

        <p>
          We have received your service enquiry regarding
          <b>${serviceType}</b>.
        </p>

        <p>
          Our team will review your requirement and contact you shortly.
        </p>

        <p>Thank you for choosing Titanobova Technologies.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Service enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    console.error("Service enquiry error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};