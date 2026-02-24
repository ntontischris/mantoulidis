'use client'

interface DirectoryViewToggleProps {
  view: 'grid' | 'list'
  onChange: (view: 'grid' | 'list') => void
}

export function DirectoryViewToggle({ view, onChange }: DirectoryViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border p-1">
      <button
        onClick={() => onChange('grid')}
        aria-label="Grid view"
        className={`rounded-md p-1.5 transition-colors ${
          view === 'grid'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {/* Grid icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="1" width="6" height="6" rx="1" />
          <rect x="9" y="1" width="6" height="6" rx="1" />
          <rect x="1" y="9" width="6" height="6" rx="1" />
          <rect x="9" y="9" width="6" height="6" rx="1" />
        </svg>
      </button>
      <button
        onClick={() => onChange('list')}
        aria-label="List view"
        className={`rounded-md p-1.5 transition-colors ${
          view === 'list'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {/* List icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="1" y="2" width="14" height="2" rx="1" />
          <rect x="1" y="7" width="14" height="2" rx="1" />
          <rect x="1" y="12" width="14" height="2" rx="1" />
        </svg>
      </button>
    </div>
  )
}
