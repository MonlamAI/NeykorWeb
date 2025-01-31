"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  name: string;
  email: string;
  message: string;
}

export async function sendEmail(data: EmailData) {
  const { name, email, message } = data;

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["tibetdelek@gmail.com"],
      subject: "Neykor Contact Form",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error };
  }
}
