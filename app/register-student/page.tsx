import { redirect } from "next/navigation";

export default function RegisterStudentPage() {
	redirect("/register-student/new");
}

// "use client";

// import type React from "react";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
// 	Card,
// 	CardContent,
// 	CardDescription,
// 	CardFooter,
// 	CardHeader,
// 	CardTitle,
// } from "@/components/ui/card";
// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from "@/components/ui/select";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { translations, type Language } from "@/lib/translations";
// import { registerStudent, type StudentFormData } from "./../../lib/actions";
// import { CheckCircle2, AlertCircle } from "lucide-react";
// import { AmharicForm } from "./amharic-form";

// export default function RegisterStudentPage() {
// 	const router = useRouter();
// 	const [lang, setLang] = useState<Language>("en");
// 	const [formData, setFormData] = useState<StudentFormData>({
// 		firstName: "",
// 		lastName: "",
// 		middleName: "",
// 		studentId: "",
// 		gender: "",
// 		phone: "",
// 		father_phone: "",
// 		mother_phone: "",
// 		branch: "",
// 		grade: "",
// 		status: "Active",
// 	});
// 	const [isSubmitting, setIsSubmitting] = useState(false);
// 	const [result, setResult] = useState<{
// 		success?: boolean;
// 		message?: string;
// 		errors?: any[];
// 	} | null>(null);

// 	const t = (key: string) => {
// 		return key.split(".").reduce((o, i) => o[i], translations[lang] as any);
// 	};

// 	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const { name, value } = e.target;
// 		setFormData((prev) => ({ ...prev, [name]: value }));
// 	};

// 	const handleSelectChange = (name: string) => (value: string) => {
// 		setFormData((prev) => ({ ...prev, [name]: value }));
// 	};

// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		setIsSubmitting(true);
// 		setResult(null);

// 		try {
// 			const response = await registerStudent(formData);
// 			setResult(response);

// 			if (response.success) {
// 				// Reset form on success
// 				setFormData({
// 					firstName: "",
// 					lastName: "",
// 					middleName: "",
// 					studentId: "",
// 					gender: "",
// 					phone: "",
// 					father_phone: "",
// 					mother_phone: "",
// 					branch: "",
// 					grade: "",
// 					status: "Active",
// 				});

// 				// Redirect after successful registration
// 				setTimeout(() => router.push("/registration-success"), 2000);
// 			}
// 		} catch (error) {
// 			console.error("Error submitting form:", error);
// 			setResult({
// 				success: false,
// 				message: "An unexpected error occurred. Please try again.",
// 			});
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};

// 	return (
// 		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// 			<div className="max-w-md mx-auto">
// 				<div className="flex justify-end mb-4">
// 					<Select
// 						value={lang}
// 						onValueChange={(value: Language) => setLang(value)}>
// 						<SelectTrigger className="w-[120px]">
// 							<SelectValue placeholder="Language" />
// 						</SelectTrigger>
// 						<SelectContent>
// 							<SelectItem value="en">English</SelectItem>
// 							<SelectItem value="am">አማርኛ</SelectItem>
// 						</SelectContent>
// 					</Select>
// 				</div>

// 				<Card className="shadow-lg">
// 					<CardHeader className="bg-gradient-to-r from-[#881337] to-[#6e0f2d] text-white">
// 						<CardTitle className="text-xl">
// 							{lang === "en" ? "Student Registration" : "የተማሪ ምዝገባ"}
// 						</CardTitle>
// 						<CardDescription className="text-gray-100">
// 							{lang === "en"
// 								? "Fill out the form below to register a new student"
// 								: "አዲስ ተማሪ ለመመዝገብ ከዚህ በታች ያለውን ቅጽ ይሙሉ"}
// 						</CardDescription>
// 					</CardHeader>

// 					<CardContent className="pt-6">
// 						{result && (
// 							<Alert
// 								className={`mb-6 ${
// 									result.success
// 										? "bg-green-50 text-green-800 border-green-200"
// 										: "bg-red-50 text-red-800 border-red-200"
// 								}`}>
// 								<div className="flex items-center gap-2">
// 									{result.success ? (
// 										<CheckCircle2 className="h-5 w-5 text-green-600" />
// 									) : (
// 										<AlertCircle className="h-5 w-5 text-red-600" />
// 									)}
// 									<AlertTitle>
// 										{result.success
// 											? lang === "en"
// 												? "Success"
// 												: "ተሳክቷል"
// 											: lang === "en"
// 											? "Error"
// 											: "ስህተት"}
// 									</AlertTitle>
// 								</div>
// 								<AlertDescription>
// 									{lang === "en"
// 										? result.message
// 										: result.success
// 										? "ተማሪው በተሳካ ሁኔታ ተመዝግቧል"
// 										: "ተማሪውን መመዝገብ አልተቻለም። እባክዎ እንደገና ይሞክሩ።"}
// 								</AlertDescription>
// 							</Alert>
// 						)}

// 						<form onSubmit={handleSubmit}>
// 							{lang === "en" ? (
// 								<div className="space-y-4">
// 									<div className="grid grid-cols-2 gap-4">
// 										<div className="space-y-2">
// 											<Label htmlFor="firstName">First Name *</Label>
// 											<Input
// 												id="firstName"
// 												name="firstName"
// 												value={formData.firstName}
// 												onChange={handleInputChange}
// 												required
// 											/>
// 										</div>

// 										<div className="space-y-2">
// 											<Label htmlFor="lastName">Last Name *</Label>
// 											<Input
// 												id="lastName"
// 												name="lastName"
// 												value={formData.lastName}
// 												onChange={handleInputChange}
// 												required
// 											/>
// 										</div>
// 									</div>

// 									<div className="space-y-2">
// 										<Label htmlFor="middleName">Middle Name</Label>
// 										<Input
// 											id="middleName"
// 											name="middleName"
// 											value={formData.middleName}
// 											onChange={handleInputChange}
// 										/>
// 									</div>

// 									<div className="space-y-2">
// 										<Label htmlFor="studentId">Student ID *</Label>
// 										<Input
// 											id="studentId"
// 											name="studentId"
// 											value={formData.studentId}
// 											onChange={handleInputChange}
// 											required
// 										/>
// 									</div>

// 									<div className="space-y-2">
// 										<Label htmlFor="gender">Gender</Label>
// 										<Select
// 											value={formData.gender}
// 											onValueChange={handleSelectChange("gender")}>
// 											<SelectTrigger id="gender">
// 												<SelectValue placeholder="Select gender" />
// 											</SelectTrigger>
// 											<SelectContent>
// 												<SelectItem value="Male">Male</SelectItem>
// 												<SelectItem value="Female">Female</SelectItem>
// 												<SelectItem value="Other">Other</SelectItem>
// 											</SelectContent>
// 										</Select>
// 									</div>

// 									<div className="space-y-2">
// 										<Label htmlFor="phone">Student Phone</Label>
// 										<Input
// 											id="phone"
// 											name="phone"
// 											value={formData.phone}
// 											onChange={handleInputChange}
// 											type="tel"
// 										/>
// 									</div>

// 									<div className="grid grid-cols-2 gap-4">
// 										<div className="space-y-2">
// 											<Label htmlFor="father_phone">Father's Phone</Label>
// 											<Input
// 												id="father_phone"
// 												name="father_phone"
// 												value={formData.father_phone}
// 												onChange={handleInputChange}
// 												type="tel"
// 											/>
// 										</div>

// 										<div className="space-y-2">
// 											<Label htmlFor="mother_phone">Mother's Phone</Label>
// 											<Input
// 												id="mother_phone"
// 												name="mother_phone"
// 												value={formData.mother_phone}
// 												onChange={handleInputChange}
// 												type="tel"
// 											/>
// 										</div>
// 									</div>

// 									<div className="space-y-2">
// 										<Label htmlFor="branch">Branch *</Label>
// 										<Input
// 											id="branch"
// 											name="branch"
// 											value={formData.branch}
// 											onChange={handleInputChange}
// 											required
// 										/>
// 									</div>

// 									<div className="space-y-2">
// 										<Label htmlFor="grade">Grade</Label>
// 										<Input
// 											id="grade"
// 											name="grade"
// 											value={formData.grade}
// 											onChange={handleInputChange}
// 										/>
// 									</div>

// 									<Button
// 										type="submit"
// 										className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white"
// 										disabled={isSubmitting}>
// 										{isSubmitting ? "Submitting..." : "Register Student"}
// 									</Button>
// 								</div>
// 							) : (
// 								<AmharicForm
// 									formData={formData}
// 									handleInputChange={handleInputChange}
// 									handleSelectChange={handleSelectChange}
// 									isSubmitting={isSubmitting}
// 								/>
// 							)}
// 						</form>
// 					</CardContent>

// 					<CardFooter className="bg-gray-50 border-t px-6 py-4">
// 						<p className="text-sm text-gray-500">
// 							{lang === "en" ? "* Required fields" : "* አስፈላጊ መረጃዎች"}
// 						</p>
// 					</CardFooter>
// 				</Card>
// 			</div>
// 		</div>
// 	);
// }
