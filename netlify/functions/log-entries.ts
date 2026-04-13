import type { Config } from '@netlify/functions'
import { createServerClient, getUserFromRequest, jsonError } from './_shared/supabase'

export default async function(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return jsonError('Unauthorized', 401)

  const supabase = createServerClient()

  if (req.method === 'GET') {
    const url = new URL(req.url)
    const date = url.searchParams.get('date')
    if (!date) return jsonError('date query param required', 400)

    const { data, error } = await supabase
      .from('log_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('log_date', date)
      .order('created_at')
    if (error) return jsonError(error.message, 500)
    return Response.json(data)
  }

  if (req.method === 'POST') {
    const body = await req.json()
    const { log_date, meal_id, meal_name, calorie_type, grams, calories } = body

    if (!log_date || !meal_name || !calorie_type || calories == null) {
      return jsonError('Missing required fields', 400)
    }

    // Ensure profile exists
    await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id' })

    const { data, error } = await supabase
      .from('log_entries')
      .insert({
        user_id: user.id,
        log_date,
        meal_id: meal_id || null,
        meal_name,
        calorie_type,
        grams: grams || null,
        calories,
      })
      .select()
      .single()
    if (error) return jsonError(error.message, 500)
    return Response.json(data, { status: 201 })
  }

  return jsonError('Method not allowed', 405)
}

export const config: Config = { path: '/api/log-entries' }
