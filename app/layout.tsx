import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getOffers } from "@/lib/offers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { OfferDetailDrawer } from "@/components/offers/offer-detail-drawer";
import { Providers } from "@/components/providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://garimpeirodoprecinho.com.br"),
  title: {
    default: "Garimpeiro do Precinho | As Melhores Promoções e Cupons",
    template: "%s | Garimpeiro do Precinho",
  },
  description:
    "Catálogo e vitrine de ofertas em tempo real. Promoções reais e auditadas de Mercado Livre, Amazon, Shopee e AliExpress.",
  openGraph: {
    title: "Garimpeiro do Precinho | Ofertas e Cupons no Telegram",
    description:
      "Garimpamos e auditamos as melhores promoções da web 3x ao dia. Entre no canal e economize.",
    url: "https://garimpeirodoprecinho.com.br",
    siteName: "Garimpeiro do Precinho",
    locale: "pt_BR",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { items: allOffers } = await getOffers();

  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} font-sans dark`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-amber-500 selection:text-black">
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <OfferDetailDrawer initialOffers={allOffers} />
        </Providers>
      </body>
    </html>
  );
}
