import {createClient} from '@supabase/supabase-js';
export const sb=createClient(import.meta.env.VITE_SUPABASE_URL||'https://missing.supabase.co',import.meta.env.VITE_SUPABASE_ANON_KEY||'missing');