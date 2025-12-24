import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FriendMatch - 女性限定IRL友達マッチングアプリ",
  description: "安全で楽しい少人数グループマッチング。東京で新しい友達を作りましょう。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-neutral-50">
        {children}
      </body>
    </html>
  );
}
