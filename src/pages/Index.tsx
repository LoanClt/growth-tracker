import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { User, Shield, BarChart3, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    if (isAdmin) {
      navigate('/admin-dashboard');
      return null;
    } else {
      navigate('/dashboard');
      return null;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome to your dashboard!",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Login error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

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
                Silicon Roundabout Ventures
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
              A simple form to track and visualize your key business data over time.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-base font-medium rounded-xl bg-blue-600 hover:bg-blue-700">
              Login
            </Button>
          </form>

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
