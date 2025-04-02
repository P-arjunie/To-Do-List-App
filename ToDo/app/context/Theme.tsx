import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  border: string;
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  checkbox: string;
  checkboxBorder: string;
}

export const lightTheme: ThemeColors = {
  background: '#f8f9fa',
  card: '#ffffff',
  text: '#212529',
  border: '#e0e0e0',
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#ff3b30',
  checkbox: '#ffffff',
  checkboxBorder: '#007bff',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#f8f9fa',
  border: '#333333',
  primary: '#0a84ff',
  secondary: '#86888a',
  success: '#30d158',
  danger: '#ff453a',
  checkbox: '#1e1e1e',
  checkboxBorder: '#0a84ff',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Get initial color scheme from device
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(colorScheme === 'dark');

  // Listen for changes in device appearance
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription.remove();
  }, []);

  // Get current theme colors
  const colors = isDarkMode ? darkTheme : lightTheme;

  // Toggle theme manually
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};