import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    workspaceName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minLength: 6
    },
    verificationToken: {
      type: String,
      required: true
    },
    verificationExpire: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

pendingRegistrationSchema.pre('save', async function hashPendingPassword() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

pendingRegistrationSchema.methods.createVerificationToken = function createVerificationToken() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  this.verificationExpire = Date.now() + 30 * 60 * 1000;
  return verificationToken;
};

const PendingRegistration = mongoose.model('PendingRegistration', pendingRegistrationSchema);

export default PendingRegistration;
