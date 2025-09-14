// LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../coponents/molecules/GetStartedButton';
import colors from '../../utils/styles/Colors';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import { commonStyles } from '../../coponents/styles/CommonStyles';
import SvgIcon from '../../coponents/icons/Icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../coponents/redux/features/auth/authSlice';
import { useAuth } from '../../hooks/auth/AuthContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
// import Icon from 'react-native-vector-icons/Ionicons'; // eye icon

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Build form data
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const url = `https://thepinkpact.onrender.com/v1/auth/login`;
      console.log('🚀 Sending formData:', formData.toString());

      const response = await axios.post(url, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });

      console.log('✅ Login Success:', response?.data);

      if (response?.data?.access_token) {
        await AsyncStorage.setItem('authToken', response.data.access_token);
        login(response.data.access_token);
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.detail || 'An error occurred');
      } else {
        setError('Network error, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.welcome}>Welcome back!</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="abc@gmail.com"
        placeholderTextColor={colors?.placeholder}
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor={colors?.placeholder}
          secureTextEntry={secure}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setSecure(!secure)}
        >
          <SvgIcon
            name={secure ? 'closedPassword' : 'openPassword'}
            width={20}
            height={20}
          />
        </TouchableOpacity>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={[commonStyles.underlineText, { marginTop: 0 }]}>
          Forgot Password
        </Text>
      </TouchableOpacity>

      {/* Gradient Login Button */}
      <CustomButton
        title="Login"
        onPress={() => handleLogin()}
        loading={loading}
      />

      {/* OR divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>or</Text>
        <View style={styles.divider} />
      </View>

      {/* Google Button */}
      <TouchableOpacity style={styles.socialButton}>
        <SvgIcon name="googleIcon" width={20} height={20} />
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Apple Button */}
      <TouchableOpacity style={styles.socialButton}>
        <SvgIcon name="appleIcon" width={20} height={20} />
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>

      {/* Signup link */}
      <Text
        style={styles.signupText}
        onPress={() => navigation.navigate('SignUp')}
      >
        Do not have an account? <Text style={styles.signupLink}>Sign up</Text>
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 6,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeButton: {
    paddingHorizontal: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotText: {
    fontSize: 12,
    color: '#bbb',
  },
  loginButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: NormalizeSize.getFontSize(34),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#555',
  },
  orText: {
    marginHorizontal: 8,
    color: '#aaa',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  socialText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  signupText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#fff',
    fontSize: 13,
  },
  signupLink: {
    color: '#ff3f7f',
    fontWeight: '600',
  },
});
