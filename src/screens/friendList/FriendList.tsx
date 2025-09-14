import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colors from '../../utils/styles/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DATA = [
  {
    id: '1',
    name: 'Harleen Singh',
    mutualFriends: 2,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: 'Damini Nair',
    mutualFriends: 0,
    image: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
  {
    id: '3',
    name: 'Harleen Singh',
    mutualFriends: 2,
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  {
    id: '4',
    name: 'Damini Nair',
    mutualFriends: 0,
    image: 'https://randomuser.me/api/portraits/women/49.jpg',
  },
  {
    id: '5',
    name: 'Harleen Singh',
    mutualFriends: 2,
    image: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  {
    id: '6',
    name: 'Damini Nair',
    mutualFriends: 0,
    image: 'https://randomuser.me/api/portraits/women/49.jpg',
  },
];

export default function FriendList({ navigation }) {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState({});

  const handleAddFriend = id => {
    setFriends(prev => ({ ...prev, [id]: 'requested' }));
  };

  const handleRemove = id => {
    setFriends(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleMessage = id => {
    alert(`Message sent to ${id}`);
  };

  const filteredData = DATA.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item }) => {
    const status = friends[item.id];

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.mutual}>
          {item.mutualFriends > 0
            ? `${item.mutualFriends} mutual friends`
            : 'No mutual friends'}
        </Text>

        {status === 'requested' ? (
          <View style={styles.row}>
            <Text style={styles.requestText}>Request sent.</Text>
            <TouchableOpacity
              style={styles.messageBtn}
              onPress={() => handleMessage(item.id)}
            >
              <Text style={styles.btnText}>Message</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => handleAddFriend(item.id)}
            >
              <Text style={styles.btnText}>Add friend</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemove(item.id)}
            >
              <Text style={styles.btnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <TouchableOpacity
          style={{
            position: 'relative',
            //   padding: 10,
            // backgroundColor: 'white',
            width: 35,
            height: 35,
            borderRadius: 20,
     
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
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* FlatList with 2 columns */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  searchBar: {
    backgroundColor: '#fff',
    width: '88%',
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    width: '48%', // Half width for 2-column layout
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
  },
  mutual: {
    color: '#aaa',
    fontSize: 12,
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  addBtn: {
    backgroundColor: '#444',
    padding: 6,
    borderRadius: 6,
    marginRight: 6,
  },
  removeBtn: {
    backgroundColor: '#444',
    padding: 6,
    borderRadius: 6,
  },
  messageBtn: {
    backgroundColor: '#444',
    padding: 6,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
  },
  requestText: {
    color: 'magenta',
    fontWeight: '600',
    marginRight: 6,
  },
});
