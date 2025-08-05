import { createContext, useContext, useEffect, useState } from "react";
import type { Utilisateur } from "@/types";

interface AuthContextType {
  user: Utilisateur | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const isAuthenticated = localStorage.getItem('isAuthenticated');
          const mockUserData = localStorage.getItem('mockUser');
          
          if (isAuthenticated === 'true' && mockUserData) {
            const mockUser = JSON.parse(mockUserData) as Utilisateur;
            setUser(mockUser);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem('mockSession');
        localStorage.removeItem('mockUser');
        localStorage.removeItem('isAuthenticated');
      }
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
