export interface Profile {
  id: string
  daily_calorie_goal: number
  created_at: string
}

export interface Tag {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface Meal {
  id: string
  user_id: string
  name: string
  calorie_type: 'per_gram' | 'flat'
  reference_calories: number
  reference_grams: number | null
  tags: Tag[]
  created_at: string
}

export interface MealInput {
  name: string
  calorie_type: 'per_gram' | 'flat'
  reference_calories: number
  reference_grams: number | null
  tag_ids: string[]
}

export interface LogEntry {
  id: string
  user_id: string
  log_date: string
  meal_id: string | null
  meal_name: string
  calorie_type: 'per_gram' | 'flat' | 'arbitrary'
  grams: number | null
  calories: number
  created_at: string
}

export interface DaySummary {
  log_date: string
  total_calories: number
  entry_count: number
}
