type ContactEmailInput = {
  name: string;
  email: string;
  message: string;
  topic: string;
  subject: string;
  phone: string;
  emailSubject: string;
  text: string;
  fallbackHtml: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildBrandedContactEmail(input: ContactEmailInput) {
  const { name, email, message, topic, subject, phone, emailSubject, text } = input;
  const reference = `365-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const receivedAt = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(new Date());

  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f4f5f4;font-family:Arial,Helvetica,sans-serif;color:#17201b">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f5f4">
    <tr><td align="center" style="padding:32px 12px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #dfe4e1">
        <tr><td background="https://365loan.ca/assets/email/contact-header-bg.jpg" style="padding:76px 32px;background-color:#176e4a;background-image:url('https://365loan.ca/assets/email/contact-header-bg.jpg');background-position:center;background-size:cover;color:#ffffff;text-align:center">
          <h1 style="margin:0;font-size:34px;line-height:1.15;font-weight:700;letter-spacing:-0.8px;color:#ffffff">New message from ${escapeHtml(name)}</h1>
          <div style="margin-top:14px;font-size:16px;line-height:1.4;font-weight:400;color:#e4f5eb">${escapeHtml(subject || topic)}</div>
        </td></tr>
        <tr><td style="padding:30px 32px 12px">
          <div style="font-size:11px;line-height:1.5;font-weight:700;color:#2f8f5f">${escapeHtml(receivedAt)} &nbsp;&middot;&nbsp; ${reference}</div>
          <h2 style="margin:16px 0 0;font-size:26px;line-height:1.25;font-weight:700;letter-spacing:-0.4px;color:#1f2823">${escapeHtml(subject || topic)}</h2>
          <div style="margin-top:20px;font-size:16px;line-height:1.65;white-space:pre-wrap;color:#36423b">${escapeHtml(message)}</div>
          <div style="margin-top:22px;font-size:11px;line-height:1.5;color:#69746e">
            <a href="mailto:${escapeHtml(email)}" style="color:#52605a;text-decoration:none">${escapeHtml(email)}</a>
            ${phone ? `<span style="padding:0 7px;color:#b0b7b3">&middot;</span><span>${escapeHtml(phone)}</span>` : ""}
          </div>
        </td></tr>
        <tr><td align="center" style="padding:24px 32px 28px">
          <img src="https://365loan.ca/logo.svg" width="96" alt="365loan" style="display:block;width:96px;max-width:100%;height:auto;margin:0 auto;border:0">
          <div style="margin-top:14px;font-size:11px;line-height:1.6;color:#66716b">
            <a href="https://365loan.ca/privacy-policy" style="color:#52605a;text-decoration:underline">Privacy Policy</a>
            <span style="padding:0 7px;color:#b0b7b3">|</span>
            <a href="https://365loan.ca/terms-of-use" style="color:#52605a;text-decoration:underline">Terms of Use</a>
          </div>
          <div style="margin-top:14px;font-size:10px;line-height:1.65;color:#8a938e">
            Sent securely from the 365loan contact form.<br>
            Never request passwords, banking credentials, or security codes by email.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject: emailSubject, html, text: `${text}\n\nReference: ${reference}` };
}
