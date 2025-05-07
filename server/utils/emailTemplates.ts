import { EmailTemplateOptions } from '../types/email.interface';

export const getWelcomeEmailTemplate = (options: EmailTemplateOptions) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;background:#ffffff">
    <div style="text-align:center;margin-bottom:20px">
      <img src="${options.logoUrl}" alt="JSNXT Logo" style="width:80px;height:auto" />
    </div>
    <h2 style="color:#333333">Welcome, ${options.user?.name || 'User'}!</h2>
    <p style="font-size:16px;color:#555555">
      Your account has been successfully created. You can now log in using your credentials.
    </p>
    ${
      options.action
        ? `
    <div style="margin:30px 0;text-align:center">
      <a href="${options.action.url}" style="background-color:#111;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">${options.action.text}</a>
    </div>
    `
        : ''
    }
    <p style="font-size:14px;color:#999999">
      If you have any questions, feel free to contact our support team.
    </p>
  </div>
`;

export const getVerificationEmailTemplate = (options: EmailTemplateOptions) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;background:#ffffff">
    <div style="text-align:center;margin-bottom:20px">
      <img src="${options.logoUrl}" alt="JSNXT Logo" style="width:80px;height:auto" />
    </div>
    <h2 style="color:#333333">Welcome to JSNXT!</h2>
    <p style="font-size:16px;color:#555555">
      Thank you for registering. Please confirm your email address by clicking the button below:
    </p>
    <div style="margin:30px 0;text-align:center">
      <a href="${options.action?.url}" style="background-color:#111;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">${options.action?.text || 'Verify Email'}</a>
    </div>
    <p style="font-size:14px;color:#999999">If you did not request this, please ignore this email.</p>
  </div>
`;

export const getPasswordResetTemplate = (options: EmailTemplateOptions) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;background:#ffffff">
    <div style="text-align:center;margin-bottom:20px">
      <img src="${options.logoUrl}" alt="JSNXT Logo" style="width:80px;height:auto" />
    </div>
    <h2 style="color:#333333">Reset Your Password</h2>
    <p style="font-size:16px;color:#555555">
      We received a request to reset your password. Click the button below to choose a new one:
    </p>
    <div style="margin:30px 0;text-align:center">
      <a href="${options.action?.url}" style="background-color:#111;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Reset Password</a>
    </div>
    <p style="font-size:14px;color:#999999">If you did not request a password reset, you can safely ignore this email.</p>
  </div>
`;

export const getLoginAlertTemplate = (
  options: EmailTemplateOptions & {
    ipAddress: string;
    browser: string;
    platform: string;
  }
) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;background:#ffffff">
    <div style="text-align:center;margin-bottom:20px">
      <img src="${options.logoUrl}" alt="JSNXT Logo" style="width:80px;height:auto" />
    </div>
    <h2 style="color:#333333">New Login Detected</h2>
    <p>We noticed a new login to your JSNXT account with the following details:</p>
    <ul>
      <li><strong>IP Address:</strong> ${options.ipAddress}</li>
      <li><strong>Browser:</strong> ${options.browser}</li>
      <li><strong>Platform:</strong> ${options.platform}</li>
      <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
    </ul>
    <p>If this was you, no further action is needed. If you suspect any unauthorized access, please reset your password immediately.</p>
    <hr />
    <p style="font-size:12px;color:#888">&copy; ${new Date().getFullYear()} JSNXT. All rights reserved.</p>
  </div>
  `;

export const accountVerifiedTemplate = (options: EmailTemplateOptions) =>
  `    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;background:#ffffff">
        <div style="text-align:center;margin-bottom:20px">
          <img src="${options.logoUrl}" alt="JSNXT Logo" style="width:80px;height:auto" />
        </div>
        <h2 style="color:#333333">Account Verified!</h2>
        <p style="font-size:16px;color:#555555">
          You're all set to explore JSNXT. We're excited to have you onboard!
        </p>
        <div style="margin:30px 0;text-align:center">
          <a href="${options.frontendUrl}" style="background-color:#111;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">Go to Home</a>
        </div>
        <p style="font-size:14px;color:#999999">Questions? Contact our support team.</p>
      </div>
    `;

export const passwordChangedTemplate = (options: EmailTemplateOptions) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e0e0e0;border-radius:10px;background:#ffffff">
        <div style="text-align:center;margin-bottom:20px">
          <img src="${options.logoUrl}" alt="JSNXT Logo" style="width:80px;height:auto" />
        </div>
        <h2 style="color:#333333">Password Updated</h2>
        <p style="font-size:16px;color:#555555">
          Your password has been successfully changed.
        </p>
        <p style="font-size:14px;color:#999999">
          If you didn't make this change, please contact support immediately.
        </p>
      </div>
    `;
