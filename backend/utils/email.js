/**
 * Mock email service for sending OTP / reset codes
 */
async function sendPasswordResetOTP(email, otp) {
  console.log(`\n==================================================`);
  console.log(`[MOCK EMAIL SERVICE] Password Reset OTP for ${email}:`);
  console.log(`>>> OTP CODE: ${otp} <<<`);
  console.log(`==================================================\n`);

  return {
    success: true,
    message: `OTP sent to ${email} (mocked)`,
    otp
  };
}

module.exports = {
  sendPasswordResetOTP
};
