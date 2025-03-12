import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";

// Define validation schema based on your Prisma model
const studentSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	middleName: z.string().optional().nullable(),
	studentId: z.string().min(1, "Student ID is required"),
	gender: z.string().optional().nullable(),
	phone: z.string().optional().nullable(),
	father_phone: z.string().optional().nullable(),
	mother_phone: z.string().optional().nullable(),
	branch: z.string().min(1, "Branch is required"),
	grade: z.string().optional().nullable(),
	status: z.string().optional().nullable().default("Active"),
	profileImage: z.string().optional().nullable(),
});

export async function GET(request: Request) {
	const url = new URL(request.url);
	const studentId = url.searchParams.get("studentId");

	if (!studentId) {
		return NextResponse.json(
			{
				success: false,
				message: "Student ID is required",
			},
			{ status: 400 }
		);
	}

	try {
		const student = await prisma.student.findUnique({
			where: { studentId },
		});

		if (!student) {
			return NextResponse.json(
				{
					success: false,
					message: "Student not found",
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			student,
		});
	} catch (error) {
		console.error("Error fetching student:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch student",
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// Validate form data
		const validatedData = studentSchema.parse(body);

		// Check if student with this ID already exists
		const existingStudent = await prisma.student.findUnique({
			where: { studentId: validatedData.studentId },
		});

		if (existingStudent) {
			return NextResponse.json(
				{
					success: false,
					message: "A student with this ID already exists",
				},
				{ status: 400 }
			);
		}

		// Create new student
		const student = await prisma.student.create({
			data: {
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				middleName: validatedData.middleName || null,
				studentId: validatedData.studentId,
				gender: validatedData.gender || null,
				phone: validatedData.phone || null,
				father_phone: validatedData.father_phone || null,
				mother_phone: validatedData.mother_phone || null,
				branch: validatedData.branch,
				grade: validatedData.grade || null,
				status: validatedData.status || "Active",
				profileImage: validatedData.profileImage || null,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Student registered successfully",
			student,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Return validation errors
			return NextResponse.json(
				{
					success: false,
					message: "Validation failed",
					errors: error.errors,
				},
				{ status: 400 }
			);
		}

		console.error("Error registering student:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to register student. Please try again.",
			},
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request) {
	try {
		const body = await request.json();

		// Validate form data
		const validatedData = studentSchema.parse(body);

		// Check if student exists
		const existingStudent = await prisma.student.findUnique({
			where: { studentId: validatedData.studentId },
		});

		if (!existingStudent) {
			return NextResponse.json(
				{
					success: false,
					message: "Student not found",
				},
				{ status: 404 }
			);
		}

		// Update student
		const student = await prisma.student.update({
			where: { studentId: validatedData.studentId },
			data: {
				firstName: validatedData.firstName,
				lastName: validatedData.lastName,
				middleName: validatedData.middleName || null,
				gender: validatedData.gender || null,
				phone: validatedData.phone || null,
				father_phone: validatedData.father_phone || null,
				mother_phone: validatedData.mother_phone || null,
				branch: validatedData.branch,
				grade: validatedData.grade || null,
				status: validatedData.status || "Active",
				profileImage: validatedData.profileImage || null,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Student updated successfully",
			student,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Return validation errors
			return NextResponse.json(
				{
					success: false,
					message: "Validation failed",
					errors: error.errors,
				},
				{ status: 400 }
			);
		}

		console.error("Error updating student:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to update student. Please try again.",
			},
			{ status: 500 }
		);
	}
}
