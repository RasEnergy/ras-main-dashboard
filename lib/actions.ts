"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

// Update the studentSchema to include additionalNotes
const studentSchema = z.object({
	id: z.string().optional(),
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
	dateOfBirth: z.string().optional().nullable(),
	additionalNotes: z
		.string()
		.max(200, "Additional notes cannot exceed 200 characters")
		.optional()
		.nullable(),
});

export type StudentFormData = z.infer<typeof studentSchema>;

export async function getStudentById(studentId: string) {
	try {
		const student = await prisma.student.findUnique({
			where: { studentId },
		});

		return student;
	} catch (error) {
		console.error("Error fetching student:", error);
		throw new Error("Failed to fetch student");
	}
}

export async function registerStudent(formData: StudentFormData) {
	try {
		// Validate form data
		const validatedData = studentSchema.parse(formData);

		// Check if student with this ID already exists
		const existingStudent = await prisma.student.findUnique({
			where: { studentId: validatedData.studentId },
		});

		if (existingStudent) {
			return {
				success: false,
				message: "A student with this ID already exists",
			};
		}

		// Update the registerStudent function to include additionalNotes
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
				dateOfBirth: validatedData.dateOfBirth || null,
				additionalNotes: validatedData.additionalNotes || null,
			},
		});

		return {
			success: true,
			message: "Student registered successfully",
			student,
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Return validation errors
			return {
				success: false,
				message: "Validation failed",
				errors: error.errors,
			};
		}

		console.error("Error registering student:", error);
		return {
			success: false,
			message: "Failed to register student. Please try again.",
		};
	}
}

export async function updateStudent(formData: StudentFormData) {
	try {
		// Validate form data
		const validatedData = studentSchema.parse(formData);

		// Check if student exists
		const existingStudent = await prisma.student.findUnique({
			where: { studentId: validatedData.studentId },
		});

		if (!existingStudent) {
			return {
				success: false,
				message: "Student not found",
			};
		}

		// Update the updateStudent function to include additionalNotes
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
				dateOfBirth: validatedData.dateOfBirth || null,
				additionalNotes: validatedData.additionalNotes || null,
			},
		});

		return {
			success: true,
			message: "Student updated successfully",
			student,
		};
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Return validation errors
			return {
				success: false,
				message: "Validation failed",
				errors: error.errors,
			};
		}

		console.error("Error updating student:", error);
		return {
			success: false,
			message: "Failed to update student. Please try again.",
		};
	}
}
