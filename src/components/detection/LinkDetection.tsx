import { useState } from "react";
import { Link as LinkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DetectionResult from "./DetectionResult";

const LinkDetection = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(url);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("detect-spam", {
        body: { type: "link", content: url },
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
        description: error.message || "Failed to analyze link",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              placeholder="https://example.com/suspicious-link"
              className="pl-10"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !url.trim()}
          className="w-full gradient-primary shadow-glow"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <LinkIcon className="mr-2 h-4 w-4" />
              Analyze Link
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Check for phishing, malicious content, and suspicious patterns
        </p>
      </div>

      {result && <DetectionResult result={result} />}
    </div>
  );
};

export default LinkDetection;
