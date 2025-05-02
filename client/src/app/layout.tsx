import "@/src/styles/index.css";
import { Poppins } from "next/font/google";
import { ReduxProvider } from "@/src/components/utils/ReduxProvider";
import { ReCaptchaProvider } from "next-recaptcha-v3";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ToastProvider from "@/src/components/ui/ToastProvider";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --font-poppins: ${poppins.style.fontFamily};
          }
        `}</style>
      </head>
      <body className={poppins.variable}>
        <ReduxProvider>
          <ReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          >
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
              <ToastProvider>{children}</ToastProvider>
            </GoogleOAuthProvider>
          </ReCaptchaProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
