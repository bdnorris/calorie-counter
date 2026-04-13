import type { Config, Context } from '@netlify/functions'
import { createServerClient, getUserFromRequest, jsonError } from './_shared/supabase'

export default async function(req: Request, context: Context) {
  const user = await getUserFromRequest(req)
  if (!user) return jsonError('Unauthorized', 401)

  const { id } = context.params
  const supabase = createServerClient()

  if (req.method === 'PUT') {
    const body = await req.json()
    const { name, calorie_type, reference_calories, reference_grams } = body

    const { data, error } = await supabase
      .from('meals')
      .update({
        name,
        calorie_type,
        reference_calories,
        reference_grams: calorie_type === 'per_gram' ? reference_grams : null,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    if (error) return jsonError(error.message, 500)
    if (!data) return jsonError('Meal not found', 404)
    return Response.json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('meals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (error) return jsonError(error.message, 500)
    return new Response(null, { status: 204 })
  }

  return jsonError('Method not allowed', 405)
}

export const config: Config = { path: '/api/meals/:id' }
