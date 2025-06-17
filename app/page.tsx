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
	CheckCircle,
	Star,
	ArrowRight,
	Sparkles,
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
import { PartnersSection } from "@/components/partners-section";

const fadeInUpKeyframes = {
	"0%": { opacity: "0", transform: "translateY(30px)" },
	"100%": { opacity: "1", transform: "translateY(0)" },
};

const slideInLeftKeyframes = {
	"0%": { opacity: "0", transform: "translateX(-30px)" },
	"100%": { opacity: "1", transform: "translateX(0)" },
};

const scaleInKeyframes = {
	"0%": { opacity: "0", transform: "scale(0.9)" },
	"100%": { opacity: "1", transform: "scale(1)" },
};

const styles = {
	"@keyframes fadeInUp": fadeInUpKeyframes,
	"@keyframes slideInLeft": slideInLeftKeyframes,
	"@keyframes scaleIn": scaleInKeyframes,
	".animate-fade-in-up": {
		animation: "fadeInUp 0.8s ease-out forwards",
	},
	".animate-slide-in-left": {
		animation: "slideInLeft 0.8s ease-out forwards",
	},
	".animate-scale-in": {
		animation: "scaleIn 0.6s ease-out forwards",
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
	".animation-delay-800": {
		animationDelay: "800ms",
	},
	".hover-scale": {
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
	},
	".hover-scale:hover": {
		transform: "scale(1.02) translateY(-4px)",
	},
	".glass-effect": {
		backdropFilter: "blur(20px)",
		background: "rgba(255, 255, 255, 0.1)",
		border: "1px solid rgba(255, 255, 255, 0.2)",
	},
	".gradient-text": {
		background: "linear-gradient(135deg, #881337, #be185d, #ec4899)",
		WebkitBackgroundClip: "text",
		WebkitTextFillColor: "transparent",
		backgroundClip: "text",
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
	}, [selectedStudent, selectedItem, quantity, totalPrice, toast]);

	const copyBillerReferenceNumber = useCallback(() => {
		navigator.clipboard.writeText(billerReferenceNumber).then(() => {
			toast({
				title: "Copied!",
				description: "Biller Reference Number copied to clipboard",
			});
		});
	}, [billerReferenceNumber, toast]);

	useEffect(() => {
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
			className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 ${
				lang ? "font-amharic" : "font-sans"
			}`}>
			{/* Enhanced Header */}
			<header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/20">
				<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
					<div className="flex items-center space-x-3">
						<div className="relative">
							<Image
								src="/assets/images/logo.png?height=50&width=50"
								alt="logo background"
								width={50}
								height={50}
								className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
							/>
							<div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse"></div>
						</div>
						<div>
							<h1 className="text-xl sm:text-2xl font-bold gradient-text hidden sm:block">
								{t("title")}
							</h1>
							<p className="text-xs text-gray-500 hidden sm:block">
								School Management System
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<Select
							value={lang}
							onValueChange={(value: Language) => setLang(value)}>
							<SelectTrigger className="w-[120px] border-rose-200 focus:ring-rose-300 bg-white/50 backdrop-blur-sm">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="am">🇪🇹 አማርኛ</SelectItem>
								<SelectItem value="en">🇺🇸 English</SelectItem>
							</SelectContent>
						</Select>
						<nav className="hidden md:flex items-center space-x-4">
							<Link href="/login" passHref>
								<Button
									variant="outline"
									className="border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-all duration-300 hover:shadow-md">
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
								className="border-rose-200 hover:bg-rose-50">
								<Menu className="h-6 w-6 text-rose-700" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-md">
							<div className="flex items-center mb-6">
								<Image
									src="/placeholder.svg?height=40&width=40"
									alt="logo background"
									width={40}
									height={40}
									className="rounded-lg mr-3"
								/>
								<h2 className="text-xl font-bold gradient-text">
									{t("title")}
								</h2>
							</div>
							<nav className="flex flex-col gap-4">
								<Select
									value={lang}
									onValueChange={(value: Language) => setLang(value)}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Language" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="am">🇪🇹 አማርኛ</SelectItem>
										<SelectItem value="en">🇺🇸 English</SelectItem>
									</SelectContent>
								</Select>
								<Link href="/login" passHref>
									<Button
										className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg"
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
				{/* Enhanced Hero Section */}
				<div className="relative mb-20 overflow-hidden">
					<div className="absolute inset-0 z-0">
						<Image
							src="/assets/images/hero7.jpg?height=800&width=1600"
							alt="Hero background"
							layout="fill"
							objectFit="cover"
							className="opacity-20"
						/>
						<div className="absolute inset-0 bg-gradient-to-br from-rose-600/80 via-pink-600/70 to-purple-600/60" />
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
					</div>
					<div className="relative z-10 py-16 px-4 sm:py-48 sm:px-6 lg:px-8 max-w-7xl mx-auto">
						<div className="text-center">
							<div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8 animate-fade-in-up">
								<Sparkles className="w-4 h-4 text-yellow-300 mr-2" />
								<span className="text-white text-sm font-medium">
									Welcome to the Future of Education
								</span>
							</div>
							<h2 className="text-5xl font-extrabold text-white text-center sm:text-6xl lg:text-7xl mb-6 drop-shadow-2xl animate-fade-in-up animation-delay-200">
								{t("hero.title")}
							</h2>
							<p className="mt-6 max-w-3xl mx-auto text-center text-xl text-white/90 drop-shadow-lg animate-fade-in-up animation-delay-400 leading-relaxed">
								{t("hero.subtitle")}
							</p>
							<div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
								<Button
									size="lg"
									className="bg-white text-rose-600 hover:bg-gray-50 text-lg px-10 py-4 rounded-full shadow-2xl transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-3xl font-semibold"
									onClick={() =>
										howToUseRef.current?.scrollIntoView({ behavior: "smooth" })
									}>
									<span className="mr-2">{t("hero.cta")}</span>
									<ArrowRight className="w-5 h-5" />
								</Button>
								{/* <Button
									size="lg"
									variant="outline"
									className="glass-effect text-white hover:bg-white/20 text-lg px-10 py-4 rounded-full shadow-2xl transform transition duration-300 ease-in-out hover:scale-105 font-semibold"
									onClick={scrollToProductManagement}>
									{t("productManagement.title")}
								</Button> */}
							</div>
						</div>
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
				</div>

				{/* Enhanced How To Use Section */}
				<div ref={howToUseRef} className="mb-24 scroll-mt-20 px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-extrabold gradient-text mb-4">
							{t("howToUse.title")}
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Simple steps to get started with our platform
						</p>
					</div>
					<Card className="shadow-2xl overflow-hidden border-none bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm hover-scale">
						<div className="lg:flex">
							<div className="lg:w-2/3 p-10">
								<CardTitle className="text-3xl font-bold text-rose-700 mb-6 flex items-center">
									<div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
										<BookOpen className="w-6 h-6 text-white" />
									</div>
									{t("howToUse.title")}
								</CardTitle>
								<p className="text-gray-600 mb-8 text-lg leading-relaxed">
									{t("howToUse.description")}
								</p>
								<div className="mt-6">
									<h3 className="text-2xl font-semibold mb-6 text-gray-800">
										{t("howToUse.steps.title")}
									</h3>
									<div className="space-y-6">
										{[
											t("howToUse.steps.step1"),
											t("howToUse.steps.step2"),
											t("howToUse.steps.step3"),
											t("howToUse.steps.step4"),
										].map((step, index) => (
											<div key={index} className="flex items-start group">
												<div className="flex items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white h-10 w-10 flex-shrink-0 mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
													{index + 1}
												</div>
												<div className="flex-1">
													<span className="text-gray-700 text-lg leading-relaxed">
														{step}
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
							<div className="lg:w-1/3 lg:flex-shrink-0 flex items-center justify-center p-10 bg-gradient-to-br from-rose-50 to-pink-50">
								<div className="relative">
									<div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-3xl blur-xl opacity-30"></div>
									<Image
										className="relative h-64 w-64 object-contain rounded-2xl shadow-2xl"
										src="/assets/images/telebirr.png?height=256&width=256"
										alt="TeleBirr Logo"
										width={256}
										height={256}
									/>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Enhanced Product Management Section */}
				<div ref={productManagementRef} className="mb-24 scroll-mt-20 px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-extrabold gradient-text mb-4">
							{t("productManagement.title")}
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Manage student orders with ease and efficiency
						</p>
					</div>
					<Card className="shadow-2xl border-none overflow-hidden bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
						<CardContent className="p-10">
							<div className="space-y-8">
								<div>
									<Label
										htmlFor="studentId"
										className="text-xl font-semibold mb-3 block text-gray-800 flex items-center">
										<Users className="w-5 h-5 mr-2 text-rose-600" />
										{t("productManagement.studentIdLabel")}
									</Label>
									<div className="flex mt-2">
										<Input
											id="studentId"
											value={studentId}
											onChange={(e) => setStudentId(e.target.value)}
											placeholder={t("productManagement.studentIdPlaceholder")}
											className="flex-grow text-lg py-7 border-rose-200 focus:ring-rose-300 focus:border-rose-400 rounded-l-xl shadow-sm"
											required
										/>
										<Button
											onClick={checkStudent}
											className="ml-0 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 text-lg py-7 rounded-r-xl shadow-lg hover:shadow-xl transition-all duration-300">
											{t("productManagement.checkStudentButton")}
										</Button>
									</div>
									{selectedStudent && (
										<div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 rounded-xl flex items-center shadow-sm animate-scale-in">
											<div className="bg-green-100 rounded-full p-2 mr-3">
												<CheckCircle className="h-6 w-6 text-green-600" />
											</div>
											<p className="font-semibold text-lg">
												{t("productManagement.studentFound")}{" "}
												<span className="font-bold text-green-900">
													{selectedStudent.fullName}
												</span>
											</p>
										</div>
									)}
								</div>
								{selectedStudent && (
									<div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg animate-fade-in-up">
										<h3 className="text-2xl font-bold mb-6 gradient-text flex items-center">
											<School className="w-6 h-6 mr-3" />
											{t("productManagement.orderDetails")}
										</h3>
										<div className="space-y-6">
											<div>
												<Label
													htmlFor="item"
													className="text-lg font-semibold mb-3 block text-gray-800">
													{t("productManagement.selectItemLabel")}
												</Label>
												<Select
													value={selectedItem}
													onValueChange={handleItemChange}>
													<SelectTrigger
														id="item"
														className="w-full text-lg py-7 border-rose-200 focus:ring-rose-300 focus:border-rose-400 rounded-xl shadow-sm">
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
													className="text-lg font-semibold mb-3 block text-gray-800">
													{t("productManagement.quantityLabel")}
												</Label>
												<Input
													id="quantity"
													type="number"
													min="1"
													value={quantity}
													onChange={(e) => handleQuantityChange(e.target.value)}
													className="text-lg py-7 border-rose-200 focus:ring-rose-300 focus:border-rose-400 rounded-xl shadow-sm"
												/>
											</div>
											{totalPrice > 0 && (
												<div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 shadow-sm animate-scale-in">
													<Label className="text-lg font-semibold mb-2 block text-gray-800">
														{t("productManagement.totalPrice")}
													</Label>
													<div className="text-4xl font-bold gradient-text">
														ETB {totalPrice.toFixed(2)}
													</div>
												</div>
											)}
											<Button
												onClick={createProduct}
												className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-7 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
												{t("productManagement.createProductButton")}
											</Button>
										</div>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Enhanced Features Section */}
				<div className="relative mb-20 px-4">
					<div
						className="absolute inset-0 flex items-center"
						aria-hidden="true">
						<div className="w-full border-t border-gradient-to-r from-transparent via-rose-300 to-transparent" />
					</div>
					<div className="relative flex justify-center">
						<span className="px-8 py-3 bg-white text-2xl font-bold gradient-text rounded-full shadow-lg border border-rose-200">
							{t("features.title")}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-24 px-4">
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
							gradient: "from-blue-500 to-cyan-500",
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
							gradient: "from-green-500 to-emerald-500",
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
							gradient: "from-purple-500 to-violet-500",
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
							gradient: "from-orange-500 to-red-500",
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
							gradient: "from-pink-500 to-rose-500",
						},
					].map((service, index) => (
						<Card
							key={index}
							className="group transform transition-all duration-500 hover:scale-105 shadow-xl overflow-hidden cursor-pointer border-none bg-white hover:shadow-2xl"
							onClick={() => openServiceModal(service)}>
							<div className="h-56 w-full relative overflow-hidden">
								<Image
									src={service.images[0] || "/placeholder.svg"}
									alt={service.title}
									layout="fill"
									objectFit="cover"
									className="transition-transform duration-700 group-hover:scale-110"
								/>
								<div
									className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-0 group-hover:opacity-80 transition-opacity duration-500`}
								/>
								<div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
									<div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
										<ArrowRight className="w-5 h-5 text-white" />
									</div>
								</div>
							</div>
							<CardHeader className="pb-3">
								<CardTitle className="flex items-center text-gray-800 group-hover:text-rose-700 transition-colors text-xl">
									<div
										className={`bg-gradient-to-r ${service.gradient} p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
										<div className="text-white">{service.icon}</div>
									</div>
									<span>{service.title}</span>
								</CardTitle>
								<CardDescription className="text-base text-gray-600 leading-relaxed">
									{service.description}
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0">
								<p className="line-clamp-3 text-gray-700 leading-relaxed">
									{service.content}
								</p>
							</CardContent>
							<CardFooter className="pt-4">
								<Button
									variant="outline"
									className="w-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:border-rose-300 transition-all duration-300 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
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

				{/* Enhanced Service Modal */}
				<Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
					<DialogContent className="max-w-5xl p-0 overflow-hidden border-none shadow-2xl">
						<div className="relative h-72 md:h-96">
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
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
							<div className="absolute bottom-0 left-0 right-0 p-8">
								<DialogTitle className="text-center text-2xl font-bold text-white flex items-center mb-3">
									<div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
										{(selectedService as any)?.icon}
									</div>
									<span>{(selectedService as any)?.title}</span>
								</DialogTitle>
							</div>
						</div>
						<div className="p-8">
							<p className="text-xl font-semibold mb-6 text-gray-800">
								{(selectedService as any)?.description}
							</p>
							<p className="mb-8 text-gray-700 text-lg leading-relaxed">
								{(selectedService as any)?.content}
							</p>
							<div className="grid grid-cols-2 gap-6 mb-8">
								{(selectedService as any)?.images
									.slice(1)
									.map((img: any, index: any) => (
										<div
											key={index}
											className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
						<DialogFooter className="p-8 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
							<Button
								variant="outline"
								onClick={() => setIsServiceModalOpen(false)}
								className="border-gray-300 hover:bg-gray-50 px-8 py-3 text-lg">
								Close
							</Button>
							<Button
								onClick={() => {
									setIsServiceModalOpen(false);
									scrollToContact();
								}}
								className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3 text-lg shadow-lg">
								{t("features.orderButton")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Partners & Sponsors Section */}
				<PartnersSection
					onContactClick={() =>
						contactRef.current?.scrollIntoView({ behavior: "smooth" })
					}
				/>

				{/* Enhanced Testimonials Section */}
				<div className="mb-24 px-4">
					<div className="bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600 text-white py-20 rounded-3xl relative overflow-hidden shadow-2xl">
						<div className="absolute inset-0 opacity-10">
							<div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
							<div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl"></div>
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-300 rounded-full blur-3xl"></div>
						</div>
						<div className="relative z-10">
							<div className="text-center mb-16">
								<h2 className="text-4xl font-extrabold mb-4">
									{t("testimonials.title")}
								</h2>
								<p className="text-xl text-white/80 max-w-2xl mx-auto">
									Hear what our satisfied customers have to say about our
									services
								</p>
							</div>
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
										className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-xl">
										<CardContent className="pt-8 pb-6">
											<div className="flex mb-4">
												{[...Array(5)].map((_, i) => (
													<Star
														key={i}
														className="w-5 h-5 text-yellow-300 fill-current"
													/>
												))}
											</div>
											<blockquote className="text-lg font-medium mb-6 text-white/90 leading-relaxed">
												"{testimonial.quote}"
											</blockquote>
											<div className="flex items-center">
												<div className="rounded-full bg-white/20 text-white p-3 mr-4">
													<Users className="h-6 w-6" />
												</div>
												<div>
													<p className="font-bold text-white text-lg">
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

				{/* Enhanced About Us Section */}
				<div className="mb-24 px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-extrabold gradient-text mb-4">
							{t("aboutUs.title")}
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Learn more about our mission and vision
						</p>
					</div>
					<Card className="shadow-2xl border-none overflow-hidden hover-scale">
						<div className="lg:flex">
							<div className="lg:w-1/3 bg-gradient-to-br from-rose-600 to-pink-600 flex items-center justify-center p-12">
								<div className="text-white text-center">
									<div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 mb-6 inline-block">
										<School className="h-16 w-16 mx-auto" />
									</div>
									<h3 className="text-3xl font-bold mb-4">{t("title")}</h3>
									<p className="text-white/90 text-lg">
										{t("aboutUs.tagline")}
									</p>
								</div>
							</div>
							<div className="lg:w-2/3">
								<CardContent className="prose max-w-none p-12">
									<p className="text-xl leading-relaxed mb-6 text-gray-700">
										{t("aboutUs.content1")}
									</p>
									<p className="text-xl leading-relaxed text-gray-700">
										{t("aboutUs.content2")}
									</p>
								</CardContent>
							</div>
						</div>
					</Card>
				</div>

				{/* Enhanced Contact Section */}
				<div ref={contactRef} className="mb-24 scroll-mt-20 px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-extrabold gradient-text mb-4">
							{t("contactUs.title")}
						</h2>
						<p className="text-xl text-gray-600 max-w-2xl mx-auto">
							Get in touch with us for any questions or support
						</p>
					</div>
					<Card className="shadow-2xl border-none overflow-hidden">
						<div className="lg:grid lg:grid-cols-2">
							<div className="bg-gradient-to-br from-rose-600 to-pink-600 p-12 text-white">
								<h3 className="text-3xl font-bold mb-8">Get in Touch</h3>
								<p className="mb-8 text-white/90 text-lg leading-relaxed">
									We'd love to hear from you. Please contact us using the
									information below or send us a message.
								</p>
								<div className="space-y-8">
									{[
										{
											icon: <Phone className="h-6 w-6" />,
											title: "Phone",
											content: t("contactUs.phone"),
										},
										{
											icon: <Mail className="h-6 w-6" />,
											title: "Email",
											content: t("contactUs.email"),
										},
										{
											icon: <MapPin className="h-6 w-6" />,
											title: "Address",
											content: t("contactUs.address"),
										},
									].map((item, index) => (
										<div key={index} className="flex items-center space-x-4">
											<div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
												{item.icon}
											</div>
											<div>
												<p className="font-semibold text-lg">{item.title}</p>
												<p className="text-white/80">{item.content}</p>
											</div>
										</div>
									))}
								</div>
							</div>
							<div className="p-12">
								<h3 className="text-3xl font-bold mb-8 gradient-text">
									Send us a Message
								</h3>
								<div className="space-y-6">
									<div>
										<Label
											htmlFor="name"
											className="text-lg font-semibold mb-3 block text-gray-800">
											Your Name
										</Label>
										<Input
											id="name"
											placeholder="Enter your name"
											className="text-lg py-7 border-rose-200 focus:ring-rose-300 focus:border-rose-400 rounded-xl shadow-sm"
										/>
									</div>
									<div>
										<Label
											htmlFor="email"
											className="text-lg font-semibold mb-3 block text-gray-800">
											Email Address
										</Label>
										<Input
											id="email"
											type="email"
											placeholder="Enter your email"
											className="text-lg py-7 border-rose-200 focus:ring-rose-300 focus:border-rose-400 rounded-xl shadow-sm"
										/>
									</div>
									<div>
										<Label
											htmlFor="message"
											className="text-lg font-semibold mb-3 block text-gray-800">
											Message
										</Label>
										<textarea
											id="message"
											rows={5}
											placeholder="Enter your message"
											className="w-full rounded-xl border border-rose-200 focus:ring-rose-300 focus:border-rose-400 p-4 text-lg shadow-sm"
										/>
									</div>
									<Button className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-7 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
										Send Message
									</Button>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Enhanced Success Modal */}
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="max-w-md border-none shadow-2xl">
						<div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-8 rounded-t-2xl">
							<div className="flex justify-center mb-6">
								<div className="bg-white rounded-full p-4 shadow-lg">
									<CheckCircle className="w-8 h-8 text-green-500" />
								</div>
							</div>
							<DialogTitle className="text-center text-2xl font-bold">
								{t("modal.title")}
							</DialogTitle>
						</div>
						<div className="py-8 px-8">
							<p className="mb-6 text-center text-gray-700 text-lg">
								{t("modal.message")}
							</p>
							<div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
								<span className="font-mono text-xl text-rose-700 font-bold">
									{billerReferenceNumber}
								</span>
								<Button
									variant="outline"
									size="icon"
									onClick={copyBillerReferenceNumber}
									className="ml-3 hover:bg-rose-50 hover:text-rose-700 border-rose-200">
									<Copy className="h-5 w-5" />
								</Button>
							</div>
							<p className="mt-6 text-sm text-gray-500 text-center">
								Please save this reference number for your records
							</p>
						</div>
						<DialogFooter className="px-8 pb-8">
							<Button
								onClick={() => setIsModalOpen(false)}
								className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-7 text-lg font-semibold rounded-xl shadow-lg">
								{t("modal.close")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Enhanced Footer */}
				<footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-16">
					<div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
							<div>
								<div className="flex items-center mb-6">
									<div className="relative">
										<Image
											src="/placeholder.svg?height=50&width=50"
											alt="logo"
											width={50}
											height={50}
											className="rounded-xl mr-4"
										/>
										<div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"></div>
									</div>
									<h3 className="text-2xl font-bold gradient-text">
										{t("title")}
									</h3>
								</div>
								<p className="text-gray-400 mb-6 text-lg leading-relaxed">
									{t("footer.description")}
								</p>
							</div>
							<div>
								<h3 className="text-xl font-bold mb-6 text-white">
									Quick Links
								</h3>
								<ul className="space-y-3">
									{["Home", "About Us", "Services", "Contact"].map(
										(link, index) => (
											<li key={index}>
												<a
													href="#"
													className="text-gray-400 hover:text-white transition-colors duration-300 text-lg flex items-center group">
													<ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
													{link}
												</a>
											</li>
										)
									)}
								</ul>
							</div>
							<div>
								<h3 className="text-xl font-bold mb-6 text-white">
									Contact Us
								</h3>
								<ul className="space-y-4">
									{[
										{
											icon: <Phone className="h-5 w-5" />,
											text: t("contactUs.phone"),
										},
										{
											icon: <Mail className="h-5 w-5" />,
											text: t("contactUs.email"),
										},
										{
											icon: <MapPin className="h-5 w-5" />,
											text: t("contactUs.address"),
										},
									].map((item, index) => (
										<li key={index} className="flex items-center">
											<div className="text-rose-400 mr-3">{item.icon}</div>
											<span className="text-gray-400 text-lg">{item.text}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="border-t border-gray-700 pt-8">
							<p className="text-center text-gray-400 text-lg">
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
// 	DialogTitle,
// 	DialogFooter,
// } from "@/components/ui/dialog";
// import { Copy } from "lucide-react";
// import { useTranslation } from "next-i18next";

// const fadeInUpKeyframes = {
// 	"0%": { opacity: "0", transform: "translateY(20px)" },
// 	"100%": { opacity: "1", transform: "translateY(0)" },
// };

// const styles = {
// 	"@keyframes fadeInUp": fadeInUpKeyframes,
// 	".animate-fade-in-up": {
// 		animation: "fadeInUp 0.8s ease-out forwards",
// 	},
// 	".animation-delay-200": {
// 		animationDelay: "200ms",
// 	},
// 	".animation-delay-400": {
// 		animationDelay: "400ms",
// 	},
// 	".animation-delay-600": {
// 		animationDelay: "600ms",
// 	},
// 	".hover-scale": {
// 		transition: "transform 0.3s ease",
// 	},
// 	".hover-scale:hover": {
// 		transform: "scale(1.05)",
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
// 		// Add a smooth scroll behavior to the entire document
// 		// Add at the beginning of the useEffect hook, before the style creation
// 		document.documentElement.style.scrollBehavior = "smooth";

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
// 				<div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
// 					<div className="flex items-center space-x-2">
// 						<Image
// 							src="/assets/images/logo.png"
// 							alt="logo background"
// 							width={75}
// 							height={35}
// 							className="rounded-lg hover:opacity-90 transition-opacity"
// 						/>
// 						<h1 className="text-xl sm:text-2xl font-bold text-gray-900 hidden sm:block">
// 							{t("title")}
// 						</h1>
// 					</div>
// 					<div className="flex items-center space-x-4">
// 						<Select
// 							value={lang}
// 							onValueChange={(value: Language) => setLang(value)}>
// 							<SelectTrigger className="w-[100px] border-[#881337]/30 focus:ring-[#881337]/20">
// 								<SelectValue placeholder="Language" />
// 							</SelectTrigger>
// 							<SelectContent>
// 								<SelectItem value="am">አማርኛ</SelectItem>
// 								<SelectItem value="en">English</SelectItem>
// 							</SelectContent>
// 						</Select>
// 						<nav className="hidden md:flex items-center space-x-4">
// 							<Link href="/login" passHref>
// 								<Button
// 									variant="outline"
// 									className="border-[#881337]/30 hover:bg-[#881337]/10 hover:text-[#881337] transition-colors">
// 									{t("nav.login")}
// 								</Button>
// 							</Link>
// 						</nav>
// 					</div>
// 					<Sheet open={isOpen} onOpenChange={setIsOpen}>
// 						<SheetTrigger asChild className="md:hidden">
// 							<Button
// 								variant="outline"
// 								size="icon"
// 								className="border-[#881337]/30">
// 								<Menu className="h-6 w-6 text-[#881337]" />
// 							</Button>
// 						</SheetTrigger>
// 						<SheetContent side="right" className="w-[300px] sm:w-[400px]">
// 							<div className="flex items-center mb-6">
// 								<Image
// 									src="/assets/images/logo.png"
// 									alt="logo background"
// 									width={60}
// 									height={30}
// 									className="rounded-lg mr-3"
// 								/>
// 								<h2 className="text-xl font-bold">{t("title")}</h2>
// 							</div>
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
// 										className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white"
// 										onClick={() => setIsOpen(false)}>
// 										{t("nav.login")}
// 									</Button>
// 								</Link>
// 							</nav>
// 						</SheetContent>
// 					</Sheet>
// 				</div>
// 			</header>

// 			<main className="max-w-7xl mx-auto px-0 sm:px-0 lg:px-8">
// 				<div className="relative mb-16">
// 					<div className="absolute inset-0 z-0">
// 						<Image
// 							src="/assets/images/hero7.jpg?height=800&width=1600"
// 							alt="Hero background"
// 							layout="fill"
// 							objectFit="cover"
// 							className="rounded-lg opacity-25"
// 						/>
// 						<div className="absolute inset-0 bg-gradient-to-r from-[#881337]/70 to-[#6e0f2d]/70 mix-blend-multiply" />
// 					</div>
// 					<div className="relative z-10 py-32 px-4 sm:py-48 sm:px-6 lg:px-8 max-w-7xl mx-auto">
// 						<h2 className="text-4xl font-extrabold text-white text-left sm:text-5xl sm:tracking-tight lg:text-6xl mb-4 drop-shadow-lg animate-fade-in-up">
// 							{t("hero.title")}
// 						</h2>
// 						<p className="mt-6 max-w-lg text-left text-xl text-white drop-shadow-lg animate-fade-in-up animation-delay-200">
// 							{t("hero.subtitle")}
// 						</p>
// 						<div className="mt-10 flex gap-4 animate-fade-in-up animation-delay-400">
// 							<Button
// 								size="lg"
// 								className="bg-white text-[#881337] hover:bg-gray-100 text-lg px-8 py-3 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
// 								onClick={() =>
// 									howToUseRef.current?.scrollIntoView({ behavior: "smooth" })
// 								}>
// 								{t("hero.cta")}
// 							</Button>
// 							<Button
// 								size="lg"
// 								variant="outline"
// 								className="bg-transparent border-white text-white hover:bg-white/10 text-lg px-8 py-3 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
// 								onClick={scrollToProductManagement}>
// 								{t("productManagement.title")}
// 							</Button>
// 						</div>
// 					</div>
// 					<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
// 				</div>

// 				<div ref={howToUseRef} className="mb-20 scroll-mt-20">
// 					<h2 className="text-3xl font-extrabold text-center mb-8 px-3">
// 						{t("howToUse.title")}
// 					</h2>
// 					<Card className="shadow-xl overflow-hidden border-none bg-gradient-to-br from-white to-gray-50">
// 						<div className="md:flex">
// 							<div className="p-8">
// 								<CardTitle className="text-2xl font-bold text-[#881337] mb-4">
// 									{t("howToUse.title")}
// 								</CardTitle>
// 								<p className="text-gray-600 mb-6 text-lg">
// 									{t("howToUse.description")}
// 								</p>
// 								<div className="mt-4">
// 									<h3 className="text-xl font-semibold mb-4 text-gray-800">
// 										{t("howToUse.steps.title")}
// 									</h3>
// 									<ol className="space-y-4">
// 										<li className="flex items-start">
// 											<span className="flex items-center justify-center rounded-full bg-[#881337] text-white h-8 w-8 flex-shrink-0 mr-3">
// 												1
// 											</span>
// 											<span className="text-gray-700">
// 												{t("howToUse.steps.step1")}
// 											</span>
// 										</li>
// 										<li className="flex items-start">
// 											<span className="flex items-center justify-center rounded-full bg-[#881337] text-white h-8 w-8 flex-shrink-0 mr-3">
// 												2
// 											</span>
// 											<span className="text-gray-700">
// 												{t("howToUse.steps.step2")}
// 											</span>
// 										</li>
// 										<li className="flex items-start">
// 											<span className="flex items-center justify-center rounded-full bg-[#881337] text-white h-8 w-8 flex-shrink-0 mr-3">
// 												3
// 											</span>
// 											<span className="text-gray-700">
// 												{t("howToUse.steps.step3")}
// 											</span>
// 										</li>
// 										<li className="flex items-start">
// 											<span className="flex items-center justify-center rounded-full bg-[#881337] text-white h-8 w-8 flex-shrink-0 mr-3">
// 												4
// 											</span>
// 											<span className="text-gray-700">
// 												{t("howToUse.steps.step4")}
// 											</span>
// 										</li>
// 									</ol>
// 								</div>
// 							</div>
// 							<div className="md:flex-shrink-0 flex items-center justify-center p-8 bg-gradient-to-br from-[#881337]/5 to-[#881337]/10">
// 								<Image
// 									className="h-full object-contain max-w-[200px]"
// 									src="/assets/images/telebirr.png"
// 									alt="TeleBirr Logo"
// 									width={200}
// 									height={200}
// 								/>
// 							</div>
// 						</div>
// 					</Card>
// 				</div>

// 				<div ref={productManagementRef} className="mb-20 scroll-mt-20">
// 					<h2 className="text-3xl font-extrabold text-center mb-8">
// 						{t("productManagement.title")}
// 					</h2>
// 					<Card className="shadow-xl border-none overflow-hidden bg-gradient-to-br from-white to-gray-50">
// 						<CardContent className="p-8">
// 							<div className="space-y-6">
// 								<div>
// 									<Label
// 										htmlFor="studentId"
// 										className="text-lg font-medium mb-2 block">
// 										{t("productManagement.studentIdLabel")}
// 									</Label>
// 									<div className="flex mt-1">
// 										<Input
// 											id="studentId"
// 											value={studentId}
// 											onChange={(e) => setStudentId(e.target.value)}
// 											placeholder={t("productManagement.studentIdPlaceholder")}
// 											className="flex-grow text-base py-6 border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337]"
// 											required
// 										/>
// 										<Button
// 											onClick={checkStudent}
// 											className="ml-2 bg-[#881337] hover:bg-[#6e0f2d] text-white px-6 text-base">
// 											{t("productManagement.checkStudentButton")}
// 										</Button>
// 									</div>
// 									{selectedStudent && (
// 										<div className="mt-3 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md flex items-center">
// 											<div className="bg-green-100 rounded-full p-1 mr-2">
// 												<Users className="h-5 w-5 text-green-600" />
// 											</div>
// 											<p className="font-medium">
// 												{t("productManagement.studentFound")}{" "}
// 												<span className="font-bold">
// 													{selectedStudent.fullName}
// 												</span>
// 											</p>
// 										</div>
// 									)}
// 								</div>
// 								{selectedStudent && (
// 									<div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
// 										<h3 className="text-lg font-semibold mb-4 text-[#881337]">
// 											{t("productManagement.orderDetails")}
// 										</h3>
// 										<div className="space-y-5">
// 											<div>
// 												<Label
// 													htmlFor="item"
// 													className="text-base font-medium mb-2 block">
// 													{t("productManagement.selectItemLabel")}
// 												</Label>
// 												<Select
// 													value={selectedItem}
// 													onValueChange={handleItemChange}>
// 													<SelectTrigger
// 														id="item"
// 														className="w-full text-base py-6 border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337]">
// 														<SelectValue placeholder="Select Item" />
// 													</SelectTrigger>
// 													<SelectContent>
// 														{availableItems.map((item) => (
// 															<SelectItem key={item.id} value={item.id}>
// 																{item.name} - ETB {item.price.toFixed(2)}
// 															</SelectItem>
// 														))}
// 													</SelectContent>
// 												</Select>
// 											</div>
// 											<div>
// 												<Label
// 													htmlFor="quantity"
// 													className="text-base font-medium mb-2 block">
// 													{t("productManagement.quantityLabel")}
// 												</Label>
// 												<Input
// 													id="quantity"
// 													type="number"
// 													min="1"
// 													value={quantity}
// 													onChange={(e) => handleQuantityChange(e.target.value)}
// 													className="text-base py-6 border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337]"
// 												/>
// 											</div>
// 											{totalPrice > 0 && (
// 												<div className="p-5 bg-[#881337]/5 rounded-md border border-[#881337]/10">
// 													<Label className="text-base font-medium mb-1 block">
// 														{t("productManagement.totalPrice")}
// 													</Label>
// 													<div className="text-3xl font-bold text-[#881337]">
// 														ETB {totalPrice.toFixed(2)}
// 													</div>
// 												</div>
// 											)}
// 											<Button
// 												onClick={createProduct}
// 												className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white py-6 text-lg font-medium">
// 												{t("productManagement.createProductButton")}
// 											</Button>
// 										</div>
// 									</div>
// 								)}
// 							</div>
// 						</CardContent>
// 					</Card>
// 				</div>

// 				<div className="relative mb-16">
// 					<div
// 						className="absolute inset-0 flex items-center"
// 						aria-hidden="true">
// 						<div className="w-full border-t border-gray-300" />
// 					</div>
// 					<div className="relative flex justify-center">
// 						<span className="px-6 py-2 bg-white text-xl font-bold text-[#881337] rounded-full shadow-sm">
// 							{t("features.title")}
// 						</span>
// 					</div>
// 				</div>

// 				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-20">
// 					{[
// 						{
// 							title: t("features.studentManagement.title"),
// 							description: t("features.studentManagement.description"),
// 							content: t("features.studentManagement.content"),
// 							cta: t("features.studentManagement.cta"),
// 							icon: <Users className="h-6 w-6" />,
// 							images: [
// 								"/assets/images/products/id1.jpg?height=400&width=600",
// 								"/assets/images/products/id2.jpg?height=400&width=600",
// 							],
// 						},
// 						{
// 							title: t("features.orderManagement.title"),
// 							description: t("features.orderManagement.description"),
// 							content: t("features.orderManagement.content"),
// 							cta: t("features.orderManagement.cta"),
// 							icon: <School className="h-6 w-6" />,
// images: [
// 	"/assets/images/products/bag.jpg?height=400&width=600",
// 	"/assets/images/products/bag2.jpg?height=400&width=600",
// ],
// 						},
// 						{
// 							title: t("features.schoolManagement.title"),
// 							description: t("features.schoolManagement.description"),
// 							content: t("features.schoolManagement.content"),
// 							cta: t("features.schoolManagement.cta"),
// 							icon: <GraduationCap className="h-6 w-6" />,
// 							images: [
// 								"/assets/images/products/sms1.jpg?height=400&width=600",
// 								"/assets/images/products/sms2.jpg?height=400&width=600",
// 							],
// 						},
// 						{
// 							title: t("features.studentInsurance.title"),
// 							description: t("features.studentInsurance.description"),
// 							content: t("features.studentInsurance.content"),
// 							cta: t("features.studentInsurance.cta"),
// 							icon: <Shield className="h-6 w-6" />,
// 							images: [
// 								"/assets/images/products/helath1.jpg?height=400&width=600",
// 								"/assets/images/products/health2.jpg?height=400&width=600",
// 								"/assets/images/products/health3.jpg?height=400&width=600",
// 							],
// 						},
// 						{
// 							title: t("features.productCatalog.title"),
// 							description: t("features.productCatalog.description"),
// 							content: t("features.productCatalog.content"),
// 							cta: t("features.productCatalog.cta"),
// 							icon: <BookOpen className="h-6 w-6" />,
// 							images: [
// 								"/assets/images/products/sport1.jpg?height=400&width=600",
// 								"/assets/images/products/sport2.jpg?height=400&width=600",
// 							],
// 						},
// 					].map((service, index) => (
// 						<Card
// 							key={index}
// 							className="group transform transition-all duration-500 hover:scale-105 shadow-lg overflow-hidden cursor-pointer border-none"
// 							onClick={() => openServiceModal(service)}>
// 							<div className="h-48 w-full relative overflow-hidden">
// 								<Image
// 									src={service.images[0] || "/placeholder.svg"}
// 									alt={service.title}
// 									layout="fill"
// 									objectFit="cover"
// 									className="transition-transform duration-700 group-hover:scale-110"
// 								/>
// 								<div className="absolute inset-0 bg-gradient-to-t from-[#881337]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
// 							</div>
// 							<CardHeader>
// 								<CardTitle className="flex items-center text-[#881337] group-hover:text-[#6e0f2d] transition-colors">
// 									<div className="bg-[#881337]/10 p-2 rounded-full mr-3 group-hover:bg-[#881337]/20 transition-colors">
// 										{service.icon}
// 									</div>
// 									<span>{service.title}</span>
// 								</CardTitle>
// 								<CardDescription className="text-base">
// 									{service.description}
// 								</CardDescription>
// 							</CardHeader>
// 							<CardContent>
// 								<p className="line-clamp-3">{service.content}</p>
// 							</CardContent>
// 							<CardFooter>
// 								<Button
// 									variant="outline"
// 									className="w-full border-[#881337]/30 text-[#881337] hover:bg-[#881337] hover:text-white transition-colors"
// 									onClick={(e) => {
// 										e.stopPropagation();
// 										scrollToContact();
// 									}}>
// 									{t("features.orderButton")}
// 								</Button>
// 							</CardFooter>
// 						</Card>
// 					))}
// 				</div>

// 				<Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
// 					<DialogContent className="max-w-4xl p-0 overflow-hidden">
// 						<div className="relative h-64 md:h-80">
// 							<Image
// 								src={
// 									(selectedService as any)?.images[0] ||
// 									"/placeholder.svg?height=600&width=800" ||
// 									"/placeholder.svg"
// 								}
// 								alt={(selectedService as any)?.title}
// 								layout="fill"
// 								objectFit="cover"
// 							/>
// 							<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
// 							<div className="absolute bottom-0 left-0 right-0 p-6">
// 								<DialogTitle className="text-3xl font-bold text-white flex items-center mb-2">
// 									<div className="bg-white/20 p-2 rounded-full mr-3">
// 										{(selectedService as any)?.icon}
// 									</div>
// 									<span>{(selectedService as any)?.title}</span>
// 								</DialogTitle>
// 							</div>
// 						</div>
// 						<div className="p-6">
// 							<p className="text-lg font-medium mb-4">
// 								{(selectedService as any)?.description}
// 							</p>
// 							<p className="mb-6 text-gray-700">
// 								{(selectedService as any)?.content}
// 							</p>
// 							<div className="grid grid-cols-2 gap-4 mb-6">
// 								{(selectedService as any)?.images
// 									.slice(1)
// 									.map((img: any, index: any) => (
// 										<div
// 											key={index}
// 											className="relative h-40 rounded-lg overflow-hidden shadow-md">
// 											<Image
// 												src={img || "/placeholder.svg"}
// 												alt={`${(selectedService as any)?.title} image ${
// 													index + 2
// 												}`}
// 												layout="fill"
// 												objectFit="cover"
// 											/>
// 										</div>
// 									))}
// 							</div>
// 						</div>
// 						<DialogFooter className="p-6 bg-gray-50 border-t">
// 							<Button
// 								variant="outline"
// 								onClick={() => setIsServiceModalOpen(false)}
// 								className="border-gray-300">
// 								Close
// 							</Button>
// 							<Button
// 								onClick={() => {
// 									setIsServiceModalOpen(false);
// 									scrollToContact();
// 								}}
// 								className="bg-[#881337] hover:bg-[#6e0f2d] text-white">
// 								{t("features.orderButton")}
// 							</Button>
// 						</DialogFooter>
// 					</DialogContent>
// 				</Dialog>

// 				<div className="mb-20">
// 					<div className="bg-gradient-to-r from-[#881337] to-[#6e0f2d] text-white py-16 rounded-xl relative overflow-hidden">
// 						<div className="absolute inset-0 opacity-10">
// 							<svg
// 								className="w-full h-full"
// 								viewBox="0 0 100 100"
// 								preserveAspectRatio="none">
// 								<path
// 									d="M0,0 L100,0 L100,100 L0,100 Z"
// 									fill="url(#quote-pattern)"
// 								/>
// 							</svg>
// 							<defs>
// 								<pattern
// 									id="quote-pattern"
// 									patternUnits="userSpaceOnUse"
// 									width="20"
// 									height="20">
// 									<text x="0" y="15" fontSize="20" fill="currentColor">
// 										"
// 									</text>
// 								</pattern>
// 							</defs>
// 						</div>
// 						<div className="relative z-10">
// 							<h2 className="text-3xl font-extrabold text-center mb-12">
// 								{t("testimonials.title")}
// 							</h2>
// 							<div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
// 								{[
// 									{
// 										quote: t("testimonials.quote1"),
// 										author: t("testimonials.author1"),
// 										role: t("testimonials.role1"),
// 									},
// 									{
// 										quote: t("testimonials.quote2"),
// 										author: t("testimonials.author2"),
// 										role: t("testimonials.role2"),
// 									},
// 									{
// 										quote: t("testimonials.quote3"),
// 										author: t("testimonials.author3"),
// 										role: t("testimonials.role3"),
// 									},
// 								].map((testimonial, index) => (
// 									<Card
// 										key={index}
// 										className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-colors">
// 										<CardContent className="pt-6">
// 											<div className="text-4xl font-serif text-white/60 mb-4">
// 												"
// 											</div>
// 											<blockquote className="text-lg font-medium mb-6 text-white/90">
// 												{testimonial.quote}
// 											</blockquote>
// 											<div className="flex items-center">
// 												<div className="rounded-full bg-white/20 text-white p-2 mr-4">
// 													<Users className="h-6 w-6" />
// 												</div>
// 												<div>
// 													<p className="font-semibold text-white">
// 														{testimonial.author}
// 													</p>
// 													<p className="text-sm text-white/70">
// 														{testimonial.role}
// 													</p>
// 												</div>
// 											</div>
// 										</CardContent>
// 									</Card>
// 								))}
// 							</div>
// 						</div>
// 					</div>
// 				</div>

// 				<div className="mb-20">
// 					<h2 className="text-3xl font-extrabold text-center mb-8">
// 						{t("aboutUs.title")}
// 					</h2>
// 					<Card className="shadow-xl border-none overflow-hidden">
// 						<div className="md:flex">
// 							<div className="md:w-1/3 bg-[#881337] flex items-center justify-center p-8">
// 								<div className="text-white text-center">
// 									<School className="h-16 w-16 mx-auto mb-4" />
// 									<h3 className="text-2xl font-bold mb-2">{t("title")}</h3>
// 									<p className="text-white/80">{t("aboutUs.tagline")}</p>
// 								</div>
// 							</div>
// 							<div className="md:w-2/3">
// 								<CardContent className="prose max-w-none p-8">
// 									<p className="text-lg leading-relaxed mb-4">
// 										{t("aboutUs.content1")}
// 									</p>
// 									<p className="text-lg leading-relaxed">
// 										{t("aboutUs.content2")}
// 									</p>
// 								</CardContent>
// 							</div>
// 						</div>
// 					</Card>
// 				</div>

// 				<div ref={contactRef} className="mb-20 scroll-mt-20">
// 					<h2 className="text-3xl font-extrabold text-center mb-8">
// 						{t("contactUs.title")}
// 					</h2>
// 					<Card className="shadow-xl border-none overflow-hidden">
// 						<div className="md:grid md:grid-cols-2">
// 							<div className="bg-[#881337] p-8 text-white">
// 								<h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
// 								<p className="mb-6 text-white/80">
// 									We'd love to hear from you. Please contact us using the
// 									information below.
// 								</p>
// 								<div className="space-y-6">
// 									<div className="flex items-center space-x-4">
// 										<div className="bg-white/20 p-3 rounded-full">
// 											<Phone className="h-6 w-6" />
// 										</div>
// 										<div>
// 											<p className="font-medium">Phone</p>
// 											<p className="text-white/80">{t("contactUs.phone")}</p>
// 										</div>
// 									</div>
// 									<div className="flex items-center space-x-4">
// 										<div className="bg-white/20 p-3 rounded-full">
// 											<Mail className="h-6 w-6" />
// 										</div>
// 										<div>
// 											<p className="font-medium">Email</p>
// 											<p className="text-white/80">{t("contactUs.email")}</p>
// 										</div>
// 									</div>
// 									<div className="flex items-center space-x-4">
// 										<div className="bg-white/20 p-3 rounded-full">
// 											<MapPin className="h-6 w-6" />
// 										</div>
// 										<div>
// 											<p className="font-medium">Address</p>
// 											<p className="text-white/80">{t("contactUs.address")}</p>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 							<div className="p-8">
// 								<h3 className="text-2xl font-bold mb-6 text-[#881337]">
// 									Send us a Message
// 								</h3>
// 								<div className="space-y-4">
// 									<div>
// 										<Label
// 											htmlFor="name"
// 											className="text-base font-medium mb-2 block">
// 											Your Name
// 										</Label>
// 										<Input
// 											id="name"
// 											placeholder="Enter your name"
// 											className="text-base py-6 border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337]"
// 										/>
// 									</div>
// 									<div>
// 										<Label
// 											htmlFor="email"
// 											className="text-base font-medium mb-2 block">
// 											Email Address
// 										</Label>
// 										<Input
// 											id="email"
// 											type="email"
// 											placeholder="Enter your email"
// 											className="text-base py-6 border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337]"
// 										/>
// 									</div>
// 									<div>
// 										<Label
// 											htmlFor="message"
// 											className="text-base font-medium mb-2 block">
// 											Message
// 										</Label>
// 										<textarea
// 											id="message"
// 											rows={4}
// 											placeholder="Enter your message"
// 											className="w-full rounded-md border border-[#881337]/20 focus:ring-[#881337]/30 focus:border-[#881337] p-3"
// 										/>
// 									</div>
// 									<Button className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white py-6 text-lg font-medium">
// 										Send Message
// 									</Button>
// 								</div>
// 							</div>
// 						</div>
// 					</Card>
// 				</div>

// 				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
// 					<DialogContent className="max-w-md">
// 						<div className="bg-[#881337] text-white p-6 rounded-t-lg">
// 							<div className="flex justify-center mb-4">
// 								<div className="bg-white rounded-full p-3">
// 									<svg
// 										width="24"
// 										height="24"
// 										viewBox="0 0 24 24"
// 										fill="none"
// 										xmlns="http://www.w3.org/2000/svg">
// 										<path
// 											d="M20 6L9 17L4 12"
// 											stroke="#881337"
// 											strokeWidth="2"
// 											strokeLinecap="round"
// 											strokeLinejoin="round"
// 										/>
// 									</svg>
// 								</div>
// 							</div>
// 							<DialogTitle className="text-center text-xl">
// 								{t("modal.title")}
// 							</DialogTitle>
// 						</div>
// 						<div className="py-6 px-6">
// 							<p className="mb-4 text-center text-gray-700">
// 								{t("modal.message")}
// 							</p>
// 							<div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
// 								<span className="font-mono text-lg text-[#881337]">
// 									{billerReferenceNumber}
// 								</span>
// 								<Button
// 									variant="outline"
// 									size="icon"
// 									onClick={copyBillerReferenceNumber}
// 									className="ml-2 hover:bg-[#881337]/10 hover:text-[#881337]">
// 									<Copy className="h-4 w-4" />
// 								</Button>
// 							</div>
// 							<p className="mt-4 text-sm text-gray-500 text-center">
// 								Please save this reference number for your records
// 							</p>
// 						</div>
// 						<DialogFooter className="px-6 pb-6">
// 							<Button
// 								onClick={() => setIsModalOpen(false)}
// 								className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white py-6">
// 								{t("modal.close")}
// 							</Button>
// 						</DialogFooter>
// 					</DialogContent>
// 				</Dialog>

// 				<footer className="bg-gray-900 text-white mt-12">
// 					<div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
// 						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
// 							<div>
// 								<div className="flex items-center mb-4">
// 									<Image
// 										src="/assets/images/logo.png"
// 										alt="logo"
// 										width={60}
// 										height={30}
// 										className="rounded-lg mr-3"
// 									/>
// 									<h3 className="text-xl font-bold">{t("title")}</h3>
// 								</div>
// 								<p className="text-gray-400 mb-4">{t("footer.description")}</p>
// 							</div>
// 							<div>
// 								<h3 className="text-lg font-semibold mb-4">Quick Links</h3>
// 								<ul className="space-y-2">
// 									<li>
// 										<a
// 											href="#"
// 											className="text-gray-400 hover:text-white transition-colors">
// 											Home
// 										</a>
// 									</li>
// 									<li>
// 										<a
// 											href="#"
// 											className="text-gray-400 hover:text-white transition-colors">
// 											About Us
// 										</a>
// 									</li>
// 									<li>
// 										<a
// 											href="#"
// 											className="text-gray-400 hover:text-white transition-colors">
// 											Services
// 										</a>
// 									</li>
// 									<li>
// 										<a
// 											href="#"
// 											className="text-gray-400 hover:text-white transition-colors">
// 											Contact
// 										</a>
// 									</li>
// 								</ul>
// 							</div>
// 							<div>
// 								<h3 className="text-lg font-semibold mb-4">Contact Us</h3>
// 								<ul className="space-y-2">
// 									<li className="flex items-center">
// 										<Phone className="h-5 w-5 text-gray-400 mr-2" />
// 										<span className="text-gray-400">
// 											{t("contactUs.phone")}
// 										</span>
// 									</li>
// 									<li className="flex items-center">
// 										<Mail className="h-5 w-5 text-gray-400 mr-2" />
// 										<span className="text-gray-400">
// 											{t("contactUs.email")}
// 										</span>
// 									</li>
// 									<li className="flex items-center">
// 										<MapPin className="h-5 w-5 text-gray-400 mr-2" />
// 										<span className="text-gray-400">
// 											{t("contactUs.address")}
// 										</span>
// 									</li>
// 								</ul>
// 							</div>
// 						</div>
// 						<div className="border-t border-gray-800 pt-8">
// 							<p className="text-center text-gray-400">
// 								{t("footer.copyright")}
// 							</p>
// 						</div>
// 					</div>
// 				</footer>
// 			</main>
// 		</div>
// 	);
// }
