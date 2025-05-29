
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getAllData, getAllUsernames, FormData } from "@/utils/dataManager";
import { ChartContainer } from "@/components/ChartContainer";
import CreateAccount from "@/components/CreateAccount";
import AccountManagement from "@/components/AccountManagement";
import ExportData from "@/components/ExportData";
import { LogOut, BarChart3 } from "lucide-react";

const AdminDashboard = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [selectedUser, setSelectedUser] = useState("all-users");
  const [allData, setAllData] = useState<FormData[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/admin-login');
      return;
    }
    
    loadData();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadData = () => {
    const data = getAllData();
    const users = getAllUsernames();
    setAllData(data);
    setUsernames(users);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getFilteredData = () => {
    if (!selectedUser || selectedUser === "all-users") return allData;
    return allData.filter(entry => entry.username === selectedUser);
  };

  const getUserStats = () => {
    const userDataCounts = usernames.reduce((acc, username) => {
      acc[username] = allData.filter(entry => entry.username === username).length;
      return acc;
    }, {} as Record<string, number>);
    
    return userDataCounts;
  };

  if (!user || !isAdmin) return null;

  const filteredData = getFilteredData();
  const userStats = getUserStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-thin text-gray-900 tracking-tight mb-2">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600 font-light">Manage accounts, forms, and view analytics</p>
          </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="rounded-full px-6 py-3 hover:bg-gray-100/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <CreateAccount onAccountCreated={loadData} />
          <ExportData />

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center text-2xl font-semibold">
                <BarChart3 className="h-6 w-6 mr-3 text-blue-600" />
                View User Data
              </CardTitle>
              <CardDescription className="text-base font-light">
                Select a user to view their data and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="userSelect" className="text-base font-medium">Select User</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="h-12 rounded-xl border-gray-200">
                      <SelectValue placeholder="Choose a user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-users">All Users</SelectItem>
                      {usernames.map(username => (
                        <SelectItem key={username} value={username}>
                          {username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-center p-6 bg-blue-50/30 rounded-xl border border-blue-100/50">
                  <p className="text-sm text-gray-600 mb-1 font-light">Showing data for</p>
                  <p className="text-xl font-medium text-blue-600 mb-2">
                    {selectedUser === "all-users" ? "All Users" : selectedUser}
                  </p>
                  <p className="text-base text-gray-600 font-light">
                    {filteredData.length} entries
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-medium">User Statistics</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {Object.entries(userStats).map(([username, count]) => (
                      <div key={username} className="flex justify-between items-center p-4 bg-gray-50/30 rounded-xl border border-gray-100/50">
                        <span className="font-medium text-base">{username}</span>
                        <Badge variant="secondary" className="text-sm font-light">
                          {count} entries
                        </Badge>
                      </div>
                    ))}
                    {Object.keys(userStats).length === 0 && (
                      <p className="text-gray-500 text-center py-4 text-base font-light">No users found</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Management */}
        <AccountManagement onAccountsChange={loadData} />

        {/* Analytics Section */}
        {filteredData.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-4xl font-thin text-gray-900 tracking-tight">
              Analytics for {selectedUser === "all-users" ? "All Users" : selectedUser}
            </h2>
            <ChartContainer data={filteredData} />
          </div>
        )}

        {filteredData.length === 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-500 font-light">
                No data available for the selected user(s). Users need to submit the form to generate analytics.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
