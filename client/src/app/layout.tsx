import "./styles/index.css";
import { Poppins } from "next/font/google";
import { ReduxProvider } from "./components/Utils/ReduxProvider";
import ToastProvider from "./components/Utils/ToastProvider";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: "normal",
  variable: "--font-poppins",
});

export const metadata = {
  title: "JSNxt Boilerplate",
  description: "This is my Next.js/Express.js boilerplate",
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
          <ToastProvider>{children}</ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
