
import { createClient } from '@supabase/supabase-js';

// Configuration for Supabase with provided credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://svmwqxrbenhflyaxowvz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bXdxeHJiZW5oZmx5YXhvd3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODcwOTcsImV4cCI6MjA5MzQ2MzA5N30.7l3PEl1PVaheHH1WufSYG24CyLNrDiaEJZEuI7M-VSo';

export const supabase = createClient(supabaseUrl, supabaseKey);
