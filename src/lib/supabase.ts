import { createClient } from '@supabase/supabase-js';

// Initialize database client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gwmeypgfdbzaesnppeng.databasepad.com';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijg5ODZhZmY1LWJhN2EtNDEyMy05NTM2LWZjNmQ5ODVlZTM5ZiJ9.eyJwcm9qZWN0SWQiOiJnd21leXBnZmRiemFlc25wcGVuZyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY1OTgxMTk3LCJleHAiOjIwODEzNDExOTcsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.TjgMbw93yqo6Mi7wLDGPC6qUeG6Un1q6GVtYksNxDp8';

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };