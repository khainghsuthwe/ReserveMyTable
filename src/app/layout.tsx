// src/app/layout.tsx
import './globals.css';
import { Metadata } from 'next';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: {
    default: 'ReserveMyTable',
    template: '%s | ReserveMyTable',
  },
  description: 'Welcome to ReserveMyTable — restaurant booking made easy.',
  openGraph: {
    title: 'ReserveMyTable',
    description: 'Welcome to ReserveMyTable — restaurant booking made easy.',
    url: 'https://restaurant-booking-frontend-rho.vercel.app/',
    siteName: 'ReserveMyTable',
    images: [
      {
        url: 'https://www.example.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  metadataBase: new URL('https://restaurant-booking-frontend-rho.vercel.app/'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content=" googlef51540a66b88dfad.html" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-100 flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
