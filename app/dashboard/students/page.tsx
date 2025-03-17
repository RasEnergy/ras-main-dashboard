"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Upload, Search } from "lucide-react";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface Student {
	id: string;
	firstName: string;
	lastName: string;
	middleName?: string;
	studentId: string;
	gender: string;
	phone?: string;
	father_phone?: string;
	mother_phone?: string;
	branch: string;
	grade: string;
	profileImage?: string;
	status: string;
}

export default function StudentsPage() {
	const [students, setStudents] = useState<Student[]>([]);
	const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
		firstName: "",
		lastName: "",
		middleName: "",
		studentId: "",
		gender: "",
		phone: "",
		father_phone: "",
		mother_phone: "",
		branch: "",
		grade: "",
		profileImage: "",
		status: "",
	});
	const [editingStudent, setEditingStudent] = useState<Student | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const [isUploading, setIsUploading] = useState(false);
	const [totalCount, setTotalCount] = useState(0);

	const fetchStudents = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/students?page=${currentPage}&limit=10&search=${searchTerm}`
			);
			const data = await response.json();
			setStudents(data.students);
			setTotalPages(data.totalPages);
			setTotalCount(data.totalCount);
		} catch (error) {
			console.error("Error fetching students:", error);
			toast({
				title: "Error",
				description: "Failed to fetch students. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, searchTerm, toast]);

	useEffect(() => {
		fetchStudents();
	}, [fetchStudents]);

	const handleSearch = useCallback(() => {
		setCurrentPage(1);
		fetchStudents();
	}, [fetchStudents]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (editingStudent) {
			setEditingStudent({ ...editingStudent, [name]: value });
		} else {
			setNewStudent({ ...newStudent, [name]: value });
		}
	};

	const handleSelectChange = (name: string) => (value: string) => {
		if (editingStudent) {
			setEditingStudent({ ...editingStudent, [name]: value });
		} else {
			setNewStudent({ ...newStudent, [name]: value });
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const url = editingStudent ? "/api/students" : "/api/students";
		const method = editingStudent ? "PUT" : "POST";
		const body = editingStudent ? editingStudent : newStudent;

		try {
			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (response.ok) {
				fetchStudents();
				setIsDialogOpen(false);
				setEditingStudent(null);
				setNewStudent({
					firstName: "",
					lastName: "",
					middleName: "",
					studentId: "",
					gender: "",
					phone: "",
					father_phone: "",
					mother_phone: "",
					branch: "",
					grade: "",
					profileImage: "",
					status: "",
				});
				toast({
					title: `Student ${
						editingStudent ? "updated" : "created"
					} successfully`,
					description: `The student has been ${
						editingStudent ? "updated" : "added"
					} to the database.`,
				});
			} else {
				throw new Error(
					`Failed to ${editingStudent ? "update" : "create"} student`
				);
			}
		} catch (error) {
			console.error(
				`Error ${editingStudent ? "updating" : "creating"} student:`,
				error
			);
			toast({
				title: `Failed to ${editingStudent ? "update" : "create"} student`,
				description: "An error occurred. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleEdit = (student: Student) => {
		setEditingStudent(student);
		setIsDialogOpen(true);
	};

	const handleDelete = async (id: string) => {
		const response = await fetch(`/api/students?id=${id}`, {
			method: "DELETE",
		});

		if (response.ok) {
			fetchStudents();
			toast({
				title: "Student deleted successfully",
				description: "The student has been removed from the database.",
			});
		} else {
			console.error("Failed to delete student");
			toast({
				title: "Failed to delete student",
				description: "An error occurred. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleFileUpload = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			// Check file type
			const fileType = file.name.split(".").pop()?.toLowerCase();
			if (fileType !== "xlsx" && fileType !== "csv") {
				toast({
					title: "Invalid file type",
					description: "Please upload an Excel (.xlsx) or CSV file.",
					variant: "destructive",
				});
				return;
			}

			setIsUploading(true);

			const reader = new FileReader();
			reader.onload = async (event) => {
				try {
					const bstr = event.target?.result;
					const workbook = XLSX.read(bstr, { type: "binary" });
					const sheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[sheetName];
					const data = XLSX.utils.sheet_to_json(worksheet);

					const response = await fetch("/api/students/bulk", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(data),
					});

					const result = await response.json();

					if (response.ok) {
						toast({
							title: "Bulk upload completed",
							description: `${result.inserted} students added, ${result.updated} students updated.`,
						});
						if (result.errors && result.errors.length > 0) {
							console.error("Errors during bulk upload:", result.errors);
							toast({
								title: "Some records failed to upload",
								description: `${result.errors.length} records failed. Check the console for details.`,
								// default: "warning",
							});
						}
						if (result.duplicates && result.duplicates.length > 0) {
							console.error("Duplicate student IDs found:", result.duplicates);
							toast({
								title: "Duplicate student IDs found",
								description: `${result.duplicates.length} duplicate student IDs were found and skipped. Check the console for details.`,
								// default: "warning",
							});
						}
						fetchStudents();
					} else {
						throw new Error(result.error || "Bulk upload failed");
					}
				} catch (error) {
					console.error("Error during bulk upload:", error);
					toast({
						title: "Bulk upload failed",
						description:
							error instanceof Error
								? error.message
								: "An unexpected error occurred during the upload process. Please try again.",
						variant: "destructive",
					});
				} finally {
					setIsUploading(false);
					// Clear the file input
					e.target.value = "";
				}
			};
			reader.onerror = (error) => {
				console.error("FileReader error:", error);
				toast({
					title: "File reading error",
					description: "There was an error reading the file. Please try again.",
					variant: "destructive",
				});
				setIsUploading(false);
				// Clear the file input
				e.target.value = "";
			};
			reader.readAsBinaryString(file);
		},
		[toast, fetchStudents]
	);

	return (
		<div className="space-y-6 p-6 bg-gray-50 min-h-screen">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl font-bold tracking-tight text-gray-900">
					Students Management
				</h2>
				<div className="flex space-x-2">
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button
								onClick={() => setEditingStudent(null)}
								className="bg-blue-600 hover:bg-blue-700">
								<Plus className="mr-2 h-4 w-4" /> Add Student
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle className="text-2xl font-semibold">
									{editingStudent ? "Edit Student" : "Register New Student"}
								</DialogTitle>
							</DialogHeader>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="grid grid-cols-3 gap-4">
									<div>
										<Label htmlFor="firstName">First Name</Label>
										<Input
											id="firstName"
											name="firstName"
											value={
												editingStudent
													? editingStudent.firstName
													: newStudent.firstName
											}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div>
										<Label htmlFor="lastName">Last Name</Label>
										<Input
											id="lastName"
											name="lastName"
											value={
												editingStudent
													? editingStudent.lastName
													: newStudent.lastName
											}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div>
										<Label htmlFor="middleName">Middle Name (Optional)</Label>
										<Input
											id="middleName"
											name="middleName"
											value={
												editingStudent
													? editingStudent.middleName
													: newStudent.middleName
											}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="studentId">Student ID</Label>
										<Input
											id="studentId"
											name="studentId"
											value={
												editingStudent
													? editingStudent.studentId
													: newStudent.studentId
											}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div>
										<Label htmlFor="gender">Gender</Label>
										<Select
											onValueChange={handleSelectChange("gender")}
											value={
												editingStudent
													? editingStudent.gender
													: newStudent.gender
											}>
											<SelectTrigger>
												<SelectValue placeholder="Select Gender" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Male">Male</SelectItem>
												<SelectItem value="Female">Female</SelectItem>
												<SelectItem value="Other">Other</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<div className="grid grid-cols-3 gap-4">
									<div>
										<Label htmlFor="phone">Phone (Optional)</Label>
										<Input
											id="phone"
											name="phone"
											value={
												editingStudent ? editingStudent.phone : newStudent.phone
											}
											onChange={handleInputChange}
										/>
									</div>
									<div>
										<Label htmlFor="father_phone">Father's Phone</Label>
										<Input
											id="father_phone"
											name="father_phone"
											value={
												editingStudent
													? editingStudent.father_phone
													: newStudent.father_phone
											}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div>
										<Label htmlFor="mother_phone">Mother's Phone</Label>
										<Input
											id="mother_phone"
											name="mother_phone"
											value={
												editingStudent
													? editingStudent.mother_phone
													: newStudent.mother_phone
											}
											onChange={handleInputChange}
										/>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="branch">Branch</Label>
										<Input
											id="branch"
											name="branch"
											value={
												editingStudent
													? editingStudent.branch
													: newStudent.branch
											}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div>
										<Label htmlFor="grade">Grade</Label>
										<Input
											id="grade"
											name="grade"
											value={
												editingStudent ? editingStudent.grade : newStudent.grade
											}
											onChange={handleInputChange}
											required
										/>
									</div>
								</div>
								<div>
									<Label htmlFor="profileImage">
										Profile Image URL (Optional)
									</Label>
									<Input
										id="profileImage"
										name="profileImage"
										value={
											editingStudent
												? editingStudent.profileImage
												: newStudent.profileImage
										}
										onChange={handleInputChange}
									/>
								</div>
								<div>
									<Label htmlFor="status">Status</Label>
									<Select
										onValueChange={handleSelectChange("status")}
										value={
											editingStudent ? editingStudent.status : newStudent.status
										}>
										<SelectTrigger>
											<SelectValue placeholder="Select Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Active">Active</SelectItem>
											<SelectItem value="Inactive">Inactive</SelectItem>
											<SelectItem value="Suspended">Suspended</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<Button type="submit">
									{editingStudent ? "Update" : "Register"} Student
								</Button>
							</form>
							;
						</DialogContent>
					</Dialog>
					<Label htmlFor="file-upload" className="cursor-pointer">
						<Input
							id="file-upload"
							type="file"
							className="hidden"
							accept=".xlsx,.csv"
							onChange={handleFileUpload}
							disabled={isUploading}
						/>
						<Button
							variant="outline"
							className="cursor-pointer bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
							onClick={() => document.getElementById("file-upload")?.click()}
							disabled={isUploading}>
							{isUploading ? (
								<>
									<span className="animate-spin mr-2">⏳</span> Uploading...
								</>
							) : (
								<>
									<Upload className="mr-2 h-4 w-4" /> Bulk Upload
								</>
							)}
						</Button>
					</Label>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Student List</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center py-4">
						<Input
							placeholder="Search students..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="max-w-sm mr-2"
						/>
						<Button onClick={handleSearch} disabled={isLoading}>
							<Search className="mr-2 h-4 w-4" />
							Search
						</Button>
					</div>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Row</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Student ID</TableHead>
									<TableHead>Father's Phone</TableHead>
									<TableHead>Mother's Phone</TableHead>
									<TableHead>Branch</TableHead>
									<TableHead>Grade</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={9} className="text-center">
											Loading...
										</TableCell>
									</TableRow>
								) : students.length === 0 ? (
									<TableRow>
										<TableCell colSpan={9} className="text-center">
											No students found
										</TableCell>
									</TableRow>
								) : (
									students.map((student, index) => (
										<TableRow key={student.id}>
											<TableCell>
												{(currentPage - 1) * 10 + index + 1}
											</TableCell>
											<TableCell className="font-medium">{student?.middleName ? `${student.firstName} ${student?.middleName} ${student.lastName}` : `${student.firstName} ${student.lastName}`}</TableCell>
											<TableCell>{student.studentId}</TableCell>
											<TableCell>{student.father_phone || "N/A"}</TableCell>
											<TableCell>{student.mother_phone || "N/A"}</TableCell>
											<TableCell>{student.branch}</TableCell>
											<TableCell>{student.grade}</TableCell>
											<TableCell>
												<span
													className={`px-2 py-1 rounded-full text-xs font-semibold ${
														student.status === "Active"
															? "bg-green-100 text-green-800"
															: student.status === "Inactive"
															? "bg-gray-100 text-gray-800"
															: "bg-yellow-100 text-yellow-800"
													}`}>
													{student.status}
												</span>
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
														<DropdownMenuItem
															onClick={() => handleEdit(student)}>
															Edit
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleDelete(student.id)}>
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
					<div className="flex items-center justify-between mt-4">
						<div>
							Showing {students.length} of {totalCount} students
						</div>
						<div className="space-x-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								disabled={currentPage === 1 || isLoading}>
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() =>
									setCurrentPage((prev) => Math.min(prev + 1, totalPages))
								}
								disabled={currentPage === totalPages || isLoading}>
								Next
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
			{/* <Card className="shadow-lg">
				<CardHeader className="bg-gray-100">
					<CardTitle className="text-xl font-semibold text-gray-800">
						Student List
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center py-4">
						<div className="relative w-full max-w-sm">
							<Input
								placeholder="Search students..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 pr-4 py-2 w-full"
							/>
							<Search
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
								size={18}
							/>
						</div>
					</div>
					<div className="rounded-md border border-gray-200 overflow-hidden">
						<Table>
							<TableHeader className="bg-gray-50">
								<TableRow>
									<TableHead className="w-[100px] font-semibold">Row</TableHead>
									<TableHead className="font-semibold">Name</TableHead>
									<TableHead className="font-semibold">Student ID</TableHead>
									<TableHead className="font-semibold">
										Father's Phone
									</TableHead>
									<TableHead className="font-semibold">Branch</TableHead>
									<TableHead className="font-semibold">Grade</TableHead>
									<TableHead className="font-semibold">Status</TableHead>
									<TableHead className="text-right font-semibold">
										Actions
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{students.map((student, index) => (
									<TableRow key={student.id} className="hover:bg-gray-50">
										<TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
										<TableCell className="font-medium">{`${student.firstName} ${student.lastName}`}</TableCell>
										<TableCell>{student.studentId}</TableCell>
										<TableCell>{student.father_phone || "N/A"}</TableCell>
										<TableCell>{student.branch}</TableCell>
										<TableCell>{student.grade}</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs font-semibold ${
													student.status === "Active"
														? "bg-green-100 text-green-800"
														: student.status === "Inactive"
														? "bg-gray-100 text-gray-800"
														: "bg-yellow-100 text-yellow-800"
												}`}>
												{student.status}
											</span>
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
													<DropdownMenuItem onClick={() => handleEdit(student)}>
														Edit
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => handleDelete(student.id)}
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
							disabled={currentPage === 1}
							className="text-gray-600">
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
							disabled={currentPage === totalPages}
							className="text-gray-600">
							Next
						</Button>
					</div>
				</CardContent>
			</Card> */}
		</div>
	);
}
