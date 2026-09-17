import { env } from "../../config/env";
import { resend } from "./email.client";

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const { data, error } = await resend.emails.send({
    from: env.emailFrom,
    to,
    subject,
    html,
  });
  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
  return data;
}
