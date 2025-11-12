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
    
    console.log('Apollo proxy: Received contact data', { 
      email: contactData.email,
      labels: contactData.label_names 
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
      console.error('Apollo API error:', {
        status: response.status,
        error: responseData
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: responseData.error || 'Apollo API request failed' 
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Apollo proxy: Contact created successfully', {
      contactId: responseData.contact?.id
    });

    return new Response(
      JSON.stringify({ success: true, data: responseData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Apollo proxy error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
