import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { format, subDays } from "date-fns";

export async function GET() {
	try {
		const endDate = new Date();
		const startDate = subDays(endDate, 30);

		const orders = await prisma.order.groupBy({
			by: ["createdAt"],
			_count: {
				id: true,
			},
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
			},
			orderBy: {
				createdAt: "asc",
			},
		});

		const timeline = orders.map((entry) => ({
			date: format(entry.createdAt, "yyyy-MM-dd"),
			orders: entry._count.id,
		}));

		return NextResponse.json(timeline);
	} catch (error) {
		console.error("Error fetching orders timeline:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
