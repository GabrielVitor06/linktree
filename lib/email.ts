import { convert } from "html-to-text";
import { Resend } from "resend";

const resend = new Resend("RESEND_API_KEY");

export function sendEmail(to: string, subject: string, html: string) {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  return resend.emails.send({
    from: "novaibiel1234@gmail.com",
    to,
    subject,
    text: convert(html),
    html,
  });
}

console.log("Email sent response:", resend.emails);
