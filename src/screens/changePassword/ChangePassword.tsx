// ForgotAndResetPassword.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../utils/styles/Colors';
import CustomButton from '../../coponents/molecules/GetStartedButton';
import apiService from '../../api/apiServices';
import { commonStyles } from '../../coponents/styles/CommonStyles';
import { useAuth } from '../../hooks/auth/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = ({ navigation }) => {
  const [isResetStage, setIsResetStage] = useState(false); // false = forgot, true = reset
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { logout } = useAuth();


  console.log('current', confirmPassword);

  const handlePasswordReset = async () => {
    if (!oldPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const body = {
      current_password: oldPassword,
      new_password: confirmPassword,
    };
    setLoading(true)
    try {
      const url = `/v1/auth/change_password`;

      const result = await apiService.post(url, body);

      if (result?.data) {
        console.log(result.data, 'dataaaaaaaaaaaa change password');
        logout()
        AsyncStorage.clear();
        setLoading(false)
        // navigation.goBack();
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err.response.data.detail);
      setError(err.response.data.detail[0].msg);
      setLoading(false)
    }
  };

  return (
    <View style={styles.container}>
      <>
        {/* Reset Password Screen */}
        <Text style={styles.title}>Change password</Text>
        <Text style={styles.subtitle}>
          Set a new password to continue your journey
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Current password"
          placeholderTextColor={colors?.placeholder}
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New password"
          placeholderTextColor={colors?.placeholder}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {error && <Text style={[commonStyles.errorText, {marginBottom: 20, bottom: 10}]}>{error}</Text>}

        <CustomButton title="Submit" loading={loading} onPress={() => handlePasswordReset()} />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 40,
    // justifyContent: "center",
    // alignItems: "center",
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePassword;
