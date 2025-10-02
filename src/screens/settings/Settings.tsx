// SettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../hooks/auth/AuthContext';
import apiService from '../../api/apiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutModal from '../../coponents/modals/LogoutModal';
import SvgIcon from '../../coponents/icons/Icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../utils/styles/Colors';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import CustomButton from '../../coponents/molecules/GetStartedButton';

// import { Ionicons, MaterialIcons, FontAwesome5, Feather } from "react-native-vector-icons";

const SettingsScreen = ({ navigation }) => {
  const [showModal, setshowModal] = useState(false);
  const { logout } = useAuth();

  const handleLogOut = async () => {
    try {
      const url = '/v1/auth/logout/';
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
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
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
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Options */}
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('HelpSupport')}>
          <Text style={styles.optionText}>Help & Support</Text>
          <SvgIcon name="ArrowRight" width={20} height={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('SettingsPrivacy')}>
          <Text style={styles.optionText}>Setting & Privacy</Text>
          <SvgIcon name="ArrowRight" width={20} height={20} />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={{ marginTop: NormalizeSize.getFontSize(52), justifyContent: 'center', alignItems: 'center' }}>
          <View style={{width: '85%'}}>
          <CustomButton
            title="Log out"
            onPress={() => setshowModal(true)}
            loading={false}
          />
          </View>
        </TouchableOpacity>
      </ScrollView>
      {showModal && (
        <LogoutModal
        title="Log Out"
        sure="Logout"
        confirmButtonText="Log Out"
          isVisible={showModal}
          onRetry={handleLogOut}
          onClose={handleCancel}
        />
      )}
    </>
  );
};

export default SettingsScreen;

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
  logoutBtn: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1eaff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
});
