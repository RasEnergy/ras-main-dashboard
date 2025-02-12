"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Menu,
	School,
	Users,
	BookOpen,
	Phone,
	Mail,
	MapPin,
} from "lucide-react";
import { translations, type Language } from "@/lib/translations";
import { useToast } from "@/components/ui/use-toast";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";

const fadeInUpKeyframes = {
	"0%": { opacity: "0", transform: "translateY(10px)" },
	"100%": { opacity: "1", transform: "translateY(0)" },
};

const styles = {
	"@keyframes fadeInUp": fadeInUpKeyframes,
	".animate-fade-in-up": {
		animation: "fadeInUp 0.5s ease-out forwards",
	},
	".animation-delay-200": {
		animationDelay: "200ms",
	},
	".animation-delay-400": {
		animationDelay: "400ms",
	},
};

export default function HomePage() {
	const [isOpen, setIsOpen] = useState(false);
	const [lang, setLang] = useState<Language>("en");
	const [studentId, setStudentId] = useState("");
	const [selectedStudent, setSelectedStudent] = useState<any>(null);
	const [availableItems, setAvailableItems] = useState<any[]>([]);
	const [selectedItem, setSelectedItem] = useState("");
	const [quantity, setQuantity] = useState("1");
	const [totalPrice, setTotalPrice] = useState(0);
	const { toast } = useToast();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [billerReferenceNumber, setBillerReferenceNumber] = useState("");

	const productManagementRef = useRef<HTMLDivElement>(null);

	const t = (key: string) => {
		return key.split(".").reduce((o, i) => o[i], translations[lang] as any);
	};

	const scrollToProductManagement = () => {
		productManagementRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const checkStudent = useCallback(async () => {
		try {
			const response = await fetch(`/api/students?studentId=${studentId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch student");
			}
			const data = await response.json();
			if (data) {
				setSelectedStudent({
					...data,
					fullName: `${data.firstName} ${data.lastName}`,
				});
				const schoolId = data.studentId.substring(0, 4);
				const itemsResponse = await fetch(`/api/items?schoolId=${schoolId}`);
				if (!itemsResponse.ok) {
					throw new Error("Failed to fetch items");
				}
				const itemsData = await itemsResponse.json();
				setAvailableItems(itemsData.items);
				toast({
					title: t("productManagement.studentFound"),
				});
			} else {
				setSelectedStudent(null);
				setAvailableItems([]);
				toast({
					title: t("productManagement.studentNotFound"),
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error checking student:", error);
			toast({
				title: t("productManagement.errorCheckingStudent"),
				variant: "destructive",
			});
		}
	}, [studentId, toast, t]);

	const handleItemChange = useCallback(
		(itemId: string) => {
			setSelectedItem(itemId);
			const item = availableItems.find((i) => i.id === itemId);
			if (item) {
				setTotalPrice(item.price * Number(quantity));
			}
		},
		[availableItems, quantity]
	);

	const handleQuantityChange = useCallback(
		(value: string) => {
			setQuantity(value);
			const item = availableItems.find((i) => i.id === selectedItem);
			if (item) {
				setTotalPrice(item.price * Number(value));
			}
		},
		[availableItems, selectedItem]
	);

	const createProduct = useCallback(async () => {
		if (selectedStudent && selectedItem) {
			const billerRefNumber = `BRN${Date.now()}`;
			const product = {
				studentId: selectedStudent.id,
				itemId: selectedItem,
				quantity: Number(quantity),
				totalPrice: totalPrice,
				billerReferenceNumber: billerRefNumber,
			};
			try {
				const response = await fetch("/api/products", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(product),
				});
				if (!response.ok) {
					throw new Error("Failed to create product");
				}
				const result = await response.json();
				toast({
					title: t("productManagement.productCreated"),
					description: `Product created with ID: ${result.id}`,
				});
				setBillerReferenceNumber(billerRefNumber);
				setIsModalOpen(true);
				setStudentId("");
				setSelectedStudent(null);
				setSelectedItem("");
				setQuantity("1");
				setTotalPrice(0);
			} catch (error) {
				console.error("Error creating product:", error);
				toast({
					title: t("productManagement.errorCreatingProduct"),
					description:
						error instanceof Error
							? error.message
							: "An unexpected error occurred",
					variant: "destructive",
				});
			}
		} else {
			toast({
				title: "Invalid Input",
				description:
					"Please select a student and an item before creating a product.",
				variant: "destructive",
			});
		}
	}, [selectedStudent, selectedItem, quantity, totalPrice, toast, t]);

	const copyBillerReferenceNumber = useCallback(() => {
		navigator.clipboard.writeText(billerReferenceNumber).then(() => {
			toast({
				title: "Copied!",
				description: "Biller Reference Number copied to clipboard",
			});
		});
	}, [billerReferenceNumber, toast]);

	useEffect(() => {
		const style = document.createElement("style");
		style.textContent = Object.entries(styles)
			.map(([selector, rules]) => {
				if (selector.startsWith("@keyframes")) {
					return `${selector} ${JSON.stringify(rules)}`;
				}
				return `${selector} ${JSON.stringify(rules).slice(1, -1)}`;
			})
			.join("\n");
		document.head.appendChild(style);
		return () => {
			document.head.removeChild(style);
		};
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<header className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
				<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
					<div className="flex items-center">
						<School className="h-8 w-8 text-[#881337] mr-2" />
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
							{t("title")}
						</h1>
					</div>
					<nav className="hidden md:flex items-center space-x-4">
						<Select
							value={lang}
							onValueChange={(value: Language) => setLang(value)}>
							<SelectTrigger className="w-[100px]">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="en">English</SelectItem>
								<SelectItem value="am">አማርኛ</SelectItem>
							</SelectContent>
						</Select>
						<Link href="/login" passHref>
							<Button variant="outline">{t("nav.login")}</Button>
						</Link>
						<Link href="/signup" passHref>
							<Button className="bg-[#881337] hover:bg-[#6e0f2d] text-white">
								{t("nav.signup")}
							</Button>
						</Link>
					</nav>
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild className="md:hidden">
							<Button variant="outline" size="icon">
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[400px]">
							<nav className="flex flex-col gap-4">
								<Select
									value={lang}
									onValueChange={(value: Language) => setLang(value)}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="en">English</SelectItem>
										<SelectItem value="am">አማርኛ</SelectItem>
									</SelectContent>
								</Select>
								<Link href="/login" passHref>
									<Button
										className="w-full"
										variant="outline"
										onClick={() => setIsOpen(false)}>
										{t("nav.login")}
									</Button>
								</Link>
								<Link href="/signup" passHref>
									<Button
										className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white"
										onClick={() => setIsOpen(false)}>
										{t("nav.signup")}
									</Button>
								</Link>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
				<div className="relative mb-16">
					<div className="absolute inset-0 z-0">
						<Image
							src="/placeholder.svg?height=800&width=1600"
							alt="Hero background"
							layout="fill"
							objectFit="cover"
							className="rounded-lg"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-[#881337]/80 to-[#6e0f2d]/80 mix-blend-multiply" />
					</div>
					<div className="relative z-10 text-center py-32 px-4 sm:py-48 sm:px-6 lg:px-8">
						<h2 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl mb-4 drop-shadow-lg animate-fade-in-up">
							{t("hero.title")}
						</h2>
						<p className="mt-6 max-w-lg mx-auto text-xl text-white/90 drop-shadow-lg animate-fade-in-up animation-delay-200">
							{t("hero.subtitle")}
						</p>
						<div className="mt-10 flex justify-center gap-4 animate-fade-in-up animation-delay-400">
							<Button
								size="lg"
								className="bg-white text-[#881337] hover:bg-gray-100 text-lg px-8 py-3 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
								onClick={scrollToProductManagement}>
								{t("hero.cta")}
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="text-white border-white hover:bg-white/10 text-lg px-8 py-3 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
								{t("hero.learnMore")}
							</Button>
						</div>
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
				</div>

				<div ref={productManagementRef} className="mb-16">
					<h2 className="text-3xl font-extrabold text-center mb-8">
						{t("productManagement.title")}
					</h2>
					<Card className="shadow-lg">
						<CardContent className="pt-6">
							<div className="space-y-4">
								<div>
									<Label htmlFor="studentId">
										{t("productManagement.studentIdLabel")}
									</Label>
									<div className="flex mt-1">
										<Input
											id="studentId"
											value={studentId}
											onChange={(e) => setStudentId(e.target.value)}
											className="flex-grow"
										/>
										<Button
											onClick={checkStudent}
											className="ml-2 bg-[#881337] hover:bg-[#6e0f2d] text-white">
											{t("productManagement.checkStudentButton")}
										</Button>
									</div>
									{selectedStudent && (
										<div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md">
											<p className="font-semibold">
												{t("productManagement.studentFound")}{" "}
												{selectedStudent.fullName}
											</p>
										</div>
									)}
								</div>
								{selectedStudent && (
									<>
										<div>
											<Label htmlFor="item">
												{t("productManagement.selectItemLabel")}
											</Label>
											<Select
												value={selectedItem}
												onValueChange={handleItemChange}>
												<SelectTrigger id="item">
													<SelectValue
														placeholder={t("productManagement.selectItemLabel")}
													/>
												</SelectTrigger>
												<SelectContent>
													{availableItems.map((item) => (
														<SelectItem key={item.id} value={item.id}>
															{item.name} - ${item.price.toFixed(2)}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div>
											<Label htmlFor="quantity">
												{t("productManagement.quantityLabel")}
											</Label>
											<Input
												id="quantity"
												type="number"
												min="1"
												value={quantity}
												onChange={(e) => handleQuantityChange(e.target.value)}
											/>
										</div>
										{totalPrice > 0 && (
											<div className="p-4 bg-gray-50 rounded-md">
												<Label>{t("productManagement.totalPrice")}</Label>
												<div className="text-2xl font-bold text-[#881337]">
													${totalPrice.toFixed(2)}
												</div>
											</div>
										)}
										<Button
											onClick={createProduct}
											className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white">
											{t("productManagement.createProductButton")}
										</Button>
									</>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="relative mb-16">
					<div
						className="absolute inset-0 flex items-center"
						aria-hidden="true">
						<div className="w-full border-t border-gray-300" />
					</div>
					<div className="relative flex justify-center">
						<span className="px-3 bg-white text-lg font-medium text-gray-900">
							{t("features.title")}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
					<Card className="transform transition duration-500 hover:scale-105 shadow-lg overflow-hidden">
						<div className="h-48 w-full relative">
							<Image
								src="/placeholder.svg?height=200&width=400"
								alt="Student Management"
								layout="fill"
								objectFit="cover"
							/>
						</div>
						<CardHeader>
							<CardTitle className="flex items-center text-[#881337]">
								<Users className="mr-2" />
								{t("features.studentManagement.title")}
							</CardTitle>
							<CardDescription>
								{t("features.studentManagement.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>{t("features.studentManagement.content")}</p>
						</CardContent>
						<CardFooter>
							<Button
								variant="outline"
								className="w-full hover:bg-[#881337] hover:text-white">
								{t("features.studentManagement.cta")}
							</Button>
						</CardFooter>
					</Card>

					<Card className="transform transition duration-500 hover:scale-105 shadow-lg overflow-hidden">
						<div className="h-48 w-full relative">
							<Image
								src="/placeholder.svg?height=200&width=400"
								alt="Product Catalog"
								layout="fill"
								objectFit="cover"
							/>
						</div>
						<CardHeader>
							<CardTitle className="flex items-center text-[#881337]">
								<BookOpen className="mr-2" />
								{t("features.productCatalog.title")}
							</CardTitle>
							<CardDescription>
								{t("features.productCatalog.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>{t("features.productCatalog.content")}</p>
						</CardContent>
						<CardFooter>
							<Button
								variant="outline"
								className="w-full hover:bg-[#881337] hover:text-white">
								{t("features.productCatalog.cta")}
							</Button>
						</CardFooter>
					</Card>

					<Card className="transform transition duration-500 hover:scale-105 shadow-lg overflow-hidden">
						<div className="h-48 w-full relative">
							<Image
								src="/placeholder.svg?height=200&width=400"
								alt="Order Management"
								layout="fill"
								objectFit="cover"
							/>
						</div>
						<CardHeader>
							<CardTitle className="flex items-center text-[#881337]">
								<School className="mr-2" />
								{t("features.orderManagement.title")}
							</CardTitle>
							<CardDescription>
								{t("features.orderManagement.description")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p>{t("features.orderManagement.content")}</p>
						</CardContent>
						<CardFooter>
							<Button
								variant="outline"
								className="w-full hover:bg-[#881337] hover:text-white">
								{t("features.orderManagement.cta")}
							</Button>
						</CardFooter>
					</Card>
				</div>

				<div className="mb-16">
					<h2 className="text-3xl font-extrabold text-center mb-8">
						{t("services.title")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<Card className="shadow-lg overflow-hidden">
							<div className="h-48 w-full relative">
								<Image
									src="/placeholder.svg?height=200&width=400"
									alt="School Management"
									layout="fill"
									objectFit="cover"
								/>
							</div>
							<CardHeader>
								<CardTitle className="flex items-center text-[#881337]">
									<School className="mr-2" />
									{t("services.schoolManagement.title")}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{t("services.schoolManagement.description")}</p>
							</CardContent>
						</Card>
						<Card className="shadow-lg overflow-hidden">
							<div className="h-48 w-full relative">
								<Image
									src="/placeholder.svg?height=200&width=400"
									alt="Student Information System"
									layout="fill"
									objectFit="cover"
								/>
							</div>
							<CardHeader>
								<CardTitle className="flex items-center text-[#881337]">
									<Users className="mr-2" />
									{t("services.studentInformationSystem.title")}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{t("services.studentInformationSystem.description")}</p>
							</CardContent>
						</Card>
						<Card className="shadow-lg overflow-hidden">
							<div className="h-48 w-full relative">
								<Image
									src="/placeholder.svg?height=200&width=400"
									alt="Curriculum Planning"
									layout="fill"
									objectFit="cover"
								/>
							</div>
							<CardHeader>
								<CardTitle className="flex items-center text-[#881337]">
									<BookOpen className="mr-2" />
									{t("services.curriculumPlanning.title")}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{t("services.curriculumPlanning.description")}</p>
							</CardContent>
						</Card>
					</div>
				</div>

				<div className="mb-16">
					<h2 className="text-3xl font-extrabold text-center mb-8">
						{t("aboutUs.title")}
					</h2>
					<Card className="shadow-lg">
						<CardContent className="prose max-w-none pt-6">
							<p>{t("aboutUs.content1")}</p>
							<p>{t("aboutUs.content2")}</p>
						</CardContent>
					</Card>
				</div>

				<div className="mb-16">
					<h2 className="text-3xl font-extrabold text-center mb-8">
						{t("contactUs.title")}
					</h2>
					<Card className="shadow-lg">
						<CardContent className="pt-6">
							<div className="flex items-center space-x-4 mb-4">
								<Phone className="h-6 w-6 text-[#881337]" />
								<p>{t("contactUs.phone")}</p>
							</div>
							<div className="flex items-center space-x-4 mb-4">
								<Mail className="h-6 w-6 text-[#881337]" />
								<p>{t("contactUs.email")}</p>
							</div>
							<div className="flex items-center space-x-4">
								<MapPin className="h-6 w-6 text-[#881337]" />
								<p>{t("contactUs.address")}</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>

			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("modal.title")}</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<p className="mb-2">{t("modal.message")}</p>
						<div className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
							<span className="font-mono text-lg">{billerReferenceNumber}</span>
							<Button
								variant="outline"
								size="icon"
								onClick={copyBillerReferenceNumber}
								className="ml-2">
								<Copy className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<DialogFooter>
						<Button onClick={() => setIsModalOpen(false)}>
							{t("modal.close")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<footer className="bg-gray-50 mt-12 border-t border-gray-200">
				<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
					<p className="text-center text-base text-gray-500">
						{t("footer.copyright")}
					</p>
				</div>
			</footer>
		</div>
	);
}
