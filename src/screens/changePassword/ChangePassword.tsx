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

const ChangePassword = () => {
  const [isResetStage, setIsResetStage] = useState(false); // false = forgot, true = reset
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendResetLink = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    console.log('Reset link sent to:', email);
    // Call API for sending reset link here...
    setIsResetStage(true); // move to reset screen after email sent
  };

  const handlePasswordReset = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    console.log('Password reset successfully:', newPassword);
    // Call API for resetting password here...
    Alert.alert('Success', 'Password has been reset successfully!');
  };

  return (
    <View style={styles.container}>
      <>
        {/* Reset Password Screen */}
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.subtitle}>
          Set a new password to continue your journey
        </Text>

        <TextInput
          style={styles.input}
          placeholder="New password"
          placeholderTextColor={colors?.placeholder}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor={colors?.placeholder}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <CustomButton title="Submit" onPress={() => handlePasswordReset()} />
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
