"use client"
import { useRouter } from "next/navigation"
import PageEditor from "@/components/page-editor"

export default function NewPagePage() {
  const router = useRouter()

  return <PageEditor isNew={true} />
}

