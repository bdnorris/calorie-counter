import type { Config } from '@netlify/functions'
import { createServerClient, getUserFromRequest, jsonError } from './_shared/supabase'

export default async function(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return jsonError('Unauthorized', 401)

  const supabase = createServerClient()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .order('name')
    if (error) return jsonError(error.message, 500)
    return Response.json(data)
  }

  if (req.method === 'POST') {
    const body = await req.json()
    const { name, calorie_type, reference_calories, reference_grams } = body

    if (!name || !calorie_type || reference_calories == null) {
      return jsonError('Missing required fields', 400)
    }
    if (calorie_type === 'per_gram' && !reference_grams) {
      return jsonError('reference_grams required for per_gram meals', 400)
    }

    // Ensure profile exists
    await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id' })

    const { data, error } = await supabase
      .from('meals')
      .insert({
        user_id: user.id,
        name,
        calorie_type,
        reference_calories,
        reference_grams: calorie_type === 'per_gram' ? reference_grams : null,
      })
      .select()
      .single()
    if (error) return jsonError(error.message, 500)
    return Response.json(data, { status: 201 })
  }

  return jsonError('Method not allowed', 405)
}

export const config: Config = { path: '/api/meals' }
