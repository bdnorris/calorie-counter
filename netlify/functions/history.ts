import type { Config } from '@netlify/functions'
import { createServerClient, getUserFromRequest, jsonError } from './_shared/supabase'

function getTodayString() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export default async function(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return jsonError('Unauthorized', 401)

  const supabase = createServerClient()
  const today = getTodayString()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('log_entries')
      .select('log_date, calories')
      .eq('user_id', user.id)
      .lt('log_date', today)
      .order('log_date', { ascending: false })
    if (error) return jsonError(error.message, 500)

    // Group by date and sum calories
    const byDate = new Map<string, { total_calories: number; entry_count: number }>()
    for (const row of data ?? []) {
      const existing = byDate.get(row.log_date) ?? { total_calories: 0, entry_count: 0 }
      existing.total_calories += Number(row.calories)
      existing.entry_count += 1
      byDate.set(row.log_date, existing)
    }

    const summaries = Array.from(byDate.entries()).map(([log_date, stats]) => ({
      log_date,
      ...stats,
    }))

    return Response.json(summaries)
  }

  if (req.method === 'DELETE') {
    // Clear all past history (keep today's entries)
    const { error } = await supabase
      .from('log_entries')
      .delete()
      .eq('user_id', user.id)
      .lt('log_date', today)
    if (error) return jsonError(error.message, 500)
    return new Response(null, { status: 204 })
  }

  return jsonError('Method not allowed', 405)
}

export const config: Config = { path: '/api/history' }
