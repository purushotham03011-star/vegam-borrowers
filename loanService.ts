
import { createClient } from '@supabase/supabase-js';

// Configuration for Supabase with provided credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://rgwqodmmmhsxiwkbqkmc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd3FvZG1tbWhzeGl3a2Jxa21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNzY3ODcsImV4cCI6MjA5MTg1Mjc4N30.waFNI_Wq7auMP5lMdb67dEKeRaWcmAOEtm6CWUTPdRY';

export const supabase = createClient(supabaseUrl, supabaseKey);
