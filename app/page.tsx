import Interviews from '@/components/Interviews';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Bot, Zap, CheckCircle, Clock, BarChart3 } from 'lucide-react';

const Home = async () => {
  const session = await getServerSession();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                Interview smarter,
                <br />
                <span className="text-blue-600">hire better</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                AI-powered interview platform with intelligent question generation, 
                real-time candidate analysis, and actionable hiring insights.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
              <Link href="/generate-interview">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 transition-colors duration-200">
                  <span className="flex items-center gap-2">
                    <Bot size={20} />
                    Create Your First Interview
                  </span>
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-16">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Trusted by leading companies worldwide</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">10K+</div>
                  <div className="text-gray-600 dark:text-gray-400">Interviews</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">500+</div>
                  <div className="text-gray-600 dark:text-gray-400">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">98%</div>
                  <div className="text-gray-600 dark:text-gray-400">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">2min</div>
                  <div className="text-gray-600 dark:text-gray-400">Setup Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Everything you need to hire better
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Streamlined interview process with intelligent automation and insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Smart Question Generation</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Generate role-specific questions automatically based on job requirements and candidate background.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Performance Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Track candidate performance with detailed analytics and AI-powered insights.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6">
                <Clock className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Real-time Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Get instant feedback and recommendations during live interview sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interviews Section */}
      <section id="interviews" className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          {session?.user?.email ? (
            <>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                  Your Interview Dashboard
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  Manage and track all your interviews in one place
                </p>
              </div>
              <Interviews />
            </>
          ) : (
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                  Ready to get started?
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Sign in to access your interview dashboard and start conducting smarter interviews
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-12">
                <div className="space-y-8">
                  <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Bot className="text-blue-600" size={32} />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-3">
                      <CheckCircle className="text-blue-600 mx-auto" size={24} />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Create Interviews</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Generate AI-powered questions</p>
                    </div>
                    <div className="space-y-3">
                      <BarChart3 className="text-blue-600 mx-auto" size={24} />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Track Performance</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Monitor candidate progress</p>
                    </div>
                    <div className="space-y-3">
                      <Clock className="text-blue-600 mx-auto" size={24} />
                      <h4 className="font-semibold text-gray-900 dark:text-white">Get Analytics</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Receive detailed insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;