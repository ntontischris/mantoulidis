import Image from 'next/image'
import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  src?: string | null
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  xs: { container: 'h-6 w-6 text-xs', image: 24 },
  sm: { container: 'h-8 w-8 text-sm', image: 32 },
  md: { container: 'h-10 w-10 text-sm', image: 40 },
  lg: { container: 'h-14 w-14 text-base', image: 56 },
  xl: { container: 'h-20 w-20 text-lg', image: 80 },
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const { container, image } = sizes[size]

  if (src) {
    return (
      <div className={cn('relative overflow-hidden rounded-full', container, className)}>
        <Image
          src={src}
          alt={name}
          width={image}
          height={image}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground',
        container,
        className
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
