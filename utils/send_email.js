const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
     const transparent = nodemailer.createTransport({
          service: "gmail",
          host: "smpt.gmail.com",
          port: 587,
          secure: false,
          auth: {
               user: process.env.EMAIL_USER,
               pass: process.env.EMAIL_PASS,
          },
     });

     const Mailoptions = {
          from: {
               name: "Bot",
               address: process.env.EMAIL_USER,
          },
          to: options.email,
          subject: options.subject,
          html: options.html,
     };

     await transparent.sendMail(Mailoptions);
};

module.exports = sendEmail;