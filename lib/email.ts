import { convert } from "html-to-text";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export function sendEmail(to: string, subject: string, html: string) {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  return resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to,
    subject,
    text: convert(html),
    html,
  });
}
