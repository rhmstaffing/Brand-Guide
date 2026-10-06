import nodemailer from "nodemailer";

function transport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

export async function sendLoginCode(to: string, code: string) {
  const t = transport();
  const subject = `${code} is your RHM Cards login code`;
  const text = `Your RHM Cards login code is ${code}.\n\nIt expires in 10 minutes. If you did not ask for this, you can ignore this email.`;
  const html = `<div style="font-family:Arial,sans-serif;color:#363E49;max-width:480px">
  <div style="background:#02195C;padding:20px 24px"><span style="color:#fff;font-weight:700;letter-spacing:.08em">RHM STAFFING SOLUTIONS</span></div>
  <div style="padding:24px;border:1px solid #DCE0E4;border-top:0">
    <p style="margin:0 0 12px">Here's your login code for RHM Cards:</p>
    <p style="font-size:34px;font-weight:700;letter-spacing:.3em;color:#02195C;margin:0 0 12px">${code}</p>
    <p style="margin:0;color:#737B85;font-size:13px">It expires in 10 minutes. If you didn't ask for this, ignore this email.</p>
  </div></div>`;
  if (!t) {
    console.log(`[dev] login code for ${to}: ${code}`);
    return;
  }
  await t.sendMail({ from: process.env.EMAIL_FROM || "RHM Cards <no-reply@rhmstaffing.net>", to, subject, text, html });
}

export async function sendNotice(to: string, subject: string, lines: string[], link?: { href: string; label: string }) {
  const t = transport();
  const text = lines.join("\n") + (link ? `\n\n${link.label}: ${link.href}` : "");
  if (!t) {
    console.log(`[dev] email to ${to}: ${subject}\n${text}`);
    return;
  }
  const html = `<div style="font-family:Arial,sans-serif;color:#363E49;max-width:520px">
  <div style="background:#02195C;padding:16px 24px"><span style="color:#fff;font-weight:700;letter-spacing:.08em">RHM CARDS</span></div>
  <div style="padding:24px;border:1px solid #DCE0E4;border-top:0">${lines.map((l) => `<p style="margin:0 0 10px">${l.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!)}</p>`).join("")}
  ${link ? `<p style="margin:16px 0 0"><a href="${link.href}" style="background:#084FA3;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none">${link.label}</a></p>` : ""}
  </div></div>`;
  await t.sendMail({ from: process.env.EMAIL_FROM || "RHM Cards <no-reply@rhmstaffing.net>", to, subject, text, html });
}
