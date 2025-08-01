export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up for HostelAlly! We're thrilled to help you find the best places to stay during your travels.</p>
    <p>To secure your account, please verify your email address using the code below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
     <p>This code will expire in 15 minutes for security reasons. Please complete your verification soon!</p>
      <p>If you didn't sign up for HostelAlly, you can safely ignore this email.</p>
   
    
  </div>
  <div class="email-footer">
      <p>Need help? Visit our <a href="" style="color: #ff7b54;">Support Center</a>.</p>
      <p>&copy; ${new Date().getFullYear()} HostelAlly. All rights reserved.</p>
    </div>
</body>
</html>
`;

export const EMAIL_VERIFICATION_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verified</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Email Verified Successfully</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello, {firstName} {lastName}</p>
    <p>Congratulations! Your email address has been successfully verified. You can now enjoy all the features of our platform.</p>
    <p>Thank you for choosing HostelAlly. We're excited to have you on board!</p>
    <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
    <p>Best regards,<br>Your HostelAlly Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;


export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;


export const SUCCESSFUL_TRANSACTION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transaction Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(to right, #4CAF50, #45a049);
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
    }
    .content {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .button {
      text-align: center;
      margin: 30px 0;
    }
    .button a {
      background-color: #4CAF50;
      color: white;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #888;
      font-size: 0.8em;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Payment Confirmation</h1>
  </div>
  <div class="content">
    <p>Dear {username},</p>
    <p>Thank you for your payment of {amount} {currency.toUpperCase()}.</p>
    <p>Transaction ID: {transactionId}</p>
    <p>If you have any questions or need further assistance, please contact us at {supportEmail}.</p>
    <p>Best regards,<br>Your Company</p>
  </div>
  <div class="footer">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>`;


export const REJECTED_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KYC Rejection</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
    .header { background: #ff4d4f; padding: 10px; color: #fff; text-align: center; }
    .content { background-color: #fff3f3; padding: 20px; border-radius: 8px; margin-top: 10px; }
    .footer { text-align: center; font-size: 0.8em; color: #999; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header"><h2>KYC Application Update</h2></div>
  <div class="content">
    <p>Dear {username},</p>
    <p>Unfortunately, your KYC submission was rejected for the following reason:</p>
    <blockquote style="color: red; font-style: italic;">{}</blockquote>
    <p>Please log in to your GPay dashboard to review and correct your information.</p>
    <p>If you have any questions, contact us at <a href="mailto:{supportEmail}">{supportEmail}</a>.</p>
    <p>— The GPay Team</p>
  </div>
  <div class="footer">This is an automated message. Please do not reply.</div>
</body>
</html>
`;
