import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

const user = process.env.EMAIL_USER!;
const pass = process.env.EMAIL_PASS!;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
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
