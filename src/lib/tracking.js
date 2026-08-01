import { customAlphabet } from "nanoid";

// Exclude ambiguous characters: 0, O, I, 1, L.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const generateSuffix = customAlphabet(ALPHABET, 4);
const generateToken = customAlphabet(
  "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789",
  32
);
const generatePinDigits = customAlphabet("0123456789", 4);

/**
 * Generate a tracking code like "PB-8X4K".
 */
export function generateTrackingCode() {
  return `PB-${generateSuffix()}`;
}

/**
 * Generate a unique tracking code, retrying on collision.
 * @param {import('mongoose').Model} ParcelRequest
 */
export async function generateUniqueTrackingCode(ParcelRequest) {
  for (let i = 0; i < 10; i++) {
    const code = generateTrackingCode();
    const exists = await ParcelRequest.exists({ trackingCode: code });
    if (!exists) return code;
  }
  // Extremely unlikely fallback with extra entropy.
  return `PB-${generateSuffix()}${generateSuffix()}`;
}

/**
 * Generate an opaque token (currently used for password-reset links).
 */
export function generateConfirmToken() {
  return generateToken();
}

/**
 * Generate a 4-digit Uber-style delivery PIN. Shown only to the sender until
 * the courier enters it to verify the handoff and mark the parcel DELIVERED.
 */
export function generateDeliveryPin() {
  return generatePinDigits();
}

