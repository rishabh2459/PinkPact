import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { commonStyles } from '../../coponents/styles/CommonStyles';
import CustomButton from '../../coponents/molecules/GetStartedButton';
import SvgIcon from '../../coponents/icons/Icons'
import { useNavigation } from '@react-navigation/native';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';

const { width } = Dimensions.get('window');

const PreLoginScreen = () => {
    const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
   
   <SvgIcon name="initial" width={180} height={180} />

      <Text style={[commonStyles.heading, {marginTop: NormalizeSize.getFontSize(52), marginBottom: NormalizeSize.getFontSize(23)}]}>
        New to <Text style={{ fontWeight: '700' }}>The Pink Pact?</Text>
      </Text>

      <CustomButton title="Get Started" onPress={() => navigation.navigate('SignUp')} />

      <Text style={commonStyles.underlineText}>
        Your Privacy is important to us
      </Text>

      <Text style={styles.accountText}>
        Already have an account?{' '}
        <Text style={commonStyles.linkText} onPress={() =>
            navigation.navigate('Login')
        }>Log in</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 30,
  },
  accountText: {
    fontSize: 14,
    color: '#fff',
    marginTop: NormalizeSize.getFontSize(53),
    textAlign: 'center',
  },
});

export default PreLoginScreen;
