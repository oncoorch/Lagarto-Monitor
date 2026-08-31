import "./globals.css";

export const metadata = {
  title: "Lagarto Monitor",
  description: "Monitor de servicios NICOP y Aigents",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
