import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "fitness.com — Move With Purpose",
  description: "Zumba, Yoga, Strength Training & Fitness Training — all in one place.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
