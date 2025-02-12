import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import type React from "react";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "School Management System",
	description:
		"A comprehensive solution for managing schools, students, and educational resources.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="h-full bg-gray-100">
			<body className={`${inter.className} h-full`}>
				<Toaster />
				{children}
			</body>
		</html>
	);
}
