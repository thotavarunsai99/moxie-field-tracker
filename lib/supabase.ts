import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://mpxdjamftzehzagyryrl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1weGRqYW1mdHplaHphZ3lyeXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyOTU1NzYsImV4cCI6MjExMDg3MTU3Nn0.TR8Xq4bPdom_sPWCaZeSwP_o4kFIEGEOyEMbS9U--0Y'
)

export type Job = {
  id: string
  technician_name: string
  customer_name: string
  address: string
  service_type: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  scheduled_date: string
  notes: string | null
  created_at: string
}
