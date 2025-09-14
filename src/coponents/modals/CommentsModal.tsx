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
} from 'react-native';
import { Font_Sizes } from '../../utils/fontScaler/fonts';
import colors from '../../utils/styles/Colors';
import { baseURL } from '../../api/apiServices';
import SvgIcon from '../icons/Icons';

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  comments: string[];
  onAddComment: (comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  onClose,
  comments,
  onAddComment,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current; // animation state
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0], // slide up from bottom
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Background overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View
          style={[styles.container, { transform: [{ translateY }] }]}
        >
          {/* Drag indicator */}
          <View style={styles.dragIndicator} />

          <Text style={styles?.comments}>Comments</Text>

          {/* Comments List */}
          <FlatList
            data={comments}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Image
                  source={{ uri: `${baseURL}${item?.image}` }}
                  style={styles?.userImage}
                />
                <Text style={styles.commentText}>{item}</Text>
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
                  onAddComment(newComment);
                  setNewComment('');
                }}
                style={styles.sendBtn}
              >
                <SvgIcon  name={'SendButton'} width={30} height={30} />
                {/* <Text style={{ color: '#fff' }}>Post</Text> */}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  comments: {
    fontSize: Font_Sizes?.large,
    color: colors?.white,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  container: {
    height: '50%',
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: '#666',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
  commentRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  commentUser: {
    color: '#FF3CAB',
    fontWeight: '600',
    marginRight: 8,
  },
  commentText: {
    color: '#fff',
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
    height: 35
  },
});

export default CommentModal;
