import { createHash, randomBytes } from "crypto";
import prisma  from "@/lib/prisma";

/**
 * Generate a cryptographically secure reset token
 * Returns both the raw token (for the email link) and its hash (for storage)
 */
export function generateResetToken(): { rawToken: string; tokenHash: string } {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  return { rawToken, tokenHash };
}

/**
 * Verify a reset token from the URL
 * Checks if it exists, hasn't expired, and hasn't been used
 */
export async function verifyResetToken(rawToken: string) {
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");

  const tokenRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!tokenRecord) {
    return { valid: false, userId: null, error: "Invalid token" };
  }

  if (tokenRecord.usedAt) {
    return { valid: false, userId: null, error: "Token already used" };
  }

  if (new Date() > tokenRecord.expiresAt) {
    return { valid: false, userId: null, error: "Token expired" };
  }

  return { valid: true, userId: tokenRecord.userId, error: null };
}

/**
 * Mark a reset token as used
 */
export async function markTokenAsUsed(rawToken: string): Promise<void> {
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  await prisma.passwordResetToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });
}
