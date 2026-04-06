import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'learner' | 'instructor';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
     try {
      const savedUser = localStorage.getItem('user');
      // Kiểm tra nếu savedUser tồn tại và không phải là chuỗi "undefined"
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Lỗi đọc dữ liệu người dùng:", error);
      localStorage.removeItem('user'); // Xóa dữ liệu lỗi nếu có
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};