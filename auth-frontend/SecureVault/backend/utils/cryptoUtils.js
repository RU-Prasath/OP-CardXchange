import crypto from 'crypto';

/**
 * Generate an RSA-2048 key pair for a new user
 * Returns { publicKey, privateKey } as PEM strings
 */
export const generateRSAKeyPair = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "spki",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
        },
    });

    return { publicKey, privateKey };
};

/**
 * Derive a 256-bit AES key from a password using PBKDF2
 * Used to encrypt/decrypt the user's RSA private key
 */
export const deriveKeyFromPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
};

/**
 * Encrypt the RSA private key using AES-256-CBC
 * The key is derived from the user's password
 */
export const encryptPrivateKey = (privateKey, password) => {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(16);
    const key = deriveKeyFromPassword(password, salt);

    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(privateKey, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
        encryptedPrivateKey: encrypted,
        salt: salt.toString("hex"),
        iv: iv.toString("hex"),
    };
};

/**
 * Decrypt the RSA private key using AES-256-CBC
 * Required to decrypt AES keys during file download
 */
export const decryptPrivateKey = (encryptedPrivateKey, password, salt, iv) => {
    const key = deriveKeyFromPassword(password, Buffer.from(salt, "hex"));
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedPrivateKey, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};

/**
 * Generate a random AES-256 key (32 bytes)
 */
export const generateAESKey = () => {
    return crypto.randomBytes(32);
};

/**
 * Generate a random IV for AES-GCM (12 bytes recommended for GCM)
 */
export const generateIV = () => {
    return crypto.randomBytes(12);
};

/**
 * Encrypt file buffer using AES-256-GCM
 */
export const encryptFile = (fileBuffer, aesKey, iv) => {
    const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv);
    const encryptedData = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return { encryptedData, authTag };
};

/**
 * Decrypt file buffer using AES-256-GCM
 * Throws if authentication tag doesn't match (tempering detected)
 */
export const decryptFile = (encryptedData, aesKey, iv, authTag) => {
    const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, iv);
    decipher.setAuthTag(authTag);
    const decryptedData = Buffer.concat([
        decipher.update(encryptedData),
        decipher.final(),
    ]);
    return decryptedData;
};

/**
 * Encrypt the AES key using a user's RSA public key
 * This is the "key wrapping" step
 */
export const encryptAESKeyWithRSA = (aesKey, publicKey) => {
    const encrypted = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        aesKey
    );
    return encrypted;
}

/**
 * Decrypt the AES key using a user's RSA private key
 */
export const decryptAESKeyWithRSA = (encryptedAESKey, privateKey) => {
    const decrypted = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        encryptedAESKey
    );
    return decrypted;
};

/**
 * Generate SHA-256 hash of file buffer
 * Used for integrity verification
 */
export const generateFileHash = (fileBuffer) => {
    return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

/**
 * Generate a human-friendly recovery key
 * Format: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX (6 groups of 4 alphanumeric chars)
 * Example: "K9P3-M2X7-R4N8-Q5V1-B6L9-T8H2"
 */
export const generateRecoveryKey = () => {
  // Use uppercase letters and digits, avoiding ambiguous chars (0, O, 1, I, L)
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const groups = [];

  for (let g = 0; g < 6; g++) {
    let group = "";
    const randomBytes = crypto.randomBytes(4);
    for (let i = 0; i < 4; i++) {
      group += chars[randomBytes[i] % chars.length];
    }
    groups.push(group);
  }

  return groups.join("-");
};

/**
 * Normalize recovery key for comparison
 * (removes spaces, hyphens, converts to uppercase)
 */
export const normalizeRecoveryKey = (key) => {
  return key.replace(/[\s-]/g, "").toUpperCase();
};

/**
 * Encrypt the RSA private key using a recovery-key-derived AES key
 * Mirrors encryptPrivateKey but uses the recovery key instead of password
 */
export const encryptPrivateKeyWithRecovery = (privateKey, recoveryKey) => {
  const normalizedKey = normalizeRecoveryKey(recoveryKey);
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);
  const aesKey = deriveKeyFromPassword(normalizedKey, salt);

  const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encryptedPrivateKey: encrypted,
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
  };
};

/**
 * Decrypt the RSA private key using a recovery key
 */
export const decryptPrivateKeyWithRecovery = (
  encryptedPrivateKey,
  recoveryKey,
  salt,
  iv
) => {
  const normalizedKey = normalizeRecoveryKey(recoveryKey);
  const aesKey = deriveKeyFromPassword(normalizedKey, Buffer.from(salt, "hex"));
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    aesKey,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(encryptedPrivateKey, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
