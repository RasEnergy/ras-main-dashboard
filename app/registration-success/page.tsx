"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Home, UserPlus, ArrowRight } from "lucide-react";
import { translations, type Language } from "@/lib/translations";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function RegistrationSuccessPage() {
	const [lang, setLang] = useState<Language>("en");
	const [countdown, setCountdown] = useState(5);
	const searchParams = useSearchParams();
	const isUpdate = searchParams.get("update") === "true";

	const t = (key: string) => {
		return key.split(".").reduce((o, i) => o[i], translations[lang] as any);
	};

	useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (countdown === 0) {
			window.location.href = "/";
		}
	}, [countdown]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md">
				<Card className="shadow-xl border-t-4 border-t-green-500 overflow-hidden">
					<CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center pb-10">
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="flex items-center justify-center mb-4">
							<div className="bg-white rounded-full p-4 shadow-lg">
								<CheckCircle className="h-16 w-16 text-green-500" />
							</div>
						</motion.div>
						<CardTitle className="text-center text-2xl font-bold">
							{isUpdate
								? lang === "en"
									? "Update Successful!"
									: "ማዘመኑ ተሳክቷል!"
								: lang === "en"
								? "Registration Successful!"
								: "ምዝገባው ተሳክቷል!"}
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-6 text-center -mt-6 bg-white rounded-t-3xl relative z-10">
						<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
							<p className="text-gray-700 mb-4 text-lg">
								{isUpdate
									? lang === "en"
										? "Thank you for updating the student information. The changes have been successfully saved in our system."
										: "የተማሪውን መረጃ ስለዘመኑ እናመሰግናለን። ለውጦቹ በሥርዓታችን ውስጥ በተሳካ ሁኔታ ተቀምጠዋል።"
									: lang === "en"
									? "Thank you for registering the student. The information has been successfully saved in our system."
									: "ተማሪውን ስለመዘገቡ እናመሰግናለን። መረጃው በሥርዓታችን ውስጥ በተሳካ ሁኔታ ተቀምጧል።"}
							</p>
							<div className="flex items-center justify-center mt-6 mb-2">
								<div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-green-600">
									{countdown}
								</div>
							</div>
							<p className="text-gray-500 text-sm">
								{lang === "en"
									? `You will be redirected to the home page in ${countdown} seconds.`
									: `በ${countdown} ሰከንዶች ውስጥ ወደ መነሻ ገጽ ይመለሳሉ።`}
							</p>
						</div>
					</CardContent>
					<CardFooter className="flex justify-center gap-4 pt-2 pb-6 bg-white">
						<Link href="/" passHref>
							<Button variant="outline" className="flex items-center gap-2">
								<Home className="h-4 w-4" />
								{lang === "en" ? "Return to Home" : "ወደ መነሻ ይመለሱ"}
							</Button>
						</Link>
						<Link href="/register-student/new" passHref>
							<Button className="bg-[#881337] hover:bg-[#6e0f2d] text-white flex items-center gap-2">
								<UserPlus className="h-4 w-4" />
								{lang === "en" ? "Register Another" : "ሌላ ተማሪ ይመዝግቡ"}
								<ArrowRight className="h-4 w-4 ml-1" />
							</Button>
						</Link>
					</CardFooter>
				</Card>
			</motion.div>
		</div>
	);
}
