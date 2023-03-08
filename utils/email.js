import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const sendEmailVerification = (user) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const token = jwt.sign(
    user,
    process.env.EMAIL_SECRET,
    {
      expiresIn: '1d',
    },
  );

  const url = `http://localhost:${process.env.PORT || 3000}/api/confirmation/${token}`;
  transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: 'Praksa.ba - Please confirm Your email',
    html: `<b>Please click this link to confirm your email:</b> <a href="${url}">Click to confirm Your email</a><br><br><b>This link expires in one day</b>`,
  });
};

export default sendEmailVerification;
