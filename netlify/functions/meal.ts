import type { Config, Context } from '@netlify/functions'
import { createServerClient, getUserFromRequest, jsonError } from './_shared/supabase'

function withTags(rows: any[]) {
  return rows.map(({ meal_tags, ...meal }) => ({
    ...meal,
    tags: (meal_tags ?? []).map((mt: any) => mt.tags).filter(Boolean),
  }))
}

export default async function(req: Request, context: Context) {
  const user = await getUserFromRequest(req)
  if (!user) return jsonError('Unauthorized', 401)

  const { id } = context.params
  const supabase = createServerClient()

  if (req.method === 'PUT') {
    const body = await req.json()
    const { name, calorie_type, reference_calories, reference_grams, tag_ids } = body

    const { error: updateErr } = await supabase
      .from('meals')
      .update({
        name,
        calorie_type,
        reference_calories,
        reference_grams: calorie_type === 'per_gram' ? reference_grams : null,
      })
      .eq('id', id)
      .eq('user_id', user.id)
    if (updateErr) return jsonError(updateErr.message, 500)

    // Replace tag associations
    await supabase.from('meal_tags').delete().eq('meal_id', id)
    if (Array.isArray(tag_ids) && tag_ids.length > 0) {
      await supabase.from('meal_tags').insert(
        tag_ids.map((tag_id: string) => ({ meal_id: id, tag_id }))
      )
    }

    const { data: full, error: fullErr } = await supabase
      .from('meals')
      .select('*, meal_tags(tags(id, name))')
      .eq('id', id)
      .single()
    if (fullErr) return jsonError(fullErr.message, 500)
    if (!full) return jsonError('Meal not found', 404)

    return Response.json(withTags([full])[0])
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
