import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET Handler - Fetch all tasks from Supabase
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err: any) {
    console.error('Database fetch error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST Handler - Create task in Supabase AND trigger n8n
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subject, deadline, phone, status } = body;

    // 1. Insert into Supabase database
    const { data: insertedData, error: dbError } = await supabase
      .from('tasks')
      .insert([
        {
          title,
          subject,
          deadline,
          phone,
          status: status || 'TODO',
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    // 2. Trigger the n8n Webhook URL from your .env file
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (n8nWebhookUrl) {
      console.log('Forwarding payload to n8n:', n8nWebhookUrl);
      
      // We run this in the background or await it
      try {
        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: "Student", // Default fallback name
            phone: phone,
            subject: subject,
            deadline: deadline,
            taskTitle: title,
          }),
        });
        
        console.log('n8n Webhook Response Status:', n8nResponse.status);
      } catch (webhookErr) {
        console.error('Failed to dispatch to n8n webhook:', webhookErr);
      }
    } else {
      console.warn('N8N_WEBHOOK_URL is not defined in your environment variables (.env)');
    }

    return NextResponse.json(insertedData);
  } catch (err: any) {
    console.error('Database insert/trigger error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}