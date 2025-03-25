"use client"
import { useRouter } from "next/navigation"
import PageEditor from "@/components/page-editor"

export default function EditPagePage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

  return <PageEditor pageId={id} />
}

