"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	School,
	Users,
	Package,
	ShoppingCart,
	TrendingUp,
	TrendingDown,
	Loader2,
} from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { subDays } from "date-fns";

// API functions
const fetchSchools = async () => {
	const res = await fetch("/api/schools/getSchools");
	if (!res.ok) throw new Error("Failed to fetch schools");
	return res.json();
};

const fetchStudents = async () => {
	const res = await fetch("/api/students");
	if (!res.ok) throw new Error("Failed to fetch students");
	return res.json();
};

const fetchProducts = async () => {
	const res = await fetch("/api/products");
	if (!res.ok) throw new Error("Failed to fetch products");
	return res.json();
};

const fetchOrders = async () => {
	const res = await fetch("/api/orders");
	if (!res.ok) throw new Error("Failed to fetch orders");
	return res.json();
};

const fetchOrdersTimeline = async () => {
	const res = await fetch("/api/orders/timeline");
	if (!res.ok) throw new Error("Failed to fetch orders timeline");
	return res.json();
};

export default function DashboardPage() {
	const [dateRange, setDateRange] = useState({
		from: subDays(new Date(), 30),
		to: new Date(),
	});

	const {
		data: schoolsData,
		isLoading: isLoadingSchools,
		error: schoolsError,
	} = useQuery({
		queryKey: ["schools"],
		queryFn: fetchSchools,
	});

	const {
		data: studentsData,
		isLoading: isLoadingStudents,
		error: studentsError,
	} = useQuery({
		queryKey: ["students"],
		queryFn: fetchStudents,
	});

	const {
		data: productsData,
		isLoading: isLoadingProducts,
		error: productsError,
	} = useQuery({
		queryKey: ["products"],
		queryFn: fetchProducts,
	});

	const {
		data: ordersData,
		isLoading: isLoadingOrders,
		error: ordersError,
	} = useQuery({
		queryKey: ["orders"],
		queryFn: fetchOrders,
	});

	const {
		data: ordersTimelineData,
		isLoading: isLoadingOrdersTimeline,
		error: ordersTimelineError,
	} = useQuery({
		queryKey: ["ordersTimeline"],
		queryFn: fetchOrdersTimeline,
	});

	const isLoading =
		isLoadingSchools ||
		isLoadingStudents ||
		isLoadingProducts ||
		isLoadingOrders ||
		isLoadingOrdersTimeline;
	const hasError =
		schoolsError ||
		studentsError ||
		productsError ||
		ordersError ||
		ordersTimelineError;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
				<span className="ml-2 text-lg font-medium">
					Loading dashboard data...
				</span>
			</div>
		);
	}

	if (hasError) {
		return (
			<div className="text-center text-red-500">
				<h2 className="text-2xl font-bold mb-2">
					Error loading dashboard data
				</h2>
				<p>
					Please try refreshing the page or contact support if the problem
					persists.
				</p>
			</div>
		);
	}

	const calculateChange = (current: number, previous: number) => {
		const change = current - previous;
		const percentage = (change / previous) * 100;
		return { change, percentage };
	};

	const schoolsChange = calculateChange(
		schoolsData.totalSchools,
		schoolsData.previousMonthSchools
	);
	const studentsChange = calculateChange(
		studentsData.totalStudents,
		studentsData.previousMonthStudents
	);
	const productsChange = calculateChange(
		productsData.totalProducts,
		productsData.previousMonthProducts
	);
	const ordersChange = calculateChange(
		ordersData.totalOrders,
		ordersData.previousMonthOrders
	);

	return (
		<div className="space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold tracking-tight">
					Dashboard Overview
				</h1>
				<DateRangePicker
					dateRange={dateRange}
					onDateRangeChange={setDateRange}
				/>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<DashboardCard
					title="Total Schools"
					value={schoolsData.totalSchools}
					change={schoolsChange}
					icon={School}
				/>
				<DashboardCard
					title="Total Students"
					value={studentsData.totalStudents}
					change={studentsChange}
					icon={Users}
				/>
				<DashboardCard
					title="Total Products"
					value={productsData.totalProducts}
					change={productsChange}
					icon={Package}
				/>
				<DashboardCard
					title="Total Orders"
					value={ordersData.totalOrders}
					change={ordersChange}
					icon={ShoppingCart}
				/>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Orders Timeline</CardTitle>
				</CardHeader>
				<CardContent>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={ordersTimelineData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="orders"
								stroke="#8884d8"
								activeDot={{ r: 8 }}
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{/* {ordersData.recentOrders.map((order: any) => (
								<li
									key={order.id}
									className="flex justify-between items-center">
									<span>{order.productName}</span>
									<span className="font-medium">
										{order.totalPrice.toFixed(2)} Birr
									</span>
								</li>
							))} */}
						</ul>
						<Button className="w-full mt-4">View All Orders</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Top Products</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{/* {productsData.topProducts.map((product: any) => (
								<li
									key={product.id}
									className="flex justify-between items-center">
									<span>{product.name}</span>
									<span className="font-medium">{product.salesCount} sold</span>
								</li>
							))} */}
						</ul>
						<Button className="w-full mt-4">View All Products</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function DashboardCard({ title, value, change, icon: Icon }: any) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				{/* <div className="text-2xl font-bold">{value.toLocaleString()}</div> */}
				<div className="flex items-center text-xs">
					{change.change >= 0 ? (
						<TrendingUp className="h-4 w-4 text-green-500 mr-1" />
					) : (
						<TrendingDown className="h-4 w-4 text-red-500 mr-1" />
					)}
					<span
						className={change.change >= 0 ? "text-green-500" : "text-red-500"}>
						{change.change >= 0 ? "+" : ""}
						{change.percentage.toFixed(2)}%
					</span>
					<span className="text-muted-foreground ml-1">from last month</span>
				</div>
			</CardContent>
		</Card>
	);
}
