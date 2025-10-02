import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../utils/styles/Colors';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import SvgIcon from '../../coponents/icons/Icons';
import apiService from '../../api/apiServices';
import { Font_Sizes } from '../../utils/fontScaler/fonts';
import spacing from '../../utils/styles/Spacing';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

const CreatePost = ({ navigation }) => {
  const [postData, setPostData] = useState('');
  const [postText, setPostText] = useState('');

  const [images, setImages] = useState<any[]>([]);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePickerModal, setImagePickerModal] = useState(false);

  const { data: profileData } = useSelector(
    (state: RootState) => state.profile
  );

  const pickImageFromGallery = async () => {
    const result: any = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 500,
      maxWidth: 500,
      selectionLimit: 0, // <-- allow multiple
    });

    if (result.assets && result.assets.length > 0) {
      setImages(prev => [...prev, ...result.assets]); // ✅ store as array
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
      setImages(prev => [...prev, ...result.assets]); // ✅ append
    }
    setImagePickerModal(false);
  };

  const handlePost = async () => {
    if (!postText && images.length === 0) {
      Alert.alert('Please write something or add images.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('body', postText);

      images.forEach((img, index) => {
        formData.append('file', {
          uri: img.uri,
          type: img.type,
          name: img.fileName || `photo_${index}.jpg`,
        } as any);
      });

      const res = await apiService.post('/v1/content/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res?.data) {
        console.log('Post success:', res?.data);
        navigation.goBack();
      }
    } catch (err) {
      console.log('Post error:', err);
      Alert.alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  console.log(images, 'imaggggggggggggggggggggg');

  return (
    <View style={styles?.container}>
      {/* Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingHorizontal: NormalizeSize.getFontSize(18) }}
        >
          <SvgIcon name={'Cross'} width={30} height={30} />
        </TouchableOpacity>
        <View>
          <Text style={styles?.heading}>Create Post</Text>
        </View>
        <TouchableOpacity
          style={{ paddingHorizontal: 20 }}
          onPress={() => setImagePickerModal(true)}
        >
          <SvgIcon name={'CameraWhite'} width={30} height={30} />
        </TouchableOpacity>
      </View>

     {/* Scrollable Content */}
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Row */}
      <View style={styles.searchContainer}>
        {profileData?.avatar_url ? (
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: profileData?.avatar_url }}
              style={styles.miniavatar2}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <SvgIcon name={'profileTab'} width={30} height={30} />
          </TouchableOpacity>
        )}
        <Text style={styles.userName}>
          {`${profileData?.first_name} ${profileData?.last_name}`}
        </Text>
      </View>

      {/* Post Text */}
      <TextInput
        placeholder="How are you today?"
        value={postText}
        onChangeText={setPostText}
        style={styles.textInput}
        multiline
      />

      {/* Selected Images Preview */}
      {images.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          {images.map((img, idx) => (
            <View
              key={idx}
              style={{ position: 'relative', marginBottom: 15 }}
            >
              <Image source={{ uri: img.uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  width: 25,
                  height: 25,
                  top: 4,
                  right: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() =>
                  setImages(prev => prev.filter((_, i) => i !== idx))
                }
              >
                <SvgIcon name={'deselectCross'} width={20} height={20} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>


      {/* Bottom Action Buttons */}
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

        <TouchableOpacity style={[styles.saveButton]} onPress={handlePost}>
          <LinearGradient
            colors={['#ff3cab', '#aa7cff']}
            start={{ x: 1, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            {loading ? (
              <ActivityIndicator size={'small'} />
            ) : (
              <Text style={{ color: '#fff' }}>Post</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Picker Modal */}
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
    </View>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.white,
    padding: 10,
  },
  headerBar: {
    flexDirection: 'row',
    backgroundColor: '#575757',
    height: NormalizeSize.getFontSize(40),
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: -10,
  },
  heading: {
    color: colors?.white,
    fontSize: NormalizeSize?.getFontSize(22),
    // marginLeft: '20%',
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: NormalizeSize.getFontSize(20),
    alignItems: 'center',
  },
  miniavatar2: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: NormalizeSize.getFontSize(16),
    color: colors?.black,
    marginLeft: spacing?.small,
  },
  textInput: {
    width: '100%',
    // height: '78%',
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: 10,
    // borderColor: colors.gray,
    // borderWidth: 1,
    // borderRadius: 10,
    padding: 10,
  },
  previewImage: {
    width: 170,
    height: 170,
    borderRadius: 8,
    marginRight: 8,
  },
  cameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: colors.gray,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingVertical: 15,
  },
  actionBtn: {
    flex: 0.48,
    padding: 14,
    alignItems: 'center',
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
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
