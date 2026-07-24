// Cloudflare Pages Function — POST /api/subscribe
// Adds an email to the Nicholas list by emailing a notification via Resend.
// Env vars (set in Cloudflare Pages → Settings → Environment variables):
//   RESEND_API_KEY  — your Resend API key
//   TO_EMAIL        — where signups are sent (e.g. hello@nicholasoliveoil.com)
//   FROM_EMAIL      — a verified Resend sender (e.g. list@nicholasoliveoil.com)
// NEVER return a 5xx — Cloudflare can swallow the body and the form reads it as failure.

export async function onRequestPost({ request, env }) {
  const json = (obj, status = 200) =>
    new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });

  let email = "";
  try {
    const body = await request.json();
    email = (body.email || "").trim();
  } catch (_) {
    return json({ ok: false, error: "bad_request" }, 200);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "invalid_email" }, 200);
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [env.TO_EMAIL],
        subject: "New Nicholas list signup",
        text: `New email joined the Nicholas list: ${email}`,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return json({ ok: false, error: "provider", detail: detail.slice(0, 200) }, 200);
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: "exception" }, 200);
  }
}
