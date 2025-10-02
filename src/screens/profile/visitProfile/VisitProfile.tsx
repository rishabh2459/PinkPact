import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import colors from '../../../utils/styles/Colors';
import NormalizeSize from '../../../utils/fontScaler/NormalizeSize';
import { Font_Sizes } from '../../../utils/fontScaler/fonts';
import spacing from '../../../utils/styles/Spacing';
import SvgIcon from '../../../coponents/icons/Icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import { commonStyles } from '../../../coponents/styles/CommonStyles';
import { Picker } from '@react-native-picker/picker';
import apiService, { baseURL } from '../../../api/apiServices';
import { FlatList } from 'react-native-gesture-handler';
import { FontStyles } from '../../../utils/fontScaler/FontStyles';
import { RFValue } from 'react-native-responsive-fontsize';
import CommentModal from '../../../coponents/modals/CommentsModal';
import EmojiSelector from 'react-native-emoji-selector';

interface FilterItem {
  id: number | string;
  label: string;
  placeholder: string;
  items: string[];

  onSearch: (text: string) => void;
  onApply: () => void;
}

export default function VisitProfile({ navigation, route }: any) {
  const [tab, setTab] = useState(0);
  const [addUser, setAddUser] = useState(false);
  const [visible, setVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [comments, setComments] = useState<string[]>(['Nice post!', '🔥🔥']);
  const [profileData, setProfileData] = useState(null);
  const [generationLabel, setGenerationLabel] = useState(null);
  const [educationalLabel, setEducationalLabel] = useState(null);
  const [generationDropdowIitems, setGenerationDropdownItems] = useState([]);
  const [educationDropdownItems, setEducationDropdownItems] = useState([]);
  const [moreDropdown, setMoreDropdown] = useState(false);
  const [moreDropdownValue, setMoreDropdownValue] = useState(null);
  const [moreDropdowIitems, setMoreDropdownItems] = useState([
    { label: 'Block', value: 1 },
    { label: 'Report Profile', value: 2 },
    { label: 'Share Profile', value: 3 },
  ]);

  const fetchposts = async () => {
    try {
      const url = `/v1/profile/posts?user_id=${route?.params?.id}`;

      console.log(url, 'urllllllllll');

      const result = await apiService.get(url);

      console.log(result, 'rrrrrrrrr21rrrr');

      if (result?.data) {
        setPosts(result?.data?.posts);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
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
      const url = `/v1/profile?user_id=${route?.params?.id}`;

      const result = await apiService.get(url);

      if (result?.data) {
        setProfileData(result?.data);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  useEffect(() => {
    fetchposts();
    educationlevel();
    generationLevel();
    fetchProfile();
  }, [posts]);

  console.log(posts, 'routeeeeeeeeeee');

  useEffect(() => {
    if (profileData) {
      const educationLabel =
        educationDropdownItems.find(
          item => item.value === profileData?.education_level_id,
        )?.label || '';

      setEducationalLabel(educationLabel);
      const GenerationLabel =
        generationDropdowIitems.find(
          item => item.value === profileData?.generation_id,
        )?.label || '';

      setGenerationLabel(GenerationLabel);
    }
  }, [profileData]);

  const renderPosts = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={{ marginVertical: 10 }}>
        <View style={styles.header}>
          {item?.author?.avatar_url ? (
            <Image
              source={{ uri: item.author?.avatar_url }}
              style={styles.miniavatar}
            />
          ) : (
            <SvgIcon name="profileTab" width={30} height={30} />
          )}

          <View style={styles.userInfo}>
            <Text style={styles.headerName}>
              {profileData?.first_name} {profileData?.last_name}
            </Text>
            <Text style={styles.headersubText}>24 May 2025</Text>
          </View>
        </View>

        {item?.media_path && (
          <View>
            <Image
              source={{ uri: item?.media_path }}
              style={{ width: '100%', height: 150, borderRadius: 5 }}
            />
            <Text style={styles?.body}>{item?.body}</Text>
          </View>
        )}

        {selectedReaction ? selectedReaction : '👍 Like'}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionButton}
            // onPress={() => setShowEmoji(!showEmoji)}
          >
            <Text style={styles.actionText}>{'👍 Like'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setCommentsModalVisible(true)}
          >
            <Text style={styles.actionText}>💬 Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>↗ Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  console.log(posts, 'postsssssssssssssss');

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <TouchableOpacity
        style={{
          position: 'relative',
          //   padding: 10,
          // backgroundColor: 'white',
          width: 35,
          height: 35,
          borderRadius: 20,
          top: 20,
          // left: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons
          name="arrow-back-ios-new"
          size={22}
          color={colors?.white}
        />
      </TouchableOpacity>
      <View style={[styles.header, { left: 20 }]}>
        <Image
          source={{ uri: profileData?.avatar_url }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>
            {profileData?.first_name} {profileData?.last_name}
          </Text>
          <Text style={styles.subText}>20 mutual friends</Text>
          <Text style={styles.subText}>4 common groups</Text>
        </View>
      </View>

      {/* Bio */}
      <Text style={styles.bio}>{profileData?.bio}</Text>

      {/* Buttons */}
      <View style={styles.buttonsRow}>
        <View
          style={{
            flexDirection: 'row',
            width: '60%',
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: addUser ? colors?.white : colors?.black },
            ]}
            onPress={() => setAddUser(!addUser)}
          >
            <SvgIcon
              name={addUser ? 'AddUser' : 'AddUserPink'}
              width={18}
              height={18}
            />
            {addUser ? (
              <Text style={styles.buttonText}>Add Friend</Text>
            ) : (
              <Text style={[styles.buttonText, { color: '#FF3CAB' }]}>
                Request Sent
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <SvgIcon name={'MessageIcon'} width={18} height={18} />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => setVisible(!visible)}
        >
          <Text style={styles.moreText}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <View style={styles.innerTab}>
          <TouchableOpacity
            style={[
              styles.tab,
              { backgroundColor: tab === 0 ? '#595959' : 'transparent' },
            ]}
            onPress={() => setTab(0)}
          >
            <Text style={tab === 0 ? styles.activeTabText : styles?.tabText}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              { backgroundColor: tab === 1 ? '#595959' : 'transparent' },
            ]}
            onPress={() => setTab(1)}
          >
            <Text style={tab === 1 ? styles.activeTabText : styles?.tabText}>
              About
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {tab === 0 ? (
        <>
          <FlatList
            data={posts}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPosts}
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          />
        </>
      ) : (
        <View style={styles.tabContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Generation</Text>
            <Text style={styles.value}>
              {generationLabel ? generationLabel : ''}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Education level</Text>
            <Text style={styles.value}>
              {educationalLabel ? educationalLabel : ''}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>
              What I look for in a support buddy?
            </Text>
            <Text style={styles.value}>{profileData?.buddy_description}</Text>
          </View>
        </View>
      )}

      {showEmoji && (
        <EmojiSelector
          onEmojiSelected={emoji => setSelectedReaction(prev => prev + emoji)}
          showSearchBar={false}
          showSectionTitles={false}
          columns={8}
        />
      )}
      <CommentModal
        visible={commentsModalVisible}
        onClose={() => setCommentsModalVisible(false)}
        comments={comments}
        onAddComment={c => setComments(prev => [...prev, c])}
      />
      {/* About Section */}
      <Modal
        // animationType="fade"
        transparent={true}
        visible={visible}
        onBlur={() => setVisible(false)}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable style={styles.modalBox} onPress={e => e.stopPropagation()}>
            <Pressable
              style={styles.option}
              onPress={() => {
                alert('Blocked');
                setVisible(false);
              }}
            >
              <Text style={styles.text}>Block</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.option}
              onPress={() => {
                alert('Reported');
                setVisible(false);
              }}
            >
              <Text style={styles.text}>Report profile</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={styles.option}
              onPress={() => {
                alert('Shared');
                setVisible(false);
              }}
            >
              <Text style={styles.text}>Share profile</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // black background
    // padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    // marginHorizontal: 15,
    // left: 20
  },
  miniavatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 15,
  },
  headerName: {
    color: '#fff',
    fontSize: NormalizeSize.getFontSize(12),
    bottom: 2,
    fontWeight: 'bold',
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    borderBottomColor: '#FF3CAB',
    borderBottomWidth: 1,
    bottom: 5,
  },
  headersubText: {
    color: '#bbb',
    fontSize: NormalizeSize.getFontSize(10),
  },
  subText: {
    color: '#bbb',
    fontSize: 14,
  },
  bio: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
    marginHorizontal: 15,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-between',
    marginHorizontal: 15,

    // justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: NormalizeSize?.getFontSize(30),
    width: NormalizeSize.getFontSize(92),
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 15,
    borderRadius: spacing?.xsmall,
  },
  buttonText: {
    color: '#000',
    fontSize: Font_Sizes?.smaller,
    height: NormalizeSize?.getFontSize(30),
    left: 4,
    textAlignVertical: 'center',
  },
  moreBtn: {
    height: NormalizeSize?.getFontSize(30),
    width: NormalizeSize.getFontSize(42),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',

    borderRadius: spacing?.xsmall,
  },
  moreText: {
    color: colors?.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabs: {
    // flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#222222',
    height: NormalizeSize?.getFontSize(41),
  },
  innerTab: {
    flexDirection: 'row',
    marginHorizontal: 15,
    height: NormalizeSize?.getFontSize(41),
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    // paddingVertical: 8,
    width: NormalizeSize?.getFontSize(60),
    height: NormalizeSize?.getFontSize(29),
    alignItems: 'center',
    borderRadius: spacing?.xsmall,
  },
  activeTab: {
    borderBottomColor: '#fff',
  },
  tabText: {
    color: colors?.white,
    textAlignVertical: 'center',
    height: NormalizeSize?.getFontSize(29),
    fontWeight: '700',
    fontSize: NormalizeSize.getFontSize(14),
  },
  tabContainer: {
    marginHorizontal: 15,
  },
  activeTabText: {
    color: colors?.black,
    textAlignVertical: 'center',
    height: NormalizeSize?.getFontSize(29),
    fontWeight: '700',
    fontSize: NormalizeSize.getFontSize(14),
  },
  infoBox: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    color: '#ccc',
    fontSize: 14,
  },
  openBtn: {
    padding: 12,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#000',
    borderRadius: 12,
    width: 160,
    top: 20,
    left: 80,
    // paddingVertical: 6,
    overflow: 'hidden',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#2a2a2a',
  },
  body: {
    color: '#fff',
    fontSize: Font_Sizes?.smaller,
    marginBottom: 4,
  },
  reactionButton: {
    marginHorizontal: 6,
  },
  emoji: {
    fontSize: 28,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  actionButton: {
    paddingHorizontal: 15,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
});
