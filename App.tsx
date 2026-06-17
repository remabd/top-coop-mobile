import { Provider, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, store } from './src/store/store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Profil } from './src/containers/Profil';
import { NavigationContainer } from '@react-navigation/native';
import { PanierScreen } from './src/containers/PanierScreen';
import { Participations } from './src/containers/Participations';
import { Catalogue } from './src/containers/Catalogue';
import { Connexion } from './src/containers/Connexion';
import {
  authSelector,
  AuthStatut,
  connexion,
  estDeconnecte,
} from './src/store/authSlice';
import { useEffect } from 'react';
import { loadToken } from './src/store/securetoken';
import { ActivityIndicator, View } from 'react-native';
import { ToastHote } from './src/components/ToastHote';
import {
  useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import Camera from './src/containers/Camera';
import {
  Figtree_400Regular,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from './src/STYLE_CONSTS';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.orange,
        tabBarInactiveTintColor: COLORS.vert_fonce,
        tabBarStyle: { backgroundColor: COLORS.vert_clair },
      }}
    >
      <Tab.Screen
        name="profil"
        component={Profil}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="panier"
        component={PanierScreen}
        options={{
          title: 'Panier',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cart-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="participations"
        component={Participations}
        options={{
          title: 'Participations',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-month-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Root() {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch<AppDispatch>();

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Figtree_400Regular,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  useEffect(() => {
    loadToken().then((t) =>
      t ? dispatch(connexion(t)) : dispatch(estDeconnecte())
    );
  }, []);

  if (!fontsLoaded || auth.statut === AuthStatut.CHARGEMENT) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {auth.statut === AuthStatut.CONNECTE ? (
          <>
            <Stack.Screen name="tabs" component={BottomNav} />
            <Stack.Screen name="catalogue" component={Catalogue} />
            <Stack.Screen name="camera" component={Camera} />
          </>
        ) : (
          <Stack.Screen name="connexion" component={Connexion} />
        )}
      </Stack.Navigator>
      <ToastHote />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
