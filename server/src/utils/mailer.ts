import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendMail({ to, subject, html, text }: SendMailOptions) {
  await transporter.sendMail({
    from: `"FlowMap" <no-reply@flowmap.com>`,
    to,
    subject,
    text,
    html,
  });
}
