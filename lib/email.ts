import { convert } from "html-to-text";
import { Resend } from "resend";

const resend = new Resend("re_ZkUrBD6n_CfkDUke5rBcM7Ew7TwQzFBMS");

export function sendEmail(to: string, subject: string, html: string) {
  if (process.env.NODE_ENV === "development") {
    console.info("[EMAIL]", subject);
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
