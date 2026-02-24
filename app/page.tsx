// Root page — redirected to /el by next.config.mjs redirect rule
// This file is kept as a fallback only
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/el')
}
