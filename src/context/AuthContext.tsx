/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
