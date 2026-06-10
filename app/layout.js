import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "NextGen CareerNav — AI-Powered Career Ecosystem",
  description:
    "Dynamically align your competencies with real-world workforce demands using AI-powered job matching, skill gap analysis, and intelligent resume optimization.",
  keywords:
    "career navigation, AI job matching, skill gap analysis, resume optimization, career development, LLM, machine learning",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
