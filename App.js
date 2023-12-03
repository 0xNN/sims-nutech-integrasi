import * as React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import { navigationRef } from './lib/services/navRef'
import store from './lib/reducers';
import Navigation from "./lib/navigation/Navigation";
import {useEffect, useState} from "react";
import {loggedIn} from "./lib/actions/auth";
import {getAuthAsyncStorage} from "./lib/services/getAuthAsyncStorage";
import SplashScreen from './lib/screens/SplashScreen';

function App() {
  const [isLoading, setIsLoadingFromAsyncStorage] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoadingFromAsyncStorage(true);
      const userStorage = await getAuthAsyncStorage();
      if (userStorage.user && userStorage.token) {
        await store.dispatch(loggedIn({
          user: userStorage.user,
          token: userStorage.token,
        }));
      }
      setTimeout(() => {
        setIsLoadingFromAsyncStorage(false);
      }, 3000);
    }
    load();
  }, []);

  if (isLoading) {
    return <SplashScreen/>
  }
  
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Navigation />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
