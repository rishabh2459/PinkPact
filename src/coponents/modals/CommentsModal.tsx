// CommentModal.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  PanResponder,
} from 'react-native';
import { Font_Sizes } from '../../utils/fontScaler/fonts';
import colors from '../../utils/styles/Colors';
import apiService, { baseURL } from '../../api/apiServices';
import SvgIcon from '../icons/Icons';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import moment from 'moment';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  comments: any; // original response object that includes post and comments
  setComments: any;
  parentId: string; // post id (you passed parentId earlier as number — switched to string to match GUIDs)
  onAddComment: (comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  onClose,
  comments,
  setComments,
  parentId,
  onAddComment,
}) => {
  const translateY = useRef(new Animated.Value(600)).current;
  const [newComment, setNewComment] = useState('');
  // local copy of top-level comments array
  const [localComments, setLocalComments] = useState<any[]>(
    comments?.comments?.items ?? []
  );

  // map commentId -> array of replies
  const [repliesMap, setRepliesMap] = useState<Record<string, any[]>>({});
  // map commentId -> whether replies visible
  const [showRepliesMap, setShowRepliesMap] = useState<Record<string, boolean>>(
    {}
  );

    const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyingToUser, setReplyingToUser] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);


  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 600,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // keep localComments in sync when prop changes
  useEffect(() => {
    setLocalComments(comments?.comments?.items ?? []);
  }, [comments]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          Animated.timing(translateY, {
            toValue: 600,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setComments(null);
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Fetch replies for a comment
  const fetchReplies = async (commentId: string) => {
    try {
      const postId = comments?.post?.id ?? parentId;
      const url = `/v1/content/${commentId}/replies?post_id=${postId}&limit=20`;
      console.log('🔎 fetchReplies:', url);
      const res = await apiService.get(url, {
        headers: { Accept: 'application/json' },
      });
      const items = res?.data?.items ?? [];
      setRepliesMap(prev => ({ ...prev, [commentId]: items }));
      setShowRepliesMap(prev => ({ ...prev, [commentId]: true }));
    } catch (err) {
      console.log('❌ fetchReplies error', err);
    }
  };

  // Toggle replies visibility (fetch if needed)
  const toggleReplies = async (commentId: string, hasMore = false) => {
    if (showRepliesMap[commentId]) {
      setShowRepliesMap(prev => ({ ...prev, [commentId]: false }));
    } else {
      // if already fetched, just show; else fetch
      if (repliesMap[commentId]?.length) {
        setShowRepliesMap(prev => ({ ...prev, [commentId]: true }));
      } else {
        await fetchReplies(commentId);
      }
    }
  };

  // Post comment or reply
  // pass parentCommentId as '' | null for top-level, else the comment id
  const PostComment = async (postId: string, parentCommentId?: string | null) => {
    if (!newComment.trim()) return;
    const formData = new URLSearchParams();
    formData.append('body', newComment.trim());
    if (parentCommentId) {
      formData.append('parent_comment_id', parentCommentId);
    }

    try {
      const url = `/v1/content/comments/${postId}`;
      console.log('📤 Posting to:', url, 'parent:', parentCommentId);
      // apiService.post should already include auth header (if configured), otherwise add here
      const result = await apiService.post(url, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });

      const posted = result?.data;
      if (!posted) {
        console.warn('No data returned after posting comment');
        return;
      }

      // If this is a reply (parentCommentId provided) -> add to repliesMap for that comment
      if (parentCommentId) {
        // If replies already in memory, append
        setRepliesMap(prev => {
          const prevReplies = prev[parentCommentId] ?? [];
          return { ...prev, [parentCommentId]: [posted, ...prevReplies] };
        });
        // ensure replies visible
        setShowRepliesMap(prev => ({ ...prev, [parentCommentId]: true }));

        // Also update comments_count for parent in localComments
        setLocalComments(prev =>
          prev.map(c =>
            c.id === parentCommentId
              ? { ...c, comments_count: (c.comments_count ?? 0) + 1 }
              : c
          )
        );
      } else {
        // top-level comment -> prepend to localComments
        setLocalComments(prev => [posted, ...prev]);
        // update comments.global if you keep that elsewhere
      }

      // call parent's callback
      onAddComment(newComment.trim());
      setNewComment('');
    } catch (err) {
      console.log('🚀 ~ PostComment error:', err);
    }
  };

  // Render a single reply
  const ReplyRow = ({ reply }: { reply: any }) => {
    const avatar =
      reply?.author?.avatar_url || reply?.author?.avatar || reply?.author?.image;
    const imageUri = avatar ? (avatar.startsWith('http') ? avatar : `${baseURL}${avatar}`) : null;

    return (
      <View style={styles.replyRow}>
        {/* <Image
          source={imageUri ? { uri: imageUri } : require('../../assets/default-avatar.png')}
          style={styles.userImageSmall}
        /> */}
        <View style={{ flex: 1 }}>
          <Text style={styles.commentTextSmall}>{reply?.body}</Text>
          <Text style={styles.replyMeta}>
            {reply?.author?.username ?? reply?.author?.first_name ?? 'Unknown'} ·{' '}
            {new Date(reply?.created_at).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

const renderItem = ({ item }: { item: any }) => {
    const hasReplies = (item?.comments_count ?? 0) > 0;

    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.commentText}>
              {item?.author?.username ?? item?.author?.first_name} ·{' '}
            </Text>
            <Text style={[styles.commentMeta, { fontSize: Font_Sizes?.small, color: '#BCBCBC' }]}>
              {item?.body}
            </Text>
            <Text style={styles.commentMeta}>
              {moment(item.created_at).format('DD/MM/YYYY HH:MM A')}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.replyButtonSmall}
                onPress={() => {
                  setReplyingTo(item.id);
                  setReplyingToUser(item?.author?.username ?? item?.author?.first_name ?? 'User');
                  setNewComment('');
                  setTimeout(() => inputRef.current?.focus(), 100); // focus input
                }}
              >
                <Text style={styles.replytextSmall}>Reply</Text>
              </TouchableOpacity>

              {hasReplies && (
                <TouchableOpacity
                  style={styles.viewRepliesBtn}
                  onPress={() => toggleReplies(item.id)}
                >
                  <Text style={styles.viewRepliesText}>
                    {showRepliesMap[item.id] ? 'Hide replies' : `View replies (${item.comments_count})`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Replies */}
        {showRepliesMap[item.id] && (
          <View style={styles.repliesContainer}>
            {repliesMap[item.id]?.length ? (
              repliesMap[item.id].map((r: any) => <ReplyRow key={r.id} reply={r} />)
            ) : (
              <Text style={styles.noRepliesText}>No replies yet</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={() => {
        setComments(null);
        onClose();
      }}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dragArea}
            {...panResponder.panHandlers}
            onPress={() => {
              onClose();
              setComments(null);
            }}
          >
            <View style={styles.dragIndicator} />
            <Text style={styles.comments}>Comments</Text>
          </TouchableOpacity>

          <FlatList
            data={localComments}
            keyExtractor={(item: any) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={<Text style={{ color: '#fff' }}>No comments yet</Text>}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
          >
              {replyingTo && replyingToUser && (
              <View style={styles.replyBanner}>
                <Text style={styles.replyBannerText}>Replying to @{replyingToUser}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setReplyingTo(null);
                    setReplyingToUser(null);
                  }}
                >
                  <Text style={styles.replyBannerClose}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.inputRow}>
              <TextInput
               ref={inputRef}
                style={styles.input}
                placeholder={replyingTo ? 'Write a reply...' : 'Add a comment...'}
                placeholderTextColor="#777"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity
                onPress={() => {
                  if (!newComment.trim()) return;
                  // if replyingTo is set, post reply, else post top-level comment
                  if (replyingTo) {
                    PostComment(parentId, replyingTo);
                    // Optionally re-fetch replies after post (we already appended to map)
                    setReplyingTo(null);
                  } else {
                    PostComment(parentId, undefined);
                  }
                  setNewComment('');
                }}
                style={styles.sendBtn}
              >
                <SvgIcon name={'SendButton'} width={30} height={30} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // backgroundColor: colors?.white,
    justifyContent: 'flex-end',
  },
  container: {
    height: '95%',
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  dragArea: {
    alignItems: 'center',
    marginBottom: 10,
  },
  comments: {
    fontSize: Font_Sizes?.large,
    color: colors?.white,
    fontWeight: '700',
    marginTop: 6,
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: '#666',
    borderRadius: 3,
    marginBottom: 6,
  },
  commentContainer: {
    // marginVertical: 8,
  },
  commentRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  userImage: {
    width: 35,
    height: 35,
    borderRadius: 18,
  },
  userImageSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  commentText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  commentMeta: {
    color: '#888',
    marginLeft: 8,
    fontSize: 11,
    marginTop: 4,
  },
  commentTextSmall: {
    color: '#fff',
    fontSize: 13,
  },
  replyMeta: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  replyButtonSmall: {
    backgroundColor: colors?.white,
    width: NormalizeSize?.getFontSize(51),
    height: NormalizeSize.getFontSize(19),
    borderRadius: NormalizeSize.getFontSize(24),
    paddingHorizontal: 10,
    // paddingVertical: 6,
  },
  replytextSmall: {
    fontSize: Font_Sizes?.smaller,
    color: colors?.black,
  },
  viewRepliesBtn: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  viewRepliesText: {
    color: '#aaa',
    fontSize: 12,
  },
  repliesContainer: {
    marginLeft: 44,
    marginTop: 6,
    borderLeftWidth: 1,
    borderLeftColor: '#222',
    paddingLeft: 12,
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  noRepliesText: {
    color: '#999',
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendBtn: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
    replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 6,
    borderRadius: 8,
    marginBottom: 6,
  },
  replyBannerText: {
    color: '#fff',
    flex: 1,
    fontSize: 13,
  },
  replyBannerClose: {
    color: '#f55',
    fontSize: 16,
    paddingHorizontal: 6,
  },

});

export default CommentModal;
