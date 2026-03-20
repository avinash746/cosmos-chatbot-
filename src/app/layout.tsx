import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "COSMOS — Space Intelligence",
  description: "Your AI guide to the universe. Ask anything about space, astronomy, black holes, galaxies, and beyond.",
  keywords: ["space", "astronomy", "AI", "chatbot", "cosmos", "NASA", "universe"],
  openGraph: {
    title: "COSMOS — Space Intelligence",
    description: "Your AI guide to the universe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cosmos-black antialiased">{children}</body>
    </html>
  );
}