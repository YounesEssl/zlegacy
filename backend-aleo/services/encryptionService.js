const crypto = require("crypto");

const algorithm = "aes-256-gcm";
const ivLength = 16;
const saltLength = 64;
const tagLength = 16;
const keyLength = 32;
const pbkdf2Iterations = 100000;

const encrypt = (text, masterKey) => {
  const salt = crypto.randomBytes(saltLength);
  const key = crypto.pbkdf2Sync(
    masterKey,
    salt,
    pbkdf2Iterations,
    keyLength,
    "sha512"
  );

  const iv = crypto.randomBytes(ivLength);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  const tag = cipher.getAuthTag();

  const result = Buffer.concat([
    salt,
    iv,
    tag,
    Buffer.from(encrypted, "base64"),
  ]).toString("base64");

  return result;
};

const decrypt = (encryptedText, masterKey) => {
  const buffer = Buffer.from(encryptedText, "base64");
  const salt = buffer.slice(0, saltLength);
  const iv = buffer.slice(saltLength, saltLength + ivLength);
  const tag = buffer.slice(
    saltLength + ivLength,
    saltLength + ivLength + tagLength
  );
  const encrypted = buffer
    .slice(saltLength + ivLength + tagLength)
    .toString("base64");

  const key = crypto.pbkdf2Sync(
    masterKey,
    salt,
    pbkdf2Iterations,
    keyLength,
    "sha512"
  );

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = {
  encrypt,
  decrypt,
};
