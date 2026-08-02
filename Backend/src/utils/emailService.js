const nodemailer = require("nodemailer");
const AdminSettings = require("../models/adminSettings");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const isEmailEnabled = async () => {
  const settings = await AdminSettings.findOne();
  return settings ? settings.emailEnabled : true;
};

const isDailyDigestEnabled = async () => {
  const settings = await AdminSettings.findOne();
  return settings ? settings.dailyDigestEnabled : true;
};

const isConnectionNotificationsEnabled = async () => {
  const settings = await AdminSettings.findOne();
  return settings ? settings.connectionNotificationsEnabled : true;
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (err) {
    console.error("Email send failed:", err.message);
    throw err;
  }
};

const sendPasswordResetEmail = async (email, firstName, resetUrl) => {
  if (!(await isEmailEnabled())) return;
  return sendEmail({
    to: email,
    subject: "DevTinder - Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e91e63;">DevTinder Password Reset</h2>
        <p>Hi ${firstName},</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #e91e63; color: white; text-decoration: none; border-radius: 5px; margin: 16px 0;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr />
        <p style="color: #888; font-size: 12px;">DevTinder - Find your perfect dev match</p>
      </div>
    `,
  });
};

const sendConnectionRequestEmail = async (email, firstName, fromUser) => {
  if (!(await isConnectionNotificationsEnabled())) return;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return sendEmail({
    to: email,
    subject: `DevTinder - ${fromUser.firstName} ${fromUser.lastName} is interested in you!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e91e63;">New Connection Request</h2>
        <p>Hi ${firstName},</p>
        <p><strong>${fromUser.firstName} ${fromUser.lastName}</strong> has sent you a connection request on DevTinder!</p>
        <p>Log in to view the request and decide whether to connect.</p>
        <a href="${frontendUrl}/requests" style="display: inline-block; padding: 12px 24px; background-color: #e91e63; color: white; text-decoration: none; border-radius: 5px; margin: 16px 0;">View Requests</a>
        <hr />
        <p style="color: #888; font-size: 12px;">DevTinder - Find your perfect dev match</p>
      </div>
    `,
  });
};

const sendConnectionAcceptedEmail = async (email, firstName, acceptedBy) => {
  if (!(await isConnectionNotificationsEnabled())) return;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return sendEmail({
    to: email,
    subject: `DevTinder - ${acceptedBy.firstName} ${acceptedBy.lastName} accepted your request!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4caf50;">Connection Accepted!</h2>
        <p>Hi ${firstName},</p>
        <p><strong>${acceptedBy.firstName} ${acceptedBy.lastName}</strong> has accepted your connection request on DevTinder!</p>
        <p>You are now connected. Start a conversation!</p>
        <a href="${frontendUrl}/connections" style="display: inline-block; padding: 12px 24px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 5px; margin: 16px 0;">View Connections</a>
        <hr />
        <p style="color: #888; font-size: 12px;">DevTinder - Find your perfect dev match</p>
      </div>
    `,
  });
};

const sendDailyDigestEmail = async (email, firstName, pendingCount, newMatches) => {
  if (!(await isDailyDigestEnabled())) return;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const matchListHtml = newMatches.length
    ? newMatches.map((m) => `<li style="padding: 6px 0;"><strong>${m.firstName} ${m.lastName}</strong> - ${m.about || "Dev looking for a match"}</li>`).join("")
    : "<li>No new matches today</li>";

  return sendEmail({
    to: email,
    subject: "DevTinder - Your Daily Digest",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e91e63;">Daily Digest</h2>
        <p>Hi ${firstName},</p>
        <p>Here's your DevTinder summary for today:</p>

        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Pending Requests:</strong> ${pendingCount}</p>
          <p style="margin: 4px 0;"><strong>New Matches Today:</strong> ${newMatches.length}</p>
        </div>

        ${newMatches.length ? `
        <h3>New Matches</h3>
        <ul style="list-style: none; padding: 0;">
          ${matchListHtml}
        </ul>
        ` : ""}

        <a href="${frontendUrl}/feed" style="display: inline-block; padding: 12px 24px; background-color: #e91e63; color: white; text-decoration: none; border-radius: 5px; margin: 16px 0;">Explore Devs</a>
        <hr />
        <p style="color: #888; font-size: 12px;">DevTinder - Find your perfect dev match</p>
      </div>
    `,
  });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendConnectionRequestEmail,
  sendConnectionAcceptedEmail,
  sendDailyDigestEmail,
  isEmailEnabled,
  isDailyDigestEnabled,
  isConnectionNotificationsEnabled,
};
