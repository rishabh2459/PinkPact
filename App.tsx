import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import { LogBox, View, Linking, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/hooks/auth/AuthContext';
import SplashScreen from './src/screens/splash/SplashScreen';
import MainContainer from './src/navigators/MainContainer';
import { Provider } from 'react-redux';
import { store } from './src/coponents/redux/store';

LogBox.ignoreAllLogs();

function App() {
  const [isShow, setIsShow] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');
  const [storeUrl, setStoreUrl] = useState('');

  const updateAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setAuthToken(token || '');
    } catch (error) {
      console.error('Error reading auth token:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await updateAuthToken();
      const loginToken = await AsyncStorage.getItem('authToken');
      if (loginToken) {
        setAuthToken(loginToken);
      }
    };

    init();

    const timeoutId = setTimeout(() => setIsShow(false), 2000);
    const intervalId = setInterval(updateAuthToken, 1000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleUpdate = () => {
    if (storeUrl) {
      Linking.openURL(storeUrl);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          barStyle="dark-content"
          showHideTransition="none"
        />
        {isShow ? (
          <SplashScreen />
        ) : (
          <Provider store={store}>
            <AuthProvider>
              <MainContainer isAuth={isAuth} authToken={authToken} />
            </AuthProvider>
          </Provider>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
