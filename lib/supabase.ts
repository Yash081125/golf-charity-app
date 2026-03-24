import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mbemnprvtatzrpfwwtdx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZW1ucHJ2dGF0enJwZnd3dGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzODAxOTgsImV4cCI6MjA4OTk1NjE5OH0.yJx86DojgJ6vq0uOzTnK_oVg0z_nhJPKBS-dbwGI2iw"

export const supabase = createClient(supabaseUrl, supabaseKey)