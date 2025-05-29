
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  username: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  adminLogin: (password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    
    // Default accounts
    const defaultAccounts = [
      { username: 'admin', password: 'admin' },
      { username: 'test', password: 'test' }
    ];
    
    // Check if account exists in stored accounts or default accounts
    const allAccounts = [...defaultAccounts, ...accounts];
    const account = allAccounts.find(acc => acc.username === username && acc.password === password);
    
    if (account) {
      const userData = { username };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const adminLogin = (password: string): boolean => {
    if (password === 'SRV-admin') {
      const adminData = { username: 'admin', isAdmin: true };
      setUser(adminData);
      localStorage.setItem('currentUser', JSON.stringify(adminData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      adminLogin,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin || false
    }}>
      {children}
    </AuthContext.Provider>
  );
};
