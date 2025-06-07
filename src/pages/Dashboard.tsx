import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { saveFormData, getUserData, isFormOpenForUser, FormData } from "@/utils/dataManager";
import { ChartContainer } from "@/components/ChartContainer";
import { LogOut, TrendingUp, Lock, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [revenue, setRevenue] = useState("");
  const [revenueError, setRevenueError] = useState("");
  const [trl, setTrl] = useState("");
  const [ip, setIp] = useState("");
  const [userData, setUserData] = useState<FormData[]>([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    loadData();
    checkFormStatus();
  }, [isAuthenticated, user, navigate]);

  const loadData = async () => {
    if (user) {
      try {
        const data = await getUserData(user.username);
        setUserData(data);
      } catch (err: any) {
        toast({
          title: "Error loading data",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const checkFormStatus = async () => {
    if (user) {
      try {
        const isOpen = await isFormOpenForUser(user.username);
        setFormOpen(isOpen);
      } catch (err: any) {
        toast({
          title: "Error checking form status",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRevenue(value);
    if (value === "" || isNaN(Number(value))) {
      setRevenueError("Please enter a valid number for revenue.");
    } else {
      setRevenueError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOpen) {
      toast({
        title: "Form is closed",
        description: "The form is currently closed. Please contact an administrator.",
        variant: "destructive",
      });
      return;
    }
    if (!user) return;
    try {
      await saveFormData({
        revenue: Number(revenue),
        trl: Number(trl),
        ip
      }, user.username);
      toast({
        title: "Data saved successfully!",
        description: "Your form data has been recorded. The form is now closed.",
      });
      setRevenue("");
      setTrl("");
      setIp("");
      await loadData();
      checkFormStatus();
    } catch (err: any) {
      toast({
        title: "Error saving data",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome, {user.username}
            </h1>
            <p className="text-xl text-gray-600">Track your progress over time</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="rounded-full px-6">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-2xl font-semibold">
                {formOpen ? (
                  <>
                    <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                    Submit New Data
                  </>
                ) : (
                  <>
                    <Lock className="h-6 w-6 mr-3 text-gray-500" />
                    Form Closed
                  </>
                )}
              </CardTitle>
              <CardDescription className="text-base">
                {formOpen 
                  ? "Enter your latest metrics to track progress"
                  : "The form is currently closed. You can still view your data evolution."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formOpen ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="revenue" className="text-base font-medium">Revenue (k$)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      value={revenue}
                      onChange={handleRevenueChange}
                      placeholder="Enter revenue in thousands (k$)"
                      className="h-12 text-base rounded-xl border-gray-200"
                      required
                    />
                    {revenueError && (
                      <div className="flex items-center text-red-600 mt-1 text-sm font-light">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {revenueError}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="trl" className="text-base font-medium">Technology Readiness Level (TRL)</Label>
                    <select
                      id="trl"
                      value={trl}
                      onChange={(e) => setTrl(e.target.value)}
                      className="h-12 text-base rounded-xl border-gray-200 w-full px-4 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      required
                    >
                      <option value="" disabled>Select TRL (1-9)</option>
                      {[...Array(9)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ip" className="text-base font-medium">Intellectual Property Status</Label>
                    <Input
                      id="ip"
                      type="text"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                      placeholder="e.g., Patent pending, Trademarked"
                      className="h-12 text-base rounded-xl border-gray-200"
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-12 text-base font-medium rounded-xl bg-blue-600 hover:bg-blue-700">
                    Submit Data
                  </Button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <Lock className="h-16 w-16 mx-auto text-gray-300 mb-6" />
                  <p className="text-lg text-gray-500">
                    The form is currently closed. Contact an administrator to reopen it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold">Your Statistics</CardTitle>
              <CardDescription className="text-base">
                Overview of your submitted data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl">
                  <span className="font-medium text-lg">Total Entries</span>
                  <span className="text-lg font-semibold text-blue-600">{userData.length}</span>
                </div>
                
                {userData.length > 0 && (
                  <>
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl">
                      <span className="font-medium text-lg">Latest Revenue</span>
                      <span className="text-lg font-semibold text-green-600">
                        {userData[userData.length - 1]?.revenue?.toLocaleString() || 0} k$
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl">
                      <span className="font-medium text-lg">Latest TRL</span>
                      <span className="text-lg font-semibold text-purple-600">
                        {userData[userData.length - 1]?.trl || 0}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-gray-50/50 rounded-xl">
                      <span className="font-medium text-lg">Form Status</span>
                      <Badge variant={formOpen ? "default" : "secondary"} className="text-sm px-3 py-1">
                        {formOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </div>
                  </>
                )}
                
                {userData.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-lg text-gray-500">No data submitted yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {userData.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Progress Over Time</h2>
            <ChartContainer data={userData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
