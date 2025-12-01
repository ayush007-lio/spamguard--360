import { useEffect, useState } from "react";
import { History, MessageSquare, Mic, Image as ImageIcon, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const DetectionHistory = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadHistory();

    const channel = supabase
      .channel("detection_history")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "detections",
        },
        () => {
          loadHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadHistory = async () => {
    const { data } = await supabase
      .from("detections")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setHistory(data);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <MessageSquare className="h-4 w-4" />;
      case "voice":
        return <Mic className="h-4 w-4" />;
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "link":
        return <Link2 className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6 shadow-card border-border/50 h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-lg">Recent Detections</h3>
      </div>

      <ScrollArea className="flex-1 -mx-6 px-6">
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No detections yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="text-sm font-medium capitalize">{item.type}</span>
                  </div>
                  <Badge
                    variant={
                      item.label === "spam"
                        ? "destructive"
                        : item.label === "suspicious"
                        ? "secondary"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {item.label}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {item.processed_text || item.content?.substring(0, 100)}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Confidence: {Math.round(item.score * 100)}%</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default DetectionHistory;
