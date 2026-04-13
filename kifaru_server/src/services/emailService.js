const nodemailer = require('nodemailer')

// ─── TRANSPORTER ─────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.hostinger.com',
  port:   Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
})

transporter.verify().then(() => {
  console.log('✅ Email SMTP ready — Hostinger connected')
}).catch(err => {
  console.warn('⚠️  Email SMTP:', err.message)
})

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const NAVY  = '#1a237e'
const RED   = '#C0392B'
const GOLD  = '#D4A843'
const LIGHT = '#f4f6fb'
const WHITE = '#ffffff'

// ─── BASE LAYOUT ─────────────────────────────────────────────────────────────
function baseLayout(title, bodyHtml) {
  const siteUrl = process.env.SITE_URL || 'https://kifarugroup.co.tz'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${LIGHT};font-family:'Segoe UI',Arial,sans-serif;color:#333;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT};padding:32px 16px;">
<tr><td align="center">
<table role="presentation" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr>
    <td style="background:${NAVY};border-radius:10px 10px 0 0;padding:30px 40px;text-align:center;">

      <!-- LOGO IMAGE -->
      <img
        src="${siteUrl}/uploads/logo.png"
        alt="KIFARU"
        width="140"
        style="height:70px;width:auto;max-width:160px;object-fit:contain;display:block;margin:0 auto 12px;border:0;"
      />

      <span style="color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:2px;text-transform:uppercase;">Real Estate &amp; Building Co. Ltd</span>
      <br/>
      <span style="color:rgba(255,255,255,0.4);font-size:11px;font-style:italic;">Tunajenga kwa gharama nafuu</span>
    </td>
  </tr>

  <!-- RED LINE -->
  <tr><td style="background:${RED};height:4px;"></td></tr>

  <!-- BODY -->
  <tr>
    <td style="background:${WHITE};padding:36px 40px 28px;border:1px solid #e4e7f0;border-top:none;">
      ${bodyHtml}
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:${NAVY};border-radius:0 0 10px 10px;padding:24px 40px;">
      <p style="margin:0 0 5px;color:rgba(255,255,255,0.9);font-size:13px;font-weight:700;">Kifaru Building Company Limited</p>
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:12px;">P.O. Box 19614, Ubungo, Goba, Dar es Salaam, Tanzania</p>
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.5);font-size:12px;">+255 714 940 231 &nbsp;·&nbsp; +255 713 860 510 &nbsp;·&nbsp; info@kifarugroup.co.tz</p>
      <p style="margin:10px 0 0;color:rgba(255,255,255,0.3);font-size:11px;">CRB: B5/1691/11/2023 &nbsp;·&nbsp; TIN: 106-957-053 &nbsp;·&nbsp; VAT: 40-045251-B</p>
    </td>
  </tr>
  <tr>
    <td style="padding:14px 0;text-align:center;">
      <p style="margin:0;color:#bbb;font-size:11px;">© ${new Date().getFullYear()} Kifaru Building Company Limited. All rights reserved.</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`
}

// ─── ROW HELPER ───────────────────────────────────────────────────────────────
function row(label, value) {
  if (!value || value === '—' || value.trim?.() === '') return ''
  return `<tr>
    <td style="padding:10px 14px;background:#f7f8fc;font-size:12px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.8px;width:36%;vertical-align:top;border-radius:4px 0 0 4px;">${label}</td>
    <td style="padding:10px 14px;font-size:14px;color:#222;vertical-align:top;">${value}</td>
  </tr>
  <tr><td colspan="2" style="height:4px;"></td></tr>`
}

// ─── CLIENT EMAIL ─────────────────────────────────────────────────────────────
function clientBody(data) {
  const { name, service, phone, email, location, message } = data
  const firstName = name?.split(' ')[0] || 'Valued Client'
  const refNo     = `KBC-${Date.now().toString().slice(-7)}`
  const siteUrl   = process.env.SITE_URL || 'https://kifarugroup.co.tz'

  return `
  <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:26px;color:${NAVY};">Asante, ${firstName}! 🎉</h2>
  <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
    Thank you for contacting <strong>Kifaru Building Company Limited</strong>. We have received your request and our team will get back to you within <strong style="color:${RED};">24 hours</strong>.
  </p>

  <!-- REF BOX -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1fb;border-left:5px solid ${NAVY};border-radius:0 8px 8px 0;margin-bottom:28px;">
    <tr>
      <td style="padding:16px 20px;">
        <p style="margin:0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">Your Reference Number</p>
        <p style="margin:6px 0 4px;font-size:22px;font-weight:700;color:${NAVY};font-family:monospace;letter-spacing:2px;">${refNo}</p>
        <p style="margin:0;font-size:12px;color:#999;">Please quote this number when contacting us</p>
      </td>
    </tr>
  </table>

  <!-- REQUEST SUMMARY -->
  <h3 style="margin:0 0 14px;font-size:13px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #eee;padding-bottom:10px;">Your Request Summary</h3>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border-collapse:separate;border-spacing:0;">
    ${row('Full Name',   name)}
    ${row('Phone',       phone)}
    ${row('Email',       email)}
    ${row('Service',     `<strong>${service}</strong>`)}
    ${row('Location',    location)}
    ${row('Message',     message ? `<em style="color:#555;">"${message}"</em>` : '')}
  </table>

  <!-- NEXT STEPS -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT};border-radius:10px;margin-bottom:28px;">
    <tr>
      <td style="padding:22px 24px;">
        <h3 style="margin:0 0 16px;font-size:15px;color:${NAVY};font-weight:700;">What happens next?</h3>
        ${[
          ['📋', 'Your request is reviewed by our team immediately.'],
          ['📞', 'A Kifaru specialist calls you within 24 hours.'],
          ['🤝', 'We schedule a free site visit or consultation.'],
          ['📄', 'You receive a detailed quote — no hidden charges.'],
        ].map(([icon, text], i) => `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
          <tr>
            <td style="width:36px;vertical-align:top;">
              <div style="width:28px;height:28px;background:${RED};border-radius:50%;text-align:center;line-height:28px;font-size:12px;font-weight:700;color:white;">${i + 1}</div>
            </td>
            <td style="padding-left:12px;vertical-align:middle;font-size:14px;color:#444;">${icon} ${text}</td>
          </tr>
        </table>`).join('')}
      </td>
    </tr>
  </table>

  <!-- CTA BUTTONS -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
    <tr>
      <td align="center" style="padding:0 4px 0 0;">
        <a href="tel:+255714940231"
          style="display:inline-block;background:${RED};color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:7px;">
          📞 Call Us
        </a>
      </td>
      <td align="center" style="padding:0 0 0 4px;">
        <a href="https://wa.me/255714940231?text=Hello%2C%20my%20reference%20is%20${refNo}"
          style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:7px;">
          💬 WhatsApp
        </a>
      </td>
    </tr>
  </table>

  <!-- PROMISE BANNER -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:${NAVY};border-radius:8px;padding:18px 24px;text-align:center;">
        <p style="margin:0 0 4px;color:${GOLD};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Our Promise to You</p>
        <p style="margin:0 0 4px;color:rgba(255,255,255,0.95);font-size:15px;font-style:italic;">"Tunajenga kwa gharama nafuu"</p>
        <p style="margin:0;color:rgba(255,255,255,0.5);font-size:12px;">We build at affordable prices — pay only after receiving your home.</p>
      </td>
    </tr>
  </table>`
}

// ─── ADMIN EMAIL ──────────────────────────────────────────────────────────────
function adminBody(data) {
  const { name, phone, email, service, location, message } = data
  const timeStr = new Date().toLocaleString('en-TZ', {
    timeZone: 'Africa/Dar_es_Salaam',
    dateStyle: 'full',
    timeStyle: 'short',
  })
  const siteUrl  = process.env.SITE_URL || 'https://kifarugroup.co.tz'
  const waNumber = (phone || '').replace(/\D/g, '')
  const waMsg    = encodeURIComponent(`Hello ${name || ''}, this is Kifaru Building Company. We received your request and would like to discuss your project.`)

  return `
  <!-- ALERT -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${RED};border-radius:8px;margin-bottom:24px;">
    <tr>
      <td style="padding:16px 22px;text-align:center;">
        <p style="margin:0;color:#fff;font-size:18px;font-weight:700;">🔔 New Booking Request</p>
        <p style="margin:5px 0 0;color:rgba(255,255,255,0.8);font-size:12px;">${timeStr}</p>
      </td>
    </tr>
  </table>

  <p style="margin:0 0 22px;font-size:15px;color:#444;line-height:1.6;">
    A new request has been submitted. Please follow up within <strong style="color:${RED};">24 hours</strong> for best results.
  </p>

  <!-- CLIENT DETAILS -->
  <h3 style="margin:0 0 14px;font-size:13px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #eee;padding-bottom:10px;">Client Information</h3>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-collapse:separate;border-spacing:0;">
    ${row('Full Name',    `<strong style="font-size:16px;">${name}</strong>`)}
    ${row('Phone',        `<a href="tel:${phone}" style="color:${RED};font-weight:700;font-size:16px;text-decoration:none;">${phone}</a>`)}
    ${row('Email',        email ? `<a href="mailto:${email}" style="color:${NAVY};text-decoration:none;">${email}</a>` : '—')}
    ${row('Service',      `<strong style="color:${NAVY};">${service}</strong>`)}
    ${row('Location',     location)}
    ${row('Message',      message ? `<em style="color:#555;">"${message}"</em>` : '')}
  </table>

  <!-- QUICK ACTIONS -->
  <h3 style="margin:0 0 14px;font-size:13px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #eee;padding-bottom:10px;">Quick Actions</h3>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td style="padding:0 5px 10px 0;">
        <a href="tel:${phone}"
          style="display:block;background:${NAVY};color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:13px 16px;border-radius:7px;text-align:center;">
          📞 Call Client
        </a>
      </td>
      <td style="padding:0 0 10px 5px;">
        <a href="https://wa.me/${waNumber}?text=${waMsg}"
          style="display:block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:13px 16px;border-radius:7px;text-align:center;">
          💬 WhatsApp Client
        </a>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <a href="${siteUrl}/admin"
          style="display:block;background:${LIGHT};color:${NAVY};text-decoration:none;font-weight:700;font-size:13px;padding:13px 16px;border-radius:7px;text-align:center;border:1px solid #dde1f0;">
          🖥️ Open Admin Dashboard
        </a>
      </td>
    </tr>
  </table>

  <!-- REMINDER -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="background:#fffde7;border:1px solid #ffe082;border-radius:7px;padding:14px 18px;">
        <p style="margin:0;font-size:13px;color:#5d4037;">
          ⏰ <strong>Action Required:</strong> Contact the client within 24 hours.
          Once done, mark the booking as "Contacted" in the Admin Panel.
        </p>
      </td>
    </tr>
  </table>`
}

// ─── MAIN SEND FUNCTION ───────────────────────────────────────────────────────
async function sendBookingEmails(bookingData) {
  const { name, phone, email, service } = bookingData

  const adminEmail = process.env.ADMIN_EMAIL || 'info@kifarugroup.co.tz'
  const fromName   = 'Kifaru Real Estate & Building'
  const fromAddr   = process.env.SMTP_USER

  // Skip if SMTP not configured
  if (!fromAddr) {
    console.log('⚠️  SMTP_USER not set — skipping email')
    return { success: false, errors: ['SMTP_USER not configured'] }
  }

  const errors = []

  // 1. Client confirmation
  if (email && email.includes('@')) {
    try {
      await transporter.sendMail({
        from:    `"${fromName}" <${fromAddr}>`,
        to:      email,
        subject: `✅ Request Received — Kifaru Building Co.`,
        html:    baseLayout('Your Request Has Been Received', clientBody(bookingData)),
      })
      console.log(`📧 Client email → ${email}`)
    } catch (err) {
      console.error('Client email failed:', err.message)
      errors.push(`client: ${err.message}`)
    }
  }

  // 2. Admin notification
  try {
    await transporter.sendMail({
      from:    `"${fromName}" <${fromAddr}>`,
      to:      adminEmail,
      replyTo: email || fromAddr,
      subject: `🔔 New Booking: ${name} — ${service}`,
      html:    baseLayout('New Booking Request — Admin Alert', adminBody(bookingData)),
    })
    console.log(`📧 Admin email → ${adminEmail}`)
  } catch (err) {
    console.error('Admin email failed:', err.message)
    errors.push(`admin: ${err.message}`)
  }

  return { success: errors.length === 0, errors }
}

module.exports = { sendBookingEmails, transporter }