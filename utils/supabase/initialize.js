require("dotenv").config();
const { createClient } = require('@supabase/supabase-js');


const options = {
  schema: 'public',
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true
}
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANNON_KEY, options)

module.exports = supabase;