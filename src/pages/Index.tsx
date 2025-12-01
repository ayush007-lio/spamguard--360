import { Shield, MessageSquare, Mic, Image as ImageIcon, Link2, BarChart3, Zap, Lock, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-cyber text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        
        <div className="relative container mx-auto px-4 py-20">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-lg blur-lg opacity-50 animate-pulse-slow" />
                <Shield className="h-10 w-10 text-primary relative" />
              </div>
              <h1 className="text-2xl font-bold">SpamShield <span className="text-primary">360</span></h1>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
              <Button className="gradient-primary shadow-glow" onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">AI-Powered Threat Detection</span>
            </div>
            
            <h2 className="text-6xl font-bold leading-tight">
              Advanced Multi-Format
              <br />
              <span className="gradient-primary bg-clip-text text-transparent">Spam Detection System</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Protect yourself from spam, scams, and phishing attacks across text, voice, images, and links with cutting-edge AI analysis
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" className="gradient-primary shadow-glow text-lg" onClick={() => navigate('/dashboard')}>
                <Shield className="mr-2 h-5 w-5" />
                Start Detection
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
                View Analytics
              </Button>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-3 justify-center pt-8 text-sm">
              {['Transformer ML', 'Real-time Analysis', 'WhatsApp Integration', 'SMS Detection', 'Voice Transcription'].map((tech) => (
                <div key={tech} className="px-4 py-2 rounded-lg bg-card/50 border border-border backdrop-blur-sm">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4">Multi-Format Detection</h3>
          <p className="text-muted-foreground text-lg">Comprehensive protection across all communication channels</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MessageSquare,
              title: "Text Analysis",
              description: "Advanced NLP for context & intent detection",
              gradient: "gradient-primary"
            },
            {
              icon: Mic,
              title: "Voice Detection",
              description: "Speech-to-text with Whisper AI transcription",
              gradient: "gradient-success"
            },
            {
              icon: ImageIcon,
              title: "Image OCR",
              description: "Extract and analyze text from screenshots",
              gradient: "gradient-danger"
            },
            {
              icon: Link2,
              title: "Link Safety",
              description: "Phishing & malicious URL detection",
              gradient: "gradient-primary"
            }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="group relative p-6 rounded-2xl bg-card shadow-card border border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.gradient} mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-4xl font-bold mb-6">Powered by Advanced AI</h3>
            <div className="space-y-6">
              {[
                {
                  icon: Brain,
                  title: "Transformer Models",
                  description: "DistilBERT fine-tuned for spam classification with context awareness"
                },
                {
                  icon: Zap,
                  title: "Real-time Analysis",
                  description: "Instant threat detection with explainable AI insights"
                },
                {
                  icon: Lock,
                  title: "Privacy First",
                  description: "Secure processing with configurable data retention policies"
                }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">{item.title}</h5>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-3xl" />
            <div className="relative p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-sm shadow-elevated">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20">
                  <span className="font-medium">Detection Accuracy</span>
                  <span className="text-2xl font-bold text-success">97%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="font-medium">Average Response Time</span>
                  <span className="text-2xl font-bold text-primary">&lt;2s</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <span className="font-medium">Threats Blocked</span>
                  <span className="text-2xl font-bold text-accent">10M+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="relative p-12 rounded-3xl gradient-cyber border border-primary/20 text-center">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl animate-pulse-slow" />
          <div className="relative space-y-6">
            <h3 className="text-4xl font-bold">Ready to Secure Your Communications?</h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users protecting themselves from spam and scams with SpamShield 360
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" className="gradient-primary shadow-glow" onClick={() => navigate('/auth')}>
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/dashboard')}>
                <BarChart3 className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">SpamShield 360</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 SpamShield 360. Advanced AI-Powered Protection.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
