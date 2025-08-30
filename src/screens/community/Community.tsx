import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import colors from '../../utils/styles/Colors';
import NormalizeSize from '../../utils/fontScaler/NormalizeSize';
import spacing from '../../utils/styles/Spacing';

const Community = () => {
  const [tabVisible, setTabVisible] = useState(0)
  return (
    <View style={styles?.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={styles?.heading}>Community</Text>
      </View>

      <View style={styles?.materialButtonContainer}>
        <TouchableOpacity style={[styles?.materialButton, {backgroundColor: tabVisible === 0 ? '#595959' : colors?.black}]} onPress={() => setTabVisible(0)}>
          <Text style={{ color: colors?.white }}>Events</Text>
        </TouchableOpacity>
           <TouchableOpacity style={[styles?.materialButton, {backgroundColor: tabVisible === 1 ? '#595959' : colors?.black}]} onPress={() => setTabVisible(1)}>
          <Text style={{ color: colors?.white }}>Resources</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Community;

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
  materialButtonContainer:{
    flexDirection: 'row',
    marginTop: spacing?.large20

  },
  materialButton: {
    backgroundColor: '#595959',
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 4
  },
});
