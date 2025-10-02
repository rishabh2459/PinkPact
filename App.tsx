import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import {
  LogBox,
  View,
  Linking,
  Platform,
  StatusBar,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/hooks/auth/AuthContext';
import SplashScreen from './src/screens/splash/SplashScreen';
import MainContainer from './src/navigators/MainContainer';
import { Provider } from 'react-redux';
import { store } from './src/coponents/redux/store';
import messaging from '@react-native-firebase/messaging';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

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

  // ✅ Request notification permission & get FCM token
  const requestNotificationPermission = async () => {
    const settings = await notifee.requestPermission();

    const authorizationStatus = settings.authorizationStatus;

    if (authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
      console.log('Permission not granted for notifications');
    } else {
      console.log('Permission granted for notifications');
    }
  };

  const getFcmToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const fcmtoken = await messaging().getToken();
      console.log('token---------', fcmtoken);
    } catch (error) {}
    // console.log(fcmtoken, "fcm");
  };

  useEffect(() => {
    const init = async () => {
      await updateAuthToken();
      const loginToken = await AsyncStorage.getItem('authToken');
      if (loginToken) {
        setAuthToken(loginToken);
      }

      // ✅ Setup Firebase Messaging
      await requestNotificationPermission();

      // Foreground messages
      const unsubscribeOnMessage = messaging().onMessage(
        async remoteMessage => {
          console.log('Foreground notification:', remoteMessage);
          Alert.alert(
            remoteMessage.notification?.title,
            remoteMessage.notification?.body,
          );
        },
      );
      getFcmToken()

      // When app is opened from quit state
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log('App opened from quit state:', remoteMessage);
          }
        });

      // When app is opened from background
      const unsubscribeOnOpen = messaging().onNotificationOpenedApp(
        remoteMessage => {
          console.log('App opened from background:', remoteMessage);
        },
      );
      return () => {
        unsubscribeOnMessage();
        unsubscribeOnOpen();
      };
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
