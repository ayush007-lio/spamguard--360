import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DetectionResult from "./DetectionResult";

const TextDetection = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("detect-spam", {
        body: { type: "text", content: text },
      });

      if (error) throw error;

      setResult(data);
      
      toast({
        title: "Analysis Complete",
        description: `Detection: ${data.label}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze text",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Textarea
          placeholder="Paste your message here for spam detection..."
          className="min-h-[200px] resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isAnalyzing}
        />

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !text.trim()}
          className="w-full gradient-primary shadow-glow"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Analyze Text
            </>
          )}
        </Button>
      </div>

      {result && <DetectionResult result={result} />}
    </div>
  );
};

export default TextDetection;
