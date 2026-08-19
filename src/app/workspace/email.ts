'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvitationEmail(email: string, role: string) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Invitation à collaborer sur YCS Studio',
      html: `
        <h2>Invitation YCS Studio</h2>
        <p>Vous avez été invité à rejoindre un workspace en tant que <strong>${role}</strong>.</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard">Cliquez ici pour accéder à votre espace</a></p>
      `
    });
    return { success: true };
  } catch (emailError) {
    console.error('Erreur envoi email:', emailError);
    return { error: 'Erreur lors de l\'envoi de l\'email' };
  }
}
