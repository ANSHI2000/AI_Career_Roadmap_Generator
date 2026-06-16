import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter;

try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP Configuration Error:', error.message);
    } else {
      console.log('✅ SMTP configured successfully');
    }
  });
} catch (error) {
  console.error('Failed to configure SMTP:', error.message);
}

export default transporter;
