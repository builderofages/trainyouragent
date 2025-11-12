import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contactData = await req.json();
    
    // Enhanced logging - show what data we're sending
    console.log('📤 Apollo proxy: Received contact data', { 
      email: contactData.email,
      name: `${contactData.first_name} ${contactData.last_name}`,
      labels: contactData.label_names,
      custom_field_keys: Object.keys(contactData.custom_fields || {}),
      has_phone: !!contactData.phone,
      has_organization: !!contactData.organization_name
    });

    // Apollo.io API key from config
    const apolloApiKey = "nefi97FTOwzcMi5WsvjHHw";
    
    const response = await fetch('https://api.apollo.io/v1/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apolloApiKey,
      },
      body: JSON.stringify(contactData),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      // Enhanced error logging
      console.error('❌ Apollo API error:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData,
        sent_data_summary: {
          email: contactData.email,
          labels: contactData.label_names,
          custom_fields: Object.keys(contactData.custom_fields || {})
        }
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: responseData.error || 'Apollo API request failed',
          details: responseData
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Enhanced success logging
    console.log('✅ Apollo proxy: Contact created successfully', {
      contactId: responseData.contact?.id,
      email: responseData.contact?.email,
      labels_applied: contactData.label_names,
      custom_fields_sent: Object.keys(contactData.custom_fields || {}).length
    });

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('❌ Apollo proxy exception:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
