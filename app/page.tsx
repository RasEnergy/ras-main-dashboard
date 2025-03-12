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
	Shield,
	GraduationCap,
} from "lucide-react";
import { translations, type Language } from "@/lib/translations";
import { useToast } from "@/components/ui/use-toast";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Copy } from "lucide-react";
import { useTranslation } from "next-i18next";

const fadeInUpKeyframes = {
	"0%": { opacity: "0", transform: "translateY(20px)" },
	"100%": { opacity: "1", transform: "translateY(0)" },
};

const styles = {
	"@keyframes fadeInUp": fadeInUpKeyframes,
	".animate-fade-in-up": {
		animation: "fadeInUp 0.8s ease-out forwards",
	},
	".animation-delay-200": {
		animationDelay: "200ms",
	},
	".animation-delay-400": {
		animationDelay: "400ms",
	},
	".animation-delay-600": {
		animationDelay: "600ms",
	},
	".hover-scale": {
		transition: "transform 0.3s ease",
	},
	".hover-scale:hover": {
		transform: "scale(1.05)",
	},
};

export default function HomePage() {
	const [isOpen, setIsOpen] = useState(false);
	const [lang, setLang] = useState<Language>("am");
	const [studentId, setStudentId] = useState("");
	const [selectedStudent, setSelectedStudent] = useState<any>(null);
	const [availableItems, setAvailableItems] = useState<any[]>([]);
	const [selectedItem, setSelectedItem] = useState("");
	const [quantity, setQuantity] = useState("1");
	const [totalPrice, setTotalPrice] = useState(0);
	const { toast } = useToast();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [billerReferenceNumber, setBillerReferenceNumber] = useState("");
	const [selectedService, setSelectedService] = useState(null);
	const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
	const contactRef = useRef<HTMLDivElement>(null);

	const { i18n } = useTranslation();

	const scrollToContact = () => {
		contactRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const openServiceModal = (service: any) => {
		setSelectedService(service);
		setIsServiceModalOpen(true);
	};

	const productManagementRef = useRef<HTMLDivElement>(null);
	const howToUseRef = useRef<HTMLDivElement>(null);

	const t = (key: string) => {
		return key.split(".").reduce((o, i) => o[i], translations[lang] as any);
	};

	const scrollToProductManagement = () => {
		productManagementRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const checkStudent = useCallback(async () => {
		if (!studentId.trim()) {
			toast({
				title: t("productManagement.errorCheckingStudent"),
				description: t("productManagement.emptyStudentId"),
				variant: "destructive",
			});
			return;
		}

		try {
			const response = await fetch(`/api/students?studentId=${studentId}`);
			if (!response.ok) {
				throw new Error("Failed to fetch student");
			}
			const data = await response.json();
			if (data) {
				setSelectedStudent({
					...data,
					fullName: data.lastName
						? `${data.firstName} ${data.lastName}`
						: data.firstName,
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
	}, [studentId, toast]);
	// const checkStudent = useCallback(async () => {
	// 	try {
	// 		const response = await fetch(`/api/students?studentId=${studentId}`);
	// 		if (!response.ok) {
	// 			throw new Error("Failed to fetch student");
	// 		}
	// 		const data = await response.json();
	// 		if (data) {
	// 			setSelectedStudent({
	// 				...data,
	// 				fullName: `${data.firstName} ${data.lastName}`,
	// 			});
	// 			const schoolId = data.studentId.substring(0, 4);
	// 			const itemsResponse = await fetch(`/api/items?schoolId=${schoolId}`);
	// 			if (!itemsResponse.ok) {
	// 				throw new Error("Failed to fetch items");
	// 			}
	// 			const itemsData = await itemsResponse.json();
	// 			setAvailableItems(itemsData.items);
	// 			toast({
	// 				title: t("productManagement.studentFound"),
	// 			});
	// 		} else {
	// 			setSelectedStudent(null);
	// 			setAvailableItems([]);
	// 			toast({
	// 				title: t("productManagement.studentNotFound"),
	// 				variant: "destructive",
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error("Error checking student:", error);
	// 		toast({
	// 			title: t("productManagement.errorCheckingStudent"),
	// 			variant: "destructive",
	// 		});
	// 	}
	// }, [studentId, toast, t]);

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
			const billerRefNumber = `RAS${Date.now()}`;
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
		// Add a smooth scroll behavior to the entire document
		// Add at the beginning of the useEffect hook, before the style creation
		document.documentElement.style.scrollBehavior = "smooth";

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
		<div
			className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${
				lang ? "font-amharic" : "font-sans"
			}`}>
			<header className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
				<div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
					<div className="flex items-center space-x-2">
						<Image
							src="/assets/images/logo.png"
							alt="logo background"
							width={75}
							height={35}
							className="rounded-lg hover:opacity-90 transition-opacity"
						/>
						<h1 className="text-xl sm:text-2xl font-bold text-gray-900 hidden sm:block">
							{t("title")}
						</h1>
					</div>
					<div className="flex items-center space-x-4">
						<Select
							value={lang}
							onValueChange={(value: Language) => setLang(value)}>
							<SelectTrigger className="w-[100px] border-[#881337]/30 focus:ring-[#881337]/20">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="am">አማርኛ</SelectItem>
								<SelectItem value="en">English</SelectItem>
							</SelectContent>
						</Select>
						<nav className="hidden md:flex items-center space-x-4">
							<Link href="/login" passHref>
								<Button
									variant="outline"
									className="border-[#881337]/30 hover:bg-[#881337]/10 hover:text-[#881337] transition-colors">
									{t("nav.login")}
								</Button>
							</Link>
						</nav>
					</div>
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild className="md:hidden">
							<Button
								variant="outline"
								size="icon"
								className="border-[#881337]/30">
								<Menu className="h-6 w-6 text-[#881337]" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[400px]">
							<div className="flex items-center mb-6">
								<Image
									src="/assets/images/logo.png"
									alt="logo background"
									width={60}
									height={30}
									className="rounded-lg mr-3"
								/>
								<h2 className="text-xl font-bold">{t("title")}</h2>
							</div>
							<nav className="flex flex-col gap-4">
								<Select
									value={lang}
									onValueChange={(value: Language) => setLang(value)}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="am">አማርኛ</SelectItem>
										<SelectItem value="en">English</SelectItem>
									</SelectContent>
								</Select>
								<Link href="/login" passHref>
									<Button
										className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white"
										onClick={() => setIsOpen(false)}>
										{t("nav.login")}
									</Button>
								</Link>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-8">
				<div className="relative mb-16">
					<div className="absolute inset-0 z-0">
						<Image
							src="/assets/images/hero4.png?height=800&width=1600"
							alt="Hero background"
							layout="fill"
							objectFit="cover"
							className="rounded-lg"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-[#881337]/70 to-[#6e0f2d]/70 mix-blend-multiply" />
					</div>
					<div className="relative z-10 py-32 px-4 sm:py-48 sm:px-6 lg:px-8 max-w-7xl mx-auto">
						<h2 className="text-4xl font-extrabold text-white text-left sm:text-5xl sm:tracking-tight lg:text-6xl mb-4 drop-shadow-lg animate-fade-in-up">
							{t("hero.title")}
						</h2>
						<p className="mt-6 max-w-lg text-left text-xl text-white drop-shadow-lg animate-fade-in-up animation-delay-200">
							{t("hero.subtitle")}
						</p>
						<div className="mt-10 flex gap-4 animate-fade-in-up animation-delay-400">
							<Button
								size="lg"
								className="bg-white text-[#881337] hover:bg-gray-100 text-lg px-8 py-3 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
								onClick={() =>
									howToUseRef.current?.scrollIntoView({ behavior: "smooth" })
								}>
								{t("hero.cta")}
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-3 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
								onClick={scrollToProductManagement}>
								{t("productManagement.title")}
							</Button>
						</div>
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
				</div>

				<div ref={howToUseRef} className="mb-20 scroll-mt-20">
					<h2 className="text-3xl font-extrabold text-center mb-8 px-3">
						{t("howToUse.title")}
					</h2>
					<Card className="shadow-xl overflow-hidden border-none bg-gradient-to-br from-white to-gray-50">
						<div className="md:flex">
							<div className="p-8">
								<CardTitle className="text-2xl font-bold text-[#881337] mb-4">
									{t("howToUse.title")}
								</CardTitle>
								<p className="text-gray-600 mb-6 text-lg">
									{t("howToUse.description")}
								</p>
								<div className="mt-4">
									<h3 className="text-xl font-semibold mb-4 text-gray-800">
										{t("howToUse.steps.title")}
									</h3>
									<ol className="space-y-4">
										<li className="flex items-start">
											<span className="flex items-center justify-center rounded-full bg-[#881337] text-white h-8 w-8 flex-shrink-0 mr-3">
												1
											</span>
											<span className="text-gray-700">
												{t("howToUse.steps.step1")}
											</span>
										</li>
										<li className="flex items-start">
											<span className="flex items-center justify-center rounded-full bg-[#881337] text-white h-8 w-8 flex-shrink-0 mr-3">
												2
											</span>
											<span className="text-gray-700">
												{t("howToUse.steps.step2")}
											</span>
										</li>
										<li className="flex items-start">
											<span className="flex items-center justify-center rounded-full bg-[#881337] text-white h-8 w-8 flex-shrink-0 mr-3">
												3
											</span>
											<span className="text-gray-700">
												{t("howToUse.steps.step3")}
											</span>
										</li>
										<li className="flex items-start">
											<span className="flex items-center justify-center rounded-full bg-[#881337] text-white h-8 w-8 flex-shrink-0 mr-3">
												4
											</span>
											<span className="text-gray-700">
												{t("howToUse.steps.step4")}
											</span>
										</li>
									</ol>
								</div>
							</div>
							<div className="md:flex-shrink-0 flex items-center justify-center p-8 bg-gradient-to-br from-[#881337]/5 to-[#881337]/10">
								<Image
									className="h-full object-contain max-w-[200px]"
									src="/assets/images/telebirr.png"
									alt="TeleBirr Logo"
									width={200}
									height={200}
								/>
							</div>
						</div>
					</Card>
				</div>

				<div ref={productManagementRef} className="mb-20 scroll-mt-20">
					<h2 className="text-3xl font-extrabold text-center mb-8">
						{t("productManagement.title")}
					</h2>
					<Card className="shadow-xl border-none overflow-hidden bg-gradient-to-br from-white to-gray-50">
						<CardContent className="p-8">
							<div className="space-y-6">
								<div>
									<Label
										htmlFor="studentId"
										className="text-lg font-medium mb-2 block">
										{t("productManagement.studentIdLabel")}
									</Label>
									<div className="flex mt-1">
										<Input
											id="studentId"
											value={studentId}
											onChange={(e) => setStudentId(e.target.value)}
											placeholder={t("productManagement.studentIdPlaceholder")}
											className="flex-grow text-base py-6 border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337]"
											required
										/>
										<Button
											onClick={checkStudent}
											className="ml-2 bg-[#881337] hover:bg-[#6e0f2d] text-white px-6 text-base">
											{t("productManagement.checkStudentButton")}
										</Button>
									</div>
									{selectedStudent && (
										<div className="mt-3 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md flex items-center">
											<div className="bg-green-100 rounded-full p-1 mr-2">
												<Users className="h-5 w-5 text-green-600" />
											</div>
											<p className="font-medium">
												{t("productManagement.studentFound")}{" "}
												<span className="font-bold">
													{selectedStudent.fullName}
												</span>
											</p>
										</div>
									)}
								</div>
								{selectedStudent && (
									<div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
										<h3 className="text-lg font-semibold mb-4 text-[#881337]">
											{t("productManagement.orderDetails")}
										</h3>
										<div className="space-y-5">
											<div>
												<Label
													htmlFor="item"
													className="text-base font-medium mb-2 block">
													{t("productManagement.selectItemLabel")}
												</Label>
												<Select
													value={selectedItem}
													onValueChange={handleItemChange}>
													<SelectTrigger
														id="item"
														className="w-full text-base py-6 border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337]">
														<SelectValue placeholder="Select Item" />
													</SelectTrigger>
													<SelectContent>
														{availableItems.map((item) => (
															<SelectItem key={item.id} value={item.id}>
																{item.name} - ETB {item.price.toFixed(2)}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div>
												<Label
													htmlFor="quantity"
													className="text-base font-medium mb-2 block">
													{t("productManagement.quantityLabel")}
												</Label>
												<Input
													id="quantity"
													type="number"
													min="1"
													value={quantity}
													onChange={(e) => handleQuantityChange(e.target.value)}
													className="text-base py-6 border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337]"
												/>
											</div>
											{totalPrice > 0 && (
												<div className="p-5 bg-[#881337]/5 rounded-md border border-[#881337]/10">
													<Label className="text-base font-medium mb-1 block">
														{t("productManagement.totalPrice")}
													</Label>
													<div className="text-3xl font-bold text-[#881337]">
														ETB {totalPrice.toFixed(2)}
													</div>
												</div>
											)}
											<Button
												onClick={createProduct}
												className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white py-6 text-lg font-medium">
												{t("productManagement.createProductButton")}
											</Button>
										</div>
									</div>
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
						<span className="px-6 py-2 bg-white text-xl font-bold text-[#881337] rounded-full shadow-sm">
							{t("features.title")}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-20">
					{[
						{
							title: t("features.studentManagement.title"),
							description: t("features.studentManagement.description"),
							content: t("features.studentManagement.content"),
							cta: t("features.studentManagement.cta"),
							icon: <Users className="h-6 w-6" />,
							images: [
								"/assets/images/products/id1.jpg?height=400&width=600",
								"/assets/images/products/id2.jpg?height=400&width=600",
							],
						},
						{
							title: t("features.orderManagement.title"),
							description: t("features.orderManagement.description"),
							content: t("features.orderManagement.content"),
							cta: t("features.orderManagement.cta"),
							icon: <School className="h-6 w-6" />,
							images: [
								"/assets/images/products/bag.jpg?height=400&width=600",
								"/assets/images/products/bag2.jpg?height=400&width=600",
							],
						},
						{
							title: t("features.schoolManagement.title"),
							description: t("features.schoolManagement.description"),
							content: t("features.schoolManagement.content"),
							cta: t("features.schoolManagement.cta"),
							icon: <GraduationCap className="h-6 w-6" />,
							images: [
								"/assets/images/products/sms1.jpg?height=400&width=600",
								"/assets/images/products/sms2.jpg?height=400&width=600",
							],
						},
						{
							title: t("features.studentInsurance.title"),
							description: t("features.studentInsurance.description"),
							content: t("features.studentInsurance.content"),
							cta: t("features.studentInsurance.cta"),
							icon: <Shield className="h-6 w-6" />,
							images: [
								"/assets/images/products/helath1.jpg?height=400&width=600",
								"/assets/images/products/health2.jpg?height=400&width=600",
								"/assets/images/products/health3.jpg?height=400&width=600",
							],
						},
						{
							title: t("features.productCatalog.title"),
							description: t("features.productCatalog.description"),
							content: t("features.productCatalog.content"),
							cta: t("features.productCatalog.cta"),
							icon: <BookOpen className="h-6 w-6" />,
							images: [
								"/assets/images/products/sport1.jpg?height=400&width=600",
								"/assets/images/products/sport2.jpg?height=400&width=600",
							],
						},
					].map((service, index) => (
						<Card
							key={index}
							className="group transform transition-all duration-500 hover:scale-105 shadow-lg overflow-hidden cursor-pointer border-none"
							onClick={() => openServiceModal(service)}>
							<div className="h-48 w-full relative overflow-hidden">
								<Image
									src={service.images[0] || "/placeholder.svg"}
									alt={service.title}
									layout="fill"
									objectFit="cover"
									className="transition-transform duration-700 group-hover:scale-110"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#881337]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							</div>
							<CardHeader>
								<CardTitle className="flex items-center text-[#881337] group-hover:text-[#6e0f2d] transition-colors">
									<div className="bg-[#881337]/10 p-2 rounded-full mr-3 group-hover:bg-[#881337]/20 transition-colors">
										{service.icon}
									</div>
									<span>{service.title}</span>
								</CardTitle>
								<CardDescription className="text-base">
									{service.description}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="line-clamp-3">{service.content}</p>
							</CardContent>
							<CardFooter>
								<Button
									variant="outline"
									className="w-full border-[#881337]/30 text-[#881337] hover:bg-[#881337] hover:text-white transition-colors"
									onClick={(e) => {
										e.stopPropagation();
										scrollToContact();
									}}>
									{t("features.orderButton")}
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>

				<Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
					<DialogContent className="max-w-4xl p-0 overflow-hidden">
						<div className="relative h-64 md:h-80">
							<Image
								src={
									(selectedService as any)?.images[0] ||
									"/placeholder.svg?height=600&width=800" ||
									"/placeholder.svg"
								}
								alt={(selectedService as any)?.title}
								layout="fill"
								objectFit="cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
							<div className="absolute bottom-0 left-0 right-0 p-6">
								<DialogTitle className="text-3xl font-bold text-white flex items-center mb-2">
									<div className="bg-white/20 p-2 rounded-full mr-3">
										{(selectedService as any)?.icon}
									</div>
									<span>{(selectedService as any)?.title}</span>
								</DialogTitle>
							</div>
						</div>
						<div className="p-6">
							<p className="text-lg font-medium mb-4">
								{(selectedService as any)?.description}
							</p>
							<p className="mb-6 text-gray-700">
								{(selectedService as any)?.content}
							</p>
							<div className="grid grid-cols-2 gap-4 mb-6">
								{(selectedService as any)?.images
									.slice(1)
									.map((img: any, index: any) => (
										<div
											key={index}
											className="relative h-40 rounded-lg overflow-hidden shadow-md">
											<Image
												src={img || "/placeholder.svg"}
												alt={`${(selectedService as any)?.title} image ${
													index + 2
												}`}
												layout="fill"
												objectFit="cover"
											/>
										</div>
									))}
							</div>
						</div>
						<DialogFooter className="p-6 bg-gray-50 border-t">
							<Button
								variant="outline"
								onClick={() => setIsServiceModalOpen(false)}
								className="border-gray-300">
								Close
							</Button>
							<Button
								onClick={() => {
									setIsServiceModalOpen(false);
									scrollToContact();
								}}
								className="bg-[#881337] hover:bg-[#6e0f2d] text-white">
								{t("features.orderButton")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<div className="mb-20">
					<div className="bg-gradient-to-r from-[#881337] to-[#6e0f2d] text-white py-16 rounded-xl relative overflow-hidden">
						<div className="absolute inset-0 opacity-10">
							<svg
								className="w-full h-full"
								viewBox="0 0 100 100"
								preserveAspectRatio="none">
								<path
									d="M0,0 L100,0 L100,100 L0,100 Z"
									fill="url(#quote-pattern)"
								/>
							</svg>
							<defs>
								<pattern
									id="quote-pattern"
									patternUnits="userSpaceOnUse"
									width="20"
									height="20">
									<text x="0" y="15" fontSize="20" fill="currentColor">
										"
									</text>
								</pattern>
							</defs>
						</div>
						<div className="relative z-10">
							<h2 className="text-3xl font-extrabold text-center mb-12">
								{t("testimonials.title")}
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
								{[
									{
										quote: t("testimonials.quote1"),
										author: t("testimonials.author1"),
										role: t("testimonials.role1"),
									},
									{
										quote: t("testimonials.quote2"),
										author: t("testimonials.author2"),
										role: t("testimonials.role2"),
									},
									{
										quote: t("testimonials.quote3"),
										author: t("testimonials.author3"),
										role: t("testimonials.role3"),
									},
								].map((testimonial, index) => (
									<Card
										key={index}
										className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors">
										<CardContent className="pt-6">
											<div className="text-4xl font-serif text-white/60 mb-4">
												"
											</div>
											<blockquote className="text-lg font-medium mb-6 text-white/90">
												{testimonial.quote}
											</blockquote>
											<div className="flex items-center">
												<div className="rounded-full bg-white/20 text-white p-2 mr-4">
													<Users className="h-6 w-6" />
												</div>
												<div>
													<p className="font-semibold text-white">
														{testimonial.author}
													</p>
													<p className="text-sm text-white/70">
														{testimonial.role}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="mb-20">
					<h2 className="text-3xl font-extrabold text-center mb-8">
						{t("aboutUs.title")}
					</h2>
					<Card className="shadow-xl border-none overflow-hidden">
						<div className="md:flex">
							<div className="md:w-1/3 bg-[#881337] flex items-center justify-center p-8">
								<div className="text-white text-center">
									<School className="h-16 w-16 mx-auto mb-4" />
									<h3 className="text-2xl font-bold mb-2">{t("title")}</h3>
									<p className="text-white/80">{t("aboutUs.tagline")}</p>
								</div>
							</div>
							<div className="md:w-2/3">
								<CardContent className="prose max-w-none p-8">
									<p className="text-lg leading-relaxed mb-4">
										{t("aboutUs.content1")}
									</p>
									<p className="text-lg leading-relaxed">
										{t("aboutUs.content2")}
									</p>
								</CardContent>
							</div>
						</div>
					</Card>
				</div>

				<div ref={contactRef} className="mb-20 scroll-mt-20">
					<h2 className="text-3xl font-extrabold text-center mb-8">
						{t("contactUs.title")}
					</h2>
					<Card className="shadow-xl border-none overflow-hidden">
						<div className="md:grid md:grid-cols-2">
							<div className="bg-[#881337] p-8 text-white">
								<h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
								<p className="mb-6 text-white/80">
									We'd love to hear from you. Please contact us using the
									information below.
								</p>
								<div className="space-y-6">
									<div className="flex items-center space-x-4">
										<div className="bg-white/20 p-3 rounded-full">
											<Phone className="h-6 w-6" />
										</div>
										<div>
											<p className="font-medium">Phone</p>
											<p className="text-white/80">{t("contactUs.phone")}</p>
										</div>
									</div>
									<div className="flex items-center space-x-4">
										<div className="bg-white/20 p-3 rounded-full">
											<Mail className="h-6 w-6" />
										</div>
										<div>
											<p className="font-medium">Email</p>
											<p className="text-white/80">{t("contactUs.email")}</p>
										</div>
									</div>
									<div className="flex items-center space-x-4">
										<div className="bg-white/20 p-3 rounded-full">
											<MapPin className="h-6 w-6" />
										</div>
										<div>
											<p className="font-medium">Address</p>
											<p className="text-white/80">{t("contactUs.address")}</p>
										</div>
									</div>
								</div>
							</div>
							<div className="p-8">
								<h3 className="text-2xl font-bold mb-6 text-[#881337]">
									Send us a Message
								</h3>
								<div className="space-y-4">
									<div>
										<Label
											htmlFor="name"
											className="text-base font-medium mb-2 block">
											Your Name
										</Label>
										<Input
											id="name"
											placeholder="Enter your name"
											className="text-base py-6 border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337]"
										/>
									</div>
									<div>
										<Label
											htmlFor="email"
											className="text-base font-medium mb-2 block">
											Email Address
										</Label>
										<Input
											id="email"
											type="email"
											placeholder="Enter your email"
											className="text-base py-6 border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337]"
										/>
									</div>
									<div>
										<Label
											htmlFor="message"
											className="text-base font-medium mb-2 block">
											Message
										</Label>
										<textarea
											id="message"
											rows={4}
											placeholder="Enter your message"
											className="w-full rounded-md border border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337] p-3"
										/>
									</div>
									<Button className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white py-6 text-lg font-medium">
										Send Message
									</Button>
								</div>
							</div>
						</div>
					</Card>
				</div>

				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="max-w-md">
						<div className="bg-[#881337] text-white p-6 rounded-t-lg">
							<div className="flex justify-center mb-4">
								<div className="bg-white rounded-full p-3">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M20 6L9 17L4 12"
											stroke="#881337"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							</div>
							<DialogTitle className="text-center text-xl">
								{t("modal.title")}
							</DialogTitle>
						</div>
						<div className="py-6 px-6">
							<p className="mb-4 text-center text-gray-700">
								{t("modal.message")}
							</p>
							<div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
								<span className="font-mono text-lg text-[#881337]">
									{billerReferenceNumber}
								</span>
								<Button
									variant="outline"
									size="icon"
									onClick={copyBillerReferenceNumber}
									className="ml-2 hover:bg-[#881337]/10 hover:text-[#881337]">
									<Copy className="h-4 w-4" />
								</Button>
							</div>
							<p className="mt-4 text-sm text-gray-500 text-center">
								Please save this reference number for your records
							</p>
						</div>
						<DialogFooter className="px-6 pb-6">
							<Button
								onClick={() => setIsModalOpen(false)}
								className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white py-6">
								{t("modal.close")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<footer className="bg-gray-900 text-white mt-12">
					<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
							<div>
								<div className="flex items-center mb-4">
									<Image
										src="/assets/images/logo.png"
										alt="logo"
										width={60}
										height={30}
										className="rounded-lg mr-3"
									/>
									<h3 className="text-xl font-bold">{t("title")}</h3>
								</div>
								<p className="text-gray-400 mb-4">{t("footer.description")}</p>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
								<ul className="space-y-2">
									<li>
										<a
											href="#"
											className="text-gray-400 hover:text-white transition-colors">
											Home
										</a>
									</li>
									<li>
										<a
											href="#"
											className="text-gray-400 hover:text-white transition-colors">
											About Us
										</a>
									</li>
									<li>
										<a
											href="#"
											className="text-gray-400 hover:text-white transition-colors">
											Services
										</a>
									</li>
									<li>
										<a
											href="#"
											className="text-gray-400 hover:text-white transition-colors">
											Contact
										</a>
									</li>
								</ul>
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-4">Contact Us</h3>
								<ul className="space-y-2">
									<li className="flex items-center">
										<Phone className="h-5 w-5 text-gray-400 mr-2" />
										<span className="text-gray-400">
											{t("contactUs.phone")}
										</span>
									</li>
									<li className="flex items-center">
										<Mail className="h-5 w-5 text-gray-400 mr-2" />
										<span className="text-gray-400">
											{t("contactUs.email")}
										</span>
									</li>
									<li className="flex items-center">
										<MapPin className="h-5 w-5 text-gray-400 mr-2" />
										<span className="text-gray-400">
											{t("contactUs.address")}
										</span>
									</li>
								</ul>
							</div>
						</div>
						<div className="border-t border-gray-800 pt-8">
							<p className="text-center text-gray-400">
								{t("footer.copyright")}
							</p>
						</div>
					</div>
				</footer>
			</main>
		</div>
	);
}

// "use client";

// import { useState, useCallback, useRef, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
// 	Menu,
// 	School,
// 	Users,
// 	BookOpen,
// 	Phone,
// 	Mail,
// 	MapPin,
// 	Shield,
// 	GraduationCap,
// } from "lucide-react";
// import { translations, type Language } from "@/lib/translations";
// import { useToast } from "@/components/ui/use-toast";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogFooter,
// } from "@/components/ui/dialog";
// import { Copy } from "lucide-react";
// import { useTranslation } from "next-i18next";

// const fadeInUpKeyframes = {
// 	"0%": { opacity: "0", transform: "translateY(10px)" },
// 	"100%": { opacity: "1", transform: "translateY(0)" },
// };

// const styles = {
// 	"@keyframes fadeInUp": fadeInUpKeyframes,
// 	".animate-fade-in-up": {
// 		animation: "fadeInUp 0.5s ease-out forwards",
// 	},
// 	".animation-delay-200": {
// 		animationDelay: "200ms",
// 	},
// 	".animation-delay-400": {
// 		animationDelay: "400ms",
// 	},
// };

// export default function HomePage() {
// 	const [isOpen, setIsOpen] = useState(false);
// 	const [lang, setLang] = useState<Language>("am");
// 	const [studentId, setStudentId] = useState("");
// 	const [selectedStudent, setSelectedStudent] = useState<any>(null);
// 	const [availableItems, setAvailableItems] = useState<any[]>([]);
// 	const [selectedItem, setSelectedItem] = useState("");
// 	const [quantity, setQuantity] = useState("1");
// 	const [totalPrice, setTotalPrice] = useState(0);
// 	const { toast } = useToast();
// 	const [isModalOpen, setIsModalOpen] = useState(false);
// 	const [billerReferenceNumber, setBillerReferenceNumber] = useState("");
// 	const [selectedService, setSelectedService] = useState(null);
// 	const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
// 	const contactRef = useRef<HTMLDivElement>(null);

// 	const { i18n } = useTranslation();

// 	const scrollToContact = () => {
// 		contactRef.current?.scrollIntoView({ behavior: "smooth" });
// 	};

// 	const openServiceModal = (service: any) => {
// 		setSelectedService(service);
// 		setIsServiceModalOpen(true);
// 	};

// 	const productManagementRef = useRef<HTMLDivElement>(null);
// 	const howToUseRef = useRef<HTMLDivElement>(null);

// 	const t = (key: string) => {
// 		return key.split(".").reduce((o, i) => o[i], translations[lang] as any);
// 	};

// 	const scrollToProductManagement = () => {
// 		productManagementRef.current?.scrollIntoView({ behavior: "smooth" });
// 	};

// 	const checkStudent = useCallback(async () => {
// 		if (!studentId.trim()) {
// 			toast({
// 				title: t("productManagement.errorCheckingStudent"),
// 				description: t("productManagement.emptyStudentId"),
// 				variant: "destructive",
// 			});
// 			return;
// 		}

// 		try {
// 			const response = await fetch(`/api/students?studentId=${studentId}`);
// 			if (!response.ok) {
// 				throw new Error("Failed to fetch student");
// 			}
// 			const data = await response.json();
// 			if (data) {
// 				setSelectedStudent({
// 					...data,
// 					fullName: data.lastName
// 						? `${data.firstName} ${data.lastName}`
// 						: data.firstName,
// 				});
// 				const schoolId = data.studentId.substring(0, 4);
// 				const itemsResponse = await fetch(`/api/items?schoolId=${schoolId}`);
// 				if (!itemsResponse.ok) {
// 					throw new Error("Failed to fetch items");
// 				}
// 				const itemsData = await itemsResponse.json();
// 				setAvailableItems(itemsData.items);
// 				toast({
// 					title: t("productManagement.studentFound"),
// 				});
// 			} else {
// 				setSelectedStudent(null);
// 				setAvailableItems([]);
// 				toast({
// 					title: t("productManagement.studentNotFound"),
// 					variant: "destructive",
// 				});
// 			}
// 		} catch (error) {
// 			console.error("Error checking student:", error);
// 			toast({
// 				title: t("productManagement.errorCheckingStudent"),
// 				variant: "destructive",
// 			});
// 		}
// 	}, [studentId, toast]);
// 	// const checkStudent = useCallback(async () => {
// 	// 	try {
// 	// 		const response = await fetch(`/api/students?studentId=${studentId}`);
// 	// 		if (!response.ok) {
// 	// 			throw new Error("Failed to fetch student");
// 	// 		}
// 	// 		const data = await response.json();
// 	// 		if (data) {
// 	// 			setSelectedStudent({
// 	// 				...data,
// 	// 				fullName: `${data.firstName} ${data.lastName}`,
// 	// 			});
// 	// 			const schoolId = data.studentId.substring(0, 4);
// 	// 			const itemsResponse = await fetch(`/api/items?schoolId=${schoolId}`);
// 	// 			if (!itemsResponse.ok) {
// 	// 				throw new Error("Failed to fetch items");
// 	// 			}
// 	// 			const itemsData = await itemsResponse.json();
// 	// 			setAvailableItems(itemsData.items);
// 	// 			toast({
// 	// 				title: t("productManagement.studentFound"),
// 	// 			});
// 	// 		} else {
// 	// 			setSelectedStudent(null);
// 	// 			setAvailableItems([]);
// 	// 			toast({
// 	// 				title: t("productManagement.studentNotFound"),
// 	// 				variant: "destructive",
// 	// 			});
// 	// 		}
// 	// 	} catch (error) {
// 	// 		console.error("Error checking student:", error);
// 	// 		toast({
// 	// 			title: t("productManagement.errorCheckingStudent"),
// 	// 			variant: "destructive",
// 	// 		});
// 	// 	}
// 	// }, [studentId, toast, t]);

// 	const handleItemChange = useCallback(
// 		(itemId: string) => {
// 			setSelectedItem(itemId);
// 			const item = availableItems.find((i) => i.id === itemId);
// 			if (item) {
// 				setTotalPrice(item.price * Number(quantity));
// 			}
// 		},
// 		[availableItems, quantity]
// 	);

// 	const handleQuantityChange = useCallback(
// 		(value: string) => {
// 			setQuantity(value);
// 			const item = availableItems.find((i) => i.id === selectedItem);
// 			if (item) {
// 				setTotalPrice(item.price * Number(value));
// 			}
// 		},
// 		[availableItems, selectedItem]
// 	);

// 	const createProduct = useCallback(async () => {
// 		if (selectedStudent && selectedItem) {
// 			const billerRefNumber = `RAS${Date.now()}`;
// 			const product = {
// 				studentId: selectedStudent.id,
// 				itemId: selectedItem,
// 				quantity: Number(quantity),
// 				totalPrice: totalPrice,
// 				billerReferenceNumber: billerRefNumber,
// 			};
// 			try {
// 				const response = await fetch("/api/products", {
// 					method: "POST",
// 					headers: { "Content-Type": "application/json" },
// 					body: JSON.stringify(product),
// 				});
// 				if (!response.ok) {
// 					throw new Error("Failed to create product");
// 				}
// 				const result = await response.json();
// 				toast({
// 					title: t("productManagement.productCreated"),
// 					description: `Product created with ID: ${result.id}`,
// 				});
// 				setBillerReferenceNumber(billerRefNumber);
// 				setIsModalOpen(true);
// 				setStudentId("");
// 				setSelectedStudent(null);
// 				setSelectedItem("");
// 				setQuantity("1");
// 				setTotalPrice(0);
// 			} catch (error) {
// 				console.error("Error creating product:", error);
// 				toast({
// 					title: t("productManagement.errorCreatingProduct"),
// 					description:
// 						error instanceof Error
// 							? error.message
// 							: "An unexpected error occurred",
// 					variant: "destructive",
// 				});
// 			}
// 		} else {
// 			toast({
// 				title: "Invalid Input",
// 				description:
// 					"Please select a student and an item before creating a product.",
// 				variant: "destructive",
// 			});
// 		}
// 	}, [selectedStudent, selectedItem, quantity, totalPrice, toast, t]);

// 	const copyBillerReferenceNumber = useCallback(() => {
// 		navigator.clipboard.writeText(billerReferenceNumber).then(() => {
// 			toast({
// 				title: "Copied!",
// 				description: "Biller Reference Number copied to clipboard",
// 			});
// 		});
// 	}, [billerReferenceNumber, toast]);

// 	useEffect(() => {
// 		const style = document.createElement("style");
// 		style.textContent = Object.entries(styles)
// 			.map(([selector, rules]) => {
// 				if (selector.startsWith("@keyframes")) {
// 					return `${selector} ${JSON.stringify(rules)}`;
// 				}
// 				return `${selector} ${JSON.stringify(rules).slice(1, -1)}`;
// 			})
// 			.join("\n");
// 		document.head.appendChild(style);
// 		return () => {
// 			document.head.removeChild(style);
// 		};
// 	}, []);

// 	return (
// 		<div
// 			className={`min-h-screen bg-gradient-to-b from-gray-50 to-white ${
// 				lang ? "font-amharic" : "font-sans"
// 			}`}>
// 			<header className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
// 				<div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
// 					<div className="flex items-center">
// 						{/* <School className="h-8 w-8 text-[#881337] mr-2" /> */}
// 						<Image
// 							src="/assets/images/logo.png"
// 							alt="logo background"
// 							width={75}
// 							height={35}
// 							className="rounded-lg"
// 						/>
// 						{/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
// 							{t("title")}
// 						</h1> */}
// 					</div>
// 					<div>
// 						<Select
// 							value={lang}
// 							onValueChange={(value: Language) => setLang(value)}>
// 							<SelectTrigger className="w-[100px]">
// 								<SelectValue placeholder="Language" />
// 							</SelectTrigger>
// 							<SelectContent>
// 								<SelectItem value="am">አማርኛ</SelectItem>
// 								<SelectItem value="en">English</SelectItem>
// 							</SelectContent>
// 						</Select>
// 						<nav className="hidden md:flex items-center space-x-4">
// 							<Link href="/login" passHref>
// 								<Button variant="outline">{t("nav.login")}</Button>
// 							</Link>
// 							{/* <Link href="/signup" passHref>
// 								<Button className="bg-[#881337] hover:bg-[#6e0f2d] text-white">
// 									{t("nav.signup")}
// 								</Button>
// 							</Link> */}
// 						</nav>
// 					</div>
// 					<Sheet open={isOpen} onOpenChange={setIsOpen}>
// 						<SheetTrigger asChild className="md:hidden">
// 							<Button variant="outline" size="icon">
// 								<Menu className="h-6 w-6" />
// 							</Button>
// 						</SheetTrigger>
// 						<SheetContent side="right" className="w-[300px] sm:w-[400px]">
// 							<nav className="flex flex-col gap-4">
// 								<Select
// 									value={lang}
// 									onValueChange={(value: Language) => setLang(value)}>
// 									<SelectTrigger className="w-full">
// 										<SelectValue placeholder="Language" />
// 									</SelectTrigger>
// 									<SelectContent>
// 										<SelectItem value="am">አማርኛ</SelectItem>
// 										<SelectItem value="en">English</SelectItem>
// 									</SelectContent>
// 								</Select>
// 								<Link href="/login" passHref>
// 									<Button
// 										className="w-full"
// 										variant="outline"
// 										onClick={() => setIsOpen(false)}>
// 										{t("nav.login")}
// 									</Button>
// 								</Link>
// 								{/* <Link href="/signup" passHref>
// 									<Button
// 										className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white"
// 										onClick={() => setIsOpen(false)}>
// 										{t("nav.signup")}
// 									</Button>
// 								</Link> */}
// 							</nav>
// 						</SheetContent>
// 					</Sheet>
// 				</div>
// 			</header>

// 			<main className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-8">
// 				{/* Hero */}
// 				<div className="relative mb-16">
// 					<div className="absolute inset-0 z-0">
// 						<Image
// 							src="/assets/images/hero4.png?height=800&width=1600"
// 							alt="Hero background"
// 							layout="fill"
// 							objectFit="cover"
// 							className="rounded-lg"
// 						/>
// 						{/* <div className="absolute inset-0 bg-gradient-to-r from-[#881337]/80 to-[#6e0f2d]/80 mix-blend-multiply" /> */}
// 					</div>
// 					<div className="relative z-10 text-center py-32 px-4 sm:py-48 sm:px-6 lg:px-8">
// 						<h2 className="text-4xl font-extrabold text-white text-left sm:text-5xl sm:tracking-tight lg:text-6xl mb-4 drop-shadow-lg animate-fade-in-up">
// 							{t("hero.title")}
// 						</h2>
// 						<p className="mt-6 max-w-lg mx-auto text-left text-xl text-white/90 drop-shadow-lg animate-fade-in-up animation-delay-200">
// 							{t("hero.subtitle")}
// 						</p>
// 						<div className="mt-10 flex justify-center gap-4 animate-fade-in-up animation-delay-400">
// 							<Button
// 								size="lg"
// 								className="bg-white text-[#881337] hover:bg-gray-100 text-lg px-8 py-3 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
// 								onClick={() =>
// 									howToUseRef.current?.scrollIntoView({ behavior: "smooth" })
// 								}>
// 								{t("hero.cta")}
// 							</Button>
// 						</div>
// 					</div>
// 					<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
// 				</div>

// 				{/* howToUse */}
// 				<div ref={howToUseRef} className="mb-16">
// 					<h2 className="text-3xl font-extrabold text-center mb-8 px-3">
// 						{t("howToUse.title")}
// 					</h2>
// 					<Card className="shadow-lg overflow-hidden">
// 						<div className="md:flex">
// 							<div className="p-8">
// 								<CardTitle className="block mt-1 text-lg leading-tight font-medium text-[#881337] hover:underline mb-2">
// 									{t("howToUse.title")}
// 								</CardTitle>
// 								<p className="mt-2 text-gray-500">
// 									{t("howToUse.description")}
// 								</p>
// 								<div className="mt-4">
// 									<h3 className="text-lg font-semibold mb-2">
// 										{t("howToUse.steps.title")}
// 									</h3>
// 									<ol className="list-decimal list-inside space-y-2">
// 										<li>{t("howToUse.steps.step1")}</li>
// 										<li>{t("howToUse.steps.step2")}</li>
// 										<li>{t("howToUse.steps.step3")}</li>
// 										<li>{t("howToUse.steps.step4")}</li>
// 									</ol>
// 								</div>
// 							</div>
// 							<div className="md:flex-shrink-0">
// 								<Image
// 									className="h-full m-auto object-cover md:w-48"
// 									src="/assets/images/telebirr.png"
// 									alt="TeleBirr Logo"
// 									width={192}
// 									height={192}
// 								/>
// 							</div>
// 						</div>
// 					</Card>
// 				</div>

// 				{/* productManagement */}
// 				<div ref={productManagementRef} className="mb-16">
// 					<h2 className="text-3xl font-extrabold text-center mb-8">
// 						{t("productManagement.title")}
// 					</h2>
// 					<Card className="shadow-lg">
// 						<CardContent className="pt-6">
// 							<div className="space-y-4">
// 								<div>
// 									<Label htmlFor="studentId">
// 										{t("productManagement.studentIdLabel")}
// 									</Label>
// 									<div className="flex mt-1">
// 										<Input
// 											id="studentId"
// 											value={studentId}
// 											onChange={(e) => setStudentId(e.target.value)}
// 											placeholder={t("productManagement.studentIdPlaceholder")}
// 											className="flex-grow"
// 											required
// 										/>
// 										<Button
// 											onClick={checkStudent}
// 											className="ml-2 bg-[#881337] hover:bg-[#6e0f2d] text-white">
// 											{t("productManagement.checkStudentButton")}
// 										</Button>
// 									</div>
// 									{selectedStudent && (
// 										<div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md">
// 											<p className="font-semibold">
// 												{t("productManagement.studentFound")}{" "}
// 												{selectedStudent.fullName}
// 											</p>
// 										</div>
// 									)}
// 									{/* {!selectedStudent && studentId && (
// 										<div className="mt-2 p-2 bg-red-100 text-red-800 rounded-md">
// 											<p className="font-semibold">
// 												{t("productManagement.studentNotFound")}
// 											</p>
// 										</div>
// 									)} */}
// 								</div>
// 								{selectedStudent && (
// 									<>
// 										<div>
// 											<Label htmlFor="item">
// 												{t("productManagement.selectItemLabel")}
// 											</Label>
// 											<Select
// 												value={selectedItem}
// 												onValueChange={handleItemChange}>
// 												<SelectTrigger id="item">
// 													<SelectValue placeholder="Select Item" />
// 												</SelectTrigger>
// 												<SelectContent>
// 													{availableItems.map((item) => (
// 														<SelectItem key={item.id} value={item.id}>
// 															{item.name} - ETB {item.price.toFixed(2)}
// 														</SelectItem>
// 													))}
// 												</SelectContent>
// 											</Select>
// 										</div>
// 										<div>
// 											<Label htmlFor="quantity">
// 												{t("productManagement.quantityLabel")}
// 											</Label>
// 											<Input
// 												id="quantity"
// 												type="number"
// 												min="1"
// 												value={quantity}
// 												onChange={(e) => handleQuantityChange(e.target.value)}
// 											/>
// 										</div>
// 										{totalPrice > 0 && (
// 											<div className="p-4 bg-gray-50 rounded-md">
// 												<Label>{t("productManagement.totalPrice")}</Label>
// 												<div className="text-2xl font-bold text-[#881337]">
// 													ETB {totalPrice.toFixed(2)}
// 												</div>
// 											</div>
// 										)}
// 										<Button
// 											onClick={createProduct}
// 											className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white">
// 											{t("productManagement.createProductButton")}
// 										</Button>
// 									</>
// 								)}
// 							</div>
// 						</CardContent>
// 					</Card>
// 				</div>

// 				{/* Feature Title */}
// 				<div className="relative mb-16">
// 					<div
// 						className="absolute inset-0 flex items-center"
// 						aria-hidden="true">
// 						<div className="w-full border-t border-gray-300" />
// 					</div>
// 					<div className="relative flex justify-center">
// 						<span className="px-3 bg-white text-lg font-medium text-gray-900">
// 							{t("features.title")}
// 						</span>
// 					</div>
// 				</div>

// 				<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
// 					<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
// 						{[
// 							{
// 								title: t("features.studentManagement.title"),
// 								description: t("features.studentManagement.description"),
// 								content: t("features.studentManagement.content"),
// 								cta: t("features.studentManagement.cta"),
// 								icon: <Users className="h-6 w-6" />,
// 								images: [
// 									"/assets/images/products/id1.jpg?height=400&width=600",
// 									"/assets/images/products/id2.jpg?height=400&width=600",
// 								],
// 							},

// 							{
// 								title: t("features.orderManagement.title"),
// 								description: t("features.orderManagement.description"),
// 								content: t("features.orderManagement.content"),
// 								cta: t("features.orderManagement.cta"),
// 								icon: <School className="h-6 w-6" />,
// 								images: [
// 									"/assets/images/products/bag.jpg?height=400&width=600",
// 									"/assets/images/products/bag2.jpg?height=400&width=600",
// 								],
// 							},
// 							{
// 								title: t("features.schoolManagement.title"),
// 								description: t("features.schoolManagement.description"),
// 								content: t("features.schoolManagement.content"),
// 								cta: t("features.schoolManagement.cta"),
// 								icon: <GraduationCap className="h-6 w-6" />,
// 								images: [
// 									"/assets/images/products/sms1.jpg?height=400&width=600",
// 									"/assets/images/products/sms2.jpg?height=400&width=600",
// 								],
// 							},
// 							{
// 								title: t("features.studentInsurance.title"),
// 								description: t("features.studentInsurance.description"),
// 								content: t("features.studentInsurance.content"),
// 								cta: t("features.studentInsurance.cta"),
// 								icon: <Shield className="h-6 w-6" />,
// 								images: [
// 									"/assets/images/products/helath1.jpg?height=400&width=600",
// 									"/assets/images/products/health2.jpg?height=400&width=600",
// 									"/assets/images/products/health3.jpg?height=400&width=600",
// 								],
// 							},
// 							{
// 								title: t("features.productCatalog.title"),
// 								description: t("features.productCatalog.description"),
// 								content: t("features.productCatalog.content"),
// 								cta: t("features.productCatalog.cta"),
// 								icon: <BookOpen className="h-6 w-6" />,
// 								images: [
// 									"/assets/images/products/sport1.jpg?height=400&width=600",
// 									"/assets/images/products/sport2.jpg?height=400&width=600",
// 								],
// 							},
// 						].map((service, index) => (
// 							<Card
// 								key={index}
// 								className="transform transition duration-500 hover:scale-105 shadow-lg overflow-hidden cursor-pointer"
// 								onClick={() => openServiceModal(service)}>
// 								<div className="h-48 w-full relative">
// 									<Image
// 										src={service.images[0] || "/placeholder.svg"}
// 										alt={service.title}
// 										layout="fill"
// 										objectFit="cover"
// 									/>
// 								</div>
// 								<CardHeader>
// 									<CardTitle className="flex items-center text-[#881337]">
// 										{service.icon}
// 										<span className="ml-2">{service.title}</span>
// 									</CardTitle>
// 									<CardDescription>{service.description}</CardDescription>
// 								</CardHeader>
// 								<CardContent>
// 									<p>{service.content}</p>
// 								</CardContent>
// 								<CardFooter>
// 									<Button
// 										variant="outline"
// 										className="w-full hover:bg-[#881337] hover:text-white"
// 										onClick={(e) => {
// 											e.stopPropagation();
// 											scrollToContact();
// 										}}>
// 										{t("features.orderButton")}
// 									</Button>
// 								</CardFooter>
// 							</Card>
// 						))}
// 					</div>
// 				</div>

// 				<Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
// 					<DialogContent className="max-w-4xl">
// 						<DialogHeader>
// 							<DialogTitle className="text-2xl font-bold text-[#881337] flex items-center">
// 								{(selectedService as any)?.icon}
// 								<span className="ml-2">{(selectedService as any)?.title}</span>
// 							</DialogTitle>
// 						</DialogHeader>
// 						<div className="mt-4">
// 							<div className="relative h-64 md:h-96 mb-4">
// 								<Image
// 									src={
// 										(selectedService as any)?.images[0] ||
// 										"/placeholder.svg?height=600&width=800"
// 									}
// 									alt={(selectedService as any)?.title}
// 									layout="fill"
// 									objectFit="cover"
// 									className="rounded-lg"
// 								/>
// 							</div>
// 							<p className="text-lg mb-4">
// 								{(selectedService as any)?.description}
// 							</p>
// 							<p className="mb-4">{(selectedService as any)?.content}</p>
// 							<div className="grid grid-cols-2 gap-4">
// 								{(selectedService as any)?.images
// 									.slice(1)
// 									.map((img: any, index: any) => (
// 										<div key={index} className="relative h-32">
// 											<Image
// 												src={img || "/placeholder.svg"}
// 												alt={`${(selectedService as any)?.title} image ${
// 													index + 2
// 												}`}
// 												layout="fill"
// 												objectFit="cover"
// 												className="rounded-lg"
// 											/>
// 										</div>
// 									))}
// 							</div>
// 						</div>
// 						<DialogFooter>
// 							<Button onClick={() => setIsServiceModalOpen(false)}>
// 								Close
// 							</Button>
// 							<Button
// 								onClick={scrollToContact}
// 								className="bg-[#881337] hover:bg-[#6e0f2d] text-white">
// 								{t("features.orderButton")}
// 							</Button>
// 						</DialogFooter>
// 					</DialogContent>
// 				</Dialog>
// 				{/* services */}
// 				{/* <div className="mb-16">
// 					<h2 className="text-3xl font-extrabold text-center mb-8">
// 						{t("services.title")}
// 					</h2>
// 					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// 						<Card className="shadow-lg overflow-hidden">
// 							<div className="h-48 w-full relative">
// 								<Image
// 									src="/assets/images/products/bag.jpg?height=200&width=400"
// 									alt="School Management"
// 									layout="fill"
// 									objectFit="cover"
// 								/>
// 							</div>
// 							<CardHeader>
// 								<CardTitle className="flex items-center text-[#881337]">
// 									<School className="mr-2" />
// 									{t("services.studentManagement.title")}
// 								</CardTitle>
// 							</CardHeader>
// 							<CardContent>
// 								<p>{t("services.studentManagement.description")}</p>
// 							</CardContent>
// 						</Card>
// 						<Card className="shadow-lg overflow-hidden">
// 							<div className="h-48 w-full relative">
// 								<Image
// 									src="/assets/images/products/id1.jpg?height=200&width=400"
// 									alt="Student Information System"
// 									layout="fill"
// 									objectFit="cover"
// 								/>
// 							</div>
// 							<CardHeader>
// 								<CardTitle className="flex items-center text-[#881337]">
// 									<Users className="mr-2" />
// 									{t("services.studentInformationSystem.title")}
// 								</CardTitle>
// 							</CardHeader>
// 							<CardContent>
// 								<p>{t("services.studentInformationSystem.description")}</p>
// 							</CardContent>
// 						</Card>

// 						<Card className="transform transition duration-500 hover:scale-105 shadow-lg overflow-hidden">
// 							<div className="h-48 w-full relative">
// 								<Image
// 									src="/placeholder.svg?height=200&width=400"
// 									alt="School Management System"
// 									layout="fill"
// 									objectFit="cover"
// 								/>
// 							</div>
// 							<CardHeader>
// 								<CardTitle className="flex items-center text-[#881337]">
// 									<GraduationCap className="mr-2" />
// 									{t("services.schoolManagement.title")}
// 								</CardTitle>
// 								<CardDescription>
// 									{t("services.schoolManagement.description")}
// 								</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								<p>{t("services.schoolManagement.content")}</p>
// 							</CardContent>
// 							<CardFooter>
// 								<Button
// 									variant="outline"
// 									className="w-full hover:bg-[#881337] hover:text-white">
// 									{t("services.schoolManagement.cta")}
// 								</Button>
// 							</CardFooter>
// 						</Card>

// 						<Card className="transform transition duration-500 hover:scale-105 shadow-lg overflow-hidden">
// 							<div className="h-48 w-full relative">
// 								<Image
// 									src="/placeholder.svg?height=200&width=400"
// 									alt="Student Insurance System"
// 									layout="fill"
// 									objectFit="cover"
// 								/>
// 							</div>
// 							<CardHeader>
// 								<CardTitle className="flex items-center text-[#881337]">
// 									<Shield className="mr-2" />
// 									{t("services.studentInsurance.title")}
// 								</CardTitle>
// 								<CardDescription>
// 									{t("services.studentInsurance.description")}
// 								</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								<p>{t("services.studentInsurance.content")}</p>
// 							</CardContent>
// 							<CardFooter>
// 								<Button
// 									variant="outline"
// 									className="w-full hover:bg-[#881337] hover:text-white">
// 									{t("services.studentInsurance.cta")}
// 								</Button>
// 							</CardFooter>
// 						</Card>
// 						<Card className="shadow-lg overflow-hidden">
// 							<div className="h-48 w-full relative">
// 								<Image
// 									src="/assets/images/products/sport1.jpg?height=200&width=400"
// 									alt="Curriculum Planning"
// 									layout="fill"
// 									objectFit="cover"
// 								/>
// 							</div>
// 							<CardHeader>
// 								<CardTitle className="flex items-center text-[#881337]">
// 									<BookOpen className="mr-2" />
// 									{t("services.curriculumPlanning.title")}
// 								</CardTitle>
// 							</CardHeader>
// 							<CardContent>
// 								<p>{t("services.curriculumPlanning.description")}</p>
// 							</CardContent>
// 						</Card>
// 					</div>
// 				</div> */}
// 				<div className="mb-16 bg-[#881337] text-white py-12 rounded-lg">
// 					<h2 className="text-3xl font-extrabold text-center mb-8">
// 						{t("testimonials.title")}
// 					</h2>
// 					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
// 						{[
// 							{
// 								quote: t("testimonials.quote1"),
// 								author: t("testimonials.author1"),
// 								role: t("testimonials.role1"),
// 							},
// 							{
// 								quote: t("testimonials.quote2"),
// 								author: t("testimonials.author2"),
// 								role: t("testimonials.role2"),
// 							},
// 							{
// 								quote: t("testimonials.quote3"),
// 								author: t("testimonials.author3"),
// 								role: t("testimonials.role3"),
// 							},
// 						].map((testimonial, index) => (
// 							<Card key={index} className="bg-white text-gray-800">
// 								<CardContent className="pt-6">
// 									<blockquote className="text-lg font-medium mb-4">
// 										"{testimonial.quote}"
// 									</blockquote>
// 									<div className="flex items-center">
// 										<div className="rounded-full bg-[#881337] text-white p-2 mr-4">
// 											<Users className="h-6 w-6" />
// 										</div>
// 										<div>
// 											<p className="font-semibold">{testimonial.author}</p>
// 											<p className="text-sm text-gray-500">
// 												{testimonial.role}
// 											</p>
// 										</div>
// 									</div>
// 								</CardContent>
// 							</Card>
// 						))}
// 					</div>
// 				</div>
// 				<div className="mb-16">
// 					<h2 className="text-3xl font-extrabold text-center mb-8">
// 						{t("aboutUs.title")}
// 					</h2>
// 					<Card className="shadow-lg">
// 						<CardContent className="prose max-w-none pt-6">
// 							<p>{t("aboutUs.content1")}</p>
// 							<p>{t("aboutUs.content2")}</p>
// 						</CardContent>
// 					</Card>
// 				</div>
// 				<div ref={contactRef} className="mb-16">
// 					<h2 className="text-3xl font-extrabold text-center mb-8">
// 						{t("contactUs.title")}
// 					</h2>
// 					<Card className="shadow-lg">
// 						<CardContent className="pt-6">
// 							<div className="flex items-center space-x-4 mb-4">
// 								<Phone className="h-6 w-6 text-[#881337]" />
// 								<p>{t("contactUs.phone")}</p>
// 							</div>
// 							<div className="flex items-center space-x-4 mb-4">
// 								<Mail className="h-6 w-6 text-[#881337]" />
// 								<p>{t("contactUs.email")}</p>
// 							</div>
// 							<div className="flex items-center space-x-4">
// 								<MapPin className="h-6 w-6 text-[#881337]" />
// 								<p>{t("contactUs.address")}</p>
// 							</div>
// 						</CardContent>
// 					</Card>
// 				</div>
// 			</main>
// 			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
// 				<DialogContent>
// 					<DialogHeader>
// 						<DialogTitle>{t("modal.title")}</DialogTitle>
// 					</DialogHeader>
// 					<div className="py-4">
// 						<p className="mb-2">{t("modal.message")}</p>
// 						<div className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
// 							<span className="font-mono text-lg">{billerReferenceNumber}</span>
// 							<Button
// 								variant="outline"
// 								size="icon"
// 								onClick={copyBillerReferenceNumber}
// 								className="ml-2">
// 								<Copy className="h-4 w-4" />
// 							</Button>
// 						</div>
// 					</div>
// 					<DialogFooter>
// 						<Button onClick={() => setIsModalOpen(false)}>
// 							{t("modal.close")}
// 						</Button>
// 					</DialogFooter>
// 				</DialogContent>
// 			</Dialog>
// 			<footer className="bg-gray-50 mt-12 border-t border-gray-200">
// 				<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
// 					<p className="text-center text-base text-gray-500">
// 						{t("footer.copyright")}
// 					</p>
// 				</div>
// 			</footer>
// 		</div>
// 	);
// }
