import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LogOut, Upload, MessageSquare, Mic, Image as ImageIcon, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TextDetection from "@/components/detection/TextDetection";
import VoiceDetection from "@/components/detection/VoiceDetection";
import ImageDetection from "@/components/detection/ImageDetection";
import LinkDetection from "@/components/detection/LinkDetection";
import DetectionHistory from "@/components/detection/DetectionHistory";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-cyber">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-lg blur-lg opacity-50 animate-pulse-slow" />
              <Shield className="h-8 w-8 text-primary relative" />
            </div>
            <h1 className="text-2xl font-bold">
              SpamShield <span className="text-primary">360</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {user.email}
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Detection Dashboard</h2>
          <p className="text-muted-foreground">
            Analyze messages across text, voice, images, and links for spam and threats
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Detection Interface */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-card border-border/50">
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="text">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="voice">
                    <Mic className="h-4 w-4 mr-2" />
                    Voice
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="link">
                    <Link2 className="h-4 w-4 mr-2" />
                    Link
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text">
                  <TextDetection />
                </TabsContent>

                <TabsContent value="voice">
                  <VoiceDetection />
                </TabsContent>

                <TabsContent value="image">
                  <ImageDetection />
                </TabsContent>

                <TabsContent value="link">
                  <LinkDetection />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* History Sidebar */}
          <div className="lg:col-span-1">
            <DetectionHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
