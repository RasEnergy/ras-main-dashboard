"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Home,
	School,
	Users,
	Package,
	ShoppingCart,
	List,
	LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
	SidebarTrigger,
	SidebarProvider,
} from "@/components/ui/sidebar";
import type React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient(); // Define queryClient here

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();

	const handleLogout = () => {
		document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		router.push("/login");
	};

	const menuItems = [
		{ icon: Home, label: "Dashboard", href: "/dashboard" },
		{ icon: School, label: "Schools", href: "/dashboard/schools" },
		{ icon: Users, label: "Students", href: "/dashboard/students" },
		{ icon: Package, label: "Products", href: "/dashboard/products" },
		{ icon: List, label: "Item List", href: "/dashboard/items" },
		{ icon: ShoppingCart, label: "Orders", href: "/dashboard/orders" },
	];

	return (
		<SidebarProvider>
			<div className="flex h-screen bg-gray-100">
				<QueryClientProvider client={queryClient}>
					<Sidebar>
						<SidebarHeader className="p-4">
							<h1 className="text-2xl font-bold text-primary">
								Admin Dashboard
							</h1>
						</SidebarHeader>
						<SidebarContent className="flex flex-col flex-grow">
							<nav className="space-y-1">
								{menuItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-900">
										<item.icon className="mr-3 h-6 w-6" />
										{item.label}
									</Link>
								))}
							</nav>
						</SidebarContent>
						<SidebarFooter className="p-4">
							<Button
								variant="outline"
								className="w-full"
								onClick={handleLogout}>
								<LogOut className="mr-2 h-4 w-4" /> Logout
							</Button>
						</SidebarFooter>
					</Sidebar>
					<main className="flex-1 overflow-y-auto bg-white p-8">
						<div className="w-[75vw] mx-auto">
							<SidebarTrigger className="mb-4" />
							{children}
						</div>
					</main>
				</QueryClientProvider>
			</div>
		</SidebarProvider>
	);
}
