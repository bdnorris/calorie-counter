import type { Config } from '@netlify/functions'
import { createServerClient, getUserFromRequest, jsonError } from './_shared/supabase'

function withTags(rows: any[]) {
  return rows.map(({ meal_tags, ...meal }) => ({
    ...meal,
    tags: (meal_tags ?? []).map((mt: any) => mt.tags).filter(Boolean),
  }))
}

export default async function(req: Request) {
  const user = await getUserFromRequest(req)
  if (!user) return jsonError('Unauthorized', 401)

  const supabase = createServerClient()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('meals')
      .select('*, meal_tags(tags(id, name))')
      .eq('user_id', user.id)
      .order('name')
    if (error) return jsonError(error.message, 500)
    return Response.json(withTags(data ?? []))
  }

  if (req.method === 'POST') {
    const body = await req.json()
    const { name, calorie_type, reference_calories, reference_grams, tag_ids } = body

    if (!name || !calorie_type || reference_calories == null) {
      return jsonError('Missing required fields', 400)
    }
    if (calorie_type === 'per_gram' && !reference_grams) {
      return jsonError('reference_grams required for per_gram meals', 400)
    }

    await supabase.from('profiles').upsert({ id: user.id }, { onConflict: 'id' })

    const { data: meal, error: mealErr } = await supabase
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
    if (mealErr) return jsonError(mealErr.message, 500)

    if (Array.isArray(tag_ids) && tag_ids.length > 0) {
      await supabase.from('meal_tags').insert(
        tag_ids.map((tag_id: string) => ({ meal_id: meal.id, tag_id }))
      )
    }

    const { data: full, error: fullErr } = await supabase
      .from('meals')
      .select('*, meal_tags(tags(id, name))')
      .eq('id', meal.id)
      .single()
    if (fullErr) return jsonError(fullErr.message, 500)

    return Response.json(withTags([full])[0], { status: 201 })
  }

  return jsonError('Method not allowed', 405)
}

export const config: Config = { path: '/api/meals' }
