'use client'

import { useState } from 'react'
import { MapPinPlus } from 'lucide-react'
import AnnotationEditor from '@/components/AnnotationEditor'
import AnnotatedImage from '@/components/AnnotatedImage'
import { visibleCount, type Annotations } from '@/lib/annotations'
import { t, type Locale } from '@/lib/i18n'

/** ชี้จุดบนรูปที่รออนุมัติ — ค่าติดไปกับฟอร์มอนุมัติผ่าน hidden input */
export default function AnnotateField({
  imageUrl,
  code,
  locale = 'th',
}: {
  imageUrl: string
  code: string
  locale?: Locale
}) {
  const d = t(locale).annotate
  const [value, setValue] = useState<Annotations | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <input type="hidden" name="annotations" value={value ? JSON.stringify(value) : ''} />

      {value && (
        <AnnotatedImage
          src={imageUrl}
          alt=""
          data={value}
          maxHeight="20rem"
          className="rounded-xl border border-border"
        />
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-10 px-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary-soft text-primary text-sm font-medium active:scale-95 transition"
      >
        <MapPinPlus size={15} /> {value ? d.editCount(visibleCount(value)) : d.open}
      </button>

      {open && (
        <AnnotationEditor
          imageUrl={imageUrl}
          code={code}
          value={value}
          saveLabel={d.done}
          locale={locale}
          onClose={() => setOpen(false)}
          onSave={(v) => {
            setValue(v)
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}
