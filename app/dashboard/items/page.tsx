"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface Item {
  id: string
  name: string
  price: number
  school: { id: string; name: string }
}

interface School {
  id: string
  name: string
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [schools, setSchools] = useState<School[]>([])
  const [newItem, setNewItem] = useState<Omit<Item, "id" | "school"> & { schoolId: string }>({
    name: "",
    price: 0,
    schoolId: "",
  })
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchItems()
  }, [currentPage, searchTerm])

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchItems = async () => {
    const response = await fetch(`/api/items?page=${currentPage}&limit=10&search=${searchTerm}`)
    const data = await response.json()
    setItems(data.items)
    setTotalPages(data.totalPages)
  }

  const fetchSchools = async () => {
    const response = await fetch("/api/schools")
    const data = await response.json()
    setSchools(data.schools)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingItem) {
      setEditingItem({ ...editingItem, [name]: name === "price" ? Number.parseFloat(value) : value })
    } else {
      setNewItem({ ...newItem, [name]: name === "price" ? Number.parseFloat(value) : value })
    }
  }

  const handleSelectChange = (value: string) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, school: { ...editingItem.school, id: value } })
    } else {
      setNewItem({ ...newItem, schoolId: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingItem ? "/api/items" : "/api/items"
    const method = editingItem ? "PUT" : "POST"
    const body = editingItem ? { ...editingItem, schoolId: editingItem.school.id } : newItem

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      fetchItems()
      setIsDialogOpen(false)
      setEditingItem(null)
      setNewItem({ name: "", price: 0, schoolId: "" })
      toast({
        title: `Item ${editingItem ? "updated" : "created"} successfully`,
        description: `The item has been ${editingItem ? "updated" : "added"} to the database.`,
      })
    } else {
      console.error(`Failed to ${editingItem ? "update" : "create"} item`)
      toast({
        title: `Failed to ${editingItem ? "update" : "create"} item`,
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/items?id=${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      fetchItems()
      toast({
        title: "Item deleted successfully",
        description: "The item has been removed from the database.",
      })
    } else {
      console.error("Failed to delete item")
      toast({
        title: "Failed to delete item",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Items</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={editingItem ? editingItem.name : newItem.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={editingItem ? editingItem.price : newItem.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="schoolId">School</Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={editingItem ? editingItem.school.id : newItem.schoolId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">{editingItem ? "Update" : "Add"} Item</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4">
            <Input
              placeholder="Search items..."
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
                  <TableHead>Price</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>ETB {item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.school.name}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleEdit(item)}>Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(item.id)}>Delete</DropdownMenuItem>
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

