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
import { getAllPages } from "@/lib/data-service"
import type { Page } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2, Eye, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function AdminPageList() {
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageToDelete, setPageToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const data = await getAllPages()
        setPages(data)
      } catch (error) {
        console.error("Error fetching pages:", error)
        toast({
          title: "Error",
          description: "Failed to load pages",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPages()
  }, [toast])

  const handleTogglePublished = async (id: string, isPublished: boolean) => {
    try {
      // Update page status
      const updatedPages = pages.map((page) => (page.id === id ? { ...page, isPublished } : page))
      setPages(updatedPages)

      // Save to database (implementation needed)
      toast({
        title: "Page Updated",
        description: `Page ${isPublished ? "published" : "unpublished"} successfully`,
      })
    } catch (error) {
      console.error("Error updating page:", error)
      toast({
        title: "Error",
        description: "Failed to update page",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (pageToDelete) {
      try {
        // Delete page (implementation needed)
        setPages(pages.filter((page) => page.id !== pageToDelete))

        toast({
          title: "Page Deleted",
          description: "The page has been deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting page:", error)
        toast({
          title: "Error",
          description: "Failed to delete page",
          variant: "destructive",
        })
      } finally {
        setPageToDelete(null)
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
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No pages found. Create your first page!
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>{formatDate(page.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={page.isPublished}
                        onCheckedChange={(checked) => handleTogglePublished(page.id, checked)}
                      />
                      <Badge variant={page.isPublished ? "default" : "outline"}>
                        {page.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/${page.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/pages/edit/${page.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setPageToDelete(page.id)}>
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

      <AlertDialog open={!!pageToDelete} onOpenChange={() => setPageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the page.
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

