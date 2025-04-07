import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, verificationUrl) {
  // Configurer le transporteur d'email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Options de l'email
  const mailOptions = {
    from: `"Atelier Lunaire" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Vérification de votre adresse email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Bienvenue chez Atelier Lunaire !</h2>
        <p>Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <p style="margin: 20px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Vérifier mon adresse email
          </a>
        </p>
        <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
        <p>Ce lien expirera dans 12 heures.</p>
        <p>Cordialement,<br>L'équipe Atelier Lunaire</p>
      </div>
    `
  };

  // Envoyer l'email
  return transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email, resetUrl) {
  // Configurer le transporteur d'email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Options de l'email
  const mailOptions = {
    from: `"Atelier Lunaire" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Si vous n'avez pas demandé de réinitialisation, vous pouvez ignorer cet email.</p>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Cordialement,<br>L'équipe Atelier Lunaire</p>
      </div>
    `
  };

  // Envoyer l'email
  return transporter.sendMail(mailOptions);
}

export async function sendOrderConfirmationEmail(email, orderDetails) {
  // Configurer le transporteur d'email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Générer la liste des produits
  const productsHtml = orderDetails.products.map(product => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center;">
          <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;" />
          ${product.name} ${product.options ? `(${product.options})` : ''}
        </div>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${product.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${product.price.toFixed(2)} €</td>
    </tr>
  `).join('');

  // Options de l'email
  const mailOptions = {
    from: `"Atelier Lunaire" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Confirmation de votre commande #${orderDetails.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Merci pour votre commande !</h2>
        <p>Bonjour ${orderDetails.customerName},</p>
        <p>Nous avons bien reçu votre commande #${orderDetails.orderNumber}. Voici un récapitulatif de votre achat :</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left;">Produit</th>
              <th style="padding: 10px; text-align: center;">Quantité</th>
              <th style="padding: 10px; text-align: right;">Prix</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Sous-total:</td>
              <td style="padding: 10px; text-align: right;">${orderDetails.subtotal.toFixed(2)} €</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Frais de livraison:</td>
              <td style="padding: 10px; text-align: right;">${orderDetails.shipping.toFixed(2)} €</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.2em;">${orderDetails.total.toFixed(2)} €</td>
            </tr>
          </tfoot>
        </table>
        
        <h3 style="margin-top: 30px;">Adresse de livraison</h3>
        <p>
          ${orderDetails.shippingAddress.street}<br>
          ${orderDetails.shippingAddress.postalCode}, ${orderDetails.shippingAddress.city}<br>
          ${orderDetails.shippingAddress.country}
        </p>
        
        <p style="margin-top: 30px;">
          Vous pouvez suivre l'état de votre commande dans votre <a href="${orderDetails.accountUrl}" style="color: #4f46e5;">espace client</a>.
        </p>
        
        <p>Nous vous remercions de votre confiance,</p>
        <p>L'équipe Atelier Lunaire</p>
      </div>
    `
  };

  // Envoyer l'email
  return transporter.sendMail(mailOptions);
}