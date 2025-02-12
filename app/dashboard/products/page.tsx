"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface Student {
  id: string
  firstName: string
  lastName: string
  studentId: string
}

interface Item {
  id: string
  name: string
  price: number
  school: { id: string, schoolId:string}
}

interface Product {
  id: string
  item: { name: string; price: number }
  student: { firstName: string; lastName: string; studentId: string }
  quantity: number
  totalPrice: number
  billerReferenceNumber: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [newProduct, setNewProduct] = useState({
    studentId: "",
    itemId: "",
    quantity: "1",
  })
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [availableItems, setAvailableItems] = useState<Item[]>([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [alert, setAlert] = useState({ show: false, message: "", type: "" })
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
    fetchItems()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    }
  }

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items")
      if (!response.ok) {
        throw new Error("Failed to fetch items")
      }
      const data = await response.json()
      setItems(data.items)
    } catch (error) {
      console.error("Error fetching items:", error)
      toast({
        title: "Error",
        description: "Failed to fetch items. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProduct({ ...newProduct, [name]: value })

    if (name === "quantity" || name === "itemId") {
      calculateTotalPrice(newProduct.itemId, value)
    }
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setNewProduct({ ...newProduct, [name]: value })
    if (name === "itemId") {
      calculateTotalPrice(value, newProduct.quantity)
    }
  }

  const calculateTotalPrice = (itemId: string, quantity: string) => {
    const selectedItem = items.find((item) => item.id === itemId)
    if (selectedItem) {
      setTotalPrice(selectedItem.price * Number.parseInt(quantity))
    }
  }

  const checkStudent = async () => {
    try {
      const response = await fetch(`/api/students?studentId=${newProduct.studentId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch student")
      }
      const data = await response.json()
      if (data) {
        setSelectedStudent(data)
        const schoolId = data.studentId.substring(0, 4) 
        console.log({
          schoolId
        })
        const filteredItems = items.filter((item) => item.school.schoolId === schoolId)
        setAvailableItems(filteredItems)
        setAlert({ show: true, message: "Student found. Items loaded.", type: "success" })
      } else {
        setSelectedStudent(null)
        setAvailableItems([])
        setAlert({ show: true, message: "Student not found.", type: "error" })
      }
    } catch (error) {
      console.error("Error checking student:", error)
      setAlert({ show: true, message: "Error checking student. Please try again.", type: "error" })
    }
  }

  const generateBillerReferenceNumber = () => {
    return `BRN${Date.now()}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedStudent) {
      const product = {
        studentId: selectedStudent.id,
        itemId: newProduct.itemId,
        quantity: Number.parseInt(newProduct.quantity),
        totalPrice: totalPrice,
        billerReferenceNumber: generateBillerReferenceNumber(),
      }
      try {
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        })
        if (!response.ok) {
          throw new Error("Failed to create product")
        }
        setNewProduct({ studentId: "", itemId: "", quantity: "1" })
        setSelectedStudent(null)
        setAvailableItems([])
        setTotalPrice(0)
        fetchProducts()
        toast({
          title: "Success",
          description: "Product created successfully.",
        })
      } catch (error) {
        console.error("Error creating product:", error)
        toast({
          title: "Error",
          description: "Failed to create product. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      setAlert({ show: true, message: "Please check student and select an item before submitting.", type: "error" })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
      {alert.show && (
        <Alert className={alert.type === "error" ? "bg-red-100" : "bg-green-100"}>
          <AlertTitle>{alert.type === "error" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  value={newProduct.studentId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="button" onClick={checkStudent}>
                Check Student
              </Button>
            </div>
            {selectedStudent && (
              <div className="p-4 bg-blue-50 rounded-md">
                <p className="font-medium">
                  Student: {selectedStudent.firstName} {selectedStudent.lastName}
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="itemId">Item</Label>
              <Select onValueChange={handleSelectChange("itemId")} value={newProduct.itemId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Item" />
                </SelectTrigger>
                <SelectContent>
                  {availableItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} - ${item.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={newProduct.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            {totalPrice > 0 && (
              <div className="p-4 bg-gray-50 rounded-md">
                <Label>Total Price</Label>
                <div className="text-2xl font-bold">${totalPrice.toFixed(2)}</div>
              </div>
            )}
            <Button type="submit">Create Product</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Biller Reference Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{`${product.student.firstName} ${product.student.lastName} (${product.student.studentId})`}</TableCell>
                  <TableCell>{product.item.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${product.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{product.billerReferenceNumber}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

