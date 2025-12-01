import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface DetectionResultProps {
  result: {
    label: "spam" | "not_spam" | "suspicious";
    score: number;
    reasons?: string[];
    processed_text?: string;
    metadata?: Record<string, any>;
  };
}

const DetectionResult = ({ result }: DetectionResultProps) => {
  const isSpam = result.label === "spam";
  const isSuspicious = result.label === "suspicious";
  const confidencePercent = Math.round(result.score * 100);

  const getStatusIcon = () => {
    if (isSpam) return <AlertTriangle className="h-6 w-6 text-destructive" />;
    if (isSuspicious) return <Info className="h-6 w-6 text-warning" />;
    return <CheckCircle className="h-6 w-6 text-success" />;
  };

  const getStatusColor = () => {
    if (isSpam) return "gradient-danger";
    if (isSuspicious) return "bg-warning/10 border-warning/20";
    return "gradient-success";
  };

  const getStatusText = () => {
    if (isSpam) return "Spam Detected";
    if (isSuspicious) return "Suspicious Content";
    return "Safe";
  };

  return (
    <Card className="p-6 space-y-6 shadow-card border-border/50 animate-fade-in">
      {/* Status Header */}
      <div className={`flex items-center gap-4 p-4 rounded-xl ${getStatusColor()}`}>
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="text-xl font-bold">{getStatusText()}</h3>
          <p className="text-sm opacity-90">
            Confidence: {confidencePercent}%
          </p>
        </div>
        <Badge
          variant={isSpam ? "destructive" : isSuspicious ? "secondary" : "default"}
          className="text-lg px-4 py-2"
        >
          {confidencePercent}%
        </Badge>
      </div>

      {/* Confidence Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Confidence Level</span>
          <span className="font-medium">{confidencePercent}%</span>
        </div>
        <Progress
          value={confidencePercent}
          className="h-2"
        />
      </div>

      {/* Reasons */}
      {result.reasons && result.reasons.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm uppercase text-muted-foreground">
            Detection Indicators
          </h4>
          <div className="space-y-2">
            {result.reasons.map((reason, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm"
              >
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Text */}
      {result.processed_text && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm uppercase text-muted-foreground">
            Processed Content
          </h4>
          <div className="p-4 rounded-lg bg-muted/30 text-sm font-mono">
            {result.processed_text}
          </div>
        </div>
      )}

      {/* Metadata */}
      {result.metadata && Object.keys(result.metadata).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm uppercase text-muted-foreground">
            Additional Information
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(result.metadata).map(([key, value]) => (
              <div key={key} className="p-3 rounded-lg bg-muted/30">
                <div className="text-xs text-muted-foreground capitalize">
                  {key.replace(/_/g, " ")}
                </div>
                <div className="text-sm font-medium mt-1">
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default DetectionResult;
