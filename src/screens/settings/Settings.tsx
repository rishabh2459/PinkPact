// SettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../hooks/auth/AuthContext';
import apiService from '../../api/apiServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutModal from '../../coponents/modals/LogoutModal';
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
        {/* Title */}
        <Text style={styles.title}>Settings</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          {/* <Ionicons name="search" size={20} color="#888" /> */}
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>

        {/* Your Account */}
        <Text style={styles.sectionTitle}>Your Account</Text>
        <TouchableOpacity style={styles.card}>
          {/* <Ionicons name="person-circle-outline" size={26} color="#4b4bff" /> */}
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Profile Settings</Text>
            <Text style={styles.cardSubtitle}>
              Change profile image and profile bio
            </Text>
          </View>
          {/* <Feather name="chevron-right" size={22} color="#555" /> */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          {/* <MaterialIcons name="security" size={24} color="#4b4bff" /> */}
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Change Password</Text>
          </View>
          {/* <Feather name="chevron-right" size={22} color="#555" /> */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          {/* <Ionicons name="notifications-outline" size={24} color="#4b4bff" /> */}
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Notification Settings</Text>
            <Text style={styles.cardSubtitle}>
              Comments, new messages, group..
            </Text>
          </View>
          {/* <Feather name="chevron-right" size={22} color="#555" /> */}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => setshowModal(true)}
        >
          {/* <Ionicons name="notifications-outline" size={24} color="#4b4bff" /> */}
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Logout</Text>
          </View>
          {/* <Feather name="chevron-right" size={22} color="#555" /> */}
        </TouchableOpacity>

        {/* Privacy Settings */}
        <Text style={styles.sectionTitle}>Privacy settings</Text>
        <TouchableOpacity style={styles.card}>
          {/* <Ionicons name="time-outline" size={24} color="#4b4bff" /> */}
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Session Time-out</Text>
          </View>
          {/* <Feather name="chevron-right" size={22} color="#555" /> */}
        </TouchableOpacity>

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.card}>
          {/* <Ionicons name="help-circle-outline" size={24} color="#4b4bff" /> */}
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Help Center</Text>
          </View>
          {/* <Feather name="chevron-right" size={22} color="#555" /> */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          {/* <FontAwesome5 name="key" size={20} color="#4b4bff" /> */}
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Recovery Code</Text>
          </View>
          {/* <Feather name="chevron-right" size={22} color="#555" /> */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          {/* <Ionicons name="document-text-outline" size={24} color="#4b4bff" /> */}
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Privacy Policy</Text>
          </View>
          {/* <Feather name="chevron-right" size={22} color="#555" /> */}
        </TouchableOpacity>
      </ScrollView>
      {showModal && (
        <LogoutModal
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
    backgroundColor: '#faf7ff',
    paddingHorizontal: 16,
    paddingTop: 40,
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
