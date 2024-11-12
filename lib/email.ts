import { convert } from "html-to-text";
import { Resend } from "resend";

export function sendEmail(to: string, subject: string, html: string) {
  if (process.env.NODE_ENV === "development") {
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: "novaibiel1234@gmail.com",
    to,
    subject,
    text: convert(html),
    html,
  });
}
