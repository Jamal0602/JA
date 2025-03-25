"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
import { getAllDomains } from "@/lib/data-service"
import type { Domain } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Edit, Trash2, ExternalLink, Loader2 } from "lucide-react"

export default function AdminDomains() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [domainToDelete, setDomainToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const data = await getAllDomains()
        setDomains(data)
      } catch (error) {
        console.error("Error fetching domains:", error)
        toast({
          title: "Error",
          description: "Failed to load domains",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDomains()
  }, [toast])

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      // Update domain status
      const updatedDomains = domains.map((domain) => (domain.id === id ? { ...domain, isActive } : domain))
      setDomains(updatedDomains)

      // Save to database (implementation needed)
      toast({
        title: "Domain Updated",
        description: `Domain ${isActive ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      console.error("Error updating domain:", error)
      toast({
        title: "Error",
        description: "Failed to update domain",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (domainToDelete) {
      try {
        // Delete domain (implementation needed)
        setDomains(domains.filter((domain) => domain.id !== domainToDelete))

        toast({
          title: "Domain Deleted",
          description: "The domain has been deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting domain:", error)
        toast({
          title: "Error",
          description: "Failed to delete domain",
          variant: "destructive",
        })
      } finally {
        setDomainToDelete(null)
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
              <TableHead className="w-[50px]">Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No domains found. Add your first domain!
                </TableCell>
              </TableRow>
            ) : (
              domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell>
                    <div className="relative w-8 h-8 rounded overflow-hidden">
                      <Image
                        src={domain.icon || "/placeholder.svg?height=32&width=32"}
                        alt={domain.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{domain.name}</TableCell>
                  <TableCell>
                    <a
                      href={domain.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:underline text-primary"
                    >
                      {domain.url}
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={domain.isActive}
                        onCheckedChange={(checked) => handleToggleActive(domain.id, checked)}
                      />
                      <Badge variant={domain.isActive ? "default" : "outline"}>
                        {domain.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/domains/edit/${domain.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDomainToDelete(domain.id)}>
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

      <AlertDialog open={!!domainToDelete} onOpenChange={() => setDomainToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the domain.
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

