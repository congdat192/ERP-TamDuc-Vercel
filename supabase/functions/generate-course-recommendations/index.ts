import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('💡 [generate-course-recommendations] Starting...');

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

    // Step 1: Clean up old pending recommendations (older than 30 days)
    console.log('🧹 Cleaning up old recommendations...');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await supabaseAdmin
      .from('training_course_recommendations')
      .delete()
      .eq('status', 'pending')
      .lt('recommended_at', thirtyDaysAgo.toISOString());

    // Step 2: Get all active employees
    const { data: employees, error: employeesError } = await supabaseAdmin
      .from('employees')
      .select('id')
      .is('deleted_at', null);

    if (employeesError) {
      throw new Error(`Failed to get employees: ${employeesError.message}`);
    }

    console.log(`📊 Processing ${employees?.length || 0} employees...`);

    let totalRecommendations = 0;

    // Step 3: Process each employee
    for (const employee of employees || []) {
      // Get employee competencies
      const { data: competencies } = await supabaseAdmin
        .from('training_competencies')
        .select('competency_name, current_level')
        .eq('employee_id', employee.id);

      // Build competency map (competency_name -> current_level)
      const competencyMap: Record<string, number> = {};
      if (competencies) {
        for (const comp of competencies) {
          competencyMap[comp.competency_name] = comp.current_level;
        }
      }

      // Get available programs that match employee's competency gaps
      const { data: programs } = await supabaseAdmin
        .from('training_programs')
        .select('id, competency_name, target_competency_level, title, course_category')
        .in('status', ['scheduled', 'ongoing'])
        .not('competency_name', 'is', null);

      if (!programs || programs.length === 0) continue;

      // Find programs that would help employee level up
      for (const program of programs) {
        const currentLevel = competencyMap[program.competency_name] || 0;
        const targetLevel = program.target_competency_level;
        const gap = targetLevel - currentLevel;

        // Only recommend if:
        // 1. Employee is below target level
        // 2. Gap is reasonable (1-2 levels)
        if (gap > 0 && gap <= 2) {
          // Check if recommendation already exists
          const { data: existing } = await supabaseAdmin
            .from('training_course_recommendations')
            .select('id')
            .eq('employee_id', employee.id)
            .eq('program_id', program.id)
            .in('status', ['pending', 'enrolled'])
            .maybeSingle();

          if (existing) {
            continue; // Skip if already recommended or enrolled
          }

          // Determine priority
          let priority: 'high' | 'medium' | 'low' = 'medium';
          if (gap === 1) {
            priority = 'high'; // Next level up
          } else if (gap === 2) {
            priority = 'medium';
          }

          // Create recommendation
          const { error: insertError } = await supabaseAdmin
            .from('training_course_recommendations')
            .insert({
              employee_id: employee.id,
              program_id: program.id,
              current_competency_level: currentLevel,
              target_competency_level: targetLevel,
              competency_gap: gap,
              priority,
              reason: `Nâng cấp năng lực "${program.competency_name}" từ Level ${currentLevel} lên Level ${targetLevel}. Khóa học này phù hợp với lộ trình phát triển của bạn.`,
              status: 'pending'
            });

          if (!insertError) {
            totalRecommendations++;
            console.log(`✅ Recommended program ${program.title} to employee ${employee.id}`);
          }
        }
      }
    }

    console.log(`✅ [generate-course-recommendations] Complete. Created ${totalRecommendations} recommendations`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Generated ${totalRecommendations} recommendations`,
        total_employees: employees?.length || 0,
        total_recommendations: totalRecommendations
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('❌ [generate-course-recommendations] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
