import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import CustomButton from '../../coponents/molecules/GetStartedButton'; // Your existing button
import colors from '../../utils/styles/Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import { commonStyles } from '../../coponents/styles/CommonStyles';
import { useNavigation } from '@react-navigation/native';
import SvgIcon from '../../coponents/icons/Icons';
import { useDispatch } from 'react-redux';
import apiService from '../../api/apiServices';

const { width } = Dimensions.get('window');

const SignupScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [countries, setCountries] = useState([]);

  const [openYourSelfDropdown, setOpenYourSelfDropdown] = useState(false);
  const [yourSelfDropdownValue, setYourSelfDropdownValue] = useState(null);
  const [yourSelfDropdowIitems, setYourSelfDropdownItems] = useState([]);

  const [openJourneyDropdown, setOpenJourneyDropdown] = useState(false);
  const [journeyDropdownValue, setJourneyDropdownValue] = useState(null);
  const [journeyDropdowIitems, setJourneyDropdownItems] = useState([]);
  const [openCancerTypeDropdown, setOpenCancerTypeDropdown] = useState(false);
  const [cancerTypeDropdownValue, setCancerTypeDropdownValue] = useState(null);
  const [cancerTypeDropdowIitems, setCancerTypeDropdownItems] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    about: '',
    area: '',
    town: '',
    journey: '',
    cancerType: '',
    otherDetails: '',
    email: '',
    password: '',
  });

  const loadPatient = async () => {
    try {
      const url = `/v1/reference/user_types`;

      const result = await apiService.get(url);
      console.log(result, ' resssssssssssssssss');

      if (result?.data) {
        setYourSelfDropdownItems(result?.data);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  const journeyType = async () => {
    try {
      const url = `/v1/reference/journey_types`;

      const result = await apiService.get(url);

      if (result?.data) {
        setJourneyDropdownItems(result?.data);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  const cancerType = async () => {
    try {
      const url = `/v1/reference/cancer_types`;

      const result = await apiService.get(url);

      if (result?.data) {
        const dropdownData = result?.data.map(item => ({
          label: item.name,
          value: item.id,
        }));
        setCancerTypeDropdownItems(dropdownData);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  console.log(cancerTypeDropdowIitems, 'test');

  useEffect(() => {
    loadPatient();
    journeyType();
    cancerType();
  }, []);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      console.log('Form submitted:', formData);
    }
  };

  const handleBack = () => {
    if (step == 1) navigation.goBack();
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return (
          formData.firstName.trim() !== '' && formData.surname.trim() !== ''
        );
      //   case 2:
      //     return formData.about !== '';
      //   case 2:
      //     return formData.area.trim() !== '' && formData.town.trim() !== '';
      case 2:
        return formData.journey !== '';
      case 3:
        return formData.cancerType !== '';
      case 4:
        return formData.email !== '';
      default:
        return false;
    }
  };

  const handleRegister = async () => {
    // if (
    //   !formData.email ||
    //   !formData.password ||
    //   !formData.firstName ||
    //   !formData.surname 
    // ) {
    //   Alert.alert('Please fill in all required fields');
    //   return;
    // }

    try {
      const url = `/v1/auth/register`;

      const data = {
        first_name: formData?.firstName,
        last_name: formData?.surname,
        email: email,
        password: password,
        // country_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        user_type: yourSelfDropdownValue,
        journey_type: journeyDropdownValue,
        cancer_type_id: cancerTypeDropdownValue,
      };

      console.log(data, "========================================================");
      
      const result = await apiService.post(url, data);

      if (result?.data) {
        navigation.navigate('Login')
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      {step && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          {/* <Text style={{ color: 'white' }}>Back</Text> */}
          <SvgIcon name="back" width={20} height={20} />
        </TouchableOpacity>
      )}
      <View style={{ height: step == 4 ? '100%' : '80%' }}>
        {/* Step 1 */}
        {step === 1 && (
          <>
            <Text style={[styles.heading, { textAlign: 'left' }]}>
              Create a new account
            </Text>

            <View style={styles.nameContainer}>
              <TextInput
                style={commonStyles.input}
                placeholder="First name"
                placeholderTextColor={colors?.placeholder}
                value={formData.firstName}
                onChangeText={text =>
                  setFormData({ ...formData, firstName: text })
                }
              />
              <TextInput
                style={commonStyles.input}
                placeholder="Surname"
                placeholderTextColor={colors?.placeholder}
                value={formData.surname}
                onChangeText={text =>
                  setFormData({ ...formData, surname: text })
                }
              />
            </View>

            <Text style={styles.label}>Tell us about yourself</Text>
            <DropDownPicker
              placeholder="Select Option"
              placeholderStyle={{ color: colors?.placeholder }}
              textStyle={commonStyles?.dropdownTextInput}
              open={openYourSelfDropdown}
              value={yourSelfDropdownValue}
              items={yourSelfDropdowIitems}
              setOpen={setOpenYourSelfDropdown}
              setValue={setYourSelfDropdownValue}
              setItems={setYourSelfDropdownItems}
            />
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <View
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                height: '85%',
              }}
            >
              <Text style={styles.label}>Where are you in your journey?</Text>
              <DropDownPicker
                placeholder="Select Option"
                placeholderStyle={{ color: colors?.placeholder }}
                textStyle={commonStyles?.dropdownTextInput}
                open={openJourneyDropdown}
                value={journeyDropdownValue}
                items={journeyDropdowIitems}
                setOpen={setOpenJourneyDropdown}
                setValue={setJourneyDropdownValue}
                setItems={setJourneyDropdownItems}
              />
            </View>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <Text style={styles.label}>
              Which cancer have you been diagnosed with?
            </Text>
            <DropDownPicker
              placeholder="Select Option"
              placeholderStyle={{ color: colors?.placeholder }}
              textStyle={commonStyles?.dropdownTextInput}
              open={openCancerTypeDropdown}
              value={cancerTypeDropdownValue}
              items={cancerTypeDropdowIitems}
              setOpen={setOpenCancerTypeDropdown}
              setValue={setCancerTypeDropdownValue}
              setItems={setCancerTypeDropdownItems}
            />

            <Text
              style={[
                styles.label,
                { marginTop: NormalizeSize.getFontSize(38) },
              ]}
            >
              Additional Details
            </Text>
            <TextInput
              style={[commonStyles.input, { width: '100%' }]}
              placeholder="Others"
              placeholderTextColor={colors?.placeholder}
              value={formData.otherDetails}
              onChangeText={text =>
                setFormData({ ...formData, otherDetails: text })
              }
            />
          </>
        )}

        {step === 4 && (
          <View style={{ marginTop: 20 }}>
            {/* Title */}
            <Text style={styles.welcome}>Welcome!</Text>

            {/* Email Input */}
            <TextInput
              style={[styles.input, { width: '100%' }]}
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

            <TouchableOpacity
              style={{ marginVertical: NormalizeSize.getFontSize(20) }}
            >
              <Text style={[styles.signupText, { marginTop: 0 }]}>
                I agreed with the Terms of Service and confirm I have read the{' '}
                <Text style={commonStyles?.underlineText}>Privacy Policy </Text>
              </Text>
            </TouchableOpacity>

            {/* Gradient Login Button */}
            <CustomButton title="Sign Up" onPress={() => handleRegister()} />

            {/* OR divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>or</Text>
              <View style={styles.divider} />
            </View>

            {/* Google Button */}
            <TouchableOpacity style={commonStyles.socialButton}>
              <SvgIcon name="googleIcon" width={20} height={20} />
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Apple Button */}
            <TouchableOpacity style={commonStyles.socialButton}>
              <SvgIcon name="appleIcon" width={20} height={20} />
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>

            {/* Signup link */}
            <Text
              style={styles.signupText}
              onPress={() => navigation.navigate('Login')}
            >
              Already have an account?{' '}
              <Text style={styles.signupLink}>Login</Text>
            </Text>
          </View>
        )}
      </View>
      {/* Next / Get Started Button */}
      {step < 4 && (
        <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
          <CustomButton
            title={step === 3 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            disabled={!isStepValid()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    height: '100%',
    // justifyContent: "center"
  },
  backButton: {
    flex: 1,
    // backgroundColor: 'red',
    // position: 'absolute',
    width: '100%',
    // top: 40,
    marginBottom: 20,
    // left: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '49%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    color: colors?.black,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  picker: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    color: '#ccc',
    marginBottom: 8,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    // marginBottom: 6,
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

export default SignupScreen;
