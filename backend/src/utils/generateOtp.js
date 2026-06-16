export const generateOTP = () => {
  // Generate random 6-digit OTP (100000-999999)
  return Math.floor(100000 + Math.random() * 900000).toString();
};
