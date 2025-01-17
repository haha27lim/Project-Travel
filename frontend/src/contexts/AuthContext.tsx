import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from "../services/auth.service";
import IUser from "../types/user.type";

interface AuthContextType {
  currentUser: IUser | undefined;
  setCurrentUser: (user: IUser | undefined) => void;
  showAdminBoard: boolean;
  setShowAdminBoard: (show: boolean) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);
  const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logout = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    setShowAdminBoard(false);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      showAdminBoard, 
      setShowAdminBoard,
      isAuthenticated: !!currentUser,
      logout
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