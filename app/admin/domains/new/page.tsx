"use client"
import { useRouter } from "next/navigation"
import DomainEditor from "@/components/domain-editor"

export default function NewDomainPage() {
  const router = useRouter()

  return <DomainEditor isNew={true} />
}

