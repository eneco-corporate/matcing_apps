import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export async function sendMagicLinkEmail(email: string, token: string) {
  const magicLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  // For MVP, log to console if no SMTP configured
  if (!process.env.SMTP_USER) {
    console.log('\n======================');
    console.log('MAGIC LINK EMAIL (MVP MODE)');
    console.log('======================');
    console.log(`To: ${email}`);
    console.log(`Link: ${magicLink}`);
    console.log('======================\n');
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'ログインリンク / Login Link - FriendMatch',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>ログイン / Login</h2>
        <p>以下のリンクをクリックしてログインしてください（15分間有効）</p>
        <p>Click the link below to log in (valid for 15 minutes):</p>
        <p style="margin: 30px 0;">
          <a href="${magicLink}" style="background: #d95f7a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            ログイン / Login
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">
          このメールに心当たりがない場合は、無視してください。<br>
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, nickname: string) {
  if (!process.env.SMTP_USER) {
    console.log(`\n[MVP] Welcome email would be sent to: ${email} (${nickname})\n`);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to FriendMatch! 🎉',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>ようこそ、${nickname}さん！</h2>
        <p>FriendMatchへの登録ありがとうございます。</p>
        <p>本人確認を完了して、素敵な仲間との出会いを始めましょう！</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <h2>Welcome, ${nickname}!</h2>
        <p>Thank you for joining FriendMatch.</p>
        <p>Complete your verification to start meeting amazing people!</p>
      </div>
    `,
  });
}
