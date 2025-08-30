import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import colors from '../../utils/styles/Colors';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import SvgIcon from '../../coponents/icons/Icons';

const RageRoom = () => {
  return (
    <View style={styles?.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
        <Text style={styles?.heading}>Rage Room</Text>
        <SvgIcon name={'Help'} width={25} height={25} />
      </View>
    </View>
  );
};

export default RageRoom;

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
});
