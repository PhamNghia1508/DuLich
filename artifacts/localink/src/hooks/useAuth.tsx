import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface UserProfile {
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  signup: (email: string, name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('localink_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('localink_user');
      }
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // Mock login delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Extract first part of email for display name
    const name = email.split('@')[0];
    const nameFormatted = name.charAt(0).toUpperCase() + name.slice(1);
    
    const loggedInUser: UserProfile = {
      email,
      name: nameFormatted,
      avatarUrl: `https://picsum.photos/seed/${name}/48/48`
    };
    
    setUser(loggedInUser);
    localStorage.setItem('localink_user', JSON.stringify(loggedInUser));
    return true;
  };

  const signup = async (email: string, name: string): Promise<boolean> => {
    // Mock signup delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newUser: UserProfile = {
      email,
      name,
      avatarUrl: `https://picsum.photos/seed/${name}/48/48`
    };
    
    setUser(newUser);
    localStorage.setItem('localink_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('localink_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
