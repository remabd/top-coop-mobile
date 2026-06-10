import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Profile } from './src/containers/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { PanierScreen } from './src/containers/PanierScreen';
import { Participations } from './src/containers/Participations';

export default function App() {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  function BottomNav() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="profile" component={Profile} />
        <Tab.Screen name="panier" component={PanierScreen} />
        <Tab.Screen name="participations" component={Participations} />
      </Tab.Navigator>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="tabs" component={BottomNav} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
