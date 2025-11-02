import { useState } from "react";
import { 
  Star, 
  Zap, 
  Shield, 
  Brain, 
  Smartphone, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const handleAdminClick = () => {
    alert("Navigating to Admin Dashboard...");
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Reviews",
      description: "Intelligent review generation and sentiment analysis powered by advanced AI",
      color: "from-cyan-500 to-blue-600",
      gradient: "bg-gradient-to-br from-cyan-500/10 to-blue-600/10"
    },
    {
      icon: Smartphone,
      title: "NFC Technology",
      description: "One-tap review collection with smart NFC cards for seamless customer experience",
      color: "from-blue-500 to-indigo-600",
      gradient: "bg-gradient-to-br from-blue-500/10 to-indigo-600/10"
    },
    {
      icon: Zap,
      title: "Instant Redirect",
      description: "Smart routing to Google Reviews based on customer sentiment and ratings",
      color: "from-sky-500 to-cyan-600",
      gradient: "bg-gradient-to-br from-sky-500/10 to-cyan-600/10"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights and detailed analytics to track your business reputation",
      color: "from-indigo-500 to-purple-600",
      gradient: "bg-gradient-to-br from-indigo-500/10 to-purple-600/10"
    },
    {
      icon: Shield,
      title: "White-Label Solution",
      description: "Fully customizable platform branded for your business needs",
      color: "from-blue-600 to-sky-600",
      gradient: "bg-gradient-to-br from-blue-600/10 to-sky-600/10"
    },
    {
      icon: Users,
      title: "Multi-Business Management",
      description: "Manage unlimited businesses from a single, unified dashboard",
      color: "from-cyan-600 to-teal-600",
      gradient: "bg-gradient-to-br from-cyan-600/10 to-teal-600/10"
    }
  ];

  const stats = [
    { label: "Businesses Connected", value: "500+", icon: Globe },
    { label: "Reviews Collected", value: "50K+", icon: Star },
    { label: "AI Accuracy", value: "98%", icon: Brain },
    { label: "Response Time", value: "<2s", icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-sky-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-cyan-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-sky-200 rounded-full mb-6 shadow-lg">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="text-sm font-semibold text-sky-900">AI-Powered Review System</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            PR Gurukul
          </h1>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-6">
            Smart NFC Review Collection Platform
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transform customer feedback into business growth with AI-powered insights 
            and seamless NFC technology
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-sky-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
            >
              <stat.icon className="w-8 h-8 text-sky-600 mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to collect, analyze, and leverage customer feedback
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`relative bg-white/80 backdrop-blur-sm border border-sky-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group animate-scale-in ${
                    hoveredFeature === index ? 'scale-105' : ''
                  }`}
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h4>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {hoveredFeature === index && (
                      <div className="mt-4 flex items-center gap-2 text-sky-600 font-medium animate-fade-in">
                        <span className="text-sm">Learn more</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-gray-600 text-lg">
              Simple, fast, and intelligent review collection
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", title: "Customer Taps NFC", desc: "One tap on the NFC card starts the review process instantly" },
              { step: "2", title: "AI Analyzes Sentiment", desc: "Advanced AI evaluates the feedback and determines the best action" },
              { step: "3", title: "Smart Redirect", desc: "Positive reviews go to Google, others get internal feedback forms" }
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold text-2xl mb-4 shadow-xl">
                  {item.step}
                  {index < 2 && (
                    <ArrowRight className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-sky-400 hidden sm:block" />
                  )}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16 animate-scale-in" style={{ animationDelay: '1s' }}>
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-sky-500 via-blue-600 to-cyan-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Reviews?
              </h3>
              <p className="text-sky-100 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of businesses already using our AI-powered platform
              </p>
              
              <button
                onClick={() => navigate("/admin")}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-sky-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Access Admin Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-sky-100 text-sm mt-6">
                Tap an NFC card to experience the customer journey
              </p>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-sky-200 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">White-labeled for</span>
              <span className="font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                PRGurukul
              </span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Developed by</span>
            <img  className="w-[120px]" src="https://www.beeztech.studio/_next/image?url=%2FLogo_Black.png&w=384&q=75" alt="" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Index;