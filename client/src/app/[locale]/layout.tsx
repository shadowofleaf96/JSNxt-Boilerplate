import "@/styles/index.css";
import { Poppins } from "next/font/google";
import { ReduxProvider } from "@/components/utils/ReduxProvider";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { GoogleOAuthProvider } from "@react-oauth/google";
import initTranslations from "@/app/utils/i18n";
import i18nConfig from "@/app/utils/i18nConfig";
import TranslationProvider from "@/app/utils/TranslationProvider";
import ToastProvider from "@/components/ui/ToastProvider";

const i18nNamespaces = ["translation"];

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: "normal",
  variable: "--font-poppins",
});

export const metadata = {
  title: "JSNXT Boilerplate",
  description: "This is a Simple Next.js/Express.js boilerplate",
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <head>
        <style>{`
          :root {
            --font-poppins: ${poppins.style.fontFamily};
          }
        `}</style>
      </head>
      <ReduxProvider>
        <ReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        >
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
          >
            <TranslationProvider
              locale={locale}
              resources={resources}
              namespaces={i18nNamespaces}
            >
              <body className={poppins.variable}>
                <ToastProvider>{children}</ToastProvider>
              </body>
            </TranslationProvider>
          </GoogleOAuthProvider>
        </ReCaptchaProvider>
      </ReduxProvider>
    </html>
  );
}
