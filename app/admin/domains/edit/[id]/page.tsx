"use client"
import { useRouter } from "next/navigation"
import DomainEditor from "@/components/domain-editor"

export default function EditDomainPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()

  return <DomainEditor domainId={id} />
}

