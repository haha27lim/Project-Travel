import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";
import api from "../services/userapi";

interface AuthContextType {
  currentUser: IUser | undefined;
  setCurrentUser: (user: any) => void;
  showAdminBoard: boolean;
  setShowAdminBoard: (show: boolean) => void;
  isAuthenticated: boolean;
  logout: () => void;
  fetchUser: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const fetchUser = useCallback(async () => {

    if (hasCheckedAuth) return;
    
    const storedUser = AuthService.getCurrentUser();
    if (!storedUser) {
      setLoading(false);
      setHasCheckedAuth(true);
      return;
    }

    try {
      const { data } = await api.get(`/auth/user`);
      setCurrentUser(data);
      if (data.roles.includes("ROLE_ADMIN")) {
        setShowAdminBoard(true);
      } else {
        setShowAdminBoard(false);
      }
    } catch (error) {
      console.error("Not authenticated or error fetching user", error);
      AuthService.logout();
      setCurrentUser(undefined);
      setShowAdminBoard(false);
    } finally {
      setLoading(false);
      setHasCheckedAuth(true);
    }
  }, [hasCheckedAuth]);

  useEffect(() => {
    
    const checkLoginStatus = async () => {
      await fetchUser();
    };
    checkLoginStatus();
  }, [fetchUser]);

  const logout = async () => {
    await AuthService.logout();
    setCurrentUser(undefined);
    setShowAdminBoard(false);
  };

  if (loading) {
    return <div>Loading application...</div>;
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      setCurrentUser,
      showAdminBoard,
      setShowAdminBoard,
      isAuthenticated: !!currentUser,
      logout,
      fetchUser,
      loading
    }}>
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