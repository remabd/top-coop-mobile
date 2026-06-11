import reactRedux, { useDispatch, useSelector } from 'react-redux';
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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomNav() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="profil" component={Profil} />
      <Tab.Screen name="panier" component={PanierScreen} />
      <Tab.Screen name="participations" component={Participations} />
    </Tab.Navigator>
  );
}

function Root() {
  const auth = useSelector(authSelector);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    loadToken().then((t) =>
      t ? dispatch(connexion(t)) : dispatch(estDeconnecte())
    );
  }, []);

  if (auth.statut === AuthStatut.CHARGEMENT) {
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
          </>
        ) : (
          <Stack.Screen name="connexion" component={Connexion} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <reactRedux.Provider store={store}>
      <Root />
    </reactRedux.Provider>
  );
}
