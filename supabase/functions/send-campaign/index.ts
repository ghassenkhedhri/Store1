import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface CampaignRequest {
  campaignId: string
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

    const { campaignId }: CampaignRequest = await req.json()

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('campaigns')
      .select(`
        *,
        products (
          title,
          price_cents,
          product_images (url)
        )
      `)
      .eq('id', campaignId)
      .single()

    if (campaignError || !campaign) {
      throw new Error('Campaign not found')
    }

    // Get marketing subscribers
    const { data: subscribers, error: subscribersError } = await supabaseClient
      .from('marketing_subscriptions')
      .select('email')
      .eq('opted_in', true)
      .eq('list', 'general')

    if (subscribersError) {
      throw new Error('Failed to fetch subscribers')
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No subscribers to send to" 
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      )
    }

    // Generate email content
    const emailContent = generateEmailContent(campaign)
    
    // In production, you would integrate with your SMTP service here
    // For now, we'll simulate sending emails
    const emailResults = []
    
    for (const subscriber of subscribers.slice(0, 10)) { // Limit for demo
      try {
        // Simulate email sending
        console.log(`Sending email to ${subscriber.email}`)
        
        // Log email sent event
        await supabaseClient
          .from('events')
          .insert({
            user_id: null,
            type: 'email_sent',
            data: {
              campaign_id: campaignId,
              email: subscriber.email,
              subject: emailContent.subject
            }
          })

        emailResults.push({
          email: subscriber.email,
          status: 'sent'
        })

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`Error sending email to ${subscriber.email}:`, error)
        emailResults.push({
          email: subscriber.email,
          status: 'failed',
          error: error.message
        })
      }
    }

    // Update campaign status
    await supabaseClient
      .from('campaigns')
      .update({ 
        status: 'completed',
        metadata: {
          ...campaign.metadata,
          last_sent: new Date().toISOString(),
          emails_sent: emailResults.filter(r => r.status === 'sent').length,
          emails_failed: emailResults.filter(r => r.status === 'failed').length
        }
      })
      .eq('id', campaignId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Campaign sent to ${emailResults.length} subscribers`,
        results: emailResults
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    )
  } catch (error) {
    console.error('Error sending campaign:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to send campaign" 
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

function generateEmailContent(campaign: any) {
  const product = campaign.products
  
  return {
    subject: `${campaign.name} - Special Offer from NovaMart`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${campaign.name}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb;">NovaMart</h1>
            <h2>${campaign.name}</h2>
          </div>
          
          ${product ? `
            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
              <img src="${product.product_images[0]?.url}" alt="${product.title}" style="width: 100%; max-width: 300px; height: auto; border-radius: 4px;">
              <h3>${product.title}</h3>
              <p style="font-size: 24px; font-weight: bold; color: #2563eb;">
                $${(product.price_cents / 100).toFixed(2)}
              </p>
              <a href="${Deno.env.get('VITE_SITE_URL')}/products/${product.slug}" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px;">
                Shop Now
              </a>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              You're receiving this email because you subscribed to NovaMart updates.
              <br>
              <a href="${Deno.env.get('VITE_SITE_URL')}/unsubscribe" style="color: #6b7280;">Unsubscribe</a>
            </p>
          </div>
        </body>
      </html>
    `
  }
}