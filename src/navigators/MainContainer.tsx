import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/auth/AuthContext';
import NavigationService from './NavigationService';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home/Home';
import Login from '../screens/login/Login';
import preLogin from '../screens/preLogin/preLogin';
import SignupScreen from '../screens/signUp/SignUp';
import ForgotAndResetPassword from '../screens/forgotPassword/ForgotPassword';
import SvgIcon from '../coponents/icons/Icons';
import colors from '../utils/styles/Colors';
import Community from '../screens/community/Community';
import Notification from '../screens/notification/Notification';
import RageRoom from '../screens/rageRoom/RageRoom';
import Profile from '../screens/profile/Profile';
import VisitProfile from '../screens/profile/visitProfile/VisitProfile';
import FriendList from '../screens/friendList/FriendList';
import SettingsScreen from '../screens/settings/Settings';
import ChangePassword from '../screens/changePassword/ChangePassword';
import SettingsPrivacy from '../screens/settings/SettingsPrivacy';
import HelpSupport from '../screens/settings/HelpSupport';
import CreatePost from '../screens/createPost/CreatePost';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth flow
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PreLogin" component={preLogin} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignUp" component={SignupScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotAndResetPassword} />
  </Stack.Navigator>
);

// App tabs
const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      // sceneStyle: {padding: 5, borderRadius: 5},
      tabBarItemStyle: {
        paddingHorizontal: 3,
        borderRadius: 10,
        paddingBottom: 8,
        shadowRadius: 5,
      },
      tabBarStyle: { padding: 5, height: 60, backgroundColor: colors?.black },
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      tabBarActiveTintColor: colors?.white,
      tabBarInactiveTintColor: colors?.white,
      tabBarActiveBackgroundColor: '#3b3939',
      tabBarInactiveBackgroundColor: colors?.black,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused ? 'homeTab' : 'homeTabUnselect';
        } else if (route.name === 'Community') {
          iconName = focused ? 'communityTab' : 'communityTabUnselect';
        } else if (route.name === 'Notification') {
          iconName = focused ? 'notificationTab' : 'notificationTabUnselect';
        } else if (route.name === 'RageRoom') {
          iconName = focused ? 'rageRoomTab' : 'rageRoomTab';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'profileTab' : 'profileTabUnselect';
        }

        return <SvgIcon name={iconName} width={25} height={25} />;
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{ tabBarLabel: 'Home' }}
    />
    {/* <Tab.Screen name="Community" component={Community} options={{ tabBarLabel: 'Community' }}/> */}
    <Tab.Screen
      name="Notification"
      component={Notification}
      options={{ tabBarLabel: 'Notification' }}
    />
    <Tab.Screen
      name="RageRoom"
      component={RageRoom}
      options={{ tabBarLabel: 'RageRoom' }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{ tabBarLabel: 'Profile' }}
    />
  </Tab.Navigator>
);

// App flow
const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs" component={AppTabs} />
    <Stack.Screen name="VisitProfile" component={VisitProfile} />
    <Stack.Screen name="FriendList" component={FriendList} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="SettingsPrivacy" component={SettingsPrivacy} />
    <Stack.Screen name="HelpSupport" component={HelpSupport} />
    <Stack.Screen name="CreatePost" component={CreatePost} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />

  </Stack.Navigator>
);

const MainContainer = ({ authToken }) => {
  const { isAuthenticated } = useAuth();

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={ref => NavigationService.setTopLevelNavigator(ref)}
      >
        {authToken || isAuthenticated ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default MainContainer;
