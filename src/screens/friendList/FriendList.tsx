import React, { useEffect, useState } from 'react';
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
import apiService from '../../api/apiServices';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';

export default function FriendList({ navigation }) {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState({});
  const [userList, setUserList] = useState([]);

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

  const fetchUsers = async text => {
    setSearch(text);
    try {
      const url = `/v1/social/search?q=${text}`;
      const result = await apiService.get(url);

      console.log(result?.data, 'dataaaaaaaaaaaaaaaaaaaaaa');

      if (result?.data) {
        setUserList(result?.data?.users);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

  const handleAddFriend = async (id) => {
    const userId = {
      receiver_id: id,
    };

    try {
      const url = `/v1/social/friends/add`;
      const result = await apiService.post(url, userId);

      if (result?.data) {
        setFriends(prev => ({ ...prev, [id]: 'requested' }));
        fetchUsers(search);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };

    const handleUnFriend = async (id) => {
    try {
      const url = `/v1/social/friends/requests/${id}`;
      const result = await apiService.delete(url);

      if (result?.data) {
        fetchUsers(search);
      }
    } catch (err) {
      console.log('🚀 ~ ; ~ err:', err);
    }
  };
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const renderItem = ({ item }) => {
    const status = friends[item.id];

    console.log(item, 'itemmmmm');

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('VisitProfile', { id: item?.user_id })
        }
      >
        <Image source={{ uri: item.avatar_url }} style={styles.image} />
        <Text
          style={styles.name}
        >{`${item.first_name} ${item.last_name}`}</Text>
        <Text style={styles.mutual}>
          {item?.mutual_friends > 0
            ? `${item?.mutual_friends} mutual friends`
            : 'No mutual friends'}
        </Text>

        {item?.friendship_status === 'request_sent' ? (
          <View style={styles.row}>
            <TouchableOpacity onPress={() => handleUnFriend(item.user_id)}>
              <Text style={styles.requestText}>Request sent</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.messageBtn}
              onPress={() => handleMessage(item.user_id)}
            >
              <Text style={styles.btnText}>Message</Text>
            </TouchableOpacity> */}
          </View>
        ) : (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => handleAddFriend(item.user_id)}
            >
              <Text style={[styles.btnText, { color: colors?.black }]}>
                Add friend
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => handleRemove(item.user_id)}
            >
              <Text style={styles.btnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
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
          onChangeText={e => fetchUsers(e)}
        />
      </View>
      {/* FlatList with 2 columns */}
      <FlatList
        data={userList}
        keyExtractor={item => item.user_id}
        renderItem={renderItem}
        keyboardShouldPersistTaps= "always"
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
    backgroundColor: colors?.white,
    width: '47.5%',
    justifyContent: 'center',
    alignItems: 'center',
    height: NormalizeSize.getFontSize(24),
    borderRadius: 6,
    marginRight: 6,
  },
  removeBtn: {
    backgroundColor: '#111',
    width: '47.5%',
    justifyContent: 'center',
    height: NormalizeSize.getFontSize(24),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors?.white,
    borderRadius: 6,
  },
  messageBtn: {
    backgroundColor: '#444',
    padding: 6,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontSize: NormalizeSize.getFontSize(12),
  },
  requestText: {
    color: 'magenta',
    fontWeight: '600',
    marginRight: 6,
  },
});
