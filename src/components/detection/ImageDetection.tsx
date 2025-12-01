import { useState, useRef } from "react";
import { Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DetectionResult from "./DetectionResult";

const ImageDetection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target?.result?.toString();
        setPreview(base64Image || "");

        const { data, error } = await supabase.functions.invoke("detect-spam", {
          body: { type: "image", content: base64Image?.split(",")[1] },
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
        description: error.message || "Failed to analyze image",
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
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview("");
                  setResult(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                Clear Image
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Screenshot or Image</h3>
                <p className="text-sm text-muted-foreground">
                  Click to select an image file (JPG, PNG, WEBP)
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
                    Select Image
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Text will be extracted using OCR and analyzed for spam patterns
        </p>
      </div>

      {result && <DetectionResult result={result} />}
    </div>
  );
};

export default ImageDetection;
