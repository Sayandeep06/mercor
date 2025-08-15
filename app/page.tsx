import Interviews from '@/components/Interviews';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Bot, Sparkles, Target, Zap, CheckCircle, Users, Clock, BarChart3 } from 'lucide-react';

const Home = async () => {
  const session = await getServerSession();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-6 py-32 md:py-40">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            
            {/* Main Heading */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm font-medium text-primary animate-fadeIn">
                <Sparkles size={16} />
                AI-Powered Interview Platform
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold leading-tight animate-fadeIn">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Revolutionize
                </span>
                <br />
                <span className="text-foreground">Your Interview</span>
                <br />
                <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
                  Process
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fadeIn">
                Create intelligent, adaptive interviews with AI. Generate targeted questions, 
                conduct seamless sessions, and gain deep insights - all in one platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
              <Link href="/generate-interview">
                <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-lg px-8 py-6 shadow-2xl hover:shadow-primary/25 transition-all duration-300">
                  <span className="relative z-10 flex items-center gap-2">
                    <Bot size={20} />
                    Create Your First Interview
                    <Sparkles size={16} className="group-hover:rotate-12 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="group border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 text-lg px-8 py-6 transition-all duration-300">
                <span className="flex items-center gap-2">
                  <Target size={20} className="group-hover:scale-110 transition-transform duration-300" />
                  View Demo
                </span>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 animate-fadeIn">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">10K+</div>
                <div className="text-muted-foreground">Interviews Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent">98%</div>
                <div className="text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent">24/7</div>
                <div className="text-muted-foreground">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Intelligent Features
              </span>
              <br />
              for Modern Interviews
            </h2>
            <p className="text-xl text-muted-foreground">
              Experience the future of interviewing with our comprehensive AI-powered toolkit
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="text-primary" size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-4">AI Question Generation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Generate targeted, role-specific questions automatically based on job requirements and skill sets.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="text-accent" size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Smart Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get detailed insights and analytics on candidate performance with AI-powered evaluation.
                </p>
              </div>
            </Card>

            <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="text-primary" size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Real-time Feedback</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive instant feedback and suggestions during interviews to optimize the process.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Interviews Section */}
      <section id="interviews" className="relative py-32">
        <div className="container mx-auto px-6">
          {session?.user?.email ? (
            <>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Your Interview
                  </span>
                  <br />
                  Dashboard
                </h2>
                <p className="text-xl text-muted-foreground">
                  Manage and track all your created interviews in one place
                </p>
              </div>
              <Interviews />
            </>
          ) : (
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Ready to Get Started?
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Sign in to access your personalized interview dashboard and start creating intelligent interviews
                </p>
              </div>

              <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
                <div className="relative space-y-8">
                  <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Bot className="text-primary" size={36} />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-3">
                      <CheckCircle className="text-primary mx-auto" size={24} />
                      <h4 className="font-semibold">Create Interviews</h4>
                      <p className="text-sm text-muted-foreground">Generate AI-powered interview questions</p>
                    </div>
                    <div className="space-y-3">
                      <BarChart3 className="text-accent mx-auto" size={24} />
                      <h4 className="font-semibold">Track Progress</h4>
                      <p className="text-sm text-muted-foreground">Monitor candidate performance</p>
                    </div>
                    <div className="space-y-3">
                      <Sparkles className="text-primary mx-auto" size={24} />
                      <h4 className="font-semibold">Get Insights</h4>
                      <p className="text-sm text-muted-foreground">Receive detailed analytics</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;