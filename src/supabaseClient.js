import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yfkpjzobpeuxjdnggjnh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlma3Bqem9icGV1eGpkbmdnam5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMDk2MzUsImV4cCI6MjA5NDc4NTYzNX0.MpH3aec-AW8qBrxyq2iLN1V9wfSIstSZLP3CIKGPdS4'
export const supabase = createClient(supabaseUrl, supabaseKey);