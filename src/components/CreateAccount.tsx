import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createAccount } from "@/utils/dataManager";
import { UserPlus, Eye, EyeOff } from "lucide-react";

interface CreateAccountProps {
  onAccountCreated: () => void;
}

const CreateAccount = ({ onAccountCreated }: CreateAccountProps) => {
  const { toast } = useToast();
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      toast({
        title: "Invalid input",
        description: "Username and password cannot be empty",
        variant: "destructive",
      });
      return;
    }
    try {
      const success = await createAccount(newUsername, newPassword);
      if (success) {
        toast({
          title: "Account created",
          description: `Account for ${newUsername} has been created successfully!`,
        });
        setNewUsername("");
        setNewPassword("");
        onAccountCreated();
      } else {
        toast({
          title: "Failed to create account",
          description: "Username already exists",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error creating account",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center text-2xl font-semibold">
          <UserPlus className="h-6 w-6 mr-3 text-green-600" />
          Create New Account
        </CardTitle>
        <CardDescription className="text-base font-light">
          Add new user accounts to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateAccount} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newUsername" className="text-base font-medium">Username</Label>
            <Input
              id="newUsername"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter username"
              className="h-12 text-base rounded-xl border-gray-200"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-base font-medium">Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter password"
                className="h-12 text-base rounded-xl border-gray-200"
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
          
          <Button type="submit" className="w-full h-12 text-base font-medium rounded-xl bg-green-600 hover:bg-green-700">
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAccount;
