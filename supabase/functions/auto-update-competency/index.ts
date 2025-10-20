import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateCompetencyPayload {
  enrollment_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🎯 [auto-update-competency] Starting...');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { enrollment_id }: UpdateCompetencyPayload = await req.json();

    // Get enrollment with program details
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('training_enrollments')
      .select(`
        *,
        training_programs(
          competency_name,
          target_competency_level,
          min_score_for_competency_up,
          title
        )
      `)
      .eq('id', enrollment_id)
      .single();

    if (enrollmentError || !enrollment) {
      throw new Error(`Enrollment not found: ${enrollmentError?.message}`);
    }

    const program = enrollment.training_programs as any;

    // Check if program has competency mapping
    if (!program.competency_name) {
      console.log('⚠️ Program has no competency mapping, skipping');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No competency mapping for this program' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if final score meets threshold
    const minScore = program.min_score_for_competency_up || 85;
    if (!enrollment.final_score || enrollment.final_score < minScore) {
      console.log(`⚠️ Score ${enrollment.final_score} < ${minScore}, not updating competency`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Score too low (${enrollment.final_score} < ${minScore})` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get current competency level
    const { data: currentCompetency } = await supabaseAdmin
      .from('training_competencies')
      .select('current_level')
      .eq('employee_id', enrollment.employee_id)
      .eq('competency_name', program.competency_name)
      .maybeSingle();

    const currentLevel = currentCompetency?.current_level || 0;
    const targetLevel = program.target_competency_level;

    // Only update if target level is higher than current
    if (targetLevel <= currentLevel) {
      console.log(`⚠️ Target level ${targetLevel} <= current level ${currentLevel}, skipping`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Already at or above target level' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Upsert competency
    const { error: upsertError } = await supabaseAdmin
      .from('training_competencies')
      .upsert({
        employee_id: enrollment.employee_id,
        competency_name: program.competency_name,
        competency_category: (enrollment.training_programs as any).course_category,
        current_level: targetLevel,
        assessment_date: new Date().toISOString(),
        assessed_by: null, // Auto-updated by system
        assessment_note: `Tự động nâng cấp từ Level ${currentLevel} lên Level ${targetLevel} sau khi hoàn thành khóa "${program.title}" với điểm ${enrollment.final_score}`
      }, {
        onConflict: 'employee_id,competency_name',
        ignoreDuplicates: false
      });

    if (upsertError) {
      throw new Error(`Failed to update competency: ${upsertError.message}`);
    }

    console.log(`✅ Competency updated: ${program.competency_name} ${currentLevel} → ${targetLevel}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Competency updated to Level ${targetLevel}`,
        old_level: currentLevel,
        new_level: targetLevel
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ [auto-update-competency] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
