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

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  comments: any;
  setComments: any;
  parentId: number;
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
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [newComment, setNewComment] = useState('');
  const translateY = useRef(new Animated.Value(600)).current;

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
  // ✅ Drag-to-close with PanResponder

  const pan = useRef(new Animated.Value(0)).current;
 const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      Math.abs(gesture.dy) > 5, // start drag on vertical movement
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
  }),
).current;

  // ✅ Post comment function
  const PostComment = async (parentId: number, parentCommentId: any) => {
    const formData = new URLSearchParams();
    formData.append('body', newComment);
    formData.append('parent_comment_id', parentCommentId);

    try {
      const url = `/v1/content/comments/${parentId}`;
      console.log('📤 Posting to:', url);

      const result = await apiService.post(url, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      });

      console.log('✅ Comment posted:', result?.data);

      if (result?.data) {
        setComments(prev => ({
          ...prev,
          comments: {
            ...prev.comments,
            items: [result.data, ...prev.comments.items],
          },
        }));
        onAddComment(newComment);
      }
    } catch (err) {
      console.log('🚀 ~ PostComment error:', err);
    }
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
        <Animated.View
          style={[
            styles.container,
            { transform: [{ translateY }] },
          ]}
        >
          {/* Drag Indicator & Header */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.dragArea}
            {...panResponder.panHandlers}
            onPress={() => {
             onClose();
             setComments(null)
              // make it clickable too
              console.log('Header clicked!');
            }}
          >
            <View style={styles.dragIndicator} />
            <Text style={styles.comments}>Comments</Text>
          </TouchableOpacity>

          {/* Comments List */}
          <FlatList
            data={comments?.comments?.items}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Image
                  source={{ uri: `${baseURL}${item?.image}` }}
                  style={styles.userImage}
                />
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.commentText}>{item?.body}</Text>
                  <TouchableOpacity
                    style={styles.replyButton}
                    onPress={() => PostComment(parentId, item?.id)}
                  >
                    <Text style={styles.replytext}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />

          {/* Input Box */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
          >
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Add a comment..."
                placeholderTextColor="#777"
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity
                onPress={() => {
                  if (!newComment.trim()) return;
                  PostComment(parentId, '');
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
  commentRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  commentText: {
    color: '#fff',
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
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
  userImage: {
    width: 35,
    height: 35,
    borderRadius: 18,
  },
  replyButton: {
    backgroundColor: colors?.white,
    width: NormalizeSize.getFontSize(51),
    height: NormalizeSize?.getFontSize(19),
    borderRadius: NormalizeSize.getFontSize(24),
    marginTop: 10,
  },
  replytext: {
    fontSize: Font_Sizes?.smaller,
    color: colors?.black,
    textAlign: 'center',
  },
});

export default CommentModal;
