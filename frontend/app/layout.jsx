import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "fitness.com — Move With Purpose",
  description: "Zumba, Yoga, Strength Training & Fitness Training — all in one place.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
