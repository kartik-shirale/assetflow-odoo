/**
 * Send password reset email via EmailJS REST API
 * Uses server-side authentication with private key
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  resetLink: string
): Promise<void> {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_RESET_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY, // keeps this server-only
      template_params: {
        to_email: toEmail,
        to_name: toName,
        reset_link: resetLink,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EmailJS send failed: ${text}`);
  }
}
