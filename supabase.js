
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://kdzoyszgudzatxlogwtb.supabase.co/rest/v1/';
const supabaseKey = 'sb_publishable_36WCeqYLD3fp6z-uWUcVyQ_0hjKY6_E';

export const supabase = createClient(supabaseUrl, supabaseKey);
