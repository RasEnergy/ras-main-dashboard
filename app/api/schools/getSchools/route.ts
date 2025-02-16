import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
	try {
		const totalSchools = await prisma.school.count();
		const previousMonthSchools = await prisma.school.count({
			where: {
				createdAt: {
					lt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
				},
			},
		});

		return NextResponse.json({ totalSchools, previousMonthSchools });
	} catch (error) {
		console.error("Error fetching schools data:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
