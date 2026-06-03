import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffjnldlguyewuojppvrf.supabase.co';
const supabaseAnonKey = 'sb_publishable_dCLMcfV8WTMeq1yza-bNtg_F-AxJuAH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
