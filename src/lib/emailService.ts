// Email service for sending notifications and form submissions
// This is a simplified version - in production, use a proper email service like SendGrid, AWS SES, or Nodemailer

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  productName?: string;
  productId?: string;
}

export const emailService = {
  // Send contact form email
  async sendContactForm(data: ContactFormData): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@foodtrucks.ma',
        subject: `Nouveau message de contact: ${data.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488;">Nouveau message de contact</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nom:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              ${data.phone ? `<p><strong>Téléphone:</strong> ${data.phone}</p>` : ''}
              <p><strong>Sujet:</strong> ${data.subject}</p>
            </div>
            <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3>Message:</h3>
              <p style="white-space: pre-wrap;">${data.message}</p>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Ce message a été envoyé depuis le formulaire de contact de votre site web.
            </p>
          </div>
        `,
        text: `
Nouveau message de contact

Nom: ${data.name}
Email: ${data.email}
${data.phone ? `Téléphone: ${data.phone}` : ''}
Sujet: ${data.subject}

Message:
${data.message}

---
Ce message a été envoyé depuis le formulaire de contact de votre site web.
        `
      };

      // In production, replace this with actual email sending logic
      console.log('📧 Contact form email would be sent:', emailData);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending contact form email:', error);
      return false;
    }
  },

  // Send quote request email
  async sendQuoteRequest(data: QuoteFormData): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@foodtrucks.ma',
        subject: `Nouvelle demande de devis${data.productName ? ` - ${data.productName}` : ''}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488;">Nouvelle demande de devis</h2>
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nom:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Téléphone:</strong> ${data.phone}</p>
              ${data.productName ? `<p><strong>Produit:</strong> ${data.productName}</p>` : ''}
              ${data.productId ? `<p><strong>ID Produit:</strong> ${data.productId}</p>` : ''}
            </div>
            <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3>Message:</h3>
              <p style="white-space: pre-wrap;">${data.message}</p>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Ce message a été envoyé depuis le formulaire de demande de devis de votre site web.
            </p>
          </div>
        `,
        text: `
Nouvelle demande de devis

Nom: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone}
${data.productName ? `Produit: ${data.productName}` : ''}
${data.productId ? `ID Produit: ${data.productId}` : ''}

Message:
${data.message}

---
Ce message a été envoyé depuis le formulaire de demande de devis de votre site web.
        `
      };

      // In production, replace this with actual email sending logic
      console.log('📧 Quote request email would be sent:', emailData);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending quote request email:', error);
      return false;
    }
  },

  // Send confirmation email to customer
  async sendConfirmationEmail(email: string, type: 'contact' | 'quote', customerName: string): Promise<boolean> {
    try {
      const subject = type === 'contact' 
        ? 'Confirmation de réception de votre message'
        : 'Confirmation de réception de votre demande de devis';
      
      const emailData: EmailData = {
        to: email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488;">Merci pour votre message, ${customerName} !</h2>
            <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p>Nous avons bien reçu votre ${type === 'contact' ? 'message' : 'demande de devis'} et nous vous répondrons dans les plus brefs délais.</p>
            </div>
            <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3>Nos coordonnées :</h3>
              <p><strong>Email:</strong> ${process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@foodtrucks.ma'}</p>
              <p><strong>Téléphone:</strong> ${process.env.NEXT_PUBLIC_COMPANY_PHONE || '+212 5XX XXX XXX'}</p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/212XXXXXXXXX">+212 XXXXXXXX</a></p>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
              Cordialement,<br>
              L'équipe Food Trucks Maroc
            </p>
          </div>
        `,
        text: `
Merci pour votre message, ${customerName} !

Nous avons bien reçu votre ${type === 'contact' ? 'message' : 'demande de devis'} et nous vous répondrons dans les plus brefs délais.

Nos coordonnées :
Email: ${process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@foodtrucks.ma'}
Téléphone: ${process.env.NEXT_PUBLIC_COMPANY_PHONE || '+212 5XX XXX XXX'}
WhatsApp: +212 XXXXXXXX

Cordialement,
L'équipe Food Trucks Maroc
        `
      };

      // In production, replace this with actual email sending logic
      console.log('📧 Confirmation email would be sent:', emailData);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  }
};
