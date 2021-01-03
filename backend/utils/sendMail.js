const nodemailer = require('nodemailer');

exports.sendMail = async function(to, type, htmlFile) {
    const transporter = nodeMailer.createTransport({
        service: process.env.EMAIL_SERVICE || "gmail",
        auth: {
          user: process.env.EMAIL_ID,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
}