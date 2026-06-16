import transporter from '../config/smtp.js';

const generateOTPEmailTemplate = (name, otp) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            color: #333;
            margin-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #4f46e5;
          }
          .content {
            color: #555;
            line-height: 1.6;
          }
          .otp-box {
            background-color: #f9f9f9;
            border: 2px solid #4f46e5;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
          }
          .otp-text {
            font-size: 32px;
            font-weight: bold;
            color: #4f46e5;
            letter-spacing: 8px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #999;
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 20px;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 10px;
            margin: 20px 0;
            border-radius: 4px;
            color: #856404;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 AI Career Roadmap</div>
            <h2>Email Verification</h2>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            
            <p>Thank you for registering with AI Career Roadmap Generator. Please use the following One-Time Password (OTP) to verify your email address.</p>
            
            <div class="otp-box">
              <div class="otp-text">${otp}</div>
            </div>
            
            <p>This OTP is valid for the next 10 minutes. If you didn't request this, please ignore this email.</p>
            
            <div class="warning">
              ⚠️ Never share this OTP with anyone. Our support team will never ask for your OTP.
            </div>
            
            <p>
              If you have any questions, please reach out to our support team.
            </p>
            
            <p>
              Best regards,<br>
              <strong>AI Career Roadmap Team</strong>
            </p>
          </div>
          
          <div class="footer">
            <p>© 2026 AI Career Roadmap Generator. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const sendOTPEmail = async (email, name, otp) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Email Verification - AI Career Roadmap Generator',
      html: generateOTPEmailTemplate(name, otp),
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendStatusEmail = async (email, name, status, reason = '') => {
  const statusCopy = {
    pending: {
      subject: 'Approval pending - AI Career Roadmap',
      message: 'Your email is verified. Your account is now waiting for admin approval.',
    },
    approved: {
      subject: 'Account approved - AI Career Roadmap',
      message: 'Your account has been approved. You can now sign in and use your dashboard.',
    },
    rejected: {
      subject: 'Account approval update - AI Career Roadmap',
      message: `Your account approval request was rejected.${reason ? ` Reason: ${reason}` : ''}`,
    },
  };

  const copy = statusCopy[status] || statusCopy.pending;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: copy.subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>AI Career Roadmap</h2>
          <p>Hi ${name},</p>
          <p>${copy.message}</p>
          <p>Best regards,<br/>AI Career Roadmap Team</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Status email sending error:', error);
    return { success: false, message: error.message };
  }
};
