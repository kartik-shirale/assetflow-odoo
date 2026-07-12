import { NextRequest, NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validations/auth.schema";
import { verifyResetToken, markTokenAsUsed } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";
import  prisma  from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { token, password } = parsed.data;

    // Verify token
    const verification = await verifyResetToken(token);

    if (!verification.valid || !verification.userId) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user's password
    await prisma.user.update({
      where: { id: verification.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await markTokenAsUsed(token);

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("[auth/reset-password]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
