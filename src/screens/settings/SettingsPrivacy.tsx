import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../utils/styles/Colors';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import { SafeAreaView } from 'react-native-safe-area-context';
import SvgIcon from '../../coponents/icons/Icons';
import LogoutModal from '../../coponents/modals/LogoutModal';
import apiService from '../../api/apiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/auth/AuthContext';

const SettingsPrivacy = ({ navigation }) => {
  const [showModal, setshowModal] = useState(false);
  const { logout } = useAuth();

    const handleLogOut = async () => {
    try {
      const url = '/v1/settings/delete';
      const result = await apiService.post(url);
      if (result?.data) {
        logout();
        AsyncStorage.clear();

        setshowModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setshowModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{
            // position: 'relative',
            //   padding: 10,
            // backgroundColor: 'white',
            width: 35,
            height: 35,
            borderRadius: 20,
            // left: 20,
            justifyContent: 'center',
            // alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons
            name="arrow-back-ios-new"
            size={22}
            color={colors?.white}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setting & Privacy</Text>
      </View>

      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ChangePassword')}>
        <Text style={styles.optionText}>Change Password</Text>
        <SvgIcon name="ArrowRight" width={20} height={20} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => setshowModal(true)}
      >
        <Text style={styles.optionText}>Delete account</Text>
        <SvgIcon name="ArrowRight" width={20} height={20} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('SettingsPrivacy')}
      >
        <Text style={styles.optionText}>Privacy Policy</Text>
        <SvgIcon name="ArrowRight" width={20} height={20} />
      </TouchableOpacity>
      {showModal && (
        <LogoutModal
        title= "Delete Account"
        sure="Delete Account"
        confirmButtonText="Delete"
          isVisible={showModal}
          onRetry={handleLogOut}
          onClose={handleCancel}
        />
      )}
    </SafeAreaView>
  );
};

export default SettingsPrivacy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: NormalizeSize.getFontSize(32),
    // justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: NormalizeSize.getFontSize(24),
    fontWeight: '700',
    color: '#fff',
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  optionText: {
    color: '#fff',
    fontSize: NormalizeSize.getFontSize(18),
    fontWeight: '400',
  },
});
