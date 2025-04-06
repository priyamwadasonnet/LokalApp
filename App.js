import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import JobsScreen from './screens/JobsScreen';
import BookmarksScreen from './screens/BookmarksScreen';
import JobDetailScreen from './screens/JobDetailScreen';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function JobsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="JobsMain" 
        component={JobsScreen} 
        options={{ title: 'Jobs' }} 
      />
      <Stack.Screen 
        name="JobDetail" 
        component={JobDetailScreen} 
        options={{ title: 'Job Detail' }} 
      />
    </Stack.Navigator>
  );
}

// 🔥 Main App Logic that uses theme
function AppContent() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator>
        <Tab.Screen 
          name="Jobs" 
          component={JobsStack} 
          options={{ headerShown: false }} 
        />
        <Tab.Screen 
          name="Bookmarks" 
          component={BookmarksScreen} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// 🧠 App wrapper
export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}