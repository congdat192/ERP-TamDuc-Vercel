import { createClient } from '@supabase/supabase-js';

// External Supabase for Storage only (avatar_customers bucket)
const EXTERNAL_SUPABASE_URL = 'https://kcirpjxbjqagrqrjfldu.supabase.co';
const EXTERNAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjaXJwanhianFhZ3JxcmpmbGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTI3NjgsImV4cCI6MjA3Mjk4ODc2OH0.GXxO7aPgF00WOkQ96z2J1P3K3BluPfBcais3h8qLr1I';

export const externalStorageClient = createClient(
  EXTERNAL_SUPABASE_URL,
  EXTERNAL_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false, // Auth vẫn dùng Lovable Cloud
      autoRefreshToken: false
    }
  }
);

console.log('[ExternalStorageClient] Initialized for avatar_customers bucket');
