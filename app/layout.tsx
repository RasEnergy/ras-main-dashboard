import "./globals.css";
// import { Inter, Noto_Sans_Ethiopic } from "next/font/google";
import type { Metadata } from "next";
import type React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School Management System",
  description:
    "A comprehensive solution for managing schools, students, and educational resources.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic&display=swap"
        />
      </head>
      <body className={`${inter.className} h-full`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}

// import "./globals.css";
// import { Inter, Noto_Sans_Ethiopic } from "next/font/google";
// import type { Metadata } from "next";
// import type React from "react";
// import { Toaster } from "@/components/ui/toaster";

// const inter = Inter({ subsets: ["latin"] });
// const notoSansEthiopic = Noto_Sans_Ethiopic({ subsets: ["ethiopic"] });

// export const metadata: Metadata = {
// 	title: "School Management System",
// 	description:
// 		"A comprehensive solution for managing schools, students, and educational resources.",
// };

// export default function RootLayout({
// 	children,
// }: {
// 	children: React.ReactNode;
// }) {
// 	return (
// 		<html lang="en" className="h-full bg-gray-100">
// 			<body
// 				className={`${inter.className} ${notoSansEthiopic.className} h-full`}>
// 				<Toaster />
// 				{children}
// 			</body>
// 		</html>
// 	);
// }
