import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://oycsjhformyuenpdxgtu.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQzMDI3NjQ2LCJleHAiOjE5NTg2MDM2NDZ9.RXRH2XeE37bK6WMlZdbShPghmuAl2yvPDJbKXaUYekY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)