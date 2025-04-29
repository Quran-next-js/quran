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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/ios/192.png" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-6XKV4CEL8K"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6XKV4CEL8K');
            `,
          }}
        />
      </head>
      <body className={`${cairo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
