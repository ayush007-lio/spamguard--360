import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, content } = await req.json();

    if (!type || !content) {
      throw new Error("Type and content are required");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    let processedText = content;
    let analysisPrompt = "";

    // Handle different input types
    switch (type) {
      case "text":
        processedText = content;
        analysisPrompt = `Analyze this message for spam, phishing, and scam indicators:\n\n"${content}"`;
        break;

      case "voice":
        // In production, this would use Whisper for transcription
        // For now, simulating transcription
        processedText = "Transcribed: " + content.substring(0, 100);
        analysisPrompt = `Analyze this transcribed voice message for spam, phishing, and scam indicators:\n\n"${processedText}"`;
        break;

      case "image":
        // In production, this would use OCR (Tesseract)
        // For now, simulating OCR extraction
        processedText = "OCR extracted text: " + content.substring(0, 100);
        analysisPrompt = `Analyze this text extracted from an image for spam, phishing, and scam indicators:\n\n"${processedText}"`;
        break;

      case "link":
        processedText = content;
        analysisPrompt = `Analyze this URL for phishing, malicious content, and suspicious patterns:\n\nURL: ${content}\n\nCheck for: shortened URLs, suspicious TLDs, typosquatting, IP addresses in URLs, and known phishing patterns.`;
        break;

      default:
        throw new Error("Invalid type");
    }

    // Call Lovable AI for spam detection
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an advanced spam detection AI. Analyze messages for spam, phishing, scams, and fraudulent intent. 

Provide your analysis in JSON format with these fields:
{
  "label": "spam" | "not_spam" | "suspicious",
  "score": 0.0-1.0 (confidence score),
  "reasons": ["reason 1", "reason 2", ...],
  "indicators": {
    "keywords": ["detected keywords"],
    "urgency_language": true/false,
    "suspicious_links": true/false,
    "financial_request": true/false,
    "impersonation": true/false
  }
}

Be thorough in your analysis and look for:
- Urgency and pressure tactics
- Requests for personal/financial information
- Too-good-to-be-true offers
- Suspicious URLs and links
- Poor grammar/spelling (common in scams)
- Impersonation attempts
- Cryptocurrency/investment schemes
- Prize/lottery scams
- Phishing attempts`,
          },
          {
            role: "user",
            content: analysisPrompt,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (aiResponse.status === 402) {
        throw new Error("AI usage limit reached. Please add credits to continue.");
      }
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No response from AI");
    }

    // Parse AI response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || 
                       aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      result = JSON.parse(jsonStr);
    } catch {
      // Fallback parsing
      console.warn("Failed to parse AI response as JSON:", aiContent);
      result = {
        label: aiContent.toLowerCase().includes("spam") ? "spam" : "not_spam",
        score: 0.5,
        reasons: ["AI analysis completed"],
        indicators: {},
      };
    }

    // Store detection in database
    const { error: insertError } = await supabase.from("detections").insert({
      user_id: user.id,
      type,
      content: type === "text" || type === "link" ? content : null,
      processed_text: processedText,
      label: result.label,
      score: result.score,
      reasons: result.reasons || [],
      metadata: result.indicators || {},
    });

    if (insertError) {
      console.error("Failed to save detection:", insertError);
    }

    return new Response(
      JSON.stringify({
        label: result.label,
        score: result.score,
        reasons: result.reasons || [],
        processed_text: processedText,
        metadata: result.indicators || {},
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in detect-spam function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
