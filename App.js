import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import NotesScreen from './screens/NotesScreen';
import KhataScreen from './screens/KhataScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import AllActivitiesScreen from './screens/AllActivitiesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0a1929' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Notes" component={NotesScreen} />
        <Stack.Screen name="Khata" component={KhataScreen} />
        <Stack.Screen name="Expenses" component={ExpensesScreen} />
        <Stack.Screen name="AllActivities" component={AllActivitiesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaProvider>
  );
}
