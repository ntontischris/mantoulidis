'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { UploadProgress } from '../types'

interface PhotoUploadZoneProps {
  uploads: UploadProgress[]
  onFilesSelected: (files: File[]) => void
  onClear: () => void
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB = 10

export function PhotoUploadZone({ uploads, onFilesSelected, onClear }: PhotoUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const valid = Array.from(fileList).filter(
      (f) => ACCEPTED.includes(f.type) && f.size <= MAX_SIZE_MB * 1024 * 1024
    )
    if (valid.length > 0) onFilesSelected(valid)
  }

  const isUploading = uploads.some((u) => u.status === 'uploading')
  const allDone = uploads.length > 0 && uploads.every((u) => u.status === 'done' || u.status === 'error')

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
        } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <span className="text-4xl">📷</span>
        <div className="text-center">
          <p className="font-medium text-foreground">Σύρτε φωτογραφίες εδώ</p>
          <p className="text-sm text-muted-foreground">ή κάντε κλικ για επιλογή</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP, GIF — έως {MAX_SIZE_MB}MB</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Upload progress list */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm truncate max-w-[200px]">{upload.file.name}</span>
                <span className="text-xs shrink-0">
                  {upload.status === 'done' && <span className="text-primary">✓ Ολοκληρώθηκε</span>}
                  {upload.status === 'error' && <span className="text-destructive">✗ Σφάλμα</span>}
                  {upload.status === 'uploading' && <span className="text-muted-foreground">{upload.progress}%</span>}
                  {upload.status === 'pending' && <span className="text-muted-foreground">Αναμονή...</span>}
                </span>
              </div>
              <Progress
                value={upload.progress}
                className={`h-1.5 ${upload.status === 'error' ? '[&>div]:bg-destructive' : upload.status === 'done' ? '[&>div]:bg-primary' : ''}`}
              />
              {upload.error && (
                <p className="text-xs text-destructive mt-1">{upload.error}</p>
              )}
            </div>
          ))}

          {allDone && (
            <Button variant="outline" size="sm" onClick={onClear}>
              Εκκαθάριση
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
