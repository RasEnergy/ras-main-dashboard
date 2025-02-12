"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface School {
  id: string
  name: string
  businessEmail: string
  schoolId: string
  location: string
  businessPhone: string
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [newSchool, setNewSchool] = useState<Omit<School, "id">>({
    name: "",
    businessEmail: "",
    schoolId: "",
    location: "",
    businessPhone: "",
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchSchools()
  }, [currentPage]) // Removed unnecessary dependency: searchTerm

  const fetchSchools = async () => {
    const response = await fetch(`/api/schools?page=${currentPage}&limit=10&search=${searchTerm}`)
    const data = await response.json()
    setSchools(data.schools)
    setTotalPages(data.totalPages)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingSchool) {
      setEditingSchool({ ...editingSchool, [name]: value })
    } else {
      setNewSchool({ ...newSchool, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingSchool ? "/api/schools" : "/api/schools"
    const method = editingSchool ? "PUT" : "POST"
    const body = editingSchool ? editingSchool : newSchool

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      fetchSchools()
      setIsDialogOpen(false)
      setEditingSchool(null)
      setNewSchool({
        name: "",
        businessEmail: "",
        schoolId: "",
        location: "",
        businessPhone: "",
      })
      toast({
        title: `School ${editingSchool ? "updated" : "created"} successfully`,
        description: `The school has been ${editingSchool ? "updated" : "added"} to the database.`,
      })
    } else {
      console.error(`Failed to ${editingSchool ? "update" : "create"} school`)
      toast({
        title: `Failed to ${editingSchool ? "update" : "create"} school`,
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (school: School) => {
    setEditingSchool(school)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/schools?id=${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      fetchSchools()
      toast({
        title: "School deleted successfully",
        description: "The school has been removed from the database.",
      })
    } else {
      console.error("Failed to delete school")
      toast({
        title: "Failed to delete school",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Schools</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSchool(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add School
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSchool ? "Edit School" : "Register New School"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">School Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editingSchool ? editingSchool.name : newSchool.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input
                  id="businessEmail"
                  name="businessEmail"
                  type="email"
                  value={editingSchool ? editingSchool.businessEmail : newSchool.businessEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="schoolId">School ID</Label>
                <Input
                  id="schoolId"
                  name="schoolId"
                  value={editingSchool ? editingSchool.schoolId : newSchool.schoolId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={editingSchool ? editingSchool.location : newSchool.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessPhone">Business Phone</Label>
                <Input
                  id="businessPhone"
                  name="businessPhone"
                  value={editingSchool ? editingSchool.businessPhone : newSchool.businessPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit">{editingSchool ? "Update" : "Register"} School</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Search schools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Row</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Business Email</TableHead>
                  <TableHead>School ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Business Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schools.map((school, index) => (
                  <TableRow key={school.id}>
                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                    <TableCell className="font-medium">{school.name}</TableCell>
                    <TableCell>{school.businessEmail}</TableCell>
                    <TableCell>{school.schoolId}</TableCell>
                    <TableCell>{school.location}</TableCell>
                    <TableCell>{school.businessPhone}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(school)}>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(school.id)}>Delete</DropdownMenuItem>
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
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

