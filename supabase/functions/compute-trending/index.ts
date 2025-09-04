import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Refresh the materialized view for trending products
    const { error } = await supabaseClient.rpc('refresh_materialized_view', {
      view_name: 'mv_trending_products'
    })

    if (error) {
      console.error('Error refreshing trending products:', error)
      throw error
    }

    console.log('Successfully refreshed trending products materialized view')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Trending products updated successfully",
        timestamp: new Date().toISOString()
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    )
  } catch (error) {
    console.error('Error computing trending products:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to compute trending products" 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    )
  }
})