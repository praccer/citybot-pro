import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [citizen, setCitizen] = useState({
    name: 'Adam Ahmed',
    theme: 'dark',
    language: 'fr',
  });

  const updateName = (name) => setCitizen((prev) => ({ ...prev, name }));
  const toggleTheme = () =>
    setCitizen((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  const setLanguage = (language) => setCitizen((prev) => ({ ...prev, language }));

  return (
    <UserContext.Provider value={{ citizen, updateName, toggleTheme, setLanguage }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
}
