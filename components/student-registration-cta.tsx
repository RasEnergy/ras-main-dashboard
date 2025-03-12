"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { translations, type Language } from "@/lib/translations";

interface StudentRegistrationCTAProps {
	lang: Language;
}

export function StudentRegistrationCTA({ lang }: StudentRegistrationCTAProps) {
	const t = (key: string) => {
		return key.split(".").reduce((o, i) => o[i], translations[lang] as any);
	};

	return (
		<Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
			<CardHeader className="bg-gradient-to-r from-[#881337]/10 to-[#6e0f2d]/10">
				<CardTitle className="flex items-center gap-2">
					<UserPlus className="h-5 w-5 text-[#881337]" />
					{lang === "en" ? "Student Registration" : "የተማሪ ምዝገባ"}
				</CardTitle>
				<CardDescription>
					{lang === "en"
						? "Register a new student in our system"
						: "አዲስ ተማሪን በሥርዓታችን ውስጥ ይመዝግቡ"}
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-4">
				<p className="text-sm text-gray-600">
					{lang === "en"
						? "Complete the registration form to add a new student to our database. This will allow them to access all our services."
						: "አዲስ ተማሪን ወደ መረጃ ቋታችን ለመጨመር የምዝገባ ቅጹን ይሙሉ። ይህ ሁሉንም አገልግሎቶቻችንን እንዲያገኙ ያስችላቸዋል።"}
				</p>
			</CardContent>
			<CardFooter>
				<Link href="/register-student" passHref>
					<Button className="w-full bg-[#881337] hover:bg-[#6e0f2d] text-white">
						{lang === "en" ? "Register a Student" : "ተማሪ ይመዝግቡ"}
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
}
