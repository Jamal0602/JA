"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { getAllWidgets } from "@/lib/data-service"
import type { Widget } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2, Loader2 } from "lucide-react"

export default function AdminWidgetList() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [widgetToDelete, setWidgetToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const data = await getAllWidgets()
        setWidgets(data)
      } catch (error) {
        console.error("Error fetching widgets:", error)
        toast({
          title: "Error",
          description: "Failed to load widgets",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWidgets()
  }, [toast])

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      // Update widget status
      const updatedWidgets = widgets.map((widget) => (widget.id === id ? { ...widget, isActive } : widget))
      setWidgets(updatedWidgets)

      // Save to database (implementation needed)
      toast({
        title: "Widget Updated",
        description: `Widget ${isActive ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating widget:", error)
      toast({
        title: "Error",
        description: "Failed to update widget",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (widgetToDelete) {
      try {
        // Delete widget (implementation needed)
        setWidgets(widgets.filter((widget) => widget.id !== widgetToDelete))

        toast({
          title: "Widget Deleted",
          description: "The widget has been deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting widget:", error)
        toast({
          title: "Error",
          description: "Failed to delete widget",
          variant: "destructive",
        })
      } finally {
        setWidgetToDelete(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {widgets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No widgets found. Create your first widget!
                </TableCell>
              </TableRow>
            ) : (
              widgets.map((widget) => (
                <TableRow key={widget.id}>
                  <TableCell className="font-medium">{widget.name}</TableCell>
                  <TableCell>{widget.type}</TableCell>
                  <TableCell>{widget.position}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={widget.isActive}
                        onCheckedChange={(checked) => handleToggleActive(widget.id, checked)}
                      />
                      <Badge variant={widget.isActive ? "default" : "outline"}>
                        {widget.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/widgets/edit/${widget.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setWidgetToDelete(widget.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!widgetToDelete} onOpenChange={() => setWidgetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the widget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

