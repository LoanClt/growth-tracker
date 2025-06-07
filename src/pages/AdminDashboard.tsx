import { useState, useEffect, useMemo } from "react";
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
  
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [allData, setAllData] = useState<FormData[]>([]);
  const [usernames, setUsernames] = useState<string[]>([]);

  // Compute last answered date for each user
  const lastAnsweredMap = useMemo(() => {
    const map: Record<string, string | null> = {};
    usernames.forEach(username => {
      const userEntries = allData.filter(entry => entry.username === username);
      if (userEntries.length > 0) {
        // Get the latest date
        const latest = userEntries.reduce((a, b) => (a.date > b.date ? a : b));
        map[username] = latest.date;
      } else {
        map[username] = null;
      }
    });
    return map;
  }, [usernames, allData]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/admin-login');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadData = async () => {
    try {
      const data = await getAllData();
      const users = await getAllUsernames();
      setAllData(data);
      setUsernames(users);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getFilteredData = () => {
    if (!selectedUser) return [];
    return allData.filter(entry => entry.username === selectedUser);
  };

  if (!user || !isAdmin) return null;

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
                      {usernames.map(username => (
                        <SelectItem key={username} value={username}>
                          {username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedUser && (
                  <div className="text-center p-6 bg-blue-50/30 rounded-xl border border-blue-100/50">
                    <p className="text-sm text-gray-600 mb-1 font-light">Last answered:</p>
                    <p className="text-xl font-medium text-blue-600 mb-2">
                      {lastAnsweredMap[selectedUser] ? new Date(lastAnsweredMap[selectedUser]!).toLocaleString() : 'No submissions yet'}
                    </p>
                    <p className="text-base text-gray-600 font-light">
                      {getFilteredData().length} entries
                    </p>
                  </div>
                )}
                <div className="space-y-3">
                  <h4 className="text-lg font-medium">User Statistics</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {usernames.map(username => (
                      <div key={username} className="flex justify-between items-center p-4 bg-gray-50/30 rounded-xl border border-gray-100/50">
                        <span className="font-medium text-base">{username}</span>
                        <span className="text-sm text-gray-500">{lastAnsweredMap[username] ? new Date(lastAnsweredMap[username]!).toLocaleDateString() : 'No submissions'}</span>
                        <Badge variant="secondary" className="text-sm font-light">
                          {allData.filter(entry => entry.username === username).length} entries
                        </Badge>
                      </div>
                    ))}
                    {usernames.length === 0 && (
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
        {selectedUser && getFilteredData().length > 0 && (
          <div className="space-y-8">
            <h2 className="text-4xl font-thin text-gray-900 tracking-tight">
              Analytics for {selectedUser}
            </h2>
            <ChartContainer data={getFilteredData()} />
          </div>
        )}

        {selectedUser && getFilteredData().length === 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="text-center py-16">
              <p className="text-lg text-gray-500 font-light">
                No data available for the selected user. User needs to submit the form to generate analytics.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
