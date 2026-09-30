'use client'

import { Printer } from 'lucide-react'

export default function PrintButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print h-11 px-5 inline-flex items-center gap-2 rounded-full bg-primary text-white text-sm font-medium active:scale-95 transition"
    >
      <Printer size={16} /> {label}
    </button>
  )
}
