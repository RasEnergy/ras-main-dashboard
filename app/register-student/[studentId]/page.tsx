"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { translations, type Language } from "@/lib/translations";
import {
	getStudentById,
	registerStudent,
	updateStudent,
	type StudentFormData,
} from "../../../lib/actions";
import {
	CheckCircle2,
	AlertCircle,
	PlusCircle,
	ArrowLeft,
	Save,
	UserPlus,
} from "lucide-react";
import { AmharicForm } from "../amharic-form";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EditStudentPage({
	params,
}: {
	params: { studentId: string };
}) {
	const router = useRouter();
	const { studentId } = params;
	const [lang, setLang] = useState<Language>("am");
	const [formData, setFormData] = useState<StudentFormData>({
		firstName: "",
		lastName: "",
		middleName: "",
		studentId: "",
		gender: "",
		phone: "",
		father_phone: "",
		mother_phone: "",
		branch: "",
		grade: "",
		status: "Active",
		dateOfBirth: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [result, setResult] = useState<{
		success?: boolean;
		message?: string;
		errors?: any[];
	} | null>(null);
	const [isEditing, setIsEditing] = useState(false);

	const t = (key: string) => {
		return key.split(".").reduce((o, i) => o[i], translations[lang] as any);
	};

	useEffect(() => {
		const fetchStudentData = async () => {
			if (studentId === "new") {
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				const student: any = await getStudentById(studentId);

				if (student) {
					setFormData(student);
					setIsEditing(true);
				} else {
					setResult({
						success: false,
						message:
							lang === "en"
								? "Student not found. You can register a new student."
								: "ተማሪው አልተገኘም። አዲስ ተማሪ መመዝገብ ይችላሉ።",
					});
				}
			} catch (error) {
				console.error("Error fetching student:", error);
				setResult({
					success: false,
					message:
						lang === "en"
							? "Error fetching student data. Please try again."
							: "የተማሪ መረጃን ማግኘት አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchStudentData();
	}, [studentId, lang]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string) => (value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setResult(null);

		try {
			let response;

			if (isEditing) {
				response = await updateStudent(formData);
			} else {
				response = await registerStudent(formData);
			}

			setResult(response);

			if (response.success) {
				// Redirect after successful registration/update
				setTimeout(
					() => router.push(`/registration-success?update=${isEditing}`),
					2000
				);
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			setResult({
				success: false,
				message:
					lang === "en"
						? "An unexpected error occurred. Please try again."
						: "ያልተጠበቀ ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setFormData({
			firstName: "",
			lastName: "",
			middleName: "",
			studentId: "",
			gender: "",
			phone: "",
			father_phone: "",
			mother_phone: "",
			branch: "",
			grade: "",
			status: "Active",
			dateOfBirth: "",
		});
		setIsEditing(false);
		router.push("/register-student/new");
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="flex flex-col items-center">
					<div className="h-12 w-12 rounded-full border-4 border-[#881337] border-t-transparent animate-spin mb-4"></div>
					<div className="text-lg font-medium text-[#881337]">
						{lang === "en" ? "Loading student data..." : "የተማሪ መረጃን በመጫን ላይ..."}
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-6">
					<Link
						href="/"
						className="text-[#881337] hover:text-[#6e0f2d] font-medium flex items-center group transition-all duration-200">
						<ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
						{lang === "en" ? "Back to Home" : "ወደ መነሻ ይመለሱ"}
					</Link>

					<Select
						value={lang}
						onValueChange={(value: Language) => setLang(value)}>
						<SelectTrigger className="w-[120px]">
							<SelectValue placeholder="Language" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="en">English</SelectItem>
							<SelectItem value="am">አማርኛ</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}>
					<Card className="shadow-xl border-t-4 border-t-[#881337] overflow-hidden">
						<CardHeader className="bg-gradient-to-r from-[#881337] to-[#6e0f2d] text-white">
							<div className="flex justify-between items-center">
								<div className="flex items-center">
									{isEditing ? (
										<Save className="h-6 w-6 mr-2" />
									) : (
										<UserPlus className="h-6 w-6 mr-2" />
									)}
									<CardTitle className="text-xl">
										{isEditing
											? lang === "en"
												? "Edit Student"
												: "የልጅዎን ሙሉ መረጃ ያስተካክሉ"
											: lang === "en"
											? "Student Registration"
											: "የተማሪ ምዝገባ"}
									</CardTitle>
								</div>

								{/* {isEditing && (
									<Button
										variant="outline"
										size="sm"
										className="text-white border-white hover:bg-white/20"
										onClick={resetForm}>
										<PlusCircle className="mr-1 h-4 w-4" />
										{lang === "en" ? "New Form" : "አዲስ ቅጽ"}
									</Button>
								)} */}
							</div>
							<CardDescription className="text-gray-100">
								{isEditing
									? lang === "en"
										? "Update the student information below"
										: "ችግር ያለበትን ቦታ ያስተካክሉ"
									: lang === "en"
									? "Fill out the form below to register a new student"
									: "አዲስ ተማሪ ለመመዝገብ ከዚህ በታች ያለውን ቅጽ ይሙሉ"}
							</CardDescription>
						</CardHeader>

						<CardContent className="pt-6">
							{result && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}>
									<Alert
										className={`mb-6 ${
											result.success
												? "bg-green-50 text-green-800 border-green-200"
												: "bg-red-50 text-red-800 border-red-200"
										}`}>
										<div className="flex items-center gap-2">
											{result.success ? (
												<CheckCircle2 className="h-5 w-5 text-green-600" />
											) : (
												<AlertCircle className="h-5 w-5 text-red-600" />
											)}
											<AlertTitle>
												{result.success
													? lang === "en"
														? "Success"
														: "ተሳክቷል"
													: lang === "en"
													? "Error"
													: "ስህተት"}
											</AlertTitle>
										</div>
										<AlertDescription>
											{lang === "en"
												? result.message
												: result.success
												? isEditing
													? "ተማሪው በተሳካ ሁኔታ ተዘምኗል"
													: "ተማሪው በተሳካ ሁኔታ ተመዝግቧል"
												: "ተማሪውን መመዝገብ አልተቻለም። እባክዎ እንደገና ይሞክሩ።"}
										</AlertDescription>
									</Alert>
								</motion.div>
							)}

							<form onSubmit={handleSubmit}>
								{lang === "en" ? (
									<div className="space-y-6">
										<div className="space-y-4">
											<h3 className="text-lg font-medium text-gray-900">
												Personal Information
											</h3>
											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label
														htmlFor="firstName"
														className="text-sm font-medium">
														First Name *
													</Label>
													<Input
														id="firstName"
														name="firstName"
														value={formData.firstName}
														onChange={handleInputChange}
														className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50"
														required
													/>
												</div>
												<div className="space-y-2">
													<Label
														htmlFor="middleName"
														className="text-sm font-medium">
														Middle Name *
													</Label>
													<Input
														id="middleName"
														name="middleName"
														value={formData.middleName || ""}
														onChange={handleInputChange}
														className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50"
														required
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label
													htmlFor="lastName"
													className="text-sm font-medium">
													Last Name *
												</Label>
												<Input
													id="lastName"
													name="lastName"
													value={formData.lastName}
													onChange={handleInputChange}
													className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50"
													required
												/>
											</div>

											<div className="space-y-2">
												<Label
													htmlFor="studentId"
													className="text-sm font-medium">
													Student ID *
												</Label>
												<Input
													id="studentId"
													name="studentId"
													value={formData.studentId}
													onChange={handleInputChange}
													className={`rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50 ${
														isEditing ? "bg-gray-100" : ""
													}`}
													required
													disabled={isEditing}
												/>
												{isEditing && (
													<p className="text-xs text-gray-500 mt-1 italic">
														Student ID cannot be changed
													</p>
												)}
											</div>

											<div className="space-y-2">
												<Label htmlFor="gender" className="text-sm font-medium">
													Gender *
												</Label>
												<Select
													value={formData.gender || ""}
													onValueChange={handleSelectChange("gender")}>
													<SelectTrigger
														id="gender"
														className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50">
														<SelectValue placeholder="Select gender" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="Male">Male</SelectItem>
														<SelectItem value="Female">Female</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label
													htmlFor="dateOfBirth"
													className="text-sm font-medium">
													Date of Birth *
												</Label>
												<Input
													id="dateOfBirth"
													name="dateOfBirth"
													type="date"
													value={formData.dateOfBirth || ""}
													onChange={handleInputChange}
													className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50"
													required
												/>
											</div>
										</div>

										<div className="space-y-4">
											<h3 className="text-lg font-medium text-gray-900">
												Contact Details
											</h3>
											<div className="space-y-2">
												<Label htmlFor="phone" className="text-sm font-medium">
													Student Phone
												</Label>
												<Input
													id="phone"
													name="phone"
													value={formData.phone || ""}
													onChange={handleInputChange}
													type="tel"
													className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50"
												/>
											</div>

											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label
														htmlFor="father_phone"
														className="text-sm font-medium">
														Father's Phone
													</Label>
													<Input
														id="father_phone"
														name="father_phone"
														value={formData.father_phone || ""}
														onChange={handleInputChange}
														type="tel"
														className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50"
													/>
												</div>

												<div className="space-y-2">
													<Label
														htmlFor="mother_phone"
														className="text-sm font-medium">
														Mother's Phone
													</Label>
													<Input
														id="mother_phone"
														name="mother_phone"
														value={formData.mother_phone || ""}
														onChange={handleInputChange}
														type="tel"
														className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50"
													/>
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<h3 className="text-lg font-medium text-gray-900">
												Academic Information
											</h3>
											<div className="space-y-2">
												<Label htmlFor="branch" className="text-sm font-medium">
													School Branch *
												</Label>
												<Input
													id="branch"
													name="branch"
													value={formData.branch}
													onChange={handleInputChange}
													className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50"
													required
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="grade" className="text-sm font-medium">
													Grade
												</Label>
												<Input
													id="grade"
													name="grade"
													value={formData.grade || ""}
													onChange={handleInputChange}
													className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50"
												/>
											</div>
										</div>

										<div className="mt-8">
											<Button
												type="submit"
												className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white py-2 rounded-md shadow-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
												disabled={isSubmitting}>
												{isSubmitting ? (
													<div className="flex items-center">
														<div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
														{lang === "en" ? "Processing..." : "በመስራት ላይ..."}
													</div>
												) : (
													<div className="flex items-center justify-center">
														{isEditing ? (
															<Save className="mr-2 h-4 w-4" />
														) : (
															<UserPlus className="mr-2 h-4 w-4" />
														)}
														{isEditing
															? lang === "en"
																? "Update Student"
																: "ተማሪን ያዘምኑ"
															: lang === "en"
															? "Register Student"
															: "ተማሪን መዝግብ"}
													</div>
												)}
											</Button>
										</div>
									</div>
								) : (
									<AmharicForm
										formData={formData}
										handleInputChange={handleInputChange}
										handleSelectChange={handleSelectChange}
										isSubmitting={isSubmitting}
										isEditing={isEditing}
									/>
								)}

								{/* <div className="mt-8">
									<Button
										type="submit"
										className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white py-2 rounded-md shadow-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
										disabled={isSubmitting}>
										{isSubmitting ? (
											<div className="flex items-center">
												<div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
												{lang === "en" ? "Processing..." : "በመስራት ላይ..."}
											</div>
										) : (
											<div className="flex items-center justify-center">
												{isEditing ? (
													<Save className="mr-2 h-4 w-4" />
												) : (
													<UserPlus className="mr-2 h-4 w-4" />
												)}
												{isEditing
													? lang === "en"
														? "Update Student"
														: "ተማሪን ያዘምኑ"
													: lang === "en"
													? "Register Student"
													: "ተማሪን መዝግብ"}
											</div>
										)}
									</Button>
								</div> */}
							</form>
						</CardContent>

						<CardFooter className="bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
							<p className="text-sm text-gray-500">
								{lang === "en" ? "* Required fields" : "* አስፈላጊ መረጃዎች"}
							</p>

							{isEditing && (
								<Button
									variant="outline"
									onClick={resetForm}
									className="text-[#881337] border-[#881337] hover:bg-[#881337] hover:text-white">
									<PlusCircle className="mr-2 h-4 w-4" />
									{lang === "en" ? "New Registration" : "አዲስ ምዝገባ"}
								</Button>
							)}
						</CardFooter>
					</Card>
				</motion.div>

				<div className="mt-8 text-center text-sm text-gray-500">
					<p>
						{lang === "en"
							? "Need help? Contact our support team at "
							: "እርዳታ ይፈልጋሉ? የድጋፍ ቡድናችንን ያግኙ በ "}
						<a
							href="mailto:support@rasynergy.com"
							className="text-[#881337] hover:underline">
							support@rasynergy.com
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
