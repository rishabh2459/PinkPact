import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import apiService from '../../api/apiServices';
import SvgIcon from '../../coponents/icons/Icons';
import colors from '../../utils/styles/Colors';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import { useFocusEffect } from '@react-navigation/native';

interface RageItem {
  id: string;
  body: string;
  created_at: string;
  expires_at: string;
}

export default function RageRoom() {
  const inputRef = useRef<TextInput>(null);
  const [messages, setMessages] = useState<RageItem[]>([]);
  const [newComment, setNewComment] = useState('');
  const [input, setInput] = useState('');
  const [profileData, setProfileData] = useState(null);

  // Mock GET API
  const fetchMessages = async () => {
    try {
      const url = `/v1/rage`;

      const result = await apiService.get(url);

      console.log(result.data, "messagesssssssssssssssssssssssssssssss");
      
      if (result?.data) {
        setMessages(result.data.rages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Mock POST API
const PostComment = async (text: string) => {
  if (!newComment.trim()) return;

  const data = {
    body: text,
  };

  try {
    const url = `/v1/rage`;
    const result = await apiService.post(url, data);

    const posted = result?.data;
    if (posted) {
      // Append the new comment instantly
      setMessages(prev => [...prev, posted]);

      // Clear input box
      setNewComment('');
    }
  } catch (err) {
    console.log('🚀 ~ PostComment error:', err);
  }
};

  useEffect(() => {
    fetchMessages();
  }, [messages]);

  const renderItem = ({ item }: { item: RageItem }) => {
    const isMine = !messages.find(msg => msg.id === item.id) ? false : true;
    // Condition: if posted by user (last added locally), align right
    const isUser = messages[messages.length - 1]?.id === item.id;

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.rightMessage : styles.leftMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.body}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: 12
        }}
      >
        <Text style={styles?.heading}>Rage Room</Text>
        <SvgIcon name={'Help'} width={25} height={25} />
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={'Type Message...'}
          placeholderTextColor="#777"
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity
          onPress={() => {
            if (!newComment.trim()) return;
            // if replyingTo is set, post reply, else post top-level comment
            PostComment(newComment);
          }}
          style={styles.sendBtn}
        >
          <SvgIcon name={'SendButton'} width={30} height={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  leftMessage: {
    backgroundColor: '#444',
    alignSelf: 'flex-start',
  },
  rightMessage: {
    backgroundColor: '#444',
    alignSelf: 'flex-end',
  },
  messageText: { color: '#fff', fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#333',
    backgroundColor: '#000',
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
  heading: {
    color: colors?.white,
    fontSize: NormalizeSize?.getFontSize(22),
  },
});
