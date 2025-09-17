// EditProfile.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import colors from '../../utils/styles/Colors';
import SvgIcon from '../../coponents/icons/Icons';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import DropDownPicker from 'react-native-dropdown-picker';
import { commonStyles } from '../../coponents/styles/CommonStyles';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import apiService from '../../api/apiServices';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

export default function EditProfile({ navigation }: any) {
  const [image, setImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState(null);

  const [bio, setBio] = useState('');
  const [generation, setGeneration] = useState('');
  const [education, setEducation] = useState('');
  const [supportBuddy, setSupportBuddy] = useState('');
  const [generationDropdown, setGenerationDropdown] = useState(false);
  const [generationDropdownValue, setGenerationDropdownValue] = useState('');
  const [generationDropdowIitems, setGenerationDropdownItems] = useState([]);

  const [educationDropdown, setEducationDropdown] = useState(false);
  const [educationDropdownValue, setEducationDropdownValue] = useState('');
  const [educationDropdowIitems, setEducationDropdownItems] = useState([]);
  const [imagePickerModal, setImagePickerModal] = useState(false);
  // 📷 Pick Image
  // 📷 Pick Image from Gallery
  const pickImageFromGallery = async () => {
    const result: any = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 500,
      maxWidth: 500,
    });
    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
    setImagePickerModal(false);
  };

  // 📷 Take Photo from Camera
  const pickImageFromCamera = async () => {
    const result: any = await launchCamera({
      mediaType: 'photo',
      includeBase64: false,
      saveToPhotos: true,
    });
    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
    setImagePickerModal(false);
  };

  const generationLevel = async () => {
    try {
      const url = `/v1/reference/generations`;

      const result = await apiService.get(url);

      if (result?.data) {
        const dropdownData = result?.data.map(item => ({
          label: item.label,
          value: item.id,
        }));
        setGenerationDropdownItems(dropdownData);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  const educationlevel = async () => {
    try {
      const url = `/v1/reference/education_levels`;

      const result = await apiService.get(url);

      if (result?.data) {
        const dropdownData = result?.data.map(item => ({
          label: item.label,
          value: item.id,
        }));
        setEducationDropdownItems(dropdownData);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const url = `/v1/profile`;

      const result = await apiService.get(url);

      if (result?.data) {
        setProfileData(result?.data);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  useEffect(() => {
    educationlevel();
    generationLevel();
    fetchProfile();
  }, []);

 const handleSubmit = async () => {
    try {
      const url = `/v1/profile`;

      const formData = new FormData();
      formData.append('first_name', profileData?.first_name || '');
      formData.append('last_name', profileData?.last_name || '');

      // ✅ Handle avatar upload if user selected new image
        formData.append('avatar_url', {
          uri: image,
          name: 'profile.jpg',
          type: 'image/jpeg',
        } as any);
      

      formData.append('bio', bio === '' ? profileData?.bio || '' : bio);
      formData.append(
        'buddy_description',
        supportBuddy === '' ? profileData?.buddy_description || '' : supportBuddy,
      );
      formData.append('birthday', '2025-09-24');
      formData.append('gender', 'male');
      formData.append('phone_number', '8744512112');
      formData.append(
        'education_level_id',
        educationDropdownValue === ''
          ? profileData?.education_level_id || ''
          : educationDropdownValue,
      );
      formData.append(
        'generation_id',
        generationDropdownValue === ''
          ? profileData?.generation_id || ''
          : generationDropdownValue,
      );

      const result = await apiService.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (result?.data) {
        navigation.navigate('Home');
      }
    } catch (err) {
      console.log('🚀 ~ handleSubmit ~ err:', err);
    }
  };
  console.log(profileData, 'profiiiiiiiiiiiiiiiiiiii');

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
            {/* <MaterialIcons
              name="arrow-back-ios-new"
              size={22}
              color={colors?.white}
            /> */}
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
        <TouchableOpacity
          onPress={() => setImagePickerModal(true)}
          style={styles.imageContainer}
        >
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
          value={bio === '' ? profileData?.bio : bio}
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
            value={
              generationDropdownValue === ''
                ? profileData?.generation_id
                : generationDropdownValue
            }
            items={generationDropdowIitems}
            setOpen={setGenerationDropdown}
            setValue={setGenerationDropdownValue}
            setItems={setGenerationDropdownItems}
          />
        </View>

        {/* Education */}
        <Text style={styles.label}>Education level</Text>
        <View style={[styles.pickerContainer, { zIndex: 2 }]}>
          <DropDownPicker
            placeholder="Select Option"
            placeholderStyle={{ color: colors?.placeholder }}
            textStyle={commonStyles?.dropdownTextInput}
            open={educationDropdown}
            value={
              educationDropdownValue === ''
                ? profileData?.education_level_id
                : educationDropdownValue
            }
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
          value={
            supportBuddy === '' ? profileData?.buddy_description : supportBuddy
          }
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

          <TouchableOpacity style={[styles.saveButton]} onPress={handleSubmit}>
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

      <Modal
        visible={imagePickerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setImagePickerModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setImagePickerModal(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={pickImageFromCamera}
            >
              <Text style={styles.modalButtonText}>📷 Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={pickImageFromGallery}
            >
              <Text style={styles.modalButtonText}>🖼️ Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#444' }]}
              onPress={() => setImagePickerModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#222',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
