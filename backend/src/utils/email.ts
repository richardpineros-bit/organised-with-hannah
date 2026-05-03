import nodemailer from 'nodemailer';

const EMAIL_FROM = process.env.EMAIL_FROM || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: EMAIL_FROM,
        pass: EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!EMAIL_FROM || !EMAIL_PASSWORD) {
    console.warn('Email not configured. Install nodemailer and set EMAIL_FROM + EMAIL_PASSWORD');
    return false;
  }
  
  try {
    await getTransporter().sendMail({
      from: `"Organised With Hannah" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error);
    return false;
  }
}

export function sendBookingConfirmation(booking: any): Promise<boolean> {
  const html = `
    <h2>Booking Confirmation</h2>
    <p>Hi ${booking.customer_name},</p>
    <p>Your booking request has been received!</p>
    <ul>
      <li><strong>Date:</strong> ${booking.booking_date}</li>
      <li><strong>Time:</strong> ${booking.start_time} - ${booking.end_time}</li>
      <li><strong>Status:</strong> Pending confirmation</li>
    </ul>
    <p>Hannah will confirm your booking shortly.</p>
    <p>Thanks,<br>Organised With Hannah</p>
  `;
  
  return sendEmail(booking.customer_email, 'Booking Request Received', html);
}

export function sendNewBookingNotification(booking: any): Promise<boolean> {
  const html = `
    <h2>New Booking Request</h2>
    <ul>
      <li><strong>Name:</strong> ${booking.customer_name}</li>
      <li><strong>Email:</strong> ${booking.customer_email}</li>
      <li><strong>Phone:</strong> ${booking.customer_phone || 'Not provided'}</li>
      <li><strong>Date:</strong> ${booking.booking_date}</li>
      <li><strong>Time:</strong> ${booking.start_time}</li>
    </ul>
    <p>Log in to the admin panel to confirm: http://localhost:5173/admin</p>
  `;
  
  return sendEmail(EMAIL_FROM, `New Booking: ${booking.customer_name}`, html);
}

export function sendContactNotification(contact: any): Promise<boolean> {
  const html = `
    <h2>New Contact Form Submission</h2>
    <ul>
      <li><strong>Name:</strong> ${contact.first_name} ${contact.last_name}</li>
      <li><strong>Email:</strong> ${contact.email}</li>
      <li><strong>Phone:</strong> ${contact.phone || 'Not provided'}</li>
      <li><strong>Subject:</strong> ${contact.subject || 'None'}</li>
      <li><strong>Message:</strong> ${contact.message}</li>
    </ul>
  `;
  
  return sendEmail(EMAIL_FROM, `New Contact: ${contact.first_name} ${contact.last_name}`, html);
}
