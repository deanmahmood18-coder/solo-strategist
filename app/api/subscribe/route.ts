export const runtime = "edge";

import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email: unknown = body?.email;

    if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const fromAddress =
      process.env.RESEND_FROM_EMAIL ?? "The Solo Strategist <onboarding@resend.dev>";

    // Confirm subscription to subscriber
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Subscription confirmed - The Solo Strategist",
      text: [
        "Thank you for subscribing to The Solo Strategist.",
        "",
        "You will receive new research memos and quarterly updates as they are published.",
        "",
        "The Solo Strategist",
        "",
        "If you did not subscribe, you may disregard this message."
      ].join("\n")
    });

    // Notify owner of new subscriber (optional)
    const ownerEmail = process.env.NOTIFICATION_EMAIL;
    if (ownerEmail) {
      await resend.emails.send({
        from: fromAddress,
        to: ownerEmail,
        subject: "New subscriber — The Solo Strategist",
        text: `New subscriber: ${email}`
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json(
      { error: "Unable to process subscription. Please try again." },
      { status: 500 }
    );
  }
}
