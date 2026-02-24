'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface BenefitQRCodeProps {
  value: string
  size?: number
}

export function BenefitQRCode({ value, size = 200 }: BenefitQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: { dark: '#1B3A5C', light: '#FFFFFF' },
    })
  }, [value, size])

  return <canvas ref={canvasRef} className="rounded-lg" />
}
