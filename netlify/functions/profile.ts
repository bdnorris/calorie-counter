import type { Config } from '@netlify/functions'
import { createServerClient, getUserFromRequest, jsonError } from './_shared/supabase'

export default async function(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return jsonError('Unauthorized', 401)

  const supabase = createServerClient()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error && error.code === 'PGRST116') {
      // Profile doesn't exist yet — create it
      const { data: created, error: createError } = await supabase
        .from('profiles')
        .insert({ id: user.id })
        .select()
        .single()
      if (createError) return jsonError(createError.message, 500)
      return Response.json(created)
    }
    if (error) return jsonError(error.message, 500)
    return Response.json(data)
  }

  if (req.method === 'PUT') {
    const body = await req.json()
    const { daily_calorie_goal } = body
    if (!daily_calorie_goal || daily_calorie_goal < 1) {
      return jsonError('daily_calorie_goal must be a positive number', 400)
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, daily_calorie_goal })
      .select()
      .single()
    if (error) return jsonError(error.message, 500)
    return Response.json(data)
  }

  return jsonError('Method not allowed', 405)
}

export const config: Config = { path: '/api/profile' }
