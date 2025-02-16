import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const students = await request.json();

		if (!Array.isArray(students) || students.length === 0) {
			return NextResponse.json(
				{ error: "Invalid or empty data provided" },
				{ status: 400 }
			);
		}

		let inserted = 0;
		const updated = 0;
		const errors: string[] = [];
		const duplicates: string[] = [];

		for (const [index, student] of students.entries()) {
			try {
				if (!student.studentId) {
					throw new Error(
						"Missing required fields: studentId, firstName, or lastName"
					);
				}

				// Convert number fields to strings
				const processedStudent = {
					...student,
					phone: student.phone?.toString(),
					father_phone: student.father_phone?.toString(),
					mother_phone: student.mother_phone?.toString(),
					grade: student.grade?.toString(),
				};

				const existingStudent = await prisma.student.findUnique({
					where: { studentId: processedStudent.studentId },
				});

				if (existingStudent) {
					duplicates.push(processedStudent.studentId);
				} else {
					await prisma.student.create({
						data: processedStudent,
					});
					inserted++;
				}
			} catch (error) {
				console.error({
					error,
				});
				errors.push(
					`Error processing student at index ${index}: ${
						error instanceof Error ? error.message : "Unknown error"
					}`
				);
			}
		}

		if (errors.length > 0 || duplicates.length > 0) {
			return NextResponse.json(
				{ inserted, updated, errors, duplicates },
				{ status: 207 }
			);
		}

		return NextResponse.json({ inserted, updated });
	} catch (error) {
		console.error("Error in bulk student upload:", error);
		return NextResponse.json(
			{ error: "Error processing bulk upload" },
			{ status: 500 }
		);
	}
}
