// EditProfile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import colors from '../../utils/styles/Colors';
import SvgIcon from '../../coponents/icons/Icons';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import DropDownPicker from 'react-native-dropdown-picker';
import { commonStyles } from '../../coponents/styles/CommonStyles';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

export default function EditProfile({ navigation }: any) {
  const [image, setImage] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [generation, setGeneration] = useState('');
  const [education, setEducation] = useState('');
  const [supportBuddy, setSupportBuddy] = useState('');
  const [generationDropdown, setGenerationDropdown] = useState(false);
  const [generationDropdownValue, setGenerationDropdownValue] = useState(null);
  const [generationDropdowIitems, setGenerationDropdownItems] = useState([
    { label: 'Silent Generation (1928-1945)', value: 1 },
    { label: 'Baby Boomers (1946-1964)', value: 2 },
    { label: 'GenerationX (1965-1980)', value: 3 },
    { label: 'Millennials (1981-1996)', value: 4 },
    { label: 'Generation Z (1997-2012)', value: 5 },
    { label: 'Generation Alpha (2013-2024)', value: 6 },
  ]);

  const [educationDropdown, setEducationDropdown] = useState(false);
  const [educationDropdownValue, setEducationDropdownValue] = useState(null);
  const [educationDropdowIitems, setEducationDropdownItems] = useState([
    { label: 'Silent Generation (1928-1945)', value: 1 },
    { label: 'Baby Boomers (1946-1964)', value: 2 },
    { label: 'GenerationX (1965-1980)', value: 3 },
    { label: 'Millennials (1981-1996)', value: 4 },
    { label: 'Generation Z (1997-2012)', value: 5 },
    { label: 'Generation Alpha (2013-2024)', value: 6 },
  ]);

  // 📷 Pick Image
  const pickImage = async () => {
    const result: any = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
    });

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // ✅ Save Profile
  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your changes have been saved!');
    // Here you can call your API to update profile
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
          <TouchableOpacity
            style={{
              position: 'relative',
              // backgroundColor: 'white',
              width: 35,
              height: 35,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MaterialIcons name="arrow-back-ios-new" size={22} color={colors?.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: 'relative',
              backgroundColor: 'white',
              width: 35,
              height: 35,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => navigation.navigate('VisitProfile')}

          >
            <MaterialIcons name="settings" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Edit profile</Text>

        {/* Profile Image */}
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          <Image
            source={
              image
                ? { uri: image }
                : require('../../assets/images/defaultfemale.png')
            }
            style={styles.profileImage}
          />
          <View style={styles.cameraIcon}>
            <Entypo name="camera" size={22} color="#FF3CAB" />
          </View>
        </TouchableOpacity>

        {/* Bio */}
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.remarks}
          value={bio}
          onChangeText={setBio}
          placeholder="Write something about you..."
          placeholderTextColor="#aaa"
          multiline
        />

        {/* Generation */}
        <Text style={styles.label}>Generation</Text>
        <View style={styles.pickerContainer}>
          <DropDownPicker
            placeholder="Select Option"
            placeholderStyle={{ color: colors?.placeholder }}
            textStyle={commonStyles?.dropdownTextInput}
            open={generationDropdown}
            value={generationDropdownValue}
            items={generationDropdowIitems}
            setOpen={setGenerationDropdown}
            setValue={setGenerationDropdownValue}
            setItems={setGenerationDropdownItems}
          />
        </View>

        {/* Education */}
        <Text style={styles.label}>Education level</Text>
        <View style={styles.pickerContainer}>
          <DropDownPicker
            placeholder="Select Option"
            placeholderStyle={{ color: colors?.placeholder }}
            textStyle={commonStyles?.dropdownTextInput}
            open={educationDropdown}
            value={educationDropdownValue}
            items={educationDropdowIitems}
            setOpen={setEducationDropdown}
            setValue={setEducationDropdownValue}
            setItems={setEducationDropdownItems}
          />
        </View>

        {/* Support Buddy */}
        <Text style={styles.label}>What I look for in a support buddy?</Text>
        <TextInput
          style={styles.remarks}
          value={supportBuddy}
          onChangeText={setSupportBuddy}
          placeholder="Type here..."
          placeholderTextColor="#aaa"
          multiline
        />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: '#000',
                borderWidth: 1,
                borderColor: colors?.white,
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#fff' }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.saveButton]} onPress={handleSave}>
            <LinearGradient
              colors={['#ff3cab', '#aa7cff']}
              start={{ x: 1, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={{ color: '#fff' }}>Save changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#000',
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  imageContainer: {
    alignSelf: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors?.white,
    borderRadius: 20,
    padding: 7,
  },
  label: {
    color: '#fff',
    marginTop: 20,
    marginBottom: 5,
    fontWeight: '500',
    fontSize: NormalizeSize?.getFontSize(16),
  },
  remarks: {
    backgroundColor: colors?.white,
    color: colors?.black,
    borderRadius: 10,
    padding: 10,
    minHeight: NormalizeSize?.getFontSize(90),
    textAlignVertical: 'top',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 10,
    padding: 10,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  saveButton: {
    width: '50%',
    height: NormalizeSize.getFontSize(48),
    // paddingVertical: 14,
    borderRadius: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
});
