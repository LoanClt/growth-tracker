import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getAllAccounts, deleteAccount, updateAccountCredentials, toggleFormForUser, Account } from "@/utils/dataManager";
import { UserMinus, Edit, Users, ToggleLeft, ToggleRight, Eye, EyeOff } from "lucide-react";

interface AccountManagementProps {
  onAccountsChange: () => void;
}

const AccountManagement = ({ onAccountsChange }: AccountManagementProps) => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const refreshAccounts = async () => {
    try {
      const updatedAccounts = await getAllAccounts();
      setAccounts(updatedAccounts);
      onAccountsChange();
    } catch (err: any) {
      toast({
        title: "Error loading accounts",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    refreshAccounts();
    // eslint-disable-next-line
  }, []);

  const handleDeleteAccount = async (username: string) => {
    try {
      await deleteAccount(username);
      toast({
        title: "Account deleted",
        description: `Account ${username} has been deleted successfully!`,
      });
      await refreshAccounts();
    } catch (err: any) {
      toast({
        title: "Cannot delete account",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setEditUsername(account.username);
    setEditPassword(account.password);
    setIsEditDialogOpen(true);
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount) return;
    try {
      await updateAccountCredentials(editingAccount.username, editUsername, editPassword);
      toast({
        title: "Account updated",
        description: `Account credentials have been updated successfully!`,
      });
      setIsEditDialogOpen(false);
      setEditingAccount(null);
      await refreshAccounts();
    } catch (err: any) {
      toast({
        title: "Failed to update account",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleToggleForm = async (username: string, isOpen: boolean) => {
    try {
      await toggleFormForUser(username, isOpen);
      toast({
        title: "Form access updated",
        description: `Form has been ${isOpen ? 'opened' : 'closed'} for ${username}`,
      });
      await refreshAccounts();
    } catch (err: any) {
      toast({
        title: "Error updating form access",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Account Management
        </CardTitle>
        <CardDescription>
          Manage user accounts and form access
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No accounts found</p>
          ) : (
            accounts.map((account) => (
              <div key={account.username} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{account.username}</p>
                      <p className="text-sm text-gray-500">
                        Form: {account.formOpen ? 'Open' : 'Closed'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`form-toggle-${account.username}`} className="text-sm">
                      Form Access
                    </Label>
                    <Switch
                      id={`form-toggle-${account.username}`}
                      checked={account.formOpen}
                      onCheckedChange={(checked) => handleToggleForm(account.username, checked)}
                    />
                  </div>
                  
                  <Dialog open={isEditDialogOpen && editingAccount?.username === account.username} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditAccount(account)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Account</DialogTitle>
                        <DialogDescription>
                          Update the credentials for {account.username}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-username">Username</Label>
                          <Input
                            id="edit-username"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            placeholder="Enter new username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="edit-password"
                              type={showEditPassword ? "text" : "password"}
                              value={editPassword}
                              onChange={(e) => setEditPassword(e.target.value)}
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                              onClick={() => setShowEditPassword((v) => !v)}
                              tabIndex={-1}
                            >
                              {showEditPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateAccount}>
                          Update Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {account.username !== 'admin' && account.username !== 'test' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the account "{account.username}"? 
                            This action cannot be undone and will also delete all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAccount(account.username)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountManagement;
