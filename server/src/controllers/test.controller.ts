import Wrapper from "../utils/asyncWrapper";
import { sendMail } from "../utils/mailer";

const Mailer = Wrapper(async (req, res) => {
  const { email } = req.body;
  const mailOptions = {
    to: email,
    subject: "Test Email",
    html: "<h1>This is a test email</h1>",
    text: "This is a test email",
  };
  await sendMail(mailOptions);
  res.status(200).json({
    success: true,
    message: "Email sent successfully",
  });
});

export { Mailer }
