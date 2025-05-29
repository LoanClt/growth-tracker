import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, Shield, BarChart3, ArrowRight } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    if (isAdmin) {
      navigate('/admin-dashboard');
      return null;
    } else {
      navigate('/dashboard');
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Admin Access Button - Top Left */}
      <div className="absolute top-6 left-6 z-10">
        <Button 
          onClick={() => navigate('/admin-login')}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 rounded-full p-3"
        >
          <Shield className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl w-full space-y-12">
          
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-thin text-gray-900 tracking-tight">
                Business Evolution
              </h1>
              <h2 className="text-6xl font-thin text-gray-900 tracking-tight">
                Tracker
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              Track your business metrics over time with comprehensive analytics and insights. 
              Monitor revenue, TRL progression, and IP development seamlessly.
            </p>
          </div>

          {/* Main Action Cards */}
          <div className="flex justify-center">
            <div className="flex justify-center w-full">
              {/* User Login Card */}
              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group max-w-md w-full mx-auto">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-4 bg-blue-50 rounded-2xl w-fit group-hover:bg-blue-100 transition-colors">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl font-medium text-gray-900">
                    User Access
                  </CardTitle>
                  <CardDescription className="text-gray-600 font-light">
                    Access your personal dashboard and track your business metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    onClick={() => navigate('/login')} 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 group-hover:scale-[1.02]"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Secondary Info */}
          <div className="text-center pt-8">
            <p className="text-sm text-gray-500 font-light">
              Need help getting started? Contact your administrator for access.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
