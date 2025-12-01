import { useState, useRef } from "react";
import { Upload, Loader2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DetectionResult from "./DetectionResult";

const VoiceDetection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Error",
        description: "Please select an audio file",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Audio = event.target?.result?.toString().split(",")[1];

        const { data, error } = await supabase.functions.invoke("detect-spam", {
          body: { type: "voice", content: base64Audio },
        });

        if (error) throw error;

        setResult(data);
        
        toast({
          title: "Analysis Complete",
          description: `Detection: ${data.label}`,
        });
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to analyze audio",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div
          className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <Mic className="h-8 w-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Voice Message</h3>
              <p className="text-sm text-muted-foreground">
                {fileName || "Click to select an audio file (MP3, WAV, OGG)"}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Select Audio File
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Audio will be transcribed using Whisper AI and analyzed for spam indicators
        </p>
      </div>

      {result && <DetectionResult result={result} />}
    </div>
  );
};

export default VoiceDetection;
