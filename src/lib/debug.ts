export async function logMutation(table: string, payload: any, response: any, error: any) {
    const supabase = await import("@/lib/supabase/server").then(m => m.createSupabaseServerClient());
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log(`[Mutation Log] Table: ${table}`);
    console.log(`User ID: ${user?.id}`);
    console.log(`Payload:`, payload);
    console.log(`Response:`, response);
    console.log(`Error:`, error);
}
