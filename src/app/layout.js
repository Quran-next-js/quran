import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Cairo } from 'next/font/google';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'],
});

export const metadata = {
  title: "مصحف الحفظ الميسر ( النسخة الإلكترونية )",
  description: "مصحف الحفظ الميسر هو  طريقة مبتكرة لتيسير حفظ القرآن الكريم باستخدام الروابط اللفظية والمعنوية والموضوعية – ويهدف – الى تيسير حفظ القرآن الكريم وتدبره والعمل به",
  icons: { icon: "/ios/32.png" },
 
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
      <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${cairo.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
