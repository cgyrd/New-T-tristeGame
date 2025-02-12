import { createContext, useState, useContext, ReactNode } from 'react';

type UserContextType = {
  user: { name: string; id: number } | null;
  setUser: (user: { name: string; id: number }) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; id: number } | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utisé à lintérieur de <UseProvider />');
  }
  return context;
};



