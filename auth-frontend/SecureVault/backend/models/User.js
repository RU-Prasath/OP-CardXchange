import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minLength: [2, "Name must be at least 2 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            unique: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        publicKey: {
            type: String,
            required: true,
        },
        encryptedPrivateKey: {
            type: String,
            required: true,
        },
        privateKeySalt: {
            type: String,
            required: true,
        },
        privateKeyIV: {
            type: String,
            required: true,
        },
        // Private key encrypted with RECOVERY-KEY-derived key (NEW)
        encryptedPrivateKeyRecovery: {
            type: String,
            required: true,
        },
        recoveryKeySalt: {
            type: String,
            required: true,
        },
        recoveryKeyIV: {
            type: String,
            required: true,
        },
        // bcrypt hash of recovery key (for verification only)
        recoveryKeyHash: {
            type: String,
            required: true,
            select: false,
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.compareRecoveryKey = async function (enteredKey) {
  return await bcrypt.compare(enteredKey, this.recoveryKeyHash);
};

const User = mongoose.model("User", userSchema);

export default User;