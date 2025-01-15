const nodemailer = require("nodemailer");
require("dotenv").config()

const mail = async (name, date, email) => {

    const transporter = nodemailer.createTransport({
        service: "gmail", // Use your email provider
        auth: {
            user: process.env.USER, // Your email
            pass: process.env.PASS, // Your email password or app password
        },
    });

    const patientEmailTemplate = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
    <h2 style="color: #3498db;">Appointment Pending</h2>
    <p style="font-size: 16px; color: #34495e;">Dear ${name},</p>
    <p style="font-size: 16px; color: #34495e;">
      Thank you for booking an appointment. Your appointment request has been received and is pending confirmation.
    </p>
    <ul style="font-size: 16px; color: #34495e;">
      <li><strong>Date & Time:</strong> ${date}</li>
    </ul>
    <p style="font-size: 16px; color: #34495e;">We will notify you once the appointment is confirmed.</p>
    <p style="font-size: 16px; color: #34495e;">Best regards,<br>Bitrox Dental Team</p>
  </div>
`;
    // Send email to the patient
    transporter.sendMail(
        {
            from: `"Bitrox Dental" <${process.env.USER}>`,
            to: email,
            subject: "Your Appointment is Pending",
            html: patientEmailTemplate,
        },
        (error, info) => {
            if (error) {
                return console.error("Error sending email to patient:", error);
            }
            console.log("Email sent to patient:", info.response);
        }
    );

}

module.exports = mail