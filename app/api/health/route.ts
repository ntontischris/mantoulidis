import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const checks: Record<string, string> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? 'unknown',
    database: 'unknown',
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').select('id').limit(1)
    checks['database'] = error ? 'error' : 'ok'
  } catch {
    checks['database'] = 'error'
    checks['status'] = 'degraded'
  }

  const statusCode = checks['status'] === 'ok' ? 200 : 503
  return NextResponse.json(checks, { status: statusCode })
}
