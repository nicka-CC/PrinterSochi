import type { Metadata } from "next";
import "@/src/app/styles/index.css";
import App from "@/src/app/app";
import Header from "@/src/widgets/header";
import Footer from "@/src/widgets/footer";

export const metadata: Metadata = {
  title: "TypeWord CMS",
  description: "Добро пожаловать в TypeWord CMS",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Header />
        <App>{children}</App>
      <Footer/>
      </body>
    </html>
  );
};
export default RootLayout;
