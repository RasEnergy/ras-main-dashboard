"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { StudentFormData } from "../../lib/actions";
import { Save, UserPlus } from "lucide-react";

interface AmharicFormProps {
	formData: StudentFormData;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	handleSelectChange: (name: string) => (value: string) => void;
	isSubmitting: boolean;
	isEditing?: boolean;
}

export function AmharicForm({
	formData,
	handleInputChange,
	handleSelectChange,
	isSubmitting,
	handleTextareaChange,
	isEditing = false,
}: AmharicFormProps) {
	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<h3 className="text-lg font-medium text-gray-900">የግል መረጃ</h3>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="firstName" className="text-sm font-medium">
							ስም *
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
						<Label htmlFor="middleName" className="text-sm font-medium">
							የአባት ስም *
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
					<Label htmlFor="lastName" className="text-sm font-medium">
						የአያት ስም *
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
					<Label htmlFor="studentId" className="text-sm font-medium">
						የተማሪ መታወቂያ ቁጥር *
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
							የተማሪ መታወቂያ ቁጥር መቀየር አይቻልም
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="gender" className="text-sm font-medium">
						ጾታ
					</Label>
					<Select
						value={formData.gender || ""}
						onValueChange={handleSelectChange("gender")}>
						<SelectTrigger
							id="gender"
							className="rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50">
							<SelectValue placeholder="ጾታ ይምረጡ" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Male">ወንድ</SelectItem>
							<SelectItem value="Female">ሴት</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="dateOfBirth" className="text-sm font-medium">
						የትውልድ ቀን *
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
				<h3 className="text-lg font-medium text-gray-900">የመገኛ መረጃ</h3>
				<div className="space-y-2">
					<Label htmlFor="phone" className="text-sm font-medium">
						የተማሪ ስልክ ቁጥር
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
						<Label htmlFor="father_phone" className="text-sm font-medium">
							የአባት ስልክ ቁጥር
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
						<Label htmlFor="mother_phone" className="text-sm font-medium">
							የእናት ስልክ ቁጥር
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
				<h3 className="text-lg font-medium text-gray-900">የትምህርት መረጃ</h3>
				<div className="space-y-2">
					<Label htmlFor="branch" className="text-sm font-medium">
						የትምህርት ቤቱ ቅርንጫፍ *
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
						ክፍል
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

			{/* Add this after the Academic Information section */}
			<div className="space-y-4 mt-6">
				<h3 className="text-lg font-medium text-gray-900">ተጨማሪ መረጃ</h3>
				<div className="space-y-2">
					<div className="flex justify-between">
						<Label htmlFor="additionalNotes" className="text-sm font-medium">
							ተጨማሪ ማስታወሻዎች
						</Label>
						<span
							className={`text-xs ${
								formData.additionalNotes &&
								formData.additionalNotes.length > 180
									? "text-amber-600"
									: "text-gray-500"
							}`}>
							{formData.additionalNotes ? formData.additionalNotes.length : 0}
							/200
						</span>
					</div>
					<textarea
						id="additionalNotes"
						name="additionalNotes"
						value={formData.additionalNotes || ""}
						onChange={handleTextareaChange}
						className={`w-full rounded-md border-gray-300 focus:border-[#881337] focus:ring focus:ring-[#881337] focus:ring-opacity-50 min-h-[100px] ${
							formData.additionalNotes && formData.additionalNotes.length > 180
								? "border-amber-300"
								: ""
						}`}
						placeholder="ስለ ተማሪው ማንኛውንም ተጨማሪ መረጃ ያስገቡ (ከፍተኛው 200 ቁምፊዎች)"
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
							በመስራት ላይ...
						</div>
					) : (
						<div className="flex items-center justify-center">
							{isEditing ? (
								<Save className="mr-2 h-4 w-4" />
							) : (
								<UserPlus className="mr-2 h-4 w-4" />
							)}
							{isEditing ? "ተማሪን ያዘምኑ" : "ተማሪን መዝግብ"}
						</div>
					)}
				</Button>
			</div>
		</div>
	);
}

