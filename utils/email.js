const nodemailer = require("nodemailer");
const { SMTP_USER, SMTP_PASS } = require("./config");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});
async function sendMail(to, subject, text) {
    try {
    const info = await transporter.sendMail({
        from: `${SMTP_USER}`, // sender address
        to: to, // list of recipients
        subject: subject, // subject line
        text: text, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
    console.error("Error while sending mail:", err);
    }
}
module.exports = {
    sendMail
};