import type { Config, Context } from '@netlify/functions'
import { createServerClient, getUserFromRequest, jsonError } from './_shared/supabase'

export default async function(req: Request, context: Context) {
  const user = await getUserFromRequest(req)
  if (!user) return jsonError('Unauthorized', 401)

  if (req.method !== 'DELETE') return jsonError('Method not allowed', 405)

  const { id } = context.params
  const supabase = createServerClient()

  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  if (error) return jsonError(error.message, 500)
  return new Response(null, { status: 204 })
}

export const config: Config = { path: '/api/tags/:id' }
