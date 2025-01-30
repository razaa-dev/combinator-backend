import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300, // OTP will automatically be deleted after 5 minutes
    },
  },
  {
    timestamps: true,
  }
);

const otpModel = mongoose.model('otps', otpSchema);

export default otpModel;
