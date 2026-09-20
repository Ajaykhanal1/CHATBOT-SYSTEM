import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (
  email: string,
  resetLink: string
) => {
  console.log("EMAIL USER:", process.env.EMAIL_USER);
  console.log("Sending email to:", email);

  const info = await transporter.sendMail({
    from: `"MyChat" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your MyChat password",
    html: `
      <h2>Reset your password</h2>

      <p>Click below to reset your password:</p>

      <a href="${resetLink}">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
    `,
  });

  console.log("Email sent:", info.messageId);
};