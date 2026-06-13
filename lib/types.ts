export interface Gift {
  id: string
  name: string
  description: string | null
  price: number | null
  image_url: string | null
  store_url: string | null
  is_reserved: boolean
  reserved_by?: string | null
  sort_order: number
  created_at: string
}

export interface AppConfig {
  key: string
  value: string
}
