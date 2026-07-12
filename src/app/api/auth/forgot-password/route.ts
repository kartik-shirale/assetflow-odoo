import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth.schema";
import { generateResetToken } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/email/emailjs";
import prisma  from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return generic success message (don't reveal if email exists)
    const successMessage =
      "If that email exists in our system, a reset link has been sent";

    if (!user) {
      return NextResponse.json({ message: successMessage }, { status: 200 });
    }

    // Generate reset token
    const { rawToken, tokenHash } = generateResetToken();

    // Store token in database (expires in 30 minutes)
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Build reset link
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${rawToken}`;

    // Send email via EmailJS
    try {
      await sendPasswordResetEmail(user.email, user.name, resetLink);
    } catch (emailError) {
      // Log error but still return success to prevent email provider outages from revealing account existence
      console.error("[auth/forgot-password] EmailJS failed:", emailError);
    }

    return NextResponse.json({ message: successMessage }, { status: 200 });
  } catch (err) {
    console.error("[auth/forgot-password]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
