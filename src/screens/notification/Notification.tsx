import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../utils/styles/Colors';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import SvgIcon from '../../coponents/icons/Icons';

const Notification = () => {
  const notificationData = [
    {
      id: 1,
      title:
        'Per natoque mus nec, nascetur vel netus nullam placerat. Potenti Per platea pellentesque fringilla dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 2,
      title:
        'Per natoque mus nec, nascetur vel netus nullam placerat. Potenti Per platea pellentesque fringilla dignissim.',
      time: '4 hours',
    },
    {
      id: 3,
      title:
        'Per natoque mus nec, nascetur vel netus nullam placerat. Potenti Per platea pellentesque fringilla imperdiet.',
      time: '4 hours',
    },
    {
      id: 4,
      title:
        'Per natoque mus nec, nascetur vel netus nullam placerat. Potenti Per platea pellentesque dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 5,
      title:
        'Per natoque mus nec, nascetur vel netus nullam placerat. Potenti Per platea fringilla dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 6,
      title:
        'Per natoque mus nec, nascetur vel netus nullam placerat. Potenti Per pellentesque fringilla dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 7,
      title:
        'Per natoque mus nec, nascetur vel netus nullam placerat. Potenti platea pellentesque fringilla dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 8,
      title:
        'Per natoque mus nec, nascetur vel netus nullam placerat. Per platea pellentesque fringilla dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 9,
      title:
        'Per natoque mus nec, nascetur vel netus nullam. Potenti Per platea pellentesque fringilla dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 10,
      title:
        'Per natoque mus nec, nascetur vel netus  placerat. Potenti Per platea pellentesque fringilla dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 11,
      title:
        'Per natoque mus nec, nascetur vel  nullam placerat. Potenti Per platea pellentesque fringilla dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 12,
      title:
        'Per natoque mus nec, nascetur netus nullam placerat. Potenti Per platea pellentesque fringilla dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 13,
      title:
        'Per natoque mus nec, vel netus nullam placerat. Potenti Per platea pellentesque fringilla dignissim imperdiet.',
      time: '4 hours',
    },
    {
      id: 14,
      title:
        'Per natoque mus, nascetur vel netus nullam placerat. Potenti Per platea pellentesque fringilla dignissim imperdiet.',
      time: '4 hours',
    },
  ];

  const renderItem = ({ item, index }) => {};

  return (
    <View style={styles?.container}>
      <Text style={styles?.heading}>Notifications</Text>

      <FlatList
        data={notificationData}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1, flexDirection: 'row', paddingVertical: NormalizeSize?.getFontSize(16) }}>
            <View style={{ justifyContent: 'center', marginRight: 10 }}>
              <SvgIcon name={'profileTab'} width={35} height={35} />
            </View>
            <View>
              <Text style={styles?.title}>{item.title}</Text>
              <Text style={styles?.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Notification;

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
  title: {
    color: colors?.white,
    width: '41%',
    fontSize: NormalizeSize?.getFontSize(14)
  },
  time: {
    fontSize: NormalizeSize?.getFontSize(10),
    color: '#BCBCBC',
  },
});
