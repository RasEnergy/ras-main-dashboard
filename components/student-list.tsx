"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Edit, UserPlus } from "lucide-react";
import { translations, type Language } from "@/lib/translations";

interface Student {
	id: string;
	firstName: string | null;
	lastName: string | null;
	studentId: string;
	branch: string;
	grade: string | null;
	status: string | null;
}

interface StudentListProps {
	lang: Language;
}

export function StudentList({ lang }: StudentListProps) {
	const [students, setStudents] = useState<Student[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

	const t = (key: string) => {
		return key.split(".").reduce((o, i) => o[i], translations[lang] as any);
	};

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				setIsLoading(true);
				const response = await fetch("/api/students");
				const data = await response.json();

				if (data.students) {
					setStudents(data.students);
					setFilteredStudents(data.students);
				}
			} catch (error) {
				console.error("Error fetching students:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStudents();
	}, []);

	useEffect(() => {
		if (searchTerm.trim() === "") {
			setFilteredStudents(students);
			return;
		}

		const filtered = students.filter(
			(student) =>
				(student.firstName?.toLowerCase() || "").includes(
					searchTerm.toLowerCase()
				) ||
				(student.lastName?.toLowerCase() || "").includes(
					searchTerm.toLowerCase()
				) ||
				student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
				student.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(student.grade?.toLowerCase() || "").includes(searchTerm.toLowerCase())
		);

		setFilteredStudents(filtered);
	}, [searchTerm, students]);

	return (
		<Card className="shadow-md">
			<CardHeader className="bg-gray-50 border-b">
				<div className="flex justify-between items-center">
					<CardTitle className="text-xl">
						{lang === "en" ? "Student Directory" : "የተማሪዎች ማውጫ"}
					</CardTitle>
					<Link href="/register-student/new" passHref>
						<Button className="bg-[#881337] hover:bg-[#6e0f2d] text-white">
							<UserPlus className="mr-2 h-4 w-4" />
							{lang === "en" ? "Add Student" : "ተማሪ ጨምር"}
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="p-4 border-b">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						<Input
							placeholder={
								lang === "en" ? "Search students..." : "ተማሪዎችን ይፈልጉ..."
							}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{isLoading ? (
					<div className="p-8 text-center">
						<div className="animate-spin h-8 w-8 border-4 border-[#881337] border-t-transparent rounded-full mx-auto mb-4"></div>
						<p>{lang === "en" ? "Loading students..." : "ተማሪዎችን በመጫን ላይ..."}</p>
					</div>
				) : filteredStudents.length === 0 ? (
					<div className="p-8 text-center text-gray-500">
						{searchTerm.trim() !== ""
							? lang === "en"
								? "No students found matching your search."
								: "ከፍለጋዎ ጋር የሚዛመዱ ተማሪዎች አልተገኙም።"
							: lang === "en"
							? "No students registered yet."
							: "እስካሁን ምንም ተማሪዎች አልተመዘገቡም።"}
					</div>
				) : (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{lang === "en" ? "Name" : "ስም"}</TableHead>
									<TableHead>
										{lang === "en" ? "Student ID" : "የተማሪ መታወቂያ"}
									</TableHead>
									<TableHead>{lang === "en" ? "Branch" : "ቅርንጫፍ"}</TableHead>
									<TableHead>{lang === "en" ? "Grade" : "ክፍል"}</TableHead>
									<TableHead>{lang === "en" ? "Status" : "ሁኔታ"}</TableHead>
									<TableHead className="text-right">
										{lang === "en" ? "Actions" : "ድርጊቶች"}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredStudents.map((student) => (
									<TableRow key={student.id}>
										<TableCell className="font-medium">
											{`${student.firstName || ""} ${student.lastName || ""}`}
										</TableCell>
										<TableCell>{student.studentId}</TableCell>
										<TableCell>{student.branch}</TableCell>
										<TableCell>{student.grade || "-"}</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													student.status === "Active"
														? "bg-green-100 text-green-800"
														: student.status === "Inactive"
														? "bg-gray-100 text-gray-800"
														: "bg-yellow-100 text-yellow-800"
												}`}>
												{student.status === "Active"
													? lang === "en"
														? "Active"
														: "ንቁ"
													: student.status === "Inactive"
													? lang === "en"
														? "Inactive"
														: "ንቁ ያልሆነ"
													: lang === "en"
													? "Pending"
													: "በመጠባበቅ ላይ"}
											</span>
										</TableCell>
										<TableCell className="text-right">
											<Link
												href={`/register-student/${student.studentId}`}
												passHref>
												<Button variant="ghost" size="sm">
													<Edit className="h-4 w-4 mr-1" />
													{lang === "en" ? "Edit" : "አርትዕ"}
												</Button>
											</Link>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
