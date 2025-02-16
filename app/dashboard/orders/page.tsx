"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Plus, Pencil, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface Student {
	id: string;
	firstName: string;
	lastName: string;
	studentId: string;
}

interface Product {
	id: string;
	item: { name: string; price: number };
	quantity: number;
	totalPrice: number;
	billerReferenceNumber: string;
}

interface Order {
	id: string;
	student: {
		id: string;
		firstName: string;
		lastName: string;
		studentId: string;
	};
	product: {
		id: string;
		item: { name: string };
		quantity: number;
		totalPrice: number;
		billerReferenceNumber: string;
	};
	parentName: string;
	parentPhone: string;
	referenceNumber: string;
	transactionNumber: string;
	totalPrice: number;
}

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [students, setStudents] = useState<Student[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [newOrder, setNewOrder] = useState({
		studentId: "",
		productId: "",
		parentName: "",
		parentPhone: "",
	});
	const [editingOrder, setEditingOrder] = useState<Order | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const { toast } = useToast();

	useEffect(() => {
		fetchOrders();
	}, [currentPage, searchTerm]);

	useEffect(() => {
		fetchStudents();
		fetchProducts();
	}, []);

	const fetchOrders = async () => {
		const response = await fetch(
			`/api/orders?page=${currentPage}&limit=10&search=${searchTerm}`
		);
		const data = await response.json();
		setOrders(data.orders);
		setTotalPages(data.totalPages);
	};

	const fetchStudents = async () => {
		const response = await fetch("/api/students");
		const data = await response.json();
		setStudents(data.students);
	};

	const fetchProducts = async () => {
		const response = await fetch("/api/products");
		const data = await response.json();
		setProducts(data);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (editingOrder) {
			setEditingOrder({ ...editingOrder, [name]: value });
		} else {
			setNewOrder({ ...newOrder, [name]: value });
		}
	};

	const handleSelectChange = (name: string) => (value: string) => {
		if (editingOrder) {
			setEditingOrder({ ...editingOrder, [name]: value });
		} else {
			setNewOrder({ ...newOrder, [name]: value });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const url = editingOrder ? `/api/orders/${editingOrder.id}` : "/api/orders";
		const method = editingOrder ? "PUT" : "POST";
		const body = editingOrder
			? editingOrder
			: {
					...newOrder,
					student: students.find((s) => s.id === newOrder.studentId),
					product: products.find((p) => p.id === newOrder.productId),
			  };

		const response = await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});

		if (response.ok) {
			fetchOrders();
			setIsDialogOpen(false);
			setEditingOrder(null);
			setNewOrder({
				studentId: "",
				productId: "",
				parentName: "",
				parentPhone: "",
			});
			toast({
				title: `Order ${editingOrder ? "updated" : "created"} successfully`,
				description: `The order has been ${
					editingOrder ? "updated" : "added"
				} to the database.`,
			});
		} else {
			console.error(`Failed to ${editingOrder ? "update" : "create"} order`);
			toast({
				title: `Failed to ${editingOrder ? "update" : "create"} order`,
				description: "An error occurred. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleEdit = (order: Order) => {
		setEditingOrder(order);
		setNewOrder({
			studentId: order.student.id,
			productId: order.product.id,
			parentName: order.parentName,
			parentPhone: order.parentPhone,
		});
		setIsDialogOpen(true);
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/orders/${id}`, {
			method: "DELETE",
		});

		if (response.ok) {
			fetchOrders();
			toast({
				title: "Order deleted successfully",
				description: "The order has been removed from the database.",
			});
		} else {
			console.error("Failed to delete order");
			toast({
				title: "Failed to delete order",
				description: "An error occurred. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleSearch = () => {
		setCurrentPage(1);
		fetchOrders();
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl font-bold tracking-tight">Orders</h2>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button
							onClick={() => setEditingOrder(null)}
							className="bg-green-600 hover:bg-green-700">
							<Plus className="mr-2 h-4 w-4" /> Add Order
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>
								{editingOrder ? "Edit Order" : "Create New Order"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<Label htmlFor="studentId">Student</Label>
								<Select
									onValueChange={handleSelectChange("studentId")}
									value={
										editingOrder ? editingOrder.student.id : newOrder.studentId
									}>
									<SelectTrigger>
										<SelectValue placeholder="Select Student" />
									</SelectTrigger>
									<SelectContent>
										{students.map((student) => (
											<SelectItem key={student.id} value={student.id}>
												{student.studentId} - {student.firstName}{" "}
												{student.lastName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="productId">Product</Label>
								<Select
									onValueChange={handleSelectChange("productId")}
									value={
										editingOrder ? editingOrder.product.id : newOrder.productId
									}>
									<SelectTrigger>
										<SelectValue placeholder="Select Product" />
									</SelectTrigger>
									<SelectContent>
										{products.map((product) => (
											<SelectItem key={product.id} value={product.id}>
												{product.item.name} - Quantity: {product.quantity},
												Price: {product.totalPrice.toFixed(2)} Birr
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label htmlFor="parentName">Parent Name</Label>
								<Input
									id="parentName"
									name="parentName"
									value={
										editingOrder ? editingOrder.parentName : newOrder.parentName
									}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div>
								<Label htmlFor="parentPhone">Parent Phone</Label>
								<Input
									id="parentPhone"
									name="parentPhone"
									value={
										editingOrder
											? editingOrder.parentPhone
											: newOrder.parentPhone
									}
									onChange={handleInputChange}
									required
								/>
							</div>
							<Button
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700">
								{editingOrder ? "Update" : "Create"} Order
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<Card className="bg-white shadow-lg rounded-lg">
				<CardHeader className="bg-gray-50 rounded-t-lg">
					<CardTitle className="text-2xl font-semibold text-gray-800">
						Orders List
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center py-4">
						<Input
							placeholder="Search orders..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="max-w-sm mr-2"
						/>
						<Button
							onClick={handleSearch}
							className="bg-blue-600 hover:bg-blue-700">
							<Search className="mr-2 h-4 w-4" /> Search
						</Button>
					</div>
					<div className="rounded-md border border-gray-200 overflow-hidden">
						<Table>
							<TableHeader className="bg-gray-100">
								<TableRow>
									<TableHead className="w-[50px] font-semibold">No.</TableHead>
									<TableHead className="font-semibold">Student</TableHead>
									<TableHead className="font-semibold">Product</TableHead>
									<TableHead className="font-semibold">Parent Name</TableHead>
									<TableHead className="font-semibold">Parent Phone</TableHead>
									<TableHead className="font-semibold">
										Reference Number
									</TableHead>
									<TableHead className="font-semibold">
										Transaction Number
									</TableHead>
									<TableHead className="font-semibold">Total Price</TableHead>
									<TableHead className="text-right font-semibold">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{orders.map((order, index) => (
									<TableRow key={order.id} className="hover:bg-gray-50">
										<TableCell className="font-medium">
											{(currentPage - 1) * 10 + index + 1}
										</TableCell>
										<TableCell>
											{`${order.student.firstName} ${order.student.lastName}`}
											<Badge variant="secondary" className="ml-2">
												{order.student.studentId}
											</Badge>
										</TableCell>
										<TableCell>
											{`${order.product.item.name}`}
											<Badge variant="outline" className="ml-2">
												Qty: {order.product.quantity}
											</Badge>
										</TableCell>
										<TableCell>{order.parentName}</TableCell>
										<TableCell>
											<a
												href={`tel:${order.parentPhone}`}
												className="flex items-center text-blue-600 hover:text-blue-800">
												<Phone className="mr-1 h-4 w-4" />
												{order.parentPhone}
											</a>
										</TableCell>
										<TableCell>
											<Badge variant="secondary">{order.referenceNumber}</Badge>
										</TableCell>
										<TableCell>
											<Badge>{order.transactionNumber}</Badge>
										</TableCell>
										<TableCell className="font-semibold">
											{order.totalPrice.toFixed(2)} Birr
										</TableCell>
										<TableCell className="text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" className="h-8 w-8 p-0">
														<span className="sr-only">Open menu</span>
														<Pencil className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem onClick={() => handleEdit(order)}>
														Edit
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleDelete(order.id)}
														className="text-red-600">
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<div className="flex items-center justify-end space-x-2 py-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}>
							Previous
						</Button>
						<span className="text-sm text-gray-600">
							Page {currentPage} of {totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								setCurrentPage((prev) => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}>
							Next
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
