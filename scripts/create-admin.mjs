import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const email = process.argv[2] ?? 'admin@kelurahan.local'
const password = process.argv[3] ?? 'ChangeMe123!'

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})

if (error) {
  console.error('Gagal bikin admin user:', error.message)
  process.exit(1)
}

console.log('Admin user dibuat:', data.user.email)
