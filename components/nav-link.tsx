"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavLinkProps {
	href: string;
	children: React.ReactNode;
	variant?: "default" | "outline" | "ghost";
	className?: string;
}

export function NavLink({
	href,
	children,
	variant = "default",
	className = "",
}: NavLinkProps) {
	return (
		<Link href={href} passHref>
			<Button variant={variant} className={className}>
				{children}
			</Button>
		</Link>
	);
}
