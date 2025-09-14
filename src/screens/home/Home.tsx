import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import colors from '../../utils/styles/Colors';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import SvgIcon from '../../coponents/icons/Icons';

const Home = ({navigation}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const reactions = [
    { emoji: '👍', label: 'Like' },
    { emoji: '😊', label: 'Smile' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '😂', label: 'Haha' },
    { emoji: '🤗', label: 'Hug' },
  ];

  return (
    <View style={styles?.container}>
      <Text style={styles?.heading}>The Pink Pact</Text>

      <View style={styles?.searchContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('FriendList')}>
          <SvgIcon name={'profileTab'} width={30} height={30} />
        </TouchableOpacity>

        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="How are you today"
            value={search}
            onChangeText={e => setSearch(e)}
          />
          <SvgIcon name={'Gallery'} width={20} height={20} />
        </View>
      </View>

      {showReactions && (
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
      )}

      {/* Action Buttons */}
      {selectedReaction ? selectedReaction : '👍 Like'}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowReactions(!showReactions)}
        >
          <Text style={styles.actionText}>{'👍 Like'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬 Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>↗ Share</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent : 'space-between', 
    paddingHorizontal: 15, 
    width: '85%', 
    backgroundColor: 'white',
    marginLeft: 15,
     borderRadius: 20
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
