import bcryptjs from 'bcryptjs';
import User from '../models/User.js';
import { generateOTP } from '../utils/generateOtp.js';
import { sendOTPEmail } from '../utils/sendEmail.js';

const pendingRegistrationOtps = new Map();
const OTP_TTL_MS = 10 * 60 * 1000;

const createOtpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const sendOTP = async (email, options = {}) => {
  const normalizedEmail = String(email || '').toLowerCase();
  const otp = generateOTP();
  const otpHash = await bcryptjs.hash(otp, 10);
  const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

  if (options.pendingRegistration) {
    const name = options.pendingRegistration.name || options.name;
    if (!name) throw createOtpError('Name is required to send OTP', 400);

    pendingRegistrationOtps.set(normalizedEmail, {
      otp: otpHash,
      otpExpiresAt,
      payload: options.pendingRegistration,
    });

    await sendOTPEmail(normalizedEmail, name, otp);
    return { email: normalizedEmail };
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpiresAt');
  if (!user) {
    throw createOtpError('User not found', 404);
  }

  user.otp = otpHash;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  await sendOTPEmail(user.email, user.name, otp);
  return { email: user.email };
};

export const verifyOTP = async (email, otp, { clearOtp = true, pendingRegistration = false } = {}) => {
  if (!email || !otp) {
    throw createOtpError('Please provide email and OTP', 400);
  }

  const normalizedEmail = String(email || '').toLowerCase();

  if (pendingRegistration) {
    const pending = pendingRegistrationOtps.get(normalizedEmail);
    if (!pending) {
      throw createOtpError('OTP not found or expired. Please register again.', 400);
    }

    if (new Date() > pending.otpExpiresAt) {
      pendingRegistrationOtps.delete(normalizedEmail);
      throw createOtpError('OTP has expired. Please register again.', 400);
    }

    const isOtpValid = await bcryptjs.compare(otp, pending.otp);
    if (!isOtpValid) {
      throw createOtpError('Invalid OTP', 400);
    }

    if (clearOtp) pendingRegistrationOtps.delete(normalizedEmail);
    return pending.payload;
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpiresAt');
  if (!user) {
    throw createOtpError('User not found', 404);
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw createOtpError('OTP not found or expired. Please request a new OTP.', 400);
  }

  if (new Date() > user.otpExpiresAt) {
    throw createOtpError('OTP has expired. Please request a new OTP.', 400);
  }

  const isOtpValid = await bcryptjs.compare(otp, user.otp);
  if (!isOtpValid) {
    throw createOtpError('Invalid OTP', 400);
  }

  if (clearOtp) {
    user.otp = undefined;
    user.otpExpiresAt = undefined;
  }

  return user;
};
