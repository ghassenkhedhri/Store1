import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface CompetitorUrl {
  productId: string
  url: string
  source: string
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

    // Get competitor URLs to fetch
    const { data: competitorUrls } = await supabaseClient
      .from('competitor_products')
      .select('product_id, url, source')
      .limit(10) // Process in batches

    if (!competitorUrls || competitorUrls.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No competitor URLs to process" 
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      )
    }

    const results = []

    for (const competitor of competitorUrls) {
      try {
        // Fetch the competitor page
        const response = await fetch(competitor.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; NovaMart-Bot/1.0)',
          }
        })

        if (!response.ok) {
          console.log(`Failed to fetch ${competitor.url}: ${response.status}`)
          continue
        }

        const html = await response.text()
        
        // Simple price extraction (in production, use proper HTML parsing)
        const priceMatch = html.match(/\$(\d+(?:\.\d{2})?)/g)
        let extractedPrice = null
        
        if (priceMatch && priceMatch.length > 0) {
          // Take the first price found and convert to cents
          const priceStr = priceMatch[0].replace('$', '')
          extractedPrice = Math.round(parseFloat(priceStr) * 100)
        }

        // Update competitor product record
        if (extractedPrice) {
          await supabaseClient
            .from('competitor_products')
            .update({
              price_cents: extractedPrice,
              last_seen_at: new Date().toISOString()
            })
            .eq('product_id', competitor.product_id)
            .eq('url', competitor.url)

          results.push({
            productId: competitor.product_id,
            url: competitor.url,
            price: extractedPrice,
            status: 'updated'
          })
        } else {
          results.push({
            productId: competitor.product_id,
            url: competitor.url,
            status: 'no_price_found'
          })
        }

        // Rate limiting - wait between requests
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`Error processing ${competitor.url}:`, error)
        results.push({
          productId: competitor.product_id,
          url: competitor.url,
          status: 'error',
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${results.length} competitor products`,
        results
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    )
  } catch (error) {
    console.error('Error fetching competitor products:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to fetch competitor products" 
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