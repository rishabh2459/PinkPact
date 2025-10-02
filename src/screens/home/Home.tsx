import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import colors from '../../utils/styles/Colors';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import SvgIcon from '../../coponents/icons/Icons';
import apiService, { baseURL } from '../../api/apiServices';
import { Font_Sizes } from '../../utils/fontScaler/fonts';
import moment from 'moment';
import CommentModal from '../../coponents/modals/CommentsModal';
import { SliderBox } from "react-native-image-slider-box";
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../coponents/redux/profileSlice';

const Home = ({ navigation }) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [feedData, setFeedData] = useState([]);
  const [search, setSearch] = useState('');
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [comments, setComments] = useState<string[]>(['Nice post!', '🔥🔥']);
  const [parentCommentId, setParentCommentId] = useState('');
  const [postData, setPostData] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // const [profileData, setProfileData] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Get profile data from redux
  const { data: profileData } = useSelector(
    (state: RootState) => state.profile
  );

  useEffect(() => {
    dispatch(fetchProfile()); // fetch on mount
  }, [dispatch]);

  const LikeUnlikePost = async (id: number) => {
    try {
      const url = `/v1/content/posts/${id}/like`;
      const result = await apiService.post(url);
      if (result?.data) {
        fetchFeed();
        // setFeedData(result?.data?.items);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  const LikeUnlikeArticle = async (id: number) => {
    try {
      const url = `/v1/content/articles/${id}/like`;
      const result = await apiService.post(url);
      if (result?.data) {
        fetchFeed();
        // setFeedData(result?.data?.items);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  const readPost = async (id: number) => {
    try {
      const url = `/v1/content/posts/${id}`;
      const result = await apiService.get(url);
      if (result?.data) {
        setPostData(result?.data);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  const commentsFetchData = async item => {
    setCommentsModalVisible(true);
    setParentCommentId(item?.id);
    readPost(item?.id);
  };

  const renderPosts = ({ item, index }: { item: any; index: number }) => {
    const images = Array.isArray(item?.media_path)
      ? item.media_path
      : item?.media_path
      ? [item.media_path]
      : [];

    return (
      <View style={{ marginVertical: 10 }}>
        <TouchableOpacity
          style={styles.header}
          onPress={() =>
            navigation.navigate('VisitProfile', { id: item?.author?.author_id })
          }
        >
          {item?.author?.avatar_url ? (
            <Image
              source={{ uri: item.author?.avatar_url }}
              style={styles.miniavatar}
            />
          ) : (
            <SvgIcon name="profileTab" width={30} height={30} />
          )}

          <View style={styles.userInfo}>
            <Text style={styles.headerName}>{item?.author?.username}</Text>
            <Text style={styles.headersubText}>
              {moment(item?.created_at).format('DD MMM YYYY')}
            </Text>
          </View>
        </TouchableOpacity>

        <View>
          {images.length > 0 && (
            <SliderBox
              images={images}
              sliderBoxHeight={250}
              dotColor="#FFEE58"
              inactiveDotColor="#90A4AE"
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 3,
                padding: 0,
                margin: 0,
              }}
              ImageComponentStyle={{ borderRadius: 10, width: '100%' }}
              resizeMode={'cover'}
              paginationBoxVerticalPadding={10}
              autoplay={false}
              circleLoop={false}
            />
          )}

          <Text style={styles?.body}>{item?.summary}</Text>
        </View>

        {(item?.hug_count > 0 || item?.comment_count > 0) && (
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text style={styles?.likes}>{item?.hug_count} Likes</Text>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
            >
              <Text style={[styles?.likes, { marginRight: 10 }]}>
                {item?.comment_count} comments
              </Text>
              <Text style={styles?.likes}>{item?.share_count} share</Text>
            </View>
          </View>
        )}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { flexDirection: 'row', justifyContent: 'space-between' },
            ]}
            onPress={() =>
              item?.content_type === 'post'
                ? LikeUnlikePost(item?.id)
                : LikeUnlikeArticle(item?.id)
            }
          >
            {item?.hug_count > 0 ? (
              <SvgIcon name={'LikedIcon'} width={30} height={30} />
            ) : (
              <SvgIcon name={'LikeGrey'} width={20} height={20} />
            )}
            <Text style={[styles.actionText, { marginLeft: 5 }]}>{'Like'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => commentsFetchData(item)}
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

// FETCH FEED
const fetchFeed = async (pageNumber = 1, append = false) => {
  if (loading) return;
  setLoading(true);

  try {
    const offset = (pageNumber - 1) * limit;
    const url = `/v1/feed?limit=${limit}&offset=${offset}`;
    const result = await apiService.get(url);

    const newItems = result?.data?.items || [];

    if (newItems.length > 0) {
      if (append) {
        setFeedData(prev => [...prev, ...newItems]);
      } else {
        setFeedData(newItems);
      }
      setHasMore(newItems.length === limit); // only true if exactly full page
    } else {
      setHasMore(false);
    }
  } catch (err) {
    console.log('🚀 ~ fetchFeed error:', err);
  } finally {
    setLoading(false);
  }
};

// REFRESH EVERY TIME SCREEN FOCUSES
useFocusEffect(
  useCallback(() => {
    setPage(1);
    setHasMore(true);
    fetchFeed(1, false);
    fetchProfile();
  }, [])
);

// LOAD MORE AT END
const handleLoadMore = useCallback(() => {
  if (!loading && hasMore) {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage, true);
  }
}, [loading, hasMore, page]);

  return (
    <View style={styles?.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <Text style={styles?.heading}>The Pink Pact</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FriendList')}>
          <SvgIcon name={'SearchIcon'} width={30} height={30} />
        </TouchableOpacity>
      </View>

      <View style={styles?.searchContainer}>
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

        <TouchableOpacity
          style={styles.textInputContainer}
          onPress={() => navigation.navigate('CreatePost')}
        >
          <TextInput
            style={styles.input}
            editable={false}
            placeholder="How are you today"
            value={search}
            onChangeText={e => setSearch(e)}
          />
          <SvgIcon name={'Gallery'} width={20} height={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={feedData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPosts}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          marginTop: 20,
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#fff" /> : null
        }
      />

      <CommentModal
        visible={commentsModalVisible}
        parentId={parentCommentId}
        onClose={() => setCommentsModalVisible(false)}
        comments={postData}
        setComments={setPostData}
        onAddComment={c => setComments(prev => [...prev, c])}
      />
      {/* {showReactions && (
        <View style={styles.reactionBar}>
          {reactions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reactionButton}
              onPress={() => {
                setSelectedReaction(item.emoji);
                setShowReactions(false);
              }}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )} */}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors?.black,
    padding: 10,
  },
  heading: {
    color: colors?.white,
    fontSize: NormalizeSize?.getFontSize(22),
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: NormalizeSize.getFontSize(20),
    //  justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    width: '85%',
    backgroundColor: 'white',
    marginLeft: 15,
    borderRadius: 20,
  },
  input: {
    // backgroundColor: colors?.white,
    // borderRadius: 20,
    // paddingHorizontal: 15,
  },
  reactionBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 8,
    marginBottom: 5,
    alignSelf: 'center',
    elevation: 5,
  },
  reactionButton: {
    marginHorizontal: 6,
  },
  emoji: {
    fontSize: 28,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  actionButton: {
    // paddingHorizontal: 15,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    // marginHorizontal: 15,
  },
  miniavatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
  },
  miniavatar2: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  headersubText: {
    color: '#bbb',
    fontSize: NormalizeSize.getFontSize(10),
  },
  body: {
    color: '#fff',
    fontSize: Font_Sizes?.smaller,
    marginBottom: 4,
    marginTop: NormalizeSize.getFontSize(6),
  },
  likes: {
    fontSize: Font_Sizes?.smaller,
    color: colors?.white,
  },
});
