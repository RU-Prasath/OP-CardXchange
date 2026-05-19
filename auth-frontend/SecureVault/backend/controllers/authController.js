import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import {
  generateRSAKeyPair,
  encryptPrivateKey,
  generateRecoveryKey,
  encryptPrivateKeyWithRecovery,
  decryptPrivateKeyWithRecovery,
  normalizeRecoveryKey,
} from "../utils/cryptoUtils.js";
import { logAudit } from "../utils/auditLogger.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    console.log(`🔑 Generating RSA key pair for ${email}...`);
    const { publicKey, privateKey } = generateRSAKeyPair();

    // Encrypt private key with password
    const passwordEncryption = encryptPrivateKey(privateKey, password);

    // Generate recovery key and encrypt private key with it
    const recoveryKey = generateRecoveryKey();
    const recoveryEncryption = encryptPrivateKeyWithRecovery(
      privateKey,
      recoveryKey
    );

    // Hash the recovery key for later verification
    const recoveryKeyHash = await bcrypt.hash(
      normalizeRecoveryKey(recoveryKey),
      10
    );

    const user = await User.create({
      name,
      email,
      password,
      publicKey,
      encryptedPrivateKey: passwordEncryption.encryptedPrivateKey,
      privateKeySalt: passwordEncryption.salt,
      privateKeyIV: passwordEncryption.iv,
      encryptedPrivateKeyRecovery: recoveryEncryption.encryptedPrivateKey,
      recoveryKeySalt: recoveryEncryption.salt,
      recoveryKeyIV: recoveryEncryption.iv,
      recoveryKeyHash,
    });

    if (user) {
      const token = generateToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log(`✅ User registered: ${email}`);

      await logAudit({
        userId: user._id,
        action: "REGISTER",
        description: "Account created",
        req,
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
        recoveryKey, // Sent ONLY at registration — never again!
      });
    }
  } catch (error) {
    console.error("❌ Register Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during registration",
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        await logAudit({
            userId: user._id,
            action: "FAILED_LOGIN",
            description: "Failed login attempt — incorrect password",
            status: "FAILURE",
            req,
        });

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log(`✅ User logged in: ${email}`);

    await logAudit({
      userId: user._id,
      action: "LOGIN",
      description: "Logged in successfully",
      req,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during login",
    });
  }
};

/**
 * @desc    Reset password using recovery key
 * @route   POST /api/auth/forgot-password
 * @access  Public
 * @body    { email, recoveryKey, newPassword }
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email, recoveryKey, newPassword } = req.body;

    if (!email || !recoveryKey || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, recovery key, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Fetch user with recovery hash
    const user = await User.findOne({ email }).select("+recoveryKeyHash");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Verify the recovery key
    const normalizedKey = normalizeRecoveryKey(recoveryKey);
    const isKeyValid = await bcrypt.compare(
      normalizedKey,
      user.recoveryKeyHash
    );

    if (!isKeyValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid recovery key",
      });
    }

    console.log(`🔓 Password recovery initiated for ${email}...`);

    await logAudit({
      userId: user._id,
      action: "PASSWORD_RECOVERY",
      description: "Password reset using recovery key",
      req,
    });

    // Step 1: Decrypt the private key using the recovery key
    let privateKey;
    try {
      privateKey = decryptPrivateKeyWithRecovery(
        user.encryptedPrivateKeyRecovery,
        recoveryKey,
        user.recoveryKeySalt,
        user.recoveryKeyIV
      );
    } catch (decryptError) {
      console.error("❌ Recovery decryption failed:", decryptError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to recover account. Please contact support.",
      });
    }

    // Step 2: Re-encrypt the private key with the new password
    const newPasswordEncryption = encryptPrivateKey(privateKey, newPassword);

    // Step 3: Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Step 4: Update the user record
    // Use findByIdAndUpdate to bypass the pre-save hook (we already hashed)
    await User.findByIdAndUpdate(user._id, {
      password: hashedNewPassword,
      encryptedPrivateKey: newPasswordEncryption.encryptedPrivateKey,
      privateKeySalt: newPasswordEncryption.salt,
      privateKeyIV: newPasswordEncryption.iv,
    });

    console.log(`✅ Password reset successfully for ${email}`);

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("❌ ForgotPassword Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during password recovery",
    });
  }
};

/**
 * @desc    Logout user
 */
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

/**
 * @desc    Get current logged-in user
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -encryptedPrivateKey -privateKeySalt -privateKeyIV -encryptedPrivateKeyRecovery -recoveryKeySalt -recoveryKeyIV -recoveryKeyHash"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};